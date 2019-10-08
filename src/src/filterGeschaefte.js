import filterGeschaefteByFulltext from './filterGeschaefteByFulltext'
import filterGeschaefteByFilterFields from './filterGeschaefteByFilterFields'

export default (geschaefte, filterFulltext, filterFields) => {
  const existsFilterFulltext = !!filterFulltext
  const existsFilterFields = Object.keys(filterFields).length > 0
  let geschaefteGefiltert = geschaefte

  if (existsFilterFulltext) {
    geschaefteGefiltert = filterGeschaefteByFulltext(geschaefte, filterFulltext)
  } else if (existsFilterFields) {
    geschaefteGefiltert = filterGeschaefteByFilterFields(
      geschaefte,
      filterFields,
    )
  }
  return geschaefteGefiltert.map(g => g.idGeschaeft)
}
