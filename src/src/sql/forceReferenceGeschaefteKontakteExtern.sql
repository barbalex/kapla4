CREATE TABLE geschaefteKontakteExtern2 (
  idGeschaeft INTEGER REFERENCES geschaefte(idGeschaeft) ON UPDATE CASCADE ON DELETE CASCADE,
  idKontakt INTEGER REFERENCES externe(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  PRIMARY KEY (idGeschaeft, idKontakt)
);

INSERT INTO
  geschaefteKontakteExtern2(idGeschaeft, idKontakt)
SELECT
  geschaefteKontakteExtern.idGeschaeft, geschaefteKontakteExtern.idKontakt
FROM
  geschaefteKontakteExtern
LEFT JOIN
    geschaefte
    ON geschaefte.idGeschaeft = geschaefteKontakteExtern.idGeschaeft
WHERE
  geschaefte.idGeschaeft IS NOT NULL;

DROP TABLE geschaefteKontakteExtern;

ALTER TABLE geschaefteKontakteExtern2 RENAME TO geschaefteKontakteExtern;