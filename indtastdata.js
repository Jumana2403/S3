// Siden bruger kun fiktive testdata i browseren.
const formular = document.getElementById("maaling-form");
const blodsukkerFelt = document.getElementById("blodsukker");
const besked = document.getElementById("maaling-besked");
const planlagtTidspunkt = document.getElementById("planlagt-tidspunkt");
const maaleStatus = document.getElementById("maale-status");

const lagerNoegle = "s3_seneste_blodsukkermaaling";

visPlanlagtTidspunkt();
visSenesteMaaling();

formular.addEventListener("submit", registrerMaaling);

function visPlanlagtTidspunkt() {
  const planlagt = new Date();
  planlagt.setHours(8, 0, 0, 0);

  planlagtTidspunkt.innerText = planlagt.toLocaleString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function registrerMaaling(event) {
  event.preventDefault();

  if (blodsukkerFelt.value.trim() === "") {
    besked.innerText = "Indtast en blodsukkerværdi først.";
    return;
  }

  const maaling = {
    vaerdi: Number(blodsukkerFelt.value),
    tidspunkt: new Date().toISOString()
  };

  localStorage.setItem(lagerNoegle, JSON.stringify(maaling));
  maaleStatus.innerText = "Registreret";
  maaleStatus.className = "status status-udfoert";
  besked.innerText = "Målingen er registreret.";
  formular.reset();
}

function visSenesteMaaling() {
  const gemtTekst = localStorage.getItem(lagerNoegle);
  if (gemtTekst === null) {
    return;
  }

  const maaling = JSON.parse(gemtTekst);
  maaleStatus.innerText = "Registreret";
  maaleStatus.className = "status status-udfoert";
  besked.innerText = "Seneste registrering: " + maaling.vaerdi.toFixed(1) + " mmol/L.";
}
