const loginForm = document.getElementById("login-form");
const personaFelt = document.getElementById("persona");

const personaer = {
  amina: { id: "amina", navn: "Amina Karlsen", rolle: "patient", side: "indtastdata.html?patient=amina" },
  jonas: { id: "jonas", navn: "Jonas Mikkelsen", rolle: "patient", side: "indtastdata.html?patient=jonas" },
  sara: { id: "sara", navn: "Sara Nielsen", rolle: "personale", side: "patientliste.html" }
};

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const valgtPersona = personaer[personaFelt.value];
  localStorage.setItem("s3_aktiv_persona", JSON.stringify(valgtPersona));
  window.location.href = valgtPersona.side;
});
