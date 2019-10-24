import { types, getParent } from 'mobx-state-tree'
import _ from 'lodash'
import moment from 'moment'

import getDropdownOptions from '../src/getDropdownOptions'
import geschaefteSortByFieldsGetSortFields from '../src/geschaefteSortByFieldsGetSortFields'
import createOptions from '../src/createOptions'
import convertDateToDdMmYyyy from '../src/convertDateToDdMmYyyy'
import convertDateToYyyyMmDd from '../src/convertDateToYyyyMmDd'
import isDateField from '../src/isDateField'
import addComputedValuesToGeschaefte from '../src/addComputedValuesToGeschaefte'
import filterGeschaeftePlus from '../src/filterGeschaeftePlus'
import sortGeschaeftePlusFiltered from '../src/sortGeschaeftePlusFiltered'
import getHistoryOfGeschaeft from '../src/getHistoryOfGeschaeft'

export default types
  .model('Geschaefte', {
    fetching: types.optional(types.boolean, false),
    filterFulltext: types.optional(types.string, ''),
    filterType: types.maybeNull(types.string),
    activeId: types.maybeNull(types.number),
    willDelete: types.optional(types.boolean, false),
  })
  .volatile(() => ({
    error: [],
    geschaefte: [],
    links: [],
    geko: [],
    filterFields: [],
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
  }))
  .views(self => ({
    get geschaeftePlus() {
      const store = getParent(self, 1)
      return addComputedValuesToGeschaefte(store)
    },
    get geschaeftePlusFiltered() {
      const store = getParent(self, 1)
      return filterGeschaeftePlus(store)
    },
    get geschaeftePlusFilteredAndSorted() {
      const store = getParent(self, 1)
      return sortGeschaeftePlusFiltered(store)
    },
    get historyOfActiveId() {
      return getHistoryOfGeschaeft(self.geschaefte, self.activeId)
    },
    get gekoOfActiveId() {
      return self.geko.filter(g => g.idGeschaeft === self.activeId)
    },
  }))
  .actions(self => {
    const store = getParent(self, 1)

    return {
      geschaeftPdfShow() {
        store.history.push('/geschaeftPdf')
      },
      getGeschaefte() {
        const { app } = store
        self.fetching = true
        let geschaefte = []
        try {
          geschaefte = app.db
            .prepare('SELECT * FROM geschaefte ORDER BY idGeschaeft DESC')
            .all()
        } catch (error) {
          self.fetching = false
          store.addError(error)
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
        if (store.history.location.pathname !== '/geschaefte') {
          store.history.push('/geschaefte')
        }
      },
      geschaeftToggleActivated(idGeschaeft) {
        self.activeId =
          self.activeId && self.activeId === idGeschaeft ? null : idGeschaeft
      },
      geschaefteFilterByFields(filterFields, filterType = 'nach Feldern') {
        const { pages } = store
        const { geschaeftePlusFilteredAndSorted } = self
        self.filterFields = filterFields
        self.filterFulltext = ''
        self.filterType = filterType || null
        self.activeId = null
        /**
         * if pages are active,
         * initiate with new data
         */
        const path = store.history.location.pathname
        if (path === '/pages') {
          const { reportType } = pages
          store.pagesInitiate(reportType)
        } else if (geschaeftePlusFilteredAndSorted.length === 1) {
          store.geschaeftToggleActivated(
            geschaeftePlusFilteredAndSorted[0].idGeschaeft,
          )
        }
      },
      geschaefteResetSort() {
        self.sortFields = []
      },
      geschaefteSortByFields(field, direction) {
        const { pages } = store
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
        const path = store.history.location.pathname
        if (path === '/pages') {
          const { reportType } = pages
          store.pagesInitiate(reportType)
        }
      },
      geschaefteFilterByFulltext(filterFulltext) {
        const { pages, geschaefte } = store
        const { geschaeftePlusFilteredAndSorted } = geschaefte
        self.filterType = 'nach Volltext'
        self.filterFulltext = filterFulltext
        self.filterFields = []
        self.activeId = null
        /**
         * if pages are active,
         * initiate with new data
         */
        const path = store.history.location.pathname
        if (path === '/pages') {
          const { reportType } = pages
          store.pagesInitiate(reportType)
        } else {
          if (path !== '/geschaefte') {
            store.history.push('/geschaefte')
          }
          if (geschaeftePlusFilteredAndSorted.length === 1) {
            store.geschaeftToggleActivated(
              geschaeftePlusFilteredAndSorted[0].idGeschaeft,
            )
          }
        }
      },
      geschaefteRemoveFilters() {
        self.GefilterteIds = _.sortBy(self.geschaefte, g => g.idGeschaeft)
          .reverse()
          .map(g => g.idGeschaeft)
        self.filterFields = []
        self.filterType = null
        self.filterFulltext = ''
        self.sortFields = []
      },
      getGeko() {
        const { app } = store
        self.fetching = true
        let geko = []
        try {
          geko = app.db
            .prepare('SELECT * FROM geko ORDER BY idGeschaeft, gekoNr')
            .all()
        } catch (error) {
          self.fetching = false
          store.addError(error)
        }
        self.fetching = false
        self.geko = geko
      },
      getLinks() {
        const { app } = store
        self.fetching = true
        let links = []
        try {
          links = app.db
            .prepare('SELECT * FROM links ORDER BY idGeschaeft, url')
            .all()
        } catch (error) {
          self.fetching = false
          return store.addError(error)
        }
        self.fetching = false
        self.links = links
      },
      /*
       * GESCHAEFT
       */
      geschaeftNewCreate() {
        const { app, user } = store
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
          return store.addError(error)
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
          return store.addError(error)
        }
        self.geschaefte.unshift(geschaeft)
        /**
         * need to remove filters
         */
        self.filterFields = []
        self.filterType = null
        self.filterFulltext = ''
        self.sortFields = []
        store.geschaeftToggleActivated(geschaeft.idGeschaeft)
        if (store.history.location.pathname !== '/geschaefte') {
          store.history.push('/geschaefte')
        }
      },
      geschaeftRemove(idGeschaeft) {
        const {
          geschaefteKontakteIntern,
          geschaefteKontakteExtern,
          geschaefte,
        } = store
        try {
          store.app.db
            .prepare(
              `
        DELETE FROM
          geschaefte
        WHERE
          idGeschaeft = ${idGeschaeft}`,
            )
            .run()
        } catch (error) {
          console.log('geschaeftRemove error', error)
          return store.addError(error)
        }
        store.geschaeftRemoveDeleteIntended(idGeschaeft)
        self.geschaefte = self.geschaefte.filter(
          g => g.idGeschaeft !== idGeschaeft,
        )
        // need to delete geschaefteKontakteIntern in store
        const geschaefteKontakteInternToDelete = geschaefteKontakteIntern.geschaefteKontakteIntern.filter(
          g => g.idGeschaeft === idGeschaeft,
        )
        geschaefteKontakteInternToDelete.forEach(g =>
          store.geschaeftKontaktInternDelete(idGeschaeft, g.idKontakt),
        )
        // need to delete geschaefteKontakteExtern in store
        const geschaefteKontakteExternToDelete = geschaefteKontakteExtern.geschaefteKontakteExtern.filter(
          g => g.idGeschaeft === idGeschaeft,
        )
        geschaefteKontakteExternToDelete.forEach(g =>
          store.geschaefteKontakteExternActions.geschaeftKontaktExternDelete(
            idGeschaeft,
            g.idKontakt,
          ),
        )
        // need to delete geKo in store
        const gekoToRemove = geschaefte.geko.filter(
          g => g.idGeschaeft === idGeschaeft,
        )
        gekoToRemove.forEach(g => store.gekoRemove(idGeschaeft, g.gekoNr))
        // need to delete links in store
        const linksToRemove = geschaefte.links.filter(
          l => l.idGeschaeft === idGeschaeft,
        )
        linksToRemove.forEach(l => store.linkDelete(idGeschaeft, l.url))
      },
      geschaeftRemoveDeleteIntended() {
        self.willDelete = false
      },
      geschaeftSetDeleteIntended() {
        self.willDelete = true
      },
      geschaefteChangeState(idGeschaeft, field, value) {
        const { user } = store
        const { geschaefte } = self
        const { username } = user
        const geschaeft = geschaefte.find(g => g.idGeschaeft === idGeschaeft)
        if (geschaeft) {
          geschaeft[field] = value
          geschaeft.mutationsperson = username
          geschaeft.mutationsdatum = moment().format('YYYY-MM-DD HH:mm:ss')
        } else {
          store.addError(new Error('Das Geschäft wurde nicht aktualisiert'))
        }
      },
      changeGeschaeftInDb(idGeschaeft, field, value) {
        /**
         * if field is date field
         * convert DD.MM.YYYY to YYYY-MM-DD
         */
        let value2 = value
        if (isDateField(field)) {
          value2 = convertDateToYyyyMmDd(value)
        }
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        try {
          store.app.db
            .prepare(
              `
          UPDATE
            geschaefte
          SET
            ${field} = '${value2}',
            mutationsdatum = '${now}',
            mutationsperson = '${store.user.username}'
          WHERE
            idGeschaeft = ${idGeschaeft}`,
            )
            .run()
        } catch (error) {
          store.addError(error)
        }
      },
      rechtsmittelErledigungOptionsGet() {
        let rechtsmittelErledigungOptions = []
        try {
          rechtsmittelErledigungOptions = getDropdownOptions(
            store,
            'rechtsmittelErledigung',
          )
        } catch (error) {
          return
        }
        self.rechtsmittelErledigungOptions = createOptions(
          rechtsmittelErledigungOptions,
        )
      },
      parlVorstossTypOptionsGet() {
        let parlVorstossTypOptions = []
        try {
          parlVorstossTypOptions = getDropdownOptions(store, 'parlVorstossTyp')
        } catch (error) {
          return
        }
        self.parlVorstossTypOptions = createOptions(parlVorstossTypOptions)
      },
      statusOptionsGet() {
        let statusOptions = []
        try {
          statusOptions = getDropdownOptions(store, 'status')
        } catch (error) {
          return
        }
        self.statusOptions = createOptions(statusOptions)
      },
      faelligeStatiOptionsGet() {
        let options = []
        try {
          options = store.app.db
            .prepare(
              `
          SELECT
            status
          FROM
            status
          WHERE
            geschaeftKannFaelligSein = 1`,
            )
            .all()
        } catch (error) {
          return store.addError(error)
        }
        self.faelligeStatiOptions = options.map(res => res.status)
      },
      geschaeftsartOptionsGet() {
        let geschaeftsartOptions = []
        try {
          geschaeftsartOptions = getDropdownOptions(store, 'geschaeftsart')
        } catch (error) {
          return
        }
        self.geschaeftsartOptions = createOptions(geschaeftsartOptions)
      },
      aktenstandortOptionsGet() {
        let aktenstandortOptions = []
        try {
          aktenstandortOptions = getDropdownOptions(store, 'aktenstandort')
        } catch (error) {
          return
        }
        self.aktenstandortOptions = createOptions(aktenstandortOptions)
      },
      interneOptionsGet() {
        let interneOptions = []
        try {
          interneOptions = store.app.db
            .prepare('SELECT * FROM interne ORDER BY kurzzeichen')
            .all()
        } catch (error) {
          return store.addError(error)
        }
        self.interneOptions = interneOptions
      },
      externeOptionsGet() {
        let externeOptions = []
        try {
          externeOptions = store.app.db
            .prepare(
              `
          SELECT
            *, name || ' ' || vorname AS nameVorname
          FROM
            externe
          ORDER BY
            name,
            vorname`,
            )
            .all()
        } catch (error) {
          return store.addError(error)
        }
        self.externeOptions = externeOptions
      },
      rechtsmittelInstanzOptionsGet() {
        let rechtsmittelInstanzOptions = []
        try {
          rechtsmittelInstanzOptions = getDropdownOptions(
            store,
            'rechtsmittelInstanz',
          )
        } catch (error) {
          return
        }
        self.rechtsmittelInstanzOptions = createOptions(
          rechtsmittelInstanzOptions,
        )
      },
      abteilungOptionsGet() {
        let abteilungOptions = []
        try {
          abteilungOptions = getDropdownOptions(store, 'abteilung')
        } catch (error) {
          return
        }
        self.abteilungOptions = createOptions(abteilungOptions)
      },
      gekoNewCreate(idGeschaeft, gekoNr) {
        let geko
        try {
          store.app.db
            .prepare(
              `INSERT INTO geko (idGeschaeft, gekoNr) VALUES (${idGeschaeft}, '${gekoNr}')`,
            )
            .run()
        } catch (error) {
          return store.addError(error)
        }
        // return full dataset
        try {
          geko = store.app.db
            .prepare(
              `
          SELECT
            *
          FROM
            geko
          WHERE
            idGeschaeft = ${idGeschaeft} AND
            gekoNr = '${gekoNr}'`,
            )
            .get()
        } catch (error) {
          return store.addError(error)
        }
        self.geko.unshift(geko)
      },
      gekoRemove(idGeschaeft, gekoNr) {
        try {
          store.app.db
            .prepare(
              `
          DELETE FROM
            geko
          WHERE
            idGeschaeft = ${idGeschaeft} AND
            gekoNr = '${gekoNr}'`,
            )
            .run()
        } catch (error) {
          return store.addError(error)
        }
        self.geko = self.geko.filter(
          g => g.idGeschaeft !== idGeschaeft || g.gekoNr !== gekoNr,
        )
      },
      changeGekoInDb(idGeschaeft, gekoNr, field, value) {
        // no need to do something on then
        // ui was updated on GEKO_CHANGE_STATE
        try {
          store.app.db
            .prepare(
              `
          UPDATE
            geko
          SET
            ${field} = '${value}'
          WHERE
            idGeschaeft = ${idGeschaeft} AND
            gekoNr = '${gekoNr}'`,
            )
            .run()
        } catch (error) {
          store.addError(error)
        }
      },
      linkNewCreate(idGeschaeft, url) {
        try {
          store.app.db
            .prepare(
              `
          INSERT INTO
            links (idGeschaeft, url)
          VALUES
            (${idGeschaeft}, '${url}')`,
            )
            .run()
        } catch (error) {
          return store.addError(error)
        }
        self.links.unshift({ idGeschaeft, url })
      },
      linkRemove(idGeschaeft, url) {
        try {
          store.app.db
            .prepare(
              `
        DELETE FROM
          links
        WHERE
          idGeschaeft = ${idGeschaeft} AND
          url = '${url}'`,
            )
            .run()
        } catch (error) {
          return store.addError(error)
        }
        store.linkDelete(idGeschaeft, url)
      },
      linkDelete(idGeschaeft, url) {
        self.links = self.links.filter(
          l => l.idGeschaeft !== idGeschaeft || l.url !== url,
        )
      },
    }
  })
