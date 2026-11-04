-- Kør én gang i en tom database.
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  cpr VARCHAR(10) NOT NULL UNIQUE,
  navn VARCHAR(200) NOT NULL
);

CREATE TABLE maaleplaner (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients (id),
  planlagt_tid TIMESTAMP NOT NULL
);

CREATE TABLE maalinger (
  id SERIAL PRIMARY KEY,
  maaleplan_id INTEGER NOT NULL UNIQUE REFERENCES maaleplaner (id),
  blodsukker DECIMAL NOT NULL,
  maalt_tid TIMESTAMP NOT NULL
);

-- Patienter med test-CPR fra pensum.
INSERT INTO patients (cpr, navn)
VALUES ('2512489996', 'Mette');

INSERT INTO patients (cpr, navn)
VALUES ('0107729995', 'Kasper');

-- Mette har ID 1, Kasper har ID 2 i den nye database.
INSERT INTO maaleplaner (patient_id, planlagt_tid)
VALUES (1, '2026-10-05 09:00:00');

INSERT INTO maaleplaner (patient_id, planlagt_tid)
VALUES (2, '2026-10-05 09:00:00');

INSERT INTO maaleplaner (patient_id, planlagt_tid)
VALUES (2, '2026-10-05 20:00:00');

-- Testmålinger. Kasper mangler morgenmålingen.
INSERT INTO maalinger (maaleplan_id, blodsukker, maalt_tid)
VALUES (1, 6.8, '2026-10-05 09:00:00');

INSERT INTO maalinger (maaleplan_id, blodsukker, maalt_tid)
VALUES (3, 7.2, '2026-10-05 20:00:00');

-- Vis patienter og Mettes plan og måling.
SELECT id, cpr, navn FROM patients ORDER BY id;

SELECT id, patient_id, planlagt_tid
FROM maaleplaner
WHERE patient_id = 1;

SELECT id, maaleplan_id, blodsukker, maalt_tid
FROM maalinger
WHERE maaleplan_id = 1;
