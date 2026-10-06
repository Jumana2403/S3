const formular = document.getElementById("maaling-form");
const blodsukkerFelt = document.getElementById("blodsukker");
const besked = document.getElementById("maaling-besked");
const maaleStatus = document.getElementById("maale-status");

formular.addEventListener("submit", registrerMaaling);

function registrerMaaling(event) {
  event.preventDefault();

  const vaerdi = Number(blodsukkerFelt.value);

  if (feltErTomt()) {
    besked.innerText = "Indtast En Blodsukkerværdi Først.";
    return;
  }
  if (vaerdiErNegativ(vaerdi)) {
    besked.innerText = "Blodsukkerværdien Kan Ikke Være Negativ.";
    return;
  }

  markerSomRegistreret();
  besked.innerText = "Målingen på " + vaerdi.toFixed(1) + " mmol/L er registreret.";
  formular.reset();
}

function feltErTomt() {
  return blodsukkerFelt.value.trim() === "";
}

function vaerdiErNegativ(vaerdi) {
  return vaerdi < 0;
}

function markerSomRegistreret() {
  maaleStatus.innerText = "Registreret";
  maaleStatus.className = "status status-udfoert";
}
