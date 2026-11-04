const express = require("express");
const app = express();

// Opdigtede patienter med test-CPR fra undervisningen.
const patients = [
  { id: "1", cpr: "2512489996", navn: "Mette" },
  { id: "2", cpr: "0107729995", navn: "Kasper" }
];

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());

app.get("/api/patients", (req, res) => {
  res.json(patients);
});

app.get("/api/patients/:id", (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: "Patienten findes ikke" });
  }
  res.json(patient);
});

app.post("/api/patients", (req, res) => {
  const { id, cpr, navn } = req.body ?? {};
  if (!id || !cpr || !navn) {
    return res.status(400).json({ error: "ID, CPR og navn skal udfyldes" });
  }
  const patient = { id, cpr, navn };
  patients.push(patient);
  res.status(201).json(patient);
});

app.use((req, res) => {
  res.status(404).json({ error: "Siden findes ikke" });
});

app.listen(3000);
