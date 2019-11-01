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

-- SELECT idGeschaeft from v_fts where value like '%abl%' -- 700ms

CREATE VIRTUAL TABLE fts USING fts5(idGeschaeft, value);
--CREATE VIRTUAL TABLE fts USING fts5(value, content=v_fts, content_rowid=idGeschaeft);
insert into fts(idGeschaeft, value) select idGeschaeft, value from v_fts;
-- select idGeschaeft from fts where value match 'abl*'  -- 49ms


CREATE TRIGGER fts_ai_from_geschaefte AFTER INSERT ON geschaefte BEGIN
  INSERT INTO fts(idGeschaeft, value) select idGeschaeft, value from v_fts where idGeschaeft = new.idGeschaeft;
END;
CREATE TRIGGER fts_ad_from_geschaefte AFTER DELETE ON geschaefte BEGIN
  delete from fts where idGeschaeft = old.idGeschaeft;
END;
CREATE TRIGGER fts_au_from_geschaefte AFTER UPDATE ON geschaefte BEGIN
  update fts set value = (select value from v_fts where idGeschaeft = new.idGeschaeft) where idGeschaeft = new.idGeschaeft;
END;
-- TODO: add triggers for gki, gke, geko, links