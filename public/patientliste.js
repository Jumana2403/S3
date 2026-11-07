const liste = document.getElementById("patienter");
const besked = document.getElementById("liste-besked");

async function hentPatienter() {
  liste.innerHTML = "";
  besked.innerText = "Henter patienter …";

  try {
    const svar = await fetch("/api/patients");
    if (!svar.ok) {
      throw new Error("Kunne ikke hente patienterne.");
    }
    const patienter = await svar.json();

    if (patienter.length === 0) {
      besked.innerText = "Der er ingen patienter at vise.";
      return;
    }

    for (const patient of patienter) {
      const raekke = document.createElement("tr");
      const id = document.createElement("td");
      const navn = document.createElement("td");
      const handling = document.createElement("td");
      const link = document.createElement("a");

      id.textContent = patient.id;
      navn.textContent = patient.navn;
      link.textContent = "Se måleforløb for " + patient.navn;
      link.href = "patientdetalje.html?id=" + patient.id;
      link.classList.add("button");

      handling.append(link);
      raekke.append(id, navn, handling);
      liste.append(raekke);
    }

    besked.innerText = "Viser " + patienter.length + " patienter.";
  } catch {
    liste.innerHTML = "";
    besked.innerText = "Patienterne kunne ikke hentes. Prøv at genindlæse siden.";
  }
}

hentPatienter();
