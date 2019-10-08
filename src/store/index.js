import { extendObservable } from 'mobx'

import observablehistory from './observableHistory'
import uiActions from './actions/ui'
import app from './app'
import appActions from './actions/app'
import user from './user'
import userActions from './actions/user'
import table from './table'
import tableActions from './actions/table'
import pages from './pages'
import pagesActions from './actions/pages'
import geschaefteKontakteIntern from './geschaefteKontakteIntern'
import geschaefteKontakteInternActions from './actions/geschaefteKontakteIntern'
import geschaefteKontakteExtern from './geschaefteKontakteExtern'
import geschaefteKontakteExternActions from './actions/geschaefteKontakteExtern'
import geschaefteActions from './actions/geschaefte'
import addComputedValuesToGeschaefte from '../src/addComputedValuesToGeschaefte'
import filterGeschaeftePlus from '../src/filterGeschaeftePlus'
import sortGeschaeftePlusFiltered from '../src/sortGeschaeftePlusFiltered'
import getHistoryOfGeschaeft from '../src/getHistoryOfGeschaeft'

function Store() {
  const store = this
  this.history = observablehistory
  this.ui = {}
  extendObservable(this.ui, {
    geschaefteListOverflowing: true,
  })
  extendObservable(this, uiActions(this))
  this.app = app
  this.dirty = false
  extendObservable(this, appActions(this))
  this.geschaefte = {}
  extendObservable(this.geschaefte, {
    /**
     * "this" is store.geschaefte, not any more store!!!!!
     * so pass store copied above
     */
    fetching: false,
    error: [],
    geschaefte: [],
    get geschaeftePlus() {
      return addComputedValuesToGeschaefte(store)
    },
    get geschaeftePlusFiltered() {
      return filterGeschaeftePlus(store)
    },
    get geschaeftePlusFilteredAndSorted() {
      return sortGeschaeftePlusFiltered(store)
    },
    links: [],
    geko: [],
    filterFields: [],
    filterFulltext: '',
    filterType: null,
    sortFields: [],
    // dropdown lists
    abteilungOptions: [],
    rechtsmittelErledigungOptions: [],
    parlVorstossTypOptions: [],
    statusOptions: [],
    geschaeftsartOptions: [],
    aktenstandortOptions: [],
    interneOptions: [],
    externeOptions: [],
    // following: state for active geschaeft
    activeId: null,
    get historyOfActiveId() {
      return getHistoryOfGeschaeft(
        store.geschaefte.geschaefte,
        store.geschaefte.activeId,
      )
    },
    get gekoOfActiveId() {
      return store.geschaefte.geko.filter(
        g => g.idGeschaeft === store.geschaefte.activeId,
      )
    },
    willDelete: false,
  })
  extendObservable(this, geschaefteActions(this))
  this.geschaefteKontakteExtern = geschaefteKontakteExtern
  extendObservable(this, geschaefteKontakteExternActions(this))
  this.geschaefteKontakteIntern = geschaefteKontakteIntern
  extendObservable(this, geschaefteKontakteInternActions(this))
  this.pages = pages
  extendObservable(this, pagesActions(this))
  this.table = table
  extendObservable(this, tableActions(this))
  this.user = user
  extendObservable(this, userActions(this))
}

export default new Store()
