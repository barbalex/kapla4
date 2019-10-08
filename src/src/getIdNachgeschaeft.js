export default (geschaefte, idGeschaeft) => {
  // it is possible that more than one geschaeft
  // has this idGeschaeft set as idVorgeschaeft
  // this causes no endless loop and it does not matter
  // that not all nachgeschaefte are shown, as it is only
  // a linear list anyway
  const nachgeschaeft = geschaefte.find(g => g.idVorgeschaeft === idGeschaeft)
  if (nachgeschaeft && nachgeschaeft.idGeschaeft) {
    return nachgeschaeft.idGeschaeft
  }
  return null
}
