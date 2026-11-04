import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (err) => {
  console.error("Databasen lukkede forbindelsen:", err.message);
});

export async function hentPatienter() {
  const result = await pool.query("SELECT id, cpr, navn FROM patients ORDER BY id");
  return result.rows;
}

export async function hentPatient(id) {
  const result = await pool.query(
    "SELECT id, cpr, navn FROM patients WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

export async function opretPatient(cpr, navn) {
  const result = await pool.query(
    "INSERT INTO patients (cpr, navn) VALUES ($1, $2) RETURNING id, cpr, navn",
    [cpr, navn]
  );
  return result.rows[0];
}
