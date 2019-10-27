import filterGeschaefteByFulltext from './filterGeschaefteByFulltext'
import filterGeschaefteByFilterFields from './filterGeschaefteByFilterFields'

export default store => {
  const {
    filterFulltext,
    filterFields,
    geschaeftePlus,
    geschaefte,
  } = store.geschaefte
  const existsFilterFulltext = !!filterFulltext
  const existsFilterFields = filterFields.length > 0

  if (existsFilterFulltext) {
    return filterGeschaefteByFulltext(geschaeftePlus, filterFulltext)
  } else if (existsFilterFields) {
    return filterGeschaefteByFilterFields(geschaeftePlus, filterFields)
  }
  return geschaefte
}
