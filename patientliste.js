const patienter = [
  { navn: "Alma Kari", plan: "Morgen kl. 09.00", maaling: "6,8", tidspunkt: "4. oktober 2026 kl. 09.00" },
  { navn: "Hager Rahdi", plan: "Morgen kl. 09.00", maaling: "7,2", tidspunkt: "4. oktober 2026 kl. 09.00" },
  { navn: "Jumana Thammer", plan: "Morgen kl. 09.00", maaling: "6,1", tidspunkt: "4. oktober 2026 kl. 09.00" }
];

const liste = document.getElementById("patienter");
const besked = document.getElementById("liste-besked");

function visPatienter() {
  liste.innerHTML = "";

  for (const patient of patienter) {
    const raekke = document.createElement("tr");
    const navn = document.createElement("td");
    const plan = document.createElement("td");
    const maaling = document.createElement("td");
    const tidspunkt = document.createElement("td");
    const status = document.createElement("td");
    const statusTekst = document.createElement("span");

    navn.textContent = patient.navn;
    plan.textContent = patient.plan;
    maaling.textContent = patient.maaling;
    tidspunkt.textContent = patient.tidspunkt;
    statusTekst.textContent = "Registreret";
    statusTekst.classList.add("status", "status-udfoert");

    status.append(statusTekst);
    raekke.append(navn, plan, maaling, tidspunkt, status);
    liste.append(raekke);
  }

  besked.innerText = "Viser " + patienter.length + " eksempelpersoner med én måling hver.";
}

visPatienter();
