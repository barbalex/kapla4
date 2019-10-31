import _ from 'lodash'
import moment from 'moment'

import isDateField from './isDateField'

export default store => {
  const geschaeftePassed = store.geschaefte.geschaeftePlusFiltered
  const { sortFields } = store.geschaefte
  let geschaefte
  sortFields.forEach(sf => {
    geschaefte = _.sortBy(geschaeftePassed, g => {
      if (g[sf.field]) {
        if (isDateField(sf.field)) {
          // need to reformat date
          return moment(g[sf.field], 'DD.MM.YYYY').format('YYYY-MM-DD')
        }
        return g[sf.field]
      }
      return 'ZZZZ'
    })
    if (sf.direction === 'DESCENDING') {
      geschaefte = geschaefte.reverse()
    }
  })
  if (sortFields.length === 0) {
    geschaefte = _.sortBy(geschaeftePassed, 'idGeschaeft').reverse()
  }
  return geschaefte
}
