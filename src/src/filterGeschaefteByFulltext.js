import getItKontoForVerantwortlich from './getItKontoForVerantwortlich'

const primitiveSatisfies = ({ data, filter }) =>
  ('' + data).toLowerCase().includes(filter)

export default store => {
  const {
    filterFulltext: filter,
    geschaefte,
    interneOptions,
    externeOptions,
    geko,
    links,
  } = store.geschaefte
  // convert to lower case if possibe
  let filterValue = filter.toLowerCase ? filter.toLowerCase() : filter
  if (filterValue.toString) {
    // a number is queried
    // convert to string to also find 7681 when filtering for 681
    filterValue = filterValue.toString()
  }

  return geschaefte.filter(geschaeftPassed => {
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
    })
    return satisfiesFilter
  })
}
