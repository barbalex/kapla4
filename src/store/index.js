import { types } from 'mobx-state-tree'
import uniq from 'lodash/uniq'

import App from './App'
import Geschaefte from './Geschaefte'
import GeschaefteKontakteIntern from './GeschaefteKontakteIntern'
import GeschaefteKontakteExtern from './GeschaefteKontakteExtern'
import Pages from './Pages'
import Table from './Table'
import getDropdownOptions from '../src/getDropdownOptions'

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
      location: types.optional(
        types.array(types.union(types.string, types.integer)),
        ['geschaefte'],
      ),
      errors: types.array(types.string),
    })
    .actions((self) => ({
      setLocation(location) {
        self.location = location
      },
      navigateToGeschaeftPdf() {
        self.location = ['geschaeftPdf']
      },
      /*
       * GESCHAEFT
       */
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
        self.geschaefte.rechtsmittelErledigungOptions = rechtsmittelErledigungOptions
      },
      parlVorstossTypOptionsGet() {
        let parlVorstossTypOptions = []
        try {
          parlVorstossTypOptions = getDropdownOptions(self, 'parlVorstossTyp')
        } catch (error) {
          return
        }
        self.geschaefte.parlVorstossTypOptions = parlVorstossTypOptions
      },
      statusOptionsGet() {
        let statusOptions = []
        try {
          statusOptions = getDropdownOptions(self, 'status')
        } catch (error) {
          return
        }
        self.geschaefte.statusOptions = statusOptions
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
          return self.addErrorMessage(error.message)
        }
        self.geschaefte.faelligeStatiOptions = options.map((res) => res.status)
      },
      geschaeftsartOptionsGet() {
        let geschaeftsartOptions = []
        try {
          geschaeftsartOptions = getDropdownOptions(self, 'geschaeftsart')
        } catch (error) {
          return
        }
        self.geschaefte.geschaeftsartOptions = geschaeftsartOptions
      },
      aktenstandortOptionsGet() {
        let aktenstandortOptions = []
        try {
          aktenstandortOptions = getDropdownOptions(self, 'aktenstandort')
        } catch (error) {
          return
        }
        self.geschaefte.aktenstandortOptions = aktenstandortOptions
      },
      interneOptionsGet() {
        let interneOptions = []
        try {
          interneOptions = self.app.db
            .prepare('SELECT * FROM interne ORDER BY kurzzeichen')
            .all()
        } catch (error) {
          return self.addErrorMessage(error.message)
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
            *
          FROM
            externe
          ORDER BY
            name,
            vorname`,
            )
            .all()
        } catch (error) {
          return self.addErrorMessage(error.message)
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
        self.geschaefte.rechtsmittelInstanzOptions = rechtsmittelInstanzOptions
      },
      abteilungOptionsGet() {
        let abteilungOptions = []
        try {
          abteilungOptions = getDropdownOptions(self, 'abteilung')
        } catch (error) {
          return
        }
        self.geschaefte.abteilungOptions = abteilungOptions
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
          return self.addErrorMessage(error.message)
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
          return self.addErrorMessage(error.message)
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
          return self.addErrorMessage(error.message)
        }
        self.geschaefte.geko = self.geschaefte.geko.filter(
          (g) => g.idGeschaeft !== idGeschaeft || g.gekoNr !== gekoNr,
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
            ${field} = ${value === null ? null : `'${value}'`},
          WHERE
            idGeschaeft = ${idGeschaeft} AND
            gekoNr = '${gekoNr}'`,
            )
            .run()
        } catch (error) {
          self.addErrorMessage(error.message)
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
          return self.addErrorMessage(error.message)
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
          return self.addErrorMessage(error.message)
        }
        self.linkDelete(idGeschaeft, url)
      },
      linkDelete(idGeschaeft, url) {
        self.geschaefte.links = self.geschaefte.links.filter(
          (l) => l.idGeschaeft !== idGeschaeft || l.url !== url,
        )
      },
      getGeschaefteKontakteExtern() {
        const { app } = self
        let geschaefteKontakteExtern
        try {
          geschaefteKontakteExtern = app.db
            .prepare('SELECT * FROM geschaefteKontakteExtern')
            .all()
        } catch (error) {
          self.addErrorMessage(error.message)
        }
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
          return self.addErrorMessage(error.message)
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
          return self.addErrorMessage(error.message)
        }
        self.geschaefteKontakteExtern.geschaefteKontakteExtern.push(
          geschaeftKontaktExtern,
        )
      },
      geschaeftKontaktExternDelete(idGeschaeft, idKontakt) {
        self.geschaefteKontakteExtern.geschaefteKontakteExtern = self.geschaefteKontakteExtern.geschaefteKontakteExtern.filter(
          (g) => g.idGeschaeft !== idGeschaeft || g.idKontakt !== idKontakt,
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
          return self.addErrorMessage(error.message)
        }
        self.geschaefteKontakteExtern.willDelete = false
        self.geschaeftKontaktExternDelete(idGeschaeft, idKontakt)
      },
      getGeschaefteKontakteIntern() {
        const { app } = self
        let geschaefteKontakteIntern = []
        try {
          geschaefteKontakteIntern = app.db
            .prepare('SELECT * FROM geschaefteKontakteIntern')
            .all()
        } catch (error) {
          return self.addErrorMessage(error.message)
        }
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
          return self.addErrorMessage(error.message)
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
          return self.addErrorMessage(error.message)
        }
        self.geschaefteKontakteIntern.geschaefteKontakteIntern.push(
          geschaeftKontaktIntern,
        )
      },
      geschaeftKontaktInternDelete(idGeschaeft, idKontakt) {
        self.geschaefteKontakteIntern.geschaefteKontakteIntern = self.geschaefteKontakteIntern.geschaefteKontakteIntern.filter(
          (g) => g.idGeschaeft !== idGeschaeft || g.idKontakt !== idKontakt,
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
          return self.addErrorMessage(error.message)
        }
        self.geschaefteKontakteIntern.willDelete = false
        self.geschaeftKontaktInternDelete(idGeschaeft, idKontakt)
      },
      messageShow(showMessageModal, messageTextLine1, messageTextLine2) {
        self.app.showMessageModal = showMessageModal
        self.app.messageTextLine1 = messageTextLine1
        self.app.messageTextLine2 = messageTextLine2
      },
      addErrorMessage(message) {
        // use uniq in case multiple same messages arrive
        self.errors = uniq([...self.errors, message])
        setTimeout(() => self.popError(), 1000 * 20)
      },
      popError() {
        // eslint-disable-next-line no-unused-vars
        const [first, ...last] = self.errors
        self.errors = [...last]
      },
      setDirty(val) {
        self.dirty = val
      },
    }))
