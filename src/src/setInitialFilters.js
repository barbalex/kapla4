import filterForFaelligeGeschaefte from './filterForFaelligeGeschaefte'

const setInitialFilters = (store) => {
  // set filter to fällige
  store.geschaefte.filterByFields(filterForFaelligeGeschaefte, 'fällige')
  store.geschaefte.sortByFields('fristMitarbeiter', 'DESCENDING')
}

export default setInitialFilters
