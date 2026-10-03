// D1-demo: Formularen sender ikke til en server.
// Loginoplysninger bliver ikke kontrolleret mod en database eller gemt.
const formular = document.getElementById("login-form");
const brugernavnFelt = document.getElementById("brugernavn");
const adgangskodeFelt = document.getElementById("adgangskode");
const patientKnap = document.getElementById("patient-knap");
const personaleKnap = document.getElementById("personale-knap");
const rolleBesked = document.getElementById("rolle-besked");
const besked = document.getElementById("besked");

// let bruges, fordi rollen ændrer sig, når brugeren klikker.
let valgtRolle = "";

function vaelgPatient() {
  valgtRolle = "patient";
  patientKnap.classList.add("valgt-rolle");
  personaleKnap.classList.remove("valgt-rolle");
  rolleBesked.innerText = "Du har valgt: Patient";
  besked.innerText = "";
}

function vaelgPersonale() {
  valgtRolle = "personale";
  personaleKnap.classList.add("valgt-rolle");
  patientKnap.classList.remove("valgt-rolle");
  rolleBesked.innerText = "Du har valgt: Sundhedspersonale";
  besked.innerText = "";
}

function logInd(event) {
  // Stop formularens normale indsendelse og genindlæsning.
  event.preventDefault();
  besked.innerText = "";

  // trim fjerner mellemrum i starten og slutningen af teksten.
  if (brugernavnFelt.value.trim() === "") {
    besked.innerText = "Skriv et brugernavn. Det må ikke kun være mellemrum.";
    return;
  }
  if (adgangskodeFelt.value.trim() === "") {
    besked.innerText = "Skriv en opdigtet adgangskode. Den må ikke kun være mellemrum.";
    return;
  }

  // Redirect til gruppens side for den valgte rolle.
  if (valgtRolle === "patient") {
    window.location.href = "indtastdata.html";
  } else if (valgtRolle === "personale") {
    window.location.href = "patientliste.html";
  } else {
    besked.innerText = "Vælg Patient eller Sundhedspersonale først.";
  }
}

// Kobl klik og indsendelse til funktionerne ovenfor.
patientKnap.addEventListener("click", vaelgPatient);
personaleKnap.addEventListener("click", vaelgPersonale);
formular.addEventListener("submit", logInd);
