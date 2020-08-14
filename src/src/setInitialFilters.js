import filterForFaelligeGeschaefte from './filterForFaelligeGeschaefte'

export default (store) => {
  // set filter to fällige
  store.geschaefte.filterByFields(filterForFaelligeGeschaefte, 'fällige')
  store.geschaefte.sortByFields('fristMitarbeiter', 'DESCENDING')
}
