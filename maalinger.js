import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (err) => {
  console.error("Databasen lukkede forbindelsen:", err.message);
});

export async function hentMaalinger() {
  const result = await pool.query(
    "SELECT id, maaleplan_id, blodsukker, maalt_tid FROM maalinger ORDER BY id"
  );
  return result.rows;
}

export async function hentMaaleplan(id) {
  const result = await pool.query("SELECT id FROM maaleplaner ORDER BY id");
  return result.rows.find(plan => plan.id === id);
}

export async function opretMaaling(maaleplanId, blodsukker, maaltTid) {
  const result = await pool.query(
    "INSERT INTO maalinger (maaleplan_id, blodsukker, maalt_tid) VALUES ($1, $2, $3) RETURNING id, maaleplan_id, blodsukker, maalt_tid",
    [maaleplanId, blodsukker, maaltTid]
  );
  return result.rows[0];
}
