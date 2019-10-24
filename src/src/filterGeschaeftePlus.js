import { getSnapshot } from 'mobx-state-tree'
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

  console.log('filterGeschaeftePlus', {
    filterFulltext,
    filterFields,
    geschaeftePlus,
    geschaefte,
    existsFilterFulltext,
    existsFilterFields,
  })

  if (existsFilterFulltext) {
    return filterGeschaefteByFulltext(geschaeftePlus, filterFulltext)
  } else if (existsFilterFields) {
    return filterGeschaefteByFilterFields(geschaeftePlus, filterFields)
  }
  return getSnapshot(geschaefte)
}
