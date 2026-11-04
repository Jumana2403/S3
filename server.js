import express from "express";
import { hentPatienter, hentPatient, opretPatient } from "./patients.js";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

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

app.use((req, res) => {
  res.status(404).json({ error: "Siden findes ikke" });
});

app.listen(3000);
