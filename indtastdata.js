const formular = document.getElementById("maaling-form");
const blodsukkerFelt = document.getElementById("blodsukker");
const besked = document.getElementById("maaling-besked");
const maaleStatus = document.getElementById("maale-status");

formular.addEventListener("submit", registrerMaaling);

function registrerMaaling(event) {
  event.preventDefault();

  const vaerdi = Number(blodsukkerFelt.value);

  if (blodsukkerFelt.value.trim() === "") {
    besked.innerText = "Indtast en blodsukkerværdi først.";
    return;
  }
  if (vaerdi < 0) {
    besked.innerText = "Blodsukkerværdien kan ikke være negativ.";
    return;
  }

  maaleStatus.innerText = "Registreret";
  maaleStatus.className = "status status-udfoert";
  besked.innerText = "Målingen på " + vaerdi.toFixed(1) + " mmol/L er registreret.";
  formular.reset();
}
