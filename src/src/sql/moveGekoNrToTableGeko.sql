-- now make sure all types
-- contained in geschaefte are included
INSERT INTO
  geko(idGeschaeft, gekoNr)
SELECT
  idGeschaeft, gekoNr
FROM
  geschaefte
WHERE gekoNr <> "";

-- then drop field geschaefte.gekoNr