import filterForFaelligeGeschaefte from './filterForFaelligeGeschaefte'
import fetchUsername from './fetchUsername'

export default store => {
  fetchUsername(store)
  store.faelligeStatiOptionsGet()
  store.geschaefte.fetchGeko()
  store.geschaefte.fetchLinks()
  store.interneOptionsGet()
  store.externeOptionsGet()
  store.getGeschaefteKontakteIntern()
  store.getGeschaefteKontakteExtern()
  store.rechtsmittelErledigungOptionsGet()
  store.parlVorstossTypOptionsGet()
  store.statusOptionsGet()
  store.geschaeftsartOptionsGet()
  store.aktenstandortOptionsGet()
  store.rechtsmittelInstanzOptionsGet()
  store.abteilungOptionsGet()
  store.geschaefte.fetch()
  // set filter to fällige
  store.geschaefte.filterByFields(filterForFaelligeGeschaefte, 'fällige')
  store.geschaefte.sortByFields('fristMitarbeiter', 'DESCENDING')
}