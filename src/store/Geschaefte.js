import { types, getParent } from 'mobx-state-tree'
import _ from 'lodash'
import moment from 'moment'

import filterGeschaefte from '../src/filterGeschaefte'
import sortGeschaefteFiltered from '../src/sortGeschaefteFiltered'
import getHistoryOfGeschaeft from '../src/getHistoryOfGeschaeft'
import Geschaeft from './Geschaeft'
import Links from './Links'
import Geko from './Geko'
// seems these are not used
//import AbteilungOptions from './Abteilung'
//import RechtsmittelErledigungOptions from './RechtsmittelErledigung'
//import ParlVorstossTypOptions from './ParlVorstossTyp'
//import StatusOptions from './Status'
//import AktenstandortOptions from './Aktenstandort'
import InterneOptions from './Interne'
import ExterneOptions from './Externe'
import FilterFields from './FilterFields'
import SortFields from './SortFields'
import isDateField from '../src/isDateField'
import convertDateToDdMmYyyy from '../src/convertDateToDdMmYyyy'
import geschaefteSortByFieldsGetSortFields from '../src/geschaefteSortByFieldsGetSortFields'

export default types
  .model('Geschaefte', {
    fetching: types.optional(types.boolean, false),
    filterFulltext: types.optional(types.string, ''),
    filterFulltextIds: types.optional(types.array(types.number), []),
    filterType: types.maybeNull(types.string),
    activeId: types.maybeNull(types.number),
    willDelete: types.optional(types.boolean, false),
    geko: types.array(Geko),
    geschaefte: types.array(Geschaeft),
    links: types.array(Links),
    abteilungOptions: types.array(types.union(types.string, types.null)),
    rechtsmittelErledigungOptions: types.array(
      types.union(types.string, types.null),
    ),
    parlVorstossTypOptions: types.array(types.union(types.string, types.null)),
    statusOptions: types.array(types.union(types.string, types.null)),
    geschaeftsartOptions: types.array(types.union(types.string, types.null)),
    aktenstandortOptions: types.array(types.union(types.string, types.null)),
    interneOptions: types.array(InterneOptions),
    externeOptions: types.array(ExterneOptions),
    filterFields: types.array(FilterFields),
    sortFields: types.array(SortFields),
  })
  .volatile(() => ({
    error: [],
  }))
  .views(self => {
    const store = getParent(self, 1)

    return {
      get geschaeftePlusFiltered() {
        return filterGeschaefte(store)
      },
      get geschaefteFilteredAndSorted() {
        return sortGeschaefteFiltered(store)
      },
      get historyOfActiveId() {
        return getHistoryOfGeschaeft(self.geschaefte, self.activeId)
      },
      get gekoOfActiveId() {
        return self.geko.filter(g => g.idGeschaeft === self.activeId)
      },
      get isFiltered() {
        const existsFilterFulltext = !!self.filterFulltext
        const existsFilterFields = self.filterFields.length > 0
        return existsFilterFields || existsFilterFulltext
      },
    }
  })
  .actions(self => {
    const store = getParent(self, 1)

    return {
      fetchFilterFulltextIds(filter) {
        // convert to lower case if possibe
        let filterValue = filter.toLowerCase ? filter.toLowerCase() : filter
        if (filterValue.toString) {
          // a number is queried
          // convert to string to also find 7681 when filtering for 681
          filterValue = filterValue.toString()
        }
        let result = []
        try {
          result = store.app.db
            .prepare(
              `select idGeschaeft from fts where value match '${filterValue}*'`,
            )
            .all()
        } catch (error) {
          store.addError(error)
        }
        self.filterFulltextIds = result.map(o => o.idGeschaeft)
      },
      sortByFields(field, direction) {
        const { reportType, initiate } = store.pages
        const sortFields = geschaefteSortByFieldsGetSortFields(
          store,
          field,
          direction,
        )
        self.sortFields = sortFields
        /**
         * if pages are active,
         * initiate with new data
         */
        const location = store.location.toJSON()
        const activeLocation = location[0]
        if (activeLocation === 'pages') {
          initiate(reportType)
        }
      },
      resetSort() {
        self.sortFields = []
      },
      filterByFields(filterFields, filterType = 'nach Feldern') {
        const { reportType, initiate } = store.pages
        const { geschaefteFilteredAndSorted } = store.geschaefte
        store.geschaefte.filterFields = filterFields
        store.geschaefte.filterFulltext = ''
        store.geschaefte.filterType = filterType || null
        store.geschaefte.activeId = null
        /**
         * if pages are active,
         * initiate with new data
         */
        const location = store.location.toJSON()
        const activeLocation = location[0]
        if (activeLocation === 'pages') {
          initiate(reportType)
        } else if (geschaefteFilteredAndSorted.length === 1) {
          self.toggleActivatedById(geschaefteFilteredAndSorted[0].idGeschaeft)
        }
      },
      filterByFulltext(filterFulltext) {
        const location = store.location.toJSON()
        const activeLocation = location[0]
        const { geschaefte, setLocation } = store
        const { initiate, reportType } = store.pages
        const { geschaefteFilteredAndSorted } = geschaefte
        self.filterType = 'nach Volltext'
        self.filterFulltext = filterFulltext
        self.filterFields = []
        self.activeId = null
        /**
         * if pages are active,
         * initiate with new data
         */
        if (activeLocation === 'pages') {
          initiate(reportType)
        } else {
          if (activeLocation !== 'geschaefte') {
            setLocation(['geschaefte'])
          }
          if (geschaefteFilteredAndSorted.length === 1) {
            self.toggleActivatedById(geschaefteFilteredAndSorted[0].idGeschaeft)
          }
        }
      },
      removeFilters() {
        self.GefilterteIds = _.sortBy(self.geschaefte, g => g.idGeschaeft)
          .reverse()
          .map(g => g.idGeschaeft)
        self.filterFields = []
        self.filterType = null
        self.filterFulltext = ''
        self.sortFields = []
      },
      toggleActivatedById(idGeschaeft) {
        self.activeId =
          self.activeId && self.activeId === idGeschaeft ? null : idGeschaeft
      },
      fetch() {
        const location = store.location.toJSON()
        const activeLocation = location[0]
        const { app, addError, setLocation } = store
        self.fetching = true
        let geschaefte = []
        try {
          geschaefte = app.db
            .prepare('SELECT * FROM geschaefte ORDER BY idGeschaeft DESC')
            .all()
        } catch (error) {
          self.fetching = false
          addError(error)
        }
        /**
         * convert date fields
         * from YYYY-MM-DD to DD.MM.YYYY
         */
        geschaefte.forEach(g => {
          const geschaeft = g
          Object.keys(geschaeft).forEach(field => {
            if (isDateField(field)) {
              geschaeft[field] = convertDateToDdMmYyyy(geschaeft[field])
            }
          })
        })
        self.fetching = false
        self.geschaefte = geschaefte
        if (activeLocation !== 'geschaefte') {
          setLocation(['geschaefte'])
        }
      },
      fetchGeko() {
        const { app, addError } = store
        self.fetching = true
        let geko = []
        try {
          geko = app.db
            .prepare('SELECT * FROM geko ORDER BY idGeschaeft, gekoNr')
            .all()
        } catch (error) {
          self.fetching = false
          addError(error)
        }
        self.fetching = false
        self.geko = geko
      },
      fetchLinks() {
        const { app, addError } = store
        self.fetching = true
        let links = []
        try {
          links = app.db
            .prepare('SELECT * FROM links ORDER BY idGeschaeft, url')
            .all()
        } catch (error) {
          self.fetching = false
          return addError(error)
        }
        self.fetching = false
        self.links = links
      },
      geschaeftInsert() {
        const location = store.location.toJSON()
        const activeLocation = location[0]
        const { app, setLocation } = store
        const { user } = app
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        let result
        try {
          result = app.db
            .prepare(
              `
        INSERT INTO
          geschaefte (mutationsdatum, mutationsperson)
        VALUES
          ('${now}', '${user.username}')`,
            )
            .run()
        } catch (error) {
          return self.addError(error)
        }
        const idGeschaeft = result.lastInsertRowid

        // return full dataset
        let geschaeft = {}
        try {
          geschaeft = app.db
            .prepare(
              `
        SELECT
          *
        FROM
          geschaefte
        WHERE
          idGeschaeft = ${idGeschaeft}`,
            )
            .get()
        } catch (error) {
          return self.addError(error)
        }
        self.geschaefte.unshift(geschaeft)
        // need to remove filters
        self.filterFields = []
        self.filterType = null
        self.filterFulltext = ''
        self.sortFields = []
        self.toggleActivatedById(geschaeft.idGeschaeft)
        if (activeLocation !== 'geschaefte') {
          setLocation(['geschaefte'])
        }
      },
      geschaeftDelete(idGeschaeft) {
        const {
          app,
          geschaefteKontakteIntern,
          geschaefteKontakteExtern,
          addError,
          geschaeftKontaktInternDelete,
        } = store
        try {
          app.db
            .prepare(
              `
              DELETE FROM
                geschaefte
              WHERE
                idGeschaeft = ${idGeschaeft}`,
            )
            .run()
        } catch (error) {
          console.log('geschaeftDelete error', error)
          return addError(error)
        }
        self.geschaeftRemoveDeleteIntended(idGeschaeft)
        self.geschaefte = self.geschaefte.filter(
          g => g.idGeschaeft !== idGeschaeft,
        )
        // need to delete geschaefteKontakteIntern in self
        const geschaefteKontakteInternToDelete = geschaefteKontakteIntern.geschaefteKontakteIntern.filter(
          g => g.idGeschaeft === idGeschaeft,
        )
        geschaefteKontakteInternToDelete.forEach(g =>
          geschaeftKontaktInternDelete(idGeschaeft, g.idKontakt),
        )
        // need to delete geschaefteKontakteExtern in self
        const geschaefteKontakteExternToDelete = geschaefteKontakteExtern.geschaefteKontakteExtern.filter(
          g => g.idGeschaeft === idGeschaeft,
        )
        geschaefteKontakteExternToDelete.forEach(g =>
          store.geschaeftKontaktExternDelete(idGeschaeft, g.idKontakt),
        )
        // need to delete geKo in self
        const gekoToRemove = self.geko.filter(
          g => g.idGeschaeft === idGeschaeft,
        )
        gekoToRemove.forEach(g => store.gekoRemove(idGeschaeft, g.gekoNr))
        // need to delete links in self
        const linkselfmove = self.links.filter(
          l => l.idGeschaeft === idGeschaeft,
        )
        linkselfmove.forEach(l => store.linkDelete(idGeschaeft, l.url))
      },
      geschaeftSetDeleteIntended() {
        self.willDelete = true
      },
      geschaeftRemoveDeleteIntended() {
        self.willDelete = false
      },
    }
  })
