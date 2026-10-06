const formular = document.getElementById("login-form");
const brugernavnFelt = document.getElementById("brugernavn");
const adgangskodeFelt = document.getElementById("adgangskode");
const patientKnap = document.getElementById("patient-knap");
const personaleKnap = document.getElementById("personale-knap");
const rolleBesked = document.getElementById("rolle-besked");
const besked = document.getElementById("besked");

let valgtRolle = "";

function vaelgPatient() {
  valgtRolle = "patient";
  patientKnap.classList.add("valgt-rolle");
  personaleKnap.classList.remove("valgt-rolle");
  rolleBesked.innerText = "Du er en Patient";
  besked.innerText = "";
}

function vaelgPersonale() {
  valgtRolle = "personale";
  personaleKnap.classList.add("valgt-rolle");
  patientKnap.classList.remove("valgt-rolle");
  rolleBesked.innerText = "Du er en Sundhedspersonale";
  besked.innerText = "";
}

function logInd(event) {
  event.preventDefault();
  besked.innerText = "";

  if (brugernavnFelt.value.trim() === "") {
    besked.innerText = "Udfyld ";
    return;
  }
  if (adgangskodeFelt.value.trim() === "") {
    besked.innerText = "Udfyld";
    return;
  }

  if (valgtRolle === "patient") {
    window.location.href = "indtastdata.html";
  } else if (valgtRolle === "personale") {
    window.location.href = "patientliste.html";
  } else {
    besked.innerText = "Vælg Patient eller Sundhedspersonale først.";
  }
}

patientKnap.addEventListener("click", vaelgPatient);
personaleKnap.addEventListener("click", vaelgPersonale);
formular.addEventListener("submit", logInd);
