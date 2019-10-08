DROP TABLE IF EXISTS externe;
CREATE TABLE externe (
  id INTEGER PRIMARY KEY,
  eMail TEXT,
  firma TEXT,
  name TEXT,
  telefon TEXT,
  titel TEXT,
  vorname TEXT
);

DROP INDEX IF EXISTS iExterneVornameName;
CREATE INDEX iExterneVornameName ON externe (vorname, name);
DROP INDEX IF EXISTS iExterneNameVorname;
CREATE INDEX iExterneNameVorname ON externe (name, vorname);

-------------------------------------------

DROP TABLE IF EXISTS interne;
CREATE TABLE interne (
  id INTEGER PRIMARY KEY,
  abteilung TEXT,
  buero TEXT,
  eMail TEXT,
  itKonto TEXT,
  kurzzeichen TEXT UNIQUE,
  name TEXT,
  telefon TEXT,
  titel TEXT,
  vorname TEXT
);

DROP INDEX IF EXISTS iKurzzeichen;
CREATE INDEX iKurzzeichen ON interne (kurzzeichen);
DROP INDEX IF EXISTS iInterneVornameName;
CREATE INDEX iInterneVornameName ON interne (vorname, name);
DROP INDEX IF EXISTS iInterneNameVorname;
CREATE INDEX iInterneNameVorname ON interne (name, vorname);

-------------------------------------------

DROP TABLE IF EXISTS geko;
CREATE TABLE geko (
  idGeschaeft INTEGER REFERENCES geschaefte(idGeschaeft) ON UPDATE CASCADE ON DELETE CASCADE,
  gekoNr TEXT,
  PRIMARY KEY (gekoNr, idGeschaeft)
);

INSERT INTO
  geko(idGeschaeft, gekoNr)
SELECT
	idGeschaeft,
  gekoNr
FROM
  geschaefte
WHERE
  geschaefte.gekoNr IS NOT NULL;

-------------------------------------------

DROP TABLE IF EXISTS links;
CREATE TABLE links (
  idGeschaeft INTEGER REFERENCES geschaefte(idGeschaeft) ON UPDATE CASCADE ON DELETE CASCADE,
  url TEXT,
  txt TEXT,
  PRIMARY KEY (url, idGeschaeft)
);

-------------------------------------------

DROP TABLE IF EXISTS geschaefte;
CREATE TABLE geschaefte (
  abteilung TEXT REFERENCES abteilung(abteilung) ON UPDATE CASCADE ON DELETE RESTRICT,
  aktennummer TEXT,
  aktenstandort TEXT REFERENCES aktenstandort(aktenstandort) ON UPDATE CASCADE ON DELETE RESTRICT,
  ausloeser TEXT,
  datumAusgangAwel TEXT,
  datumEingangAwel TEXT,
  details TEXT,
  entscheidAwel TEXT,
  entscheidBdv TEXT,
  entscheidBvv TEXT,
  entscheidKr TEXT,
  entscheidRrb TEXT,
  fristAbteilung TEXT,
  fristAmtschef TEXT,
  fristAwel TEXT,
  fristDirektion TEXT,
  fristMitarbeiter TEXT,
  gegenstand TEXT,
  geschaeftsart TEXT REFERENCES geschaeftsart(geschaeftsart) ON UPDATE CASCADE ON DELETE RESTRICT,
  idGeschaeft INTEGER PRIMARY KEY,
  idVorgeschaeft INTEGER,
  mutationsdatum TEXT,
  mutationsperson TEXT,
  naechsterSchritt TEXT,
  ort TEXT,
  parlVorstossStufe TEXT,
  parlVorstossTyp TEXT REFERENCES parlVorstossTyp(parlVorstossTyp) ON UPDATE CASCADE ON DELETE RESTRICT,
  parlVorstossZustaendigkeitAwel TEXT,
  rechtsmittelInstanz TEXT REFERENCES rechtsmittelInstanz(rechtsmittelInstanz) ON UPDATE CASCADE ON DELETE RESTRICT,
  rechtsmittelErledigung TEXT REFERENCES rechtsmittelErledigung(rechtsmittelErledigung) ON UPDATE CASCADE ON DELETE RESTRICT,
  rechtsmittelEntscheidNr TEXT,
  rechtsmittelEntscheidDatum TEXT,
  rechtsmittelTxt TEXT,
  status TEXT REFERENCES status(status) ON UPDATE CASCADE ON DELETE RESTRICT,
  verantwortlich TEXT REFERENCES interne(kurzzeichen) ON UPDATE CASCADE ON DELETE RESTRICT,
  vermerk TEXT,
  vermerkIntern TEXT,
  zustaendigeDirektion TEXT
);
DROP INDEX IF EXISTS iGeschaefteVerantwortlich;
CREATE INDEX iGeschaefteVerantwortlich ON geschaefte (verantwortlich);
DROP INDEX IF EXISTS iGeschaefteFristMitarbeiter;
CREATE INDEX iGeschaefteFristMitarbeiter ON geschaefte (fristMitarbeiter);
DROP INDEX IF EXISTS iGeschaefteGeschaeftsart;
CREATE INDEX iGeschaefteGeschaeftsart ON geschaefte (geschaeftsart);
DROP INDEX IF EXISTS iGeschaefteParlVorstossTyp;
CREATE INDEX iGeschaefteParlVorstossTyp ON geschaefte (parlVorstossTyp);
DROP INDEX IF EXISTS iGeschaefteRechtsmittelInstanz;
CREATE INDEX iGeschaefteRechtsmittelInstanz ON geschaefte (rechtsmittelInstanz);
DROP INDEX IF EXISTS iGeschaefteRechtsmittelErledigung;
CREATE INDEX iGeschaefteRechtsmittelErledigung ON geschaefte (rechtsmittelErledigung);
DROP INDEX IF EXISTS iGeschaefteStatus;
CREATE INDEX iGeschaefteStatus ON geschaefte (status);
DROP INDEX IF EXISTS iGeschaefteAktenstandort;
CREATE INDEX iGeschaefteAktenstandort ON geschaefte (aktenstandort);
DROP INDEX IF EXISTS iGeschaefteAbteilung;
CREATE INDEX iGeschaefteAbteilung ON geschaefte (abteilung);

-------------------------------------------

DROP TABLE IF EXISTS geschaefteKontakteIntern;
CREATE TABLE geschaefteKontakteIntern (
  idGeschaeft INTEGER REFERENCES geschaefte(idGeschaeft) ON UPDATE CASCADE ON DELETE CASCADE,
  idKontakt INTEGER REFERENCES interne(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  PRIMARY KEY (idGeschaeft, idKontakt)
);

INSERT INTO geschaefteKontakteIntern (idGeschaeft, idKontakt)
SELECT geschaefte.idGeschaeft, interne.id
FROM
  geschaefte
  INNER JOIN interne
  ON interne.kurzzeichen = geschaefte.kontaktIntern1
UNION SELECT geschaefte.idGeschaeft, interne.id
FROM
  geschaefte
  INNER JOIN interne
  ON interne.kurzzeichen = geschaefte.kontaktIntern2
UNION SELECT geschaefte.idGeschaeft, interne.id
FROM
  geschaefte
  INNER JOIN interne
  ON interne.kurzzeichen = geschaefte.kontaktIntern3
UNION SELECT geschaefte.idGeschaeft, interne.id
FROM
  geschaefte
  INNER JOIN interne
  ON interne.kurzzeichen = geschaefte.kontaktIntern4;

-------------------------------------------

DROP TABLE IF EXISTS geschaefteKontakteExtern;
CREATE TABLE geschaefteKontakteExtern (
  idGeschaeft INTEGER REFERENCES geschaefte(idGeschaeft) ON UPDATE CASCADE ON DELETE CASCADE,
  idKontakt INTEGER REFERENCES externe(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  PRIMARY KEY (idGeschaeft, idKontakt)
);

INSERT INTO geschaefteKontakteExtern (idGeschaeft, idKontakt)
SELECT geschaefte.idGeschaeft, externe.id
FROM
  geschaefte
  INNER JOIN externe
  -- ON instr(geschaefte.idKontaktExtern_readonly, externe.name || ' ' || externe.vorname) > 0
  ON geschaefte.idKontaktExtern_readonly LIKE '%' || externe.name || ' ' || externe.vorname || '%'
WHERE
  geschaefte.idKontaktExtern_readonly <> '';

-------------------------------------------

-- boolean in sqlite is integer
-- true = 1
-- false = 0
DROP TABLE IF EXISTS geschaeftsart;
CREATE TABLE geschaeftsart (
  id integer PRIMARY KEY,
  geschaeftsart TEXT UNIQUE,
  historisch integer DEFAULT 0,
  sort INTEGER
);

DROP INDEX IF EXISTS iGeschaeftsartGeschaeftsart;
CREATE INDEX iGeschaeftsartGeschaeftsart ON geschaeftsart (geschaeftsart);
DROP INDEX IF EXISTS iGeschaeftsartHistorisch;
CREATE INDEX iGeschaeftsartHistorisch ON geschaeftsart (historisch);
DROP INDEX IF EXISTS iGeschaeftsartSort;
CREATE INDEX iGeschaeftsartSort ON geschaeftsart (sort);

-- now make sure all types
-- contained in geschaefte are included
INSERT INTO
  geschaeftsart(geschaeftsart)
SELECT
  geschaeftsart
FROM
  geschaefte
WHERE geschaeftsart NOT IN (
	SELECT geschaeftsart FROM geschaeftsart
)
GROUP BY
  geschaeftsart
HAVING
  geschaeftsart IS NOT NULL;

-- but only ones to be used actively
-- are not historical
UPDATE
  geschaeftsart
SET
  historisch = 1
WHERE
  geschaeftsart NOT IN ('Rechtsgeschäft', 'Rekurs/Beschwerde', 'Parlament. Vorstoss', 'Vernehmlassung', 'Strafverfahren', 'Diverses');

-- and actively used ones have a sort value
UPDATE
  geschaeftsart
SET
  sort = 1
WHERE
  geschaeftsart = 'Rechtsgeschäft';

UPDATE
  geschaeftsart
SET
  sort = 2
WHERE
  geschaeftsart = 'Rekurs/Beschwerde';

UPDATE
  geschaeftsart
SET
  sort = 3
WHERE
  geschaeftsart = 'Parlament. Vorstoss';

UPDATE
  geschaeftsart
SET
  sort = 4
WHERE
  geschaeftsart = 'Vernehmlassung';

UPDATE
  geschaeftsart
SET
  sort = 5
WHERE
  geschaeftsart = 'Strafverfahren';

UPDATE
  geschaeftsart
SET
  sort = 6
WHERE
  geschaeftsart = 'Diverses';
-------------------------------------------

INSERT INTO
  interne(kurzzeichen)
SELECT
  verantwortlich
FROM
  geschaefte
WHERE verantwortlich NOT IN (
	SELECT kurzzeichen FROM interne
)
GROUP BY
  verantwortlich;


-------------------------------------------


DROP TABLE IF EXISTS status;
CREATE TABLE status (
  id integer PRIMARY KEY,
  status TEXT UNIQUE,
  geschaeftKannFaelligSein integer DEFAULT 0,
  historisch integer DEFAULT 0,
  sort INTEGER
);

DROP INDEX IF EXISTS iStatusStatus;
CREATE INDEX iStatusStatus ON status (status);
DROP INDEX IF EXISTS iStatusGeschaeftKannFaelligSein;
CREATE INDEX iStatusGeschaeftKannFaelligSein ON status (geschaeftKannFaelligSein);
DROP INDEX IF EXISTS iStatusHistorisch;
CREATE INDEX iStatusHistorisch ON status (historisch);
DROP INDEX IF EXISTS iStatusSort;
CREATE INDEX iStatusSort ON status (sort);

-- now make sure all types
-- contained in geschaefte are included
INSERT INTO
  status(status)
SELECT
  status
FROM
  geschaefte
WHERE status NOT IN (
	SELECT status FROM status
)
GROUP BY
  status
HAVING
  status IS NOT NULL;

-- but only ones to be used actively
-- are not historical
UPDATE
  status
SET
  historisch = 1
WHERE
  status NOT IN ('angekündigt', 'pendent', 'überwachen int.', 'überwachen ext.', 'erledigt');

-- and actively used ones have a sort value
UPDATE
  status
SET
  sort = 1
WHERE
  status = 'angekündigt';
UPDATE
  status
SET
  sort = 2
WHERE
  status = 'pendent';
UPDATE
  status
SET
  sort = 3
WHERE
  status = 'überwachen int.';
UPDATE
  status
SET
  sort = 4
WHERE
  status = 'überwachen ext.';
UPDATE
  status
SET
  sort = 5
WHERE
  status = 'erledigt';

-------------------------------------------





DROP TABLE IF EXISTS aktenstandort;
CREATE TABLE aktenstandort (
  id integer PRIMARY KEY,
  aktenstandort TEXT UNIQUE,
  historisch integer DEFAULT 0,
  sort INTEGER
);

DROP INDEX IF EXISTS iAktenstandortAktenstandort;
CREATE INDEX iAktenstandortAktenstandort ON aktenstandort (aktenstandort);
DROP INDEX IF EXISTS iAktenstandortHistorisch;
CREATE INDEX iAktenstandortHistorisch ON aktenstandort (historisch);
DROP INDEX IF EXISTS iAktenstandortSort;
CREATE INDEX iAktenstandortSort ON aktenstandort (sort);

-- now make sure all types
-- contained in geschaefte are included
INSERT INTO
  aktenstandort(aktenstandort)
SELECT
  aktenstandort
FROM
  geschaefte
WHERE aktenstandort NOT IN (
	SELECT aktenstandort from aktenstandort
)
GROUP BY
  aktenstandort
HAVING
  aktenstandort IS NOT NULL;

INSERT INTO
  aktenstandort(aktenstandort)
VALUES ('Archiv');

-- but only ones to be used actively
-- are not historical
-- TODO
UPDATE
  aktenstandort
SET
  historisch = 1
WHERE
  aktenstandort NOT IN ('Archiv', 'W102 aktiv');

UPDATE
  aktenstandort
SET
  historisch = 0
WHERE
  aktenstandort IN ('Archiv', 'W102 aktiv');

-- and actively used ones have a sort value
UPDATE
  aktenstandort
SET
  sort = 1
WHERE
  aktenstandort = 'Archiv';
UPDATE
  aktenstandort
SET
  sort = 2
WHERE
  aktenstandort = 'W102 aktiv';





-------------------------------------------

DROP TABLE IF EXISTS parlVorstossTyp;
CREATE TABLE parlVorstossTyp (
  id integer PRIMARY KEY,
  parlVorstossTyp TEXT UNIQUE,
  historisch integer DEFAULT 0,
  sort INTEGER
);

DROP INDEX IF EXISTS iParlVorstossTypParlVorstossTyp;
CREATE INDEX iParlVorstossTypParlVorstossTyp ON parlVorstossTyp (parlVorstossTyp);
DROP INDEX IF EXISTS iParlVorstossTypHistorisch;
CREATE INDEX iParlVorstossTypHistorisch ON parlVorstossTyp (historisch);
DROP INDEX IF EXISTS iParlVorstossTypSort;
CREATE INDEX iParlVorstossTypSort ON parlVorstossTyp (sort);

-- now make sure all types
-- contained in geschaefte are included
INSERT INTO
  parlVorstossTyp(parlVorstossTyp)
SELECT
  parlVorstossTyp
FROM
  geschaefte
WHERE parlVorstossTyp NOT IN (
	SELECT parlVorstossTyp FROM parlVorstossTyp
)
GROUP BY
  parlVorstossTyp
HAVING
  parlVorstossTyp IS NOT NULL;


-- add missing value
INSERT INTO
	parlVorstossTyp(parlVorstossTyp)
	VALUES ('Leistungsmotion');

-- but only ones to be used actively
-- are not historical
UPDATE
  parlVorstossTyp
SET
  historisch = 1
WHERE
  parlVorstossTyp NOT IN ('Anfrage', 'Dringliche Anfrage', 'Interpellation', 'Postulat', 'Dringliches Postulat', 'Leistungsmotion', 'Motion', 'Vorlage');

  -- and actively used ones have a sort value
UPDATE
  parlVorstossTyp
SET
  sort = 1
WHERE
  parlVorstossTyp = 'Anfrage';
UPDATE
    parlVorstossTyp
SET
  sort = 2
WHERE
  parlVorstossTyp = 'Dringliche Anfrage';
UPDATE
  parlVorstossTyp
SET
  sort = 3
WHERE
  parlVorstossTyp = 'Interpellation';
UPDATE
  parlVorstossTyp
SET
  sort = 4
WHERE
  parlVorstossTyp = 'Postulat';
UPDATE
  parlVorstossTyp
SET
  sort = 5
WHERE
  parlVorstossTyp = 'Dringliches Postulat';
UPDATE
  parlVorstossTyp
SET
  sort = 6
WHERE
  parlVorstossTyp = 'Leistungsmotion';
UPDATE
  parlVorstossTyp
SET
  sort = 7
WHERE
  parlVorstossTyp = 'Motion';
UPDATE
  parlVorstossTyp
SET
  sort = 8
WHERE
  parlVorstossTyp = 'Vorlage';

-------------------------------------------

DROP TABLE IF EXISTS rechtsmittelErledigung;
CREATE TABLE rechtsmittelErledigung (
  id integer PRIMARY KEY,
  rechtsmittelErledigung TEXT UNIQUE,
  historisch integer DEFAULT 0,
  sort INTEGER
);

DROP INDEX IF EXISTS iRechtsmittelErledigungRechtsmittelErledigung;
CREATE INDEX iRechtsmittelErledigungRechtsmittelErledigung ON rechtsmittelErledigung (rechtsmittelErledigung);
DROP INDEX IF EXISTS iRechtsmittelErledigungHistorisch;
CREATE INDEX iRechtsmittelErledigungHistorisch ON rechtsmittelErledigung (historisch);
DROP INDEX IF EXISTS iRechtsmittelErledigungSort;
CREATE INDEX iRechtsmittelErledigungSort ON rechtsmittelErledigung (sort);

-- now make sure all types
-- contained in geschaefte are included
INSERT INTO
  rechtsmittelErledigung(rechtsmittelErledigung)
SELECT
  rechtsmittelErledigung
FROM
  geschaefte
WHERE rechtsmittelErledigung NOT IN (
	SELECT rechtsmittelErledigung FROM rechtsmittelErledigung
)
GROUP BY
  rechtsmittelErledigung
HAVING
  rechtsmittelErledigung IS NOT NULL;

-- but only ones to be used actively
-- are not historical
UPDATE
  rechtsmittelErledigung
SET
  historisch = 1
WHERE
  rechtsmittelErledigung NOT IN ('vollständig zugunsten AWEL', 'überwiegend zugunsten AWEL', 'zur Hälfte zugunsten AWEL', 'überwiegend zulasten AWEL', 'vollständig zulasten AWEL', '-------------------------', 'gegenstandslos', 'Rechtsmittelrückzug Rekurrent', 'Rücknahme durch AWEL', 'andere Gründe');

-- and actively used ones have a sort value
UPDATE
  rechtsmittelErledigung
SET
  sort = 1
WHERE
  rechtsmittelErledigung = 'vollständig zugunsten AWEL';
UPDATE
  rechtsmittelErledigung
SET
  sort = 2
WHERE
  rechtsmittelErledigung = 'überwiegend zugunsten AWEL';
UPDATE
  rechtsmittelErledigung
SET
  sort = 3
WHERE
  rechtsmittelErledigung = 'zur Hälfte zugunsten AWEL';
UPDATE
  rechtsmittelErledigung
SET
  sort = 4
WHERE
  rechtsmittelErledigung = 'überwiegend zulasten AWEL';
UPDATE
  rechtsmittelErledigung
SET
  sort = 5
WHERE
  rechtsmittelErledigung = 'vollständig zulasten AWEL';
UPDATE
  rechtsmittelErledigung
SET
  sort = 6
WHERE
  rechtsmittelErledigung = '-------------------------';
UPDATE
  rechtsmittelErledigung
SET
  sort = 7
WHERE
  rechtsmittelErledigung = 'gegenstandslos';
UPDATE
  rechtsmittelErledigung
SET
  sort = 8
WHERE
  rechtsmittelErledigung = 'Rechtsmittelrückzug Rekurrent';
UPDATE
  rechtsmittelErledigung
SET
  sort = 9
WHERE
  rechtsmittelErledigung = 'Rücknahme durch AWEL';
UPDATE
  rechtsmittelErledigung
SET
  sort = 10
WHERE
  rechtsmittelErledigung = 'andere Gründe';

-------------------------------------------

DROP TABLE IF EXISTS rechtsmittelInstanz;
CREATE TABLE rechtsmittelInstanz (
  id integer PRIMARY KEY,
  rechtsmittelInstanz TEXT UNIQUE,
  historisch integer DEFAULT 0,
  sort INTEGER
);

DROP INDEX IF EXISTS iRechtsmittelInstanzRechtsmittelInstanz;
CREATE INDEX iRechtsmittelInstanzRechtsmittelInstanz ON rechtsmittelInstanz (rechtsmittelInstanz);
DROP INDEX IF EXISTS iRechtsmittelInstanzHistorisch;
CREATE INDEX iRechtsmittelInstanzHistorisch ON rechtsmittelInstanz (historisch);
DROP INDEX IF EXISTS iRechtsmittelInstanzSort;
CREATE INDEX iRechtsmittelInstanzSort ON rechtsmittelInstanz (sort);

-- now make sure all types
-- contained in geschaefte are included
INSERT INTO
  rechtsmittelInstanz(rechtsmittelInstanz)
SELECT
  rechtsmittelInstanz
FROM
  geschaefte
WHERE rechtsmittelInstanz NOT IN (
	SELECT rechtsmittelInstanz from rechtsmittelInstanz
)
GROUP BY
  rechtsmittelInstanz
HAVING
  rechtsmittelInstanz IS NOT NULL;

-- now insert all wanted values, if not yet included
INSERT OR IGNORE INTO
  rechtsmittelInstanz(rechtsmittelInstanz,sort)
VALUES ('Baurekursgericht', 1);
INSERT OR IGNORE INTO
  rechtsmittelInstanz(rechtsmittelInstanz,sort)
VALUES ('Verwaltungsgericht', 2);
INSERT OR IGNORE INTO
  rechtsmittelInstanz(rechtsmittelInstanz,sort)
VALUES ('Bundesverwaltungsgericht', 3);
INSERT OR IGNORE INTO
  rechtsmittelInstanz(rechtsmittelInstanz,sort)
VALUES ('Bundesgericht', 4);
INSERT OR IGNORE INTO
  rechtsmittelInstanz(rechtsmittelInstanz,sort)
VALUES ('Baudirektion', 5);
INSERT OR IGNORE INTO
  rechtsmittelInstanz(rechtsmittelInstanz,sort)
VALUES ('Regierungsrat', 6);
INSERT OR IGNORE INTO
  rechtsmittelInstanz(rechtsmittelInstanz,sort)
VALUES ('andere Instanz', 7);

-- but only ones to be used actively
-- are not historical
UPDATE
  rechtsmittelInstanz
SET
  historisch = 1
WHERE
  rechtsmittelInstanz NOT IN ('Baurekursgericht', 'Verwaltungsgericht', 'Bundesverwaltungsgericht', 'Bundesgericht', 'Baudirektion', 'Regierungsrat', 'andere Instanz');

-- and actively used ones have a sort value
UPDATE
  rechtsmittelInstanz
SET
  sort = 2
WHERE
  rechtsmittelInstanz = 'Instanz 2';
UPDATE
  rechtsmittelInstanz
SET
  sort = 3
WHERE
  rechtsmittelInstanz = 'Instanz 3';

-------------------------------------------

DROP TABLE IF EXISTS abteilung;
CREATE TABLE abteilung (
  id integer PRIMARY KEY,
  abteilung TEXT UNIQUE,
  historisch integer DEFAULT 0,
  sort INTEGER
);

DROP INDEX IF EXISTS iAbteilungAbteilung;
CREATE INDEX iAbteilungAbteilung ON abteilung (abteilung);
DROP INDEX IF EXISTS iAbteilungHistorisch;
CREATE INDEX iAbteilungHistorisch ON abteilung (historisch);
DROP INDEX IF EXISTS iAbteilungSort;
CREATE INDEX iAbteilungSort ON abteilung (sort);

INSERT INTO
  abteilung(abteilung, historisch, sort)
VALUES
  ('', 1, 0),
  ('AW', 0, 1),
  ('Di', 0, 2),
  ('En', 0, 3),
  ('GS', 0, 4),
  ('Lu', 0, 5),
  ('Re', 0, 6),
  ('WB', 0, 7);

-------------------------------------------

-- set empty values to null:
-- do for all fields
UPDATE geschaefte
SET abteilung = NULL
WHERE abteilung = ''

-------------------------------------------

-- trim verantwortlich
UPDATE
  geschaefte
SET
  verantwortlich = trim(verantwortlich, ' ')

-- trim verantwortlich
UPDATE
  interne
SET
  kurzzeichen = trim(kurzzeichen, ' ')

-------------------------------------------

SELECT
  idGeschaeft,
  verantwortlich
FROM
  geschaefte
  LEFT JOIN interne
  ON interne.kurzzeichen = geschaefte.verantwortlich
WHERE
  geschaefte.verantwortlich IS NOT NULL AND
  interne.kurzzeichen IS NULL


SELECT
  verantwortlich
FROM
  geschaefte
  LEFT JOIN interne
  ON interne.kurzzeichen = geschaefte.verantwortlich
WHERE
  verantwortlich IS NOT NULL AND
  kurzzeichen IS NULL
GROUP BY
  verantwortlich

-------------------------------------------

vacuum

-------------------------------------------

INSERT INTO
  geschaefteKontakteExtern(idGeschaeft, idKontakt)
SELECT
	idGeschaeft, idKontakt
FROM
  geschaefteKontakteExternTmp;
