import { types } from 'mobx-state-tree'
import _ from 'lodash'
import moment from 'moment'
import getMyName from 'username'
import fs from 'fs'
import betterSqlite from 'better-sqlite3'
import uniqBy from 'lodash/uniqBy'

import observablehistory from './observableHistory'
import App from './App'
import Geschaefte from './Geschaefte'
import GeschaefteKontakteIntern from './GeschaefteKontakteIntern'
import GeschaefteKontakteExtern from './GeschaefteKontakteExtern'
import Pages from './Pages'
import Table from './Table'
import User from './User'
import getDropdownOptions from '../src/getDropdownOptions'
import geschaefteSortByFieldsGetSortFields from '../src/geschaefteSortByFieldsGetSortFields'
import createOptions from '../src/createOptions'
import convertDateToDdMmYyyy from '../src/convertDateToDdMmYyyy'
import convertDateToYyyyMmDd from '../src/convertDateToYyyyMmDd'
import isDateField from '../src/isDateField'
import pageStandardState from '../src/pageStandardState'
import tableStandardState from '../src/tableStandardState'
import standardConfig from '../src/standardConfig'
import standardDbPath from '../src/standardDbPath'
import getConfig from '../src/getConfig'
import filterForFaelligeGeschaefte from '../src/filterForFaelligeGeschaefte'
import saveConfig from '../src/saveConfig'
import chooseDb from '../src/chooseDb'

export default () =>
  types
    .model({
      app: types.optional(App, {}),
      dirty: types.optional(types.boolean, false),
      geschaefte: types.optional(Geschaefte, {}),
      geschaefteKontakteIntern: types.optional(GeschaefteKontakteIntern, {}),
      geschaefteKontakteExtern: types.optional(GeschaefteKontakteExtern, {}),
      pages: types.optional(Pages, {}),
      table: types.optional(Table, {}),
      user: types.optional(User, {}),
    })
    .volatile(() => ({
      history: observablehistory,
    }))
    .views(self => ({}))
    .actions(self => ({
      geschaeftPdfShow() {
        self.history.push('/geschaeftPdf')
      },
      getGeschaefte() {
        const { app } = self
        self.geschaefte.fetching = true
        let geschaefte = []
        try {
          geschaefte = app.db
            .prepare('SELECT * FROM geschaefte ORDER BY idGeschaeft DESC')
            .all()
        } catch (error) {
          self.geschaefte.fetching = false
          self.addError(error)
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
        self.geschaefte.fetching = false
        self.geschaefte.geschaefte = geschaefte
        if (self.history.location.pathname !== '/geschaefte') {
          self.history.push('/geschaefte')
        }
      },
      geschaeftToggleActivated(idGeschaeft) {
        self.geschaefte.activeId =
          self.geschaefte.activeId && self.geschaefte.activeId === idGeschaeft
            ? null
            : idGeschaeft
      },
      geschaefteFilterByFields(filterFields, filterType = 'nach Feldern') {
        const { pages } = self
        const { geschaeftePlusFilteredAndSorted } = self.geschaefte
        self.geschaefte.filterFields = filterFields
        self.geschaefte.filterFulltext = ''
        self.geschaefte.filterType = filterType || null
        self.geschaefte.activeId = null
        /**
         * if pages are active,
         * initiate with new data
         */
        const path = self.history.location.pathname
        if (path === '/pages') {
          const { reportType } = pages
          self.pagesInitiate(reportType)
        } else if (geschaeftePlusFilteredAndSorted.length === 1) {
          self.geschaeftToggleActivated(
            geschaeftePlusFilteredAndSorted[0].idGeschaeft,
          )
        }
      },
      geschaefteResetSort() {
        self.geschaefte.sortFields = []
      },
      geschaefteSortByFields(field, direction) {
        const { pages } = self
        const sortFields = geschaefteSortByFieldsGetSortFields(
          self,
          field,
          direction,
        )
        self.geschaefte.sortFields = sortFields
        /**
         * if pages are active,
         * initiate with new data
         */
        const path = self.history.location.pathname
        if (path === '/pages') {
          const { reportType } = pages
          self.pagesInitiate(reportType)
        }
      },
      geschaefteFilterByFulltext(filterFulltext) {
        const { pages, geschaefte } = self
        const { geschaeftePlusFilteredAndSorted } = geschaefte
        self.geschaefte.filterType = 'nach Volltext'
        self.geschaefte.filterFulltext = filterFulltext
        self.geschaefte.filterFields = []
        self.geschaefte.activeId = null
        /**
         * if pages are active,
         * initiate with new data
         */
        const path = self.history.location.pathname
        if (path === '/pages') {
          const { reportType } = pages
          self.pagesInitiate(reportType)
        } else {
          if (path !== '/geschaefte') {
            self.history.push('/geschaefte')
          }
          if (geschaeftePlusFilteredAndSorted.length === 1) {
            self.geschaeftToggleActivated(
              geschaeftePlusFilteredAndSorted[0].idGeschaeft,
            )
          }
        }
      },
      geschaefteRemoveFilters() {
        self.geschaefte.GefilterteIds = _.sortBy(
          self.geschaefte.geschaefte,
          g => g.idGeschaeft,
        )
          .reverse()
          .map(g => g.idGeschaeft)
        self.geschaefte.filterFields = []
        self.geschaefte.filterType = null
        self.geschaefte.filterFulltext = ''
        self.geschaefte.sortFields = []
      },
      getGeko() {
        const { app } = self
        self.geschaefte.fetching = true
        let geko = []
        try {
          geko = app.db
            .prepare('SELECT * FROM geko ORDER BY idGeschaeft, gekoNr')
            .all()
        } catch (error) {
          self.geschaefte.fetching = false
          self.addError(error)
        }
        self.geschaefte.fetching = false
        self.geschaefte.geko = geko
      },
      getLinks() {
        const { app } = self
        self.geschaefte.fetching = true
        let links = []
        try {
          links = app.db
            .prepare('SELECT * FROM links ORDER BY idGeschaeft, url')
            .all()
        } catch (error) {
          self.geschaefte.fetching = false
          return self.addError(error)
        }
        self.geschaefte.fetching = false
        self.geschaefte.links = links
      },
      /*
       * GESCHAEFT
       */
      geschaeftNewCreate() {
        const { app, user } = self
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
        self.geschaefte.geschaefte.unshift(geschaeft)
        /**
         * need to remove filters
         */
        self.geschaefte.filterFields = []
        self.geschaefte.filterType = null
        self.geschaefte.filterFulltext = ''
        self.geschaefte.sortFields = []
        self.geschaeftToggleActivated(geschaeft.idGeschaeft)
        if (self.history.location.pathname !== '/geschaefte') {
          self.history.push('/geschaefte')
        }
      },
      geschaeftRemove(idGeschaeft) {
        const {
          geschaefteKontakteIntern,
          geschaefteKontakteExtern,
          geschaefte,
        } = self
        try {
          self.app.db
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
          return self.addError(error)
        }
        self.geschaeftRemoveDeleteIntended(idGeschaeft)
        self.geschaefte.geschaefte = self.geschaefte.geschaefte.filter(
          g => g.idGeschaeft !== idGeschaeft,
        )
        // need to delete geschaefteKontakteIntern in self
        const geschaefteKontakteInternToDelete = geschaefteKontakteIntern.geschaefteKontakteIntern.filter(
          g => g.idGeschaeft === idGeschaeft,
        )
        geschaefteKontakteInternToDelete.forEach(g =>
          self.geschaeftKontaktInternDelete(idGeschaeft, g.idKontakt),
        )
        // need to delete geschaefteKontakteExtern in self
        const geschaefteKontakteExternToDelete = geschaefteKontakteExtern.geschaefteKontakteExtern.filter(
          g => g.idGeschaeft === idGeschaeft,
        )
        geschaefteKontakteExternToDelete.forEach(g =>
          self.geschaefteKontakteExternActions.geschaeftKontaktExternDelete(
            idGeschaeft,
            g.idKontakt,
          ),
        )
        // need to delete geKo in self
        const gekoToRemove = geschaefte.geko.filter(
          g => g.idGeschaeft === idGeschaeft,
        )
        gekoToRemove.forEach(g => self.gekoRemove(idGeschaeft, g.gekoNr))
        // need to delete links in self
        const linkselfmove = geschaefte.links.filter(
          l => l.idGeschaeft === idGeschaeft,
        )
        linkselfmove.forEach(l => self.linkDelete(idGeschaeft, l.url))
      },
      geschaeftRemoveDeleteIntended() {
        self.geschaefte.willDelete = false
      },
      geschaeftSetDeleteIntended() {
        self.geschaefte.willDelete = true
      },
      geschaefteChangeState(idGeschaeft, field, value) {
        const { user } = self
        const { geschaefte } = self.geschaefte
        const { username } = user
        const geschaeft = geschaefte.find(g => g.idGeschaeft === idGeschaeft)
        console.log('store, geschaefteChangeState', {
          idGeschaeft,
          field,
          value,
          username,
          geschaeft,
        })
        if (geschaeft) {
          geschaeft[field] = value
          geschaeft.mutationsperson = username
          geschaeft.mutationsdatum = moment().format('YYYY-MM-DD HH:mm:ss')
        } else {
          self.addError(new Error('Das Geschäft wurde nicht aktualisiert'))
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
          self.app.db
            .prepare(
              `
          UPDATE
            geschaefte
          SET
            ${field} = '${value2}',
            mutationsdatum = '${now}',
            mutationsperson = '${self.user.username}'
          WHERE
            idGeschaeft = ${idGeschaeft}`,
            )
            .run()
        } catch (error) {
          self.addError(error)
        }
      },
      rechtsmittelErledigungOptionsGet() {
        let rechtsmittelErledigungOptions = []
        try {
          rechtsmittelErledigungOptions = getDropdownOptions(
            self,
            'rechtsmittelErledigung',
          )
        } catch (error) {
          return
        }
        self.geschaefte.rechtsmittelErledigungOptions = createOptions(
          rechtsmittelErledigungOptions,
        )
      },
      parlVorstossTypOptionsGet() {
        let parlVorstossTypOptions = []
        try {
          parlVorstossTypOptions = getDropdownOptions(self, 'parlVorstossTyp')
        } catch (error) {
          return
        }
        self.geschaefte.parlVorstossTypOptions = createOptions(
          parlVorstossTypOptions,
        )
      },
      statusOptionsGet() {
        let statusOptions = []
        try {
          statusOptions = getDropdownOptions(self, 'status')
        } catch (error) {
          return
        }
        self.geschaefte.statusOptions = createOptions(statusOptions)
      },
      faelligeStatiOptionsGet() {
        let options = []
        try {
          options = self.app.db
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
          return self.addError(error)
        }
        self.geschaefte.faelligeStatiOptions = options.map(res => res.status)
      },
      geschaeftsartOptionsGet() {
        let geschaeftsartOptions = []
        try {
          geschaeftsartOptions = getDropdownOptions(self, 'geschaeftsart')
        } catch (error) {
          return
        }
        self.geschaefte.geschaeftsartOptions = createOptions(
          geschaeftsartOptions,
        )
      },
      aktenstandortOptionsGet() {
        let aktenstandortOptions = []
        try {
          aktenstandortOptions = getDropdownOptions(self, 'aktenstandort')
        } catch (error) {
          return
        }
        self.geschaefte.aktenstandortOptions = createOptions(
          aktenstandortOptions,
        )
      },
      interneOptionsGet() {
        let interneOptions = []
        try {
          interneOptions = self.app.db
            .prepare('SELECT * FROM interne ORDER BY kurzzeichen')
            .all()
        } catch (error) {
          return self.addError(error)
        }
        self.geschaefte.interneOptions = interneOptions
      },
      externeOptionsGet() {
        let externeOptions = []
        try {
          externeOptions = self.app.db
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
          return self.addError(error)
        }
        self.geschaefte.externeOptions = externeOptions
      },
      rechtsmittelInstanzOptionsGet() {
        let rechtsmittelInstanzOptions = []
        try {
          rechtsmittelInstanzOptions = getDropdownOptions(
            self,
            'rechtsmittelInstanz',
          )
        } catch (error) {
          return
        }
        self.geschaefte.rechtsmittelInstanzOptions = createOptions(
          rechtsmittelInstanzOptions,
        )
      },
      abteilungOptionsGet() {
        let abteilungOptions = []
        try {
          abteilungOptions = getDropdownOptions(self, 'abteilung')
        } catch (error) {
          return
        }
        self.geschaefte.abteilungOptions = createOptions(abteilungOptions)
      },
      gekoNewCreate(idGeschaeft, gekoNr) {
        let geko
        try {
          self.app.db
            .prepare(
              `INSERT INTO geko (idGeschaeft, gekoNr) VALUES (${idGeschaeft}, '${gekoNr}')`,
            )
            .run()
        } catch (error) {
          return self.addError(error)
        }
        // return full dataset
        try {
          geko = self.app.db
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
          return self.addError(error)
        }
        self.geschaefte.geko.unshift(geko)
      },
      gekoRemove(idGeschaeft, gekoNr) {
        try {
          self.app.db
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
          return self.addError(error)
        }
        self.geschaefte.geko = self.geschaefte.geko.filter(
          g => g.idGeschaeft !== idGeschaeft || g.gekoNr !== gekoNr,
        )
      },
      changeGekoInDb(idGeschaeft, gekoNr, field, value) {
        // no need to do something on then
        // ui was updated on GEKO_CHANGE_STATE
        try {
          self.app.db
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
          self.addError(error)
        }
      },
      linkNewCreate(idGeschaeft, url) {
        try {
          self.app.db
            .prepare(
              `
          INSERT INTO
            links (idGeschaeft, url)
          VALUES
            (${idGeschaeft}, '${url}')`,
            )
            .run()
        } catch (error) {
          return self.addError(error)
        }
        self.geschaefte.links.unshift({ idGeschaeft, url })
      },
      linkRemove(idGeschaeft, url) {
        try {
          self.app.db
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
          return self.addError(error)
        }
        self.linkDelete(idGeschaeft, url)
      },
      linkDelete(idGeschaeft, url) {
        self.geschaefte.links = self.geschaefte.links.filter(
          l => l.idGeschaeft !== idGeschaeft || l.url !== url,
        )
      },
      getGeschaefteKontakteExtern() {
        const { app } = self
        self.geschaefteKontakteExtern.fetching = true
        let geschaefteKontakteExtern
        try {
          geschaefteKontakteExtern = app.db
            .prepare('SELECT * FROM geschaefteKontakteExtern')
            .all()
        } catch (error) {
          self.geschaefteKontakteExtern.fetching = false
          self.addError(error)
        }
        self.geschaefteKontakteExtern.fetching = false
        self.geschaefteKontakteExtern.geschaefteKontakteExtern = geschaefteKontakteExtern
      },
      geschaeftKontaktExternNewCreate(idGeschaeft, idKontakt) {
        const { app } = self
        let geschaeftKontaktExtern
        try {
          app.db
            .prepare(
              `
              INSERT INTO
                geschaefteKontakteExtern (idGeschaeft, idKontakt)
              VALUES
                (${idGeschaeft}, ${idKontakt})`,
            )
            .run()
        } catch (error) {
          return self.addError(error)
        }
        // return full object
        try {
          geschaeftKontaktExtern = app.db
            .prepare(
              `
              SELECT
                *
              FROM
                geschaefteKontakteExtern
              WHERE
                idGeschaeft = ${idGeschaeft}
                AND idKontakt = ${idKontakt}`,
            )
            .get()
        } catch (error) {
          return self.addError(error)
        }
        self.geschaefteKontakteExtern.geschaefteKontakteExtern.push(
          geschaeftKontaktExtern,
        )
      },
      geschaeftKontaktExternDelete(idGeschaeft, idKontakt) {
        self.geschaefteKontakteExtern.geschaefteKontakteExtern = self.geschaefteKontakteExtern.geschaefteKontakteExtern.filter(
          g => g.idGeschaeft !== idGeschaeft || g.idKontakt !== idKontakt,
        )
        self.geschaefteKontakteExtern.activeIdGeschaeft = null
        self.geschaefteKontakteExtern.activeIdKontakt = null
      },
      geschaeftKontaktExternRemove(idGeschaeft, idKontakt) {
        try {
          self.app.db
            .prepare(
              `
              DELETE FROM
                geschaefteKontakteExtern
              WHERE
                idGeschaeft = ${idGeschaeft}
                AND idKontakt = ${idKontakt}`,
            )
            .run()
        } catch (error) {
          return self.addError(error)
        }
        self.geschaefteKontakteExtern.willDelete = false
        self.geschaeftKontaktExternDelete(idGeschaeft, idKontakt)
      },
      getGeschaefteKontakteIntern() {
        const { app } = self
        self.geschaefteKontakteIntern.fetching = true
        let geschaefteKontakteIntern = []
        try {
          geschaefteKontakteIntern = app.db
            .prepare('SELECT * FROM geschaefteKontakteIntern')
            .all()
        } catch (error) {
          self.geschaefteKontakteIntern.fetching = false
          self.addError(error)
          return
        }
        self.geschaefteKontakteIntern.fetching = false
        self.geschaefteKontakteIntern.geschaefteKontakteIntern = geschaefteKontakteIntern
      },
      geschaeftKontaktInternNewCreate(idGeschaeft, idKontakt) {
        const { app } = self
        try {
          app.db
            .prepare(
              `
              INSERT INTO
                geschaefteKontakteIntern (idGeschaeft, idKontakt)
              VALUES
                (${idGeschaeft}, ${idKontakt})`,
            )
            .run()
        } catch (error) {
          console.log({ error, idGeschaeft, idKontakt })
          return self.addError(error)
        }
        // return full object
        let geschaeftKontaktIntern
        try {
          geschaeftKontaktIntern = app.db
            .prepare(
              `
              SELECT
                *
              FROM
                geschaefteKontakteIntern
              WHERE
                idGeschaeft = ${idGeschaeft}
                AND idKontakt = ${idKontakt}`,
            )
            .get()
        } catch (error) {
          console.log({ error, idGeschaeft, idKontakt })
          return self.addError(error)
        }
        console.log({ geschaeftKontaktIntern })
        self.geschaefteKontakteIntern.geschaefteKontakteIntern.push(
          geschaeftKontaktIntern,
        )
      },
      geschaeftKontaktInternDelete(idGeschaeft, idKontakt) {
        self.geschaefteKontakteIntern.geschaefteKontakteIntern = self.geschaefteKontakteIntern.geschaefteKontakteIntern.filter(
          g => g.idGeschaeft !== idGeschaeft || g.idKontakt !== idKontakt,
        )
        self.geschaefteKontakteIntern.activeIdGeschaeft = null
        self.geschaefteKontakteIntern.activeIdKontakt = null
      },
      geschaeftKontaktInternRemove(idGeschaeft, idKontakt) {
        try {
          self.app.db
            .prepare(
              `
              DELETE FROM
                geschaefteKontakteIntern
              WHERE
                idGeschaeft = ${idGeschaeft}
                AND idKontakt = ${idKontakt}`,
            )
            .run()
        } catch (error) {
          return self.addError(error)
        }
        self.geschaefteKontakteIntern.willDelete = false
        self.geschaeftKontaktInternDelete(idGeschaeft, idKontakt)
      },
      pagesCleanUp() {
        self.pages.pages = [Object.assign(pageStandardState)]
        self.pages.activePageIndex = 0
        self.pages.remainingGeschaefte = []
        self.pages.building = false
        self.pages.title = ''
        self.pages.queryTitle = true
        self.pages.reportType = 'fristen'
        self.pages.showPagesModal = false
        self.pages.modalTextLine1 = ''
        self.pages.modalTextLine2 = ''
      },
      pagesStop() {
        self.pages.remainingGeschaefte = []
        self.pages.building = false
        self.pages.showPagesModal = false
        self.pages.modalTextLine1 = ''
        self.pages.modalTextLine2 = ''
      },
      pagesModalShow(showPagesModal, modalTextLine1, modalTextLine2) {
        self.pages.showPagesModal = showPagesModal
        self.pages.modalTextLine1 = modalTextLine1
        self.pages.modalTextLine2 = modalTextLine2
      },
      pagesInitiate(reportType) {
        self.pagesCleanUp()
        const { geschaeftePlusFilteredAndSorted } = self.geschaefte
        self.pages.reportType = reportType
        self.pages.remainingGeschaefte = _.clone(
          geschaeftePlusFilteredAndSorted,
        )
        self.pages.building = true
        self.history.push('/pages')
      },
      pagesFinishedBuilding() {
        self.pages.building = false
      },
      pagesQueryTitle(queryTitle) {
        self.pages.queryTitle = queryTitle
      },
      pagesSetTitle(title) {
        self.pages.title = title
      },
      pagesNewPage() {
        self.pages.activePageIndex += 1
        self.pages.pages.push(Object.assign(pageStandardState))
      },
      pageAddGeschaeft() {
        if (self.pages.building) {
          const activePage = self.pages.pages.find(
            (p, i) => i === self.pages.activePageIndex,
          )
          if (activePage) {
            activePage.geschaefte.push(self.pages.remainingGeschaefte.shift())
          }
        }
      },
      pagesMoveGeschaeftToNewPage() {
        // remove geschaeft from active page
        const { pages } = self
        const { activePageIndex } = pages
        const activePage = pages.pages.find((p, i) => i === activePageIndex)
        if (activePage) {
          activePage.full = true
          self.pages.remainingGeschaefte.unshift(activePage.geschaefte.pop())
          self.pagesNewPage()
          self.pageAddGeschaeft()
        }
      },
      tableReset() {
        Object.keys(tableStandardState).forEach(k => {
          self.table[k] = tableStandardState[k]
        })
      },
      getTable(table) {
        const { app } = self
        self.table.table = table
        let rows
        try {
          rows = app.db.prepare(`SELECT * FROM ${table}`).all()
        } catch (error) {
          return self.addError(error)
        }
        self.table.table = table
        self.table.rows = rows
        self.table.id = null
        if (self.history.location.pathname !== '/table') {
          self.history.push('/table')
        }
      },
      /*
       * ROW
       */
      tableRowToggleActivated(table, id) {
        self.table.id = self.table.id && self.table.id === id ? null : id
      },
      tableRowNewCreate(table) {
        const { db } = self.app
        let result
        try {
          result = db.prepare(`INSERT INTO ${table} (id) VALUES (NULL)`).run()
        } catch (error) {
          return self.addError(error)
        }
        const id = result.lastInsertRowid
        // return full dataset
        let row
        try {
          row = db.prepare(`SELECT * FROM ${table} WHERE id = ${id}`).get()
        } catch (error) {
          return self.addError(error)
        }
        // react does not want to get null values
        Object.keys(row).forEach(key => {
          if (row[key] === null) {
            row[key] = ''
          }
        })
        self.table.rows.push(row)
        self.tableRowToggleActivated(table, row.id)
        if (self.history.location.pathname !== '/table') {
          self.history.push('/table')
        }
      },
      tableRowRemove(table, id) {
        try {
          self.app.db
            .prepare(
              `
              DELETE FROM
                ${table}
              WHERE
                id = ${id}`,
            )
            .run()
        } catch (error) {
          return self.addError(error)
        }
        self.tableRowToggleActivated(table, null)
        self.table.rows = self.table.rows.filter(g => g.id !== id)
      },
      tableChangeState(id, field, value) {
        const row = self.table.rows.find(r => r.id === id)
        if (row) {
          row[field] = value
        }
      },
      changeTableInDb(table, id, field, value) {
        // no need to do something on then
        // ui was updated on TABLE_CHANGE_STATE
        try {
          self.app.db.prepare(
            `
            UPDATE
              ${table}
            SET
              ${field} = '${value}'
            WHERE
              id = ${id}`,
          )
        } catch (error) {
          // TODO: reset ui
          return self.addError(error)
        }
        // need to reload this table in self
        const actionName = `${table}OptionsGet`
        self[actionName]()
      },
      fetchUsername() {
        const { user } = self
        if (!user.username) {
          const username = getMyName.sync()
          if (username) {
            self.user.error = null
            self.user.username = username
          } else {
            self.user.error = 'keinen Benutzernamen erhalten'
            self.user.username = ''
          }
        }
      },
      configSetKey(key, value) {
        const { config } = self.app
        if (value) {
          config[key] = value
        } else if (config[key]) {
          delete config[key]
        }
        saveConfig(config)
        self.app.config = config
      },
      dbGet() {
        self.app.fetchingDb = true
        self.app.errorFetchingDb = null
        chooseDb()
          .then(dbPath => {
            const db = betterSqlite(dbPath, { fileMustExist: true })
            self.dbChooseSuccess(dbPath, db)
            self.configSetKey('dbPath', dbPath)
          })
          .catch(err => self.dbChooseError(err))
      },
      dbChooseError(err) {
        self.fetchingDb = false
        self.errorFetchingDb = err
        self.db = null
      },
      dbChooseSuccess(dbPath, db) {
        self.app.fetchingDb = false
        self.app.db = db
        self.app.config = Object.assign({}, self.app.config, { dbPath })
        // get data
        self.faelligeStatiOptionsGet()
        self.getGeko()
        self.getLinks()
        self.interneOptionsGet()
        self.externeOptionsGet()
        self.getGeschaefteKontakteIntern()
        self.getGeschaefteKontakteExtern()
        self.rechtsmittelErledigungOptionsGet()
        self.parlVorstossTypOptionsGet()
        self.statusOptionsGet()
        self.geschaeftsartOptionsGet()
        self.aktenstandortOptionsGet()
        self.rechtsmittelInstanzOptionsGet()
        self.abteilungOptionsGet()
        self.getGeschaefte()
        self.fetchUsername()
        // set filter to fällige
        self.geschaefteFilterByFields(filterForFaelligeGeschaefte, 'fällige')
        self.geschaefteSortByFields('fristMitarbeiter', 'DESCENDING')
      },
      dbGetAtStandardpathIfPossible() {
        // try to open db at standard path
        // need function that tests if db exists at standard path
        const standardDbExists = fs.existsSync(standardDbPath)
        if (standardDbExists) {
          const db = betterSqlite(standardDbPath, { fileMustExist: true })
          self.dbChooseSuccess(standardDbPath, db)
          self.configSetKey('dbPath', standardDbPath)
        } else {
          // let user choose db file
          self.app.fetchingDb = true
          self.app.errorFetchingDb = null
          chooseDb()
            .then(dbPath => {
              const db = betterSqlite(dbPath, { fileMustExist: true })
              self.dbChooseSuccess(dbPath, db)
              self.configSetKey('dbPath', dbPath)
            })
            .catch(err => self.dbChooseError(err))
        }
      },
      configGet() {
        getConfig()
          .then(config => {
            const newConfig = config || standardConfig
            self.config = newConfig
            const { dbPath } = newConfig
            if (!dbPath) {
              return self.dbGetAtStandardpathIfPossible()
            }
            const dbExists = fs.existsSync(dbPath)
            if (!dbExists) {
              return self.dbGetAtStandardpathIfPossible()
            }
            const db = betterSqlite(dbPath, { fileMustExist: true })
            self.dbChooseSuccess(dbPath, db)
          })
          .catch(error => console.error(error))
      },
      configUiReset() {
        const { config } = self.app
        const newConfig = {}
        const dbPath = config.dbPath
        if (dbPath) {
          newConfig.dbPath = dbPath
        }
        saveConfig(newConfig)
        self.app.config = newConfig
      },
      messageShow(showMessageModal, messageTextLine1, messageTextLine2) {
        self.app.showMessageModal = showMessageModal
        self.app.messageTextLine1 = messageTextLine1
        self.app.messageTextLine2 = messageTextLine2
      },
      addError(error) {
        // use uniq in case multiple same messages arrive
        self.app.errors = uniqBy([...self.app.errors, error], 'message')
        setTimeout(() => self.popError(), 1000 * 10)
      },
      popError() {
        // eslint-disable-next-line no-unused-vars
        const [first, ...last] = self.app.errors
        self.app.errors = [...last]
      },
      setDirty(val) {
        self.dirty = val
      },
    }))
