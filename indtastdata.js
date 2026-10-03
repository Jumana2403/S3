// D1-mockup: Siden bruger kun syntetiske testdata i browseren.
// CPR, adgangskoder og rigtige patientoplysninger gemmes ikke.
const formular = document.getElementById("maaling-form");
const maalingstypeFelt = document.getElementById("maalingstype");
const blodsukkerFelt = document.getElementById("blodsukker");
const tidspunktFelt = document.getElementById("tidspunkt");
const noteFelt = document.getElementById("note");
const besked = document.getElementById("maaling-besked");
const registreringerListe = document.getElementById("registreringer");
const rydKnap = document.getElementById("ryd-knap");

const plan = {
  morgen: { navn: "Morgen", tid: "07:30" },
  middag: { navn: "Middag", tid: "12:30" },
  aften: { navn: "Aften", tid: "21:00" },
  ekstra: { navn: "Ekstra måling", tid: "Ikke planlagt" }
};

const lagerNoegle = "s3_mockup_registreringer";
let registreringer = hentRegistreringer();

saetPlanlagtTidspunkt();
tegnPreview();
tegnRegistreringer();

maalingstypeFelt.addEventListener("change", () => {
  saetPlanlagtTidspunkt();
  tegnPreview();
});
formular.addEventListener("input", tegnPreview);
formular.addEventListener("submit", gemMaaling);
rydKnap.addEventListener("click", rydRegistreringer);

function hentRegistreringer() {
  const gemtTekst = localStorage.getItem(lagerNoegle);
  if (gemtTekst === null) {
    return [];
  }
  return JSON.parse(gemtTekst);
}

function gemRegistreringer() {
  localStorage.setItem(lagerNoegle, JSON.stringify(registreringer));
}

function saetPlanlagtTidspunkt() {
  const valgtType = maalingstypeFelt.value;
  const nu = new Date();

  if (valgtType !== "ekstra") {
    const tid = plan[valgtType].tid.split(":");
    nu.setHours(Number(tid[0]), Number(tid[1]), 0, 0);
  }

  nu.setMinutes(nu.getMinutes() - nu.getTimezoneOffset());
  tidspunktFelt.value = nu.toISOString().slice(0, 16);
}

function beregnStatus() {
  const valgtType = maalingstypeFelt.value;
  if (valgtType === "ekstra") {
    return "Ekstra";
  }

  const valgtTidspunkt = new Date(tidspunktFelt.value);
  const planTid = plan[valgtType].tid.split(":");
  const planlagtTidspunkt = new Date(valgtTidspunkt);
  planlagtTidspunkt.setHours(Number(planTid[0]), Number(planTid[1]), 0, 0);

  const forskelIMinutter = Math.abs(valgtTidspunkt - planlagtTidspunkt) / 60000;
  if (forskelIMinutter > 60) {
    return "Forsinket";
  }

  return "Udført";
}

function beskrivVaerdi() {
  const vaerdi = Number(blodsukkerFelt.value);
  blodsukkerFelt.classList.remove("felt-lav", "felt-ok", "felt-hoej");

  if (blodsukkerFelt.value.trim() === "") {
    return "Udfyld blodsukker";
  }
  if (vaerdi < 4) {
    blodsukkerFelt.classList.add("felt-lav");
    return vaerdi.toFixed(1) + " mmol/L - lav testværdi";
  }
  if (vaerdi > 10) {
    blodsukkerFelt.classList.add("felt-hoej");
    return vaerdi.toFixed(1) + " mmol/L - høj testværdi";
  }

  blodsukkerFelt.classList.add("felt-ok");
  return vaerdi.toFixed(1) + " mmol/L - inden for testinterval";
}

function tegnPreview() {
  const status = beregnStatus();
  const valgtType = maalingstypeFelt.value;

  document.getElementById("preview-status").innerText = status + " - " + plan[valgtType].navn;
  document.getElementById("preview-vaerdi").innerText = beskrivVaerdi();
  document.getElementById("preview-tid").innerText = tidspunktFelt.value === ""
    ? "Vælg tidspunkt"
    : new Date(tidspunktFelt.value).toLocaleString("da-DK");
}

function gemMaaling(event) {
  event.preventDefault();

  if (blodsukkerFelt.value.trim() === "") {
    besked.innerText = "Indtast en blodsukkerværdi først.";
    return;
  }

  const valgtType = maalingstypeFelt.value;
  const nyRegistrering = {
    type: plan[valgtType].navn,
    vaerdi: Number(blodsukkerFelt.value),
    tidspunkt: tidspunktFelt.value,
    status: beregnStatus(),
    note: noteFelt.value.trim()
  };

  registreringer = [nyRegistrering, ...registreringer].slice(0, 5);
  gemRegistreringer();
  tegnRegistreringer();
  besked.innerText = "Målingen er gemt i mockuppet.";
  formular.reset();
  saetPlanlagtTidspunkt();
  tegnPreview();
}

function tegnRegistreringer() {
  registreringerListe.replaceChildren();

  if (registreringer.length === 0) {
    const tom = document.createElement("li");
    tom.innerText = "Ingen registreringer endnu.";
    registreringerListe.appendChild(tom);
    return;
  }

  registreringer.forEach((registrering) => {
    const punkt = document.createElement("li");
    const titel = document.createElement("strong");
    const detaljer = document.createElement("span");

    titel.innerText = registrering.vaerdi.toFixed(1) + " mmol/L - " + registrering.status;
    detaljer.innerText = registrering.type + " - " + new Date(registrering.tidspunkt).toLocaleString("da-DK");

    punkt.appendChild(titel);
    punkt.appendChild(detaljer);

    if (registrering.note !== "") {
      const note = document.createElement("span");
      note.innerText = "Note: " + registrering.note;
      punkt.appendChild(note);
    }

    registreringerListe.appendChild(punkt);
  });
}

function rydRegistreringer() {
  registreringer = [];
  localStorage.removeItem(lagerNoegle);
  tegnRegistreringer();
  besked.innerText = "Testdata er ryddet.";
}
