-- in sqlite fields can not be removed from table
-- need to create new table
-- insert data from old
-- remove old
-- rename new

-- create table geschaefte2 using createGeschaefte2.sql
-- geschaefte
INSERT INTO geschaefte2 (abteilung, aktennummer, aktenstandort, ausloeser, datumAusgangAwel, datumEingangAwel, details, entscheidAwel, entscheidBdv, entscheidBvv, entscheidKr, entscheidRrb, fristAbteilung, fristAmtschef, fristAwel, fristDirektion, fristMitarbeiter, gegenstand, geschaeftsart, idGeschaeft, idVorgeschaeft, mutationsdatum, mutationsperson, naechsterSchritt, ort, parlVorstossStufe, parlVorstossTyp, parlVorstossZustaendigkeitAwel, rechtsmittelInstanz, rechtsmittelErledigung, rechtsmittelEntscheidNr, rechtsmittelEntscheidDatum, rechtsmittelTxt, status, verantwortlich, vermerk, vermerkIntern, zustaendigeDirektion)
SELECT abteilung, aktennummer, aktenstandort, ausloeser, datumAusgangAwel, datumEingangAwel, details, entscheidAwel, entscheidBdv, entscheidBvv, entscheidKr, entscheidRrb, fristAbteilung, fristAmtschef, fristAwel, fristDirektion, fristMitarbeiter, gegenstand, geschaeftsart, idGeschaeft, idVorgeschaeft, mutationsdatum, mutationsperson, naechsterSchritt, ort, parlVorstossStufe, parlVorstossTyp, parlVorstossZustaendigkeitAwel, rechtsmittelInstanz, rechtsmittelErledigung, rechtsmittelEntscheidNr, rechtsmittelEntscheidDatum, rechtsmittelTxt, status, verantwortlich, vermerk, vermerkIntern, zustaendigeDirektion
FROM geschaefte;

-- WARNING:
-- STOP CASCADING ON DELETE REFERENCES BEFORE DROPPING GESCHAEFTE
-- OTHERWISE SOME TABLES ARE EMPTIED, FOR INSTANCE geschaefteKontakteIntern
PRAGMA foreign_keys = OFF;
DROP TABLE geschaefte;
ALTER TABLE geschaefte2 RENAME TO geschaefte;
-- enable references
PRAGMA foreign_keys = ON;
-- create indexes, just to be sure:
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
