drop view if exists v_fts;
create view v_fts as 
SELECT 
  g.idGeschaeft,
  coalesce(g.abteilung, '') || ' ' ||
  coalesce(g.aktennummer, '') || ' ' ||
  coalesce(g.aktenstandort, '') || ' ' ||
  coalesce(g.ausloeser, '') || ' ' ||
  coalesce(g.datumAusgangAwel, '') || ' ' ||
  coalesce(g.datumEingangAwel, '') || ' ' ||
  coalesce(g.details, '') || ' ' ||
  coalesce(g.entscheidAwel, '') || ' ' ||
  coalesce(g.entscheidBdv, '') || ' ' ||
  coalesce(g.entscheidBvv, '') || ' ' ||
  coalesce(g.entscheidKr, '') || ' ' ||
  coalesce(g.entscheidRrb, '') || ' ' ||
  coalesce(g.fristAbteilung, '') || ' ' ||
  coalesce(g.fristAmtschef, '') || ' ' ||
  coalesce(g.fristAwel, '') || ' ' ||
  coalesce(g.fristDirektion, '') || ' ' ||
  coalesce(g.fristMitarbeiter, '') || ' ' ||
  coalesce(g.gegenstand, '') || ' ' ||
  coalesce(g.geschaeftsart, '') || ' ' ||
  coalesce(g.idGeschaeft, '') || ' ' ||
  coalesce(g.idVorgeschaeft, '') || ' ' ||
  coalesce(g.mutationsdatum, '') || ' ' ||
  coalesce(g.mutationsperson, '') || ' ' ||
  coalesce(g.naechsterSchritt, '') || ' ' ||
  coalesce(g.ort, '') || ' ' ||
  coalesce(g.parlVorstossStufe, '') || ' ' ||
  coalesce(g.parlVorstossTyp, '') || ' ' ||
  coalesce(g.parlVorstossZustaendigkeitAwel, '') || ' ' ||
  coalesce(g.rechtsmittelInstanz, '') || ' ' ||
  coalesce(g.rechtsmittelErledigung, '') || ' ' ||
  coalesce(g.rechtsmittelEntscheidNr, '') || ' ' ||
  coalesce(g.rechtsmittelEntscheidDatum, '') || ' ' ||
  coalesce(g.rechtsmittelTxt, '') || ' ' ||
  coalesce(g.status, '') || ' ' ||
  coalesce(g.verantwortlich, '') || ' ' ||
  coalesce(g.vermerk, '') || ' ' ||
  coalesce(g.vermerkIntern, '') || ' ' ||
  coalesce(g.zustaendigeDirektion, '') || ' ' ||
  coalesce((
    select
      coalesce(group_concat(interne.name, ', '), '') || ' ' ||
      coalesce(group_concat(interne.vorname, ', '), '') || ' ' ||
      coalesce(group_concat(interne.abteilung, ', '), '') || ' ' ||
      coalesce(group_concat(interne.eMail, ', '), '') || ' ' ||
      coalesce(group_concat(interne.telefon, ', '), '') as val
    from 
      interne
      inner join geschaefteKontakteIntern gki
      on interne.id = gki.idKontakt
    where gki.idGeschaeft = g.idGeschaeft
  ), '') || ' ' ||
  coalesce((
    select
      coalesce(group_concat(externe.name, ', '), '') || ' ' ||
      coalesce(group_concat(externe.firma, ', '), '') || ' ' ||
      coalesce(group_concat(externe.eMail, ', '), '') || ' ' ||
      coalesce(group_concat(externe.telefon, ', '), '') as val
    from 
      externe
      inner join geschaefteKontakteExtern gke
      on externe.id = gke.idKontakt
    where gke.idGeschaeft = g.idGeschaeft
    group by gke.idGeschaeft
  ), '') || ' ' ||
  coalesce((
    select
      group_concat(geko.gekoNr, ', ') as val
    from 
      geko
      inner join geschaefte
      on geko.idGeschaeft = geschaefte.idGeschaeft
    where geko.idGeschaeft = g.idGeschaeft
    group by geko.idGeschaeft
  ), '') || ' ' ||
  coalesce((
    select
      group_concat(links.url, ', ') as val
    from 
      links
      inner join geschaefte
      on links.idGeschaeft = geschaefte.idGeschaeft
    where links.idGeschaeft = g.idGeschaeft
    group by links.idGeschaeft
  ), '') as value
FROM
  geschaefte g;

SELECT * from v_fts where value like '%natur%' -- 820ms

CREATE VIRTUAL TABLE fts USING fts5(idGeschaeft, value);
insert into fts(idGeschaeft, value) select * from v_fts;
select * from fts where value match 'abl*'


SELECT * from fts where value match '%natur%'

CREATE TRIGGER tbl_ai AFTER INSERT ON tbl BEGIN
  INSERT INTO fts_idx(rowid, b, c) VALUES (new.a, new.b, new.c);
END;
CREATE TRIGGER tbl_ad AFTER DELETE ON tbl BEGIN
  INSERT INTO fts_idx(fts_idx, rowid, b, c) VALUES('delete', old.a, old.b, old.c);
END;
CREATE TRIGGER tbl_au AFTER UPDATE ON tbl BEGIN
  INSERT INTO fts_idx(fts_idx, rowid, b, c) VALUES('delete', old.a, old.b, old.c);
  INSERT INTO fts_idx(rowid, b, c) VALUES (new.a, new.b, new.c);
END;