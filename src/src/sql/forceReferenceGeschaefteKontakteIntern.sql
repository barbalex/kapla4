CREATE TABLE geschaefteKontakteIntern2 (
  idGeschaeft INTEGER REFERENCES geschaefte(idGeschaeft) ON UPDATE CASCADE ON DELETE CASCADE,
  idKontakt INTEGER REFERENCES interne(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  PRIMARY KEY (idGeschaeft, idKontakt)
);

INSERT INTO
  geschaefteKontakteIntern2(idGeschaeft, idKontakt)
SELECT
  geschaefteKontakteIntern.idGeschaeft, geschaefteKontakteIntern.idKontakt
FROM
  geschaefteKontakteIntern
LEFT JOIN
    geschaefte
    ON geschaefte.idGeschaeft = geschaefteKontakteIntern.idGeschaeft
WHERE
  geschaefte.idGeschaeft IS NOT NULL;

DROP TABLE geschaefteKontakteIntern;

ALTER TABLE geschaefteKontakteIntern2 RENAME TO geschaefteKontakteIntern;