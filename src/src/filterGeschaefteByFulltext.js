import { isArray, isObject } from 'lodash'

import getItKontoForVerantwortlich from './getItKontoForVerantwortlich'

const primitiveSatisfies = ({ data, filter }) => {
  // a number or string
  // convert to string if is number to also find 7681 when filtering for 681
  if (data.toString) {
    data = data.toString()
  }
  // lowercase
  if (data.toLowerCase) {
    data = data.toLowerCase()
  }
  // check if satisfies filter
  // by now data should be a string
  if (data.includes(filter)) {
    return true
  }
  return false
}

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
      verantwortlichItKonto: getItKontoForVerantwortlich(
        interneOptions,
        geschaeftPassed.verantwortlich,
      ),
      geko: geko
        .filter(gko => gko.idGeschaeft === geschaeftPassed.idGeschaeft)
        .map(g => g.gekoNr)
        .join(', '),
      interne: interne
        .map(i => {
          const name = `${i.name} ${i.vorname}, ${i.kurzzeichen}`
          const abt = i.abteilung ? `, ${i.abteilung}` : ''
          const eMail = i.eMail ? `, ${i.eMail}` : ''
          const telefon = i.telefon ? `, ${i.telefon}` : ''
          return `${name}${abt}${eMail}${telefon}`
        })
        .join('; '),
      externe:
        externe
          .map(i => {
            const name = `${i.name} ${i.vorname}`
            const firma = i.firma ? `, ${i.firma}` : ''
            const eMail = i.eMail ? `, ${i.eMail}` : ''
            const telefon = i.telefon ? `, ${i.telefon}` : ''
            return `${name}${firma}${eMail}${telefon}`
          })
          .join('; ') || null,
      links:
        links
          .filter(l => l.idGeschaeft === geschaeftPassed.idGeschaeft)
          .map(l => l.url)
          .join(', ') || null,
    }

    // if any value satisfies the filter, include the geschaeft
    let satisfiesFilter = false
    Object.keys(geschaeft).forEach(key => {
      let data = geschaeft[key]
      // ignore empty fields
      if (!(data || data === 0)) return
      if (isArray(data)) {
        // set satisfiesFilter = true if any element includes filterValue
        data.forEach(val => {
          // ignore empty fields
          if (!(val || val === 0)) return
          // elements can be objects (geko, person...)
          if (isObject(val)) {
            Object.values(val).forEach(val2 => {
              if (!(val2 || val2 === 0)) return
              /**
               * TODO: as in filterGeschaefteByFilterFields: create computed fields!
               */
              if (primitiveSatisfies({ data: val2, filter })) {
                satisfiesFilter = true
              }
            })
          } else {
            if (primitiveSatisfies({ data: val, filter })) {
              satisfiesFilter = true
            }
          }
        })
      } else if (isObject(data)) {
        // set satisfiesFilter = true if any value includes filterValue
        // does this occur?
        Object.values(data).forEach(val => {
          // ignore empty fields
          if (!(val || val === 0)) return
          if (primitiveSatisfies({ data: val, filter })) {
            satisfiesFilter = true
          }
        })
      } else {
        // data is a primitive value
        if (primitiveSatisfies({ data, filter })) {
          satisfiesFilter = true
        }
      }
    })
    return satisfiesFilter
  })
}
