/* eslint-disable no-param-reassign */
import { action } from 'mobx'
import _ from 'lodash'
import moment from 'moment'

import getDropdownOptions from '../../src/getDropdownOptions'
import geschaefteSortByFieldsGetSortFields from '../../src/geschaefteSortByFieldsGetSortFields'
import convertDateToDdMmYyyy from '../../src/convertDateToDdMmYyyy'
import convertDateToYyyyMmDd from '../../src/convertDateToYyyyMmDd'
import isDateField from '../../src/isDateField'

export default store => ({
  geschaeftPdfShow: action(() => store.history.push('/geschaeftPdf')),
  getGeschaefte: action(() => {
    const { app } = store
    store.geschaefte.fetching = true
    let geschaefte = []
    try {
      geschaefte = app.db
        .prepare('SELECT * FROM geschaefte ORDER BY idGeschaeft DESC')
        .all()
    } catch (error) {
      store.geschaefte.fetching = false
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
    store.geschaefte.fetching = false
    store.geschaefte.geschaefte = geschaefte
    if (store.history.location.pathname !== '/geschaefte') {
      store.history.push('/geschaefte')
    }
  }),
  geschaeftToggleActivated: action(idGeschaeft => {
    store.geschaefte.activeId =
      store.geschaefte.activeId && store.geschaefte.activeId === idGeschaeft
        ? null
        : idGeschaeft
  }),
  geschaefteFilterByFields: action(
    (filterFields, filterType = 'nach Feldern') => {
      const { pages } = store
      const { geschaeftePlusFilteredAndSorted } = store.geschaefte
      store.geschaefte.filterFields = filterFields
      store.geschaefte.filterFulltext = ''
      store.geschaefte.filterType = filterType || null
      store.geschaefte.activeId = null
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
  ),
  geschaefteResetSort: action(() => {
    store.geschaefte.sortFields = []
  }),
  geschaefteSortByFields: action((field, direction) => {
    const { pages } = store
    const sortFields = geschaefteSortByFieldsGetSortFields(
      store,
      field,
      direction,
    )
    store.geschaefte.sortFields = sortFields
    /**
     * if pages are active,
     * initiate with new data
     */
    const path = store.history.location.pathname
    if (path === '/pages') {
      const { reportType } = pages
      store.pagesInitiate(reportType)
    }
  }),
  geschaefteFilterByFulltext: action(filterFulltext => {
    const { pages, geschaefte } = store
    const { geschaeftePlusFilteredAndSorted } = geschaefte
    store.geschaefte.filterType = 'nach Volltext'
    store.geschaefte.filterFulltext = filterFulltext
    store.geschaefte.filterFields = []
    store.geschaefte.activeId = null
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
  }),
  geschaefteRemoveFilters: action(() => {
    store.geschaefte.GefilterteIds = _.sortBy(
      store.geschaefte.geschaefte,
      g => g.idGeschaeft,
    )
      .reverse()
      .map(g => g.idGeschaeft)
    store.geschaefte.filterFields = []
    store.geschaefte.filterType = null
    store.geschaefte.filterFulltext = ''
    store.geschaefte.sortFields = []
  }),
  getGeko: action(() => {
    const { app } = store
    store.geschaefte.fetching = true
    let geko = []
    try {
      geko = app.db
        .prepare('SELECT * FROM geko ORDER BY idGeschaeft, gekoNr')
        .all()
    } catch (error) {
      store.geschaefte.fetching = false
      store.addError(error)
    }
    store.geschaefte.fetching = false
    store.geschaefte.geko = geko
  }),
  getLinks: action(() => {
    const { app } = store
    store.geschaefte.fetching = true
    let links = []
    try {
      links = app.db
        .prepare('SELECT * FROM links ORDER BY idGeschaeft, url')
        .all()
    } catch (error) {
      store.geschaefte.fetching = false
      return store.addError(error)
    }
    store.geschaefte.fetching = false
    store.geschaefte.links = links
  }),
  /*
   * GESCHAEFT
   */
  geschaeftNewCreate: action(() => {
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
    store.geschaefte.geschaefte.unshift(geschaeft)
    /**
     * need to remove filters
     */
    store.geschaefte.filterFields = []
    store.geschaefte.filterType = null
    store.geschaefte.filterFulltext = ''
    store.geschaefte.sortFields = []
    store.geschaeftToggleActivated(geschaeft.idGeschaeft)
    if (store.history.location.pathname !== '/geschaefte') {
      store.history.push('/geschaefte')
    }
  }),
  geschaeftRemove: action(idGeschaeft => {
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
    store.geschaefte.geschaefte = store.geschaefte.geschaefte.filter(
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
  }),
  geschaeftRemoveDeleteIntended: action(() => {
    store.geschaefte.willDelete = false
  }),
  geschaeftSetDeleteIntended: action(() => {
    store.geschaefte.willDelete = true
  }),
  geschaefteChangeState: action((idGeschaeft, field, value) => {
    const { user } = store
    const { geschaefte } = store.geschaefte
    const { username } = user
    const geschaeft = geschaefte.find(g => g.idGeschaeft === idGeschaeft)
    if (geschaeft) {
      geschaeft[field] = value
      geschaeft.mutationsperson = username
      geschaeft.mutationsdatum = moment().format('YYYY-MM-DD HH:mm:ss')
    } else {
      store.addError(new Error('Das Geschäft wurde nicht aktualisiert'))
    }
  }),
  changeGeschaeftInDb: action((idGeschaeft, field, value) => {
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
  }),
  rechtsmittelErledigungOptionsGet: action(() => {
    let rechtsmittelErledigungOptions = []
    try {
      rechtsmittelErledigungOptions = getDropdownOptions(
        store,
        'rechtsmittelErledigung',
      )
    } catch (error) {
      return
    }
    store.geschaefte.rechtsmittelErledigungOptions = rechtsmittelErledigungOptions
  }),
  parlVorstossTypOptionsGet: action(() => {
    let parlVorstossTypOptions = []
    try {
      parlVorstossTypOptions = getDropdownOptions(store, 'parlVorstossTyp')
    } catch (error) {
      return
    }
    store.geschaefte.parlVorstossTypOptions = parlVorstossTypOptions
  }),
  statusOptionsGet: action(() => {
    let statusOptions = []
    try {
      statusOptions = getDropdownOptions(store, 'status')
    } catch (error) {
      return
    }
    store.geschaefte.statusOptions = statusOptions
  }),
  faelligeStatiOptionsGet: action(() => {
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
    store.geschaefte.faelligeStatiOptions = options.map(res => res.status)
  }),
  geschaeftsartOptionsGet: action(() => {
    let geschaeftsartOptions = []
    try {
      geschaeftsartOptions = getDropdownOptions(store, 'geschaeftsart')
    } catch (error) {
      return
    }
    store.geschaefte.geschaeftsartOptions = geschaeftsartOptions
  }),
  aktenstandortOptionsGet: action(() => {
    let aktenstandortOptions = []
    try {
      aktenstandortOptions = getDropdownOptions(store, 'aktenstandort')
    } catch (error) {
      return
    }
    store.geschaefte.aktenstandortOptions = aktenstandortOptions
  }),
  interneOptionsGet: action(() => {
    let interneOptions = []
    try {
      interneOptions = store.app.db
        .prepare('SELECT * FROM interne ORDER BY kurzzeichen')
        .all()
    } catch (error) {
      return store.addError(error)
    }
    store.geschaefte.interneOptions = interneOptions
  }),
  externeOptionsGet: action(() => {
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
    store.geschaefte.externeOptions = externeOptions
  }),
  rechtsmittelInstanzOptionsGet: action(() => {
    let rechtsmittelInstanzOptions = []
    try {
      rechtsmittelInstanzOptions = getDropdownOptions(
        store,
        'rechtsmittelInstanz',
      )
    } catch (error) {
      return
    }
    store.geschaefte.rechtsmittelInstanzOptions = rechtsmittelInstanzOptions
  }),
  abteilungOptionsGet: action(() => {
    let abteilungOptions = []
    try {
      abteilungOptions = getDropdownOptions(store, 'abteilung')
    } catch (error) {
      return
    }
    store.geschaefte.abteilungOptions = abteilungOptions
  }),
  gekoNewCreate: action((idGeschaeft, gekoNr) => {
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
    store.geschaefte.geko.unshift(geko)
  }),
  gekoRemove: action((idGeschaeft, gekoNr) => {
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
    store.geschaefte.geko = store.geschaefte.geko.filter(
      g => g.idGeschaeft !== idGeschaeft || g.gekoNr !== gekoNr,
    )
  }),
  changeGekoInDb: action((idGeschaeft, gekoNr, field, value) => {
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
  }),
  linkNewCreate: action((idGeschaeft, url) => {
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
    store.geschaefte.links.unshift({ idGeschaeft, url })
  }),
  linkRemove: action((idGeschaeft, url) => {
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
  }),
  linkDelete: action((idGeschaeft, url) => {
    store.geschaefte.links = store.geschaefte.links.filter(
      l => l.idGeschaeft !== idGeschaeft || l.url !== url,
    )
  }),
})
