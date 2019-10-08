CREATE TABLE geschaefte2 (
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