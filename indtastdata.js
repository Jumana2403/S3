const formular = document.getElementById("maaling-form");
const blodsukkerFelt = document.getElementById("blodsukker");
const besked = document.getElementById("maaling-besked");
const maaleStatus = document.getElementById("maale-status");

formular.addEventListener("submit", registrerMaaling);

visGemtMaaling();

async function visGemtMaaling() {
  const maaleplanId = Number(document.getElementById("maaleplan-id").value);
  const knap = formular.querySelector('button[type="submit"]');
  knap.disabled = true;

  try {
    const svar = await fetch("/api/maalinger");
    if (!svar.ok) {
      besked.innerText = "Kunne ikke hente den gemte måling.";
      return;
    }

    const maalinger = await svar.json();
    const maaling = maalinger.find(maaling => Number(maaling.maaleplan_id) === maaleplanId);
    if (maaling) {
      markerSomRegistreret(maaling.blodsukker);
    }
  } catch {
    besked.innerText = "Kunne ikke hente den gemte måling.";
  } finally {
    knap.disabled = false;
  }
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
      return;
    }

    markerSomRegistreret(resultat.blodsukker);
    besked.innerText = "Din måling er gemt.";
    formular.reset();
  } catch {
    besked.innerText = "Kunne ikke få svar fra serveren. Tjek din måleplan, før du prøver igen.";
  } finally {
    knap.disabled = false;
  }
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
