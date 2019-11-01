/*const primitiveSatisfies = ({ data, filter }) =>
  ('' + data).toLowerCase().includes(filter)*/

export default store => {
  const { app, addError } = store
  const { filterFulltext: filter, geschaefte } = store.geschaefte
  // convert to lower case if possibe
  let filterValue = filter.toLowerCase ? filter.toLowerCase() : filter
  if (filterValue.toString) {
    // a number is queried
    // convert to string to also find 7681 when filtering for 681
    filterValue = filterValue.toString()
  }

  let result = []
  try {
    result = app.db
      .prepare(`select idGeschaeft from fts where value match '${filter}*'`)
      .all()
  } catch (error) {
    addError(error)
  }
  const filteredIds = result.map(o => o.idGeschaeft)

  return geschaefte.filter(g => {
    /**
     * this was far too slow
     * replaced it with fts on db
     */
    /*
    const interne = store.geschaefteKontakteIntern.geschaefteKontakteIntern
      .filter(k => k.idGeschaeft === geschaeftPassed.idGeschaeft)
      .map(gk => interneOptions.find(i => i.id === gk.idKontakt) || null)
    const externe = store.geschaefteKontakteExtern.geschaefteKontakteExtern
      .filter(k => k.idGeschaeft === geschaeftPassed.idGeschaeft)
      .map(gk => externeOptions.find(i => i.id === gk.idKontakt) || null)

    // add related data to geschaeft
    const geschaeft = {
      ...geschaeftPassed,
      verantwortlichItKonto:
        getItKontoForVerantwortlich(
          interneOptions,
          geschaeftPassed.verantwortlich,
        ) || '',
      geko: geko
        .filter(gko => gko.idGeschaeft === geschaeftPassed.idGeschaeft)
        .map(g => g.gekoNr)
        .join(),
      interne: interne
        .map(
          i =>
            `${i.name || ''} ${i.vorname || ''}  ${i.kurzzeichen ||
              ''} ${i.abteilung || ''} ${i.eMail || ''} ${i.telefon || ''}`,
        )
        .join(),
      externe: externe
        .map(
          i =>
            `${i.name || ''} ${i.vorname || ''} ${i.firma || ''} ${i.eMail ||
              ''} ${i.telefon || ''}`,
        )
        .join(),
      links: links
        .filter(l => l.idGeschaeft === geschaeftPassed.idGeschaeft)
        .map(l => l.url)
        .join(),
    }

    // if any value satisfies the filter, include the geschaeft
    let satisfiesFilter = false
    Object.values(geschaeft).forEach(data => {
      // ignore empty fields
      if (!(data || data === 0)) return
      // data is a primitive value
      if (primitiveSatisfies({ data, filter })) {
        satisfiesFilter = true
      }
    })*/
    return filteredIds.includes(g.idGeschaeft)
  })
}
