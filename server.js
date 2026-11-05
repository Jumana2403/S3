import express from "express";
import cors from "cors";
import { hentPatienter, hentPatient, opretPatient } from "./patients.js";

import { hentMaalinger, hentMaaleplan, opretMaaling } from "./maalinger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/patients", async (req, res) => {
  try {
    res.json(await hentPatienter());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

app.get("/api/patients/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    return res.status(404).json({ error: "Patienten findes ikke" });
  }

  try {
    const patient = await hentPatient(id);
    if (!patient) {
      return res.status(404).json({ error: "Patienten findes ikke" });
    }
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

app.post("/api/patients", async (req, res) => {
  const { cpr, navn } = req.body ?? {};
  if (!cpr || !navn) {
    return res.status(400).json({ error: "CPR og navn skal udfyldes" });
  }

  try {
    res.status(201).json(await opretPatient(cpr, navn));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

app.get("/api/maalinger", async (req, res) => {
  try {
    res.json(await hentMaalinger());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

app.post("/api/maalinger", async (req, res) => {
  const { maaleplan_id, blodsukker, maalt_tid } = req.body ?? {};
  if (!maaleplan_id || !blodsukker || !maalt_tid) {
    return res.status(400).json({ error: "Måleplan, blodsukker og målt tid skal udfyldes" });
  }
  if (maaleplan_id !== Number(maaleplan_id) ||
      maaleplan_id < 1 || maaleplan_id > 2147483647 ||
      blodsukker !== Number(blodsukker) || blodsukker <= 0) {
    return res.status(400).json({ error: "Angiv et gyldigt måleplan-ID og en positiv blodsukkerværdi" });
  }

  try {
    const maaleplan = await hentMaaleplan(maaleplan_id);
    if (!maaleplan) {
      return res.status(400).json({ error: "Måleplanen findes ikke" });
    }
    res.status(201).json(await opretMaaling(maaleplan_id, blodsukker, maalt_tid));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Siden findes ikke" });
});

app.listen(3000);
