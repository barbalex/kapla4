import { toJS } from 'mobx'

import getItKontoForVerantwortlich from './getItKontoForVerantwortlich'

export default store =>
  toJS(store.geschaefte.geschaefte).map(g => {
    const { geko, links, faelligeStatiOptions } = store.geschaefte
    g.verantwortlichItKonto = getItKontoForVerantwortlich(
      store.geschaefte.interneOptions,
      g.verantwortlich,
    )
    g.geko = geko.filter(gko => gko.idGeschaeft === g.idGeschaeft)
    g.links = links.filter(link => link.idGeschaeft === g.idGeschaeft)
    g.kannFaelligSein =
      faelligeStatiOptions && faelligeStatiOptions.includes
        ? faelligeStatiOptions.includes(g.status)
        : false
    return g
  })
