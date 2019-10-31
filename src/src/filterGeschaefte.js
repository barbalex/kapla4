import filterGeschaefteByFulltext from './filterGeschaefteByFulltext'
import filterGeschaefteByFilterFields from './filterGeschaefteByFilterFields'

export default store => {
  const { filterFulltext, filterFields, geschaefte } = store.geschaefte
  const existsFilterFulltext = !!filterFulltext
  const existsFilterFields = filterFields.length > 0

  if (existsFilterFulltext) {
    return filterGeschaefteByFulltext(store)
  } else if (existsFilterFields) {
    return filterGeschaefteByFilterFields(store)
  }
  return geschaefte
}
