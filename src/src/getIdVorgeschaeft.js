export default (geschaefte, idGeschaeft) => {
  const geschaeft = geschaefte.find(g => g.idGeschaeft === idGeschaeft)
  if (geschaeft && geschaeft.idVorgeschaeft) {
    return geschaeft.idVorgeschaeft
  }
  return null
}
