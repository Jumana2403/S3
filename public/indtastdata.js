const formular = document.getElementById("maaling-form");
const blodsukkerFelt = document.getElementById("blodsukker");
const besked = document.getElementById("maaling-besked");
const maaleStatus = document.getElementById("maale-status");

const maaleplanFelt = document.getElementById("maaleplan-id");
const knap = formular.querySelector('button[type="submit"]');
const patientId = 1;
let planer = [];
let gemteMaalinger = [];

formular.addEventListener("submit", registrerMaaling);
maaleplanFelt.addEventListener("change", visValgtMaaletid);

hentMaaleplan();

async function hentMaaleplan() {
  try {
    const planSvar = await fetch("/api/patients/" + patientId + "/maaleplaner");
    if (!planSvar.ok) {
      throw new Error("Kunne ikke hente måleplanen.");
    }
    planer = await planSvar.json();

    const maalingSvar = await fetch("/api/maalinger");
    if (!maalingSvar.ok) {
      throw new Error("Kunne ikke hente de gemte målinger.");
    }
    gemteMaalinger = await maalingSvar.json();
    maaleplanFelt.innerHTML = "";

    if (planer.length === 0) {
      maaleStatus.innerText = "Ingen planlagte måletider";
      besked.innerText = "Der er ingen måletider for testpatienten.";
      return;
    }

    for (const plan of planer) {
      const mulighed = document.createElement("option");
      mulighed.value = plan.maaleplan_id;
      mulighed.innerText = new Date(plan.planlagt_tid).toLocaleString("da-DK");
      maaleplanFelt.appendChild(mulighed);
    }
    maaleplanFelt.disabled = false;
    visValgtMaaletid();
  } catch (err) {
    maaleStatus.innerText = "Kunne ikke hente status";
    besked.innerText = "Kunne ikke hente måleplanen. Prøv at genindlæse siden.";
  }
}

function visValgtMaaletid() {
  const maaleplanId = Number(maaleplanFelt.value);
  const plan = planer.find(plan => Number(plan.maaleplan_id) === maaleplanId);
  const maaling = gemteMaalinger.find(maaling => Number(maaling.maaleplan_id) === maaleplanId);
  besked.innerText = "";
  knap.disabled = true;
  if (!plan) {
    return;
  }
  if (maaling) {
    markerSomRegistreret(maaling.blodsukker);
    besked.innerText = "Denne måling er allerede registreret. Vælg en anden måletid for at gemme en ny måling.";
    return;
  }
  if (new Date(plan.planlagt_tid) < new Date()) {
    maaleStatus.innerText = "Mangler registrering";
    maaleStatus.className = "status status-mangler";
  } else {
    maaleStatus.innerText = "Planlagt";
    maaleStatus.className = "status status-planlagt";
  }
  knap.disabled = false;
}

async function registrerMaaling(event) {
  event.preventDefault();

  const vaerdi = Number(blodsukkerFelt.value);

  if (feltErTomt()) {
    besked.innerText = "Indtast en blodsukkerværdi først.";
    return;
  }
  if (vaerdiErUgyldig(vaerdi)) {
    besked.innerText = "Blodsukkerværdien skal være større end 0.";
    return;
  }

  const maaleplanId = Number(document.getElementById("maaleplan-id").value);
  if (!Number.isInteger(maaleplanId) || maaleplanId < 1) {
    besked.innerText = "Måletiden mangler eller er ugyldig.";
    return;
  }

  const maaltTid = document.getElementById("maalt-tid").value;
  const knap = formular.querySelector('button[type="submit"]');
  knap.disabled = true;
  besked.innerText = "Gemmer målingen …";

  try {
    const svar = await fetch("/api/maalinger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        maaleplan_id: maaleplanId,
        blodsukker: vaerdi,
        maalt_tid: maaltTid
      })
    });
    const resultat = await svar.json();

    if (svar.status !== 201) {
      besked.innerText = resultat.error || "Målingen kunne ikke gemmes.";
      opdaterRegistreringsknap(maaleplanId);
      return;
    }

    gemteMaalinger.push(resultat);
    formular.reset();

    try {
      const henteSvar = await fetch("/api/maalinger");
      if (!henteSvar.ok) {
        throw new Error("Kunne ikke hente målingerne.");
      }
      const hentedeMaalinger = await henteSvar.json();
      const gemtMaaling = hentedeMaalinger.find(maaling => Number(maaling.maaleplan_id) === maaleplanId);
      if (!gemtMaaling) {
        throw new Error("Den gemte måling blev ikke fundet.");
      }
      gemteMaalinger = hentedeMaalinger;
      markerSomRegistreret(gemtMaaling.blodsukker);
      besked.innerText = "Din måling er gemt.";
    } catch (err) {
      markerSomRegistreret(resultat.blodsukker);
      besked.innerText = "Din måling er gemt, men kunne ikke hentes igen. Genindlæs siden for at opdatere din måleplan.";
    }
  } catch (err) {
    besked.innerText = "Kunne ikke få svar fra serveren. Tjek din måleplan, før du prøver igen.";
  }

  opdaterRegistreringsknap(maaleplanId);
}

function opdaterRegistreringsknap(maaleplanId) {
  let erRegistreret = false;

  for (const maaling of gemteMaalinger) {
    if (Number(maaling.maaleplan_id) === maaleplanId) {
      erRegistreret = true;
      break;
    }
  }

  knap.disabled = erRegistreret;
}

function feltErTomt() {
  return blodsukkerFelt.value.trim() === "";
}

function vaerdiErUgyldig(vaerdi) {
  return !Number.isFinite(vaerdi) || vaerdi <= 0;
}

function markerSomRegistreret(blodsukker) {
  const gemtVaerdi = Number(blodsukker).toFixed(1).replace(".", ",");
  maaleStatus.innerText = "Registreret (" + gemtVaerdi + " mmol/L)";
  maaleStatus.className = "status status-udfoert";
}
