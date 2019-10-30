import { toJS } from 'mobx'

import getItKontoForVerantwortlich from './getItKontoForVerantwortlich'
import getVornameNameForVerantwortlich from './getVornameNameForVerantwortlich'

export default store =>
  toJS(store.geschaefte.geschaefte).map(g => {
    const {
      interneOptions,
      geko,
      links,
      faelligeStatiOptions,
    } = store.geschaefte
    g.verantwortlichName = getVornameNameForVerantwortlich(
      interneOptions,
      g.verantwortlich,
    )
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
