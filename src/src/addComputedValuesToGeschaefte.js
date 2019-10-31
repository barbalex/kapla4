import { toJS } from 'mobx'

export default store =>
  toJS(store.geschaefte.geschaefte).map(g => {
    const { links } = store.geschaefte
    g.links = links.filter(link => link.idGeschaeft === g.idGeschaeft)
    return g
  })
