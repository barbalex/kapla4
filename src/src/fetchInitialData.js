import fetchUsername from './fetchUsername'

export default (store) => {
  fetchUsername(store)
  store.faelligeStatiOptionsGet()
  store.geschaefte.fetchAllGeko()
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
  store.geschaefte.fetchAll()
}
