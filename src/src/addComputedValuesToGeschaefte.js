import { toJS } from 'mobx'

import getDauerBisFristMitarbeiter from './getDauerBisFristMitarbeiter'
import getFristMitarbeiterWarnung from './getFristMitarbeiterWarnung'
import getItKontoForVerantwortlich from './getItKontoForVerantwortlich'
import getVornameNameForVerantwortlich from './getVornameNameForVerantwortlich'

export default store =>
  toJS(store.geschaefte.geschaefte).map(g => {
    const {
      interneOptions,
      externeOptions,
      geko,
      links,
      faelligeStatiOptions,
    } = store.geschaefte
    const interne = store.geschaefteKontakteIntern.geschaefteKontakteIntern
    const externe = store.geschaefteKontakteExtern.geschaefteKontakteExtern
    g.verantwortlichName = getVornameNameForVerantwortlich(
      interneOptions,
      g.verantwortlich,
    )
    g.interne = interne
      .filter(i => i.idGeschaeft === g.idGeschaeft)
      .map(gk => interneOptions.find(i => i.id === gk.idKontakt) || null)
    g.externe = externe
      .filter(i => i.idGeschaeft === g.idGeschaeft)
      .map(gk => externeOptions.find(i => i.id === gk.idKontakt) || null)
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
