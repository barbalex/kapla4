import fetchUsername from './fetchUsername'

export default (store) => {
  const { fetching, setFetching } = store
  !fetching && setFetching(true)
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
  setFetching(false)
  console.log('fetched initial data')
}
