const parametre = new URLSearchParams(window.location.search);
const patientId = Number(parametre.get("id"));

const navn = document.getElementById("patient-navn");
const idTekst = document.getElementById("patient-id");
const liste = document.getElementById("maaleplan");
const besked = document.getElementById("detalje-besked");

async function hentPatientforloeb() {
  if (!Number.isInteger(patientId) || patientId < 1 || patientId > 2147483647) {
    besked.innerText = "Patient-ID mangler eller er ugyldigt. Vælg en patient fra patientlisten.";
    return;
  }

  try {
    const patientSvar = await fetch("/api/patients/" + patientId);
    if (patientSvar.status === 404) {
      besked.innerText = "Patienten findes ikke. Vælg en patient fra patientlisten.";
      return;
    }
    if (!patientSvar.ok) {
      throw new Error("Kunne ikke hente patienten.");
    }
    const patient = await patientSvar.json();
    navn.textContent = patient.navn;
    idTekst.textContent = "Patient-ID: " + patient.id;

    const planSvar = await fetch("/api/patients/" + patientId + "/maaleplaner");
    if (!planSvar.ok) {
      throw new Error("Kunne ikke hente måleplanen.");
    }
    const planer = await planSvar.json();

    if (planer.length === 0) {
      besked.innerText = "Patienten har ingen planlagte måletider.";
      return;
    }

    const maalingSvar = await fetch("/api/maalinger");
    if (!maalingSvar.ok) {
      throw new Error("Kunne ikke hente målingerne.");
    }
    const maalinger = await maalingSvar.json();
    visMaaleplan(planer, maalinger);
    besked.innerText = "Viser " + planer.length + " planlagte måletider for " + patient.navn + ".";
  } catch {
    liste.innerHTML = "";
    besked.innerText = "Patientens måleforløb kunne ikke hentes. Prøv at genindlæse siden.";
  }
}

function visMaaleplan(planer, maalinger) {
  liste.innerHTML = "";
  const nu = new Date();

  for (const plan of planer) {
    const maaling = maalinger.find(maaling => Number(maaling.maaleplan_id) === Number(plan.maaleplan_id));
    const raekke = document.createElement("tr");
    const planlagtTid = document.createElement("td");
    const faktiskTid = document.createElement("td");
    const blodsukker = document.createElement("td");
    const status = document.createElement("td");
    const statusTekst = document.createElement("span");

    planlagtTid.textContent = visTidspunkt(plan.planlagt_tid);
    faktiskTid.textContent = "Ikke registreret";
    blodsukker.textContent = "Ikke registreret";
    statusTekst.classList.add("status");

    if (maaling) {
      faktiskTid.textContent = visTidspunkt(maaling.maalt_tid);
      blodsukker.textContent = Number(maaling.blodsukker).toFixed(1).replace(".", ",");
      statusTekst.textContent = "Registreret";
      statusTekst.classList.add("status-udfoert");
    } else if (new Date(plan.planlagt_tid) < nu) {
      statusTekst.textContent = "Mangler registrering";
      statusTekst.classList.add("status-mangler");
    } else {
      statusTekst.textContent = "Planlagt";
      statusTekst.classList.add("status-planlagt");
    }

    status.append(statusTekst);
    raekke.append(planlagtTid, faktiskTid, blodsukker, status);
    liste.append(raekke);
  }
}

function visTidspunkt(tidspunkt) {
  if (!tidspunkt) {
    return "Tidspunkt ikke oplyst";
  }
  return new Date(tidspunkt).toLocaleString("da-DK");
}

hentPatientforloeb();
