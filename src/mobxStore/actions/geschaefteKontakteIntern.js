/* eslint-disable no-param-reassign */
import { action } from 'mobx'

export default store => ({
  getGeschaefteKontakteIntern: action(() => {
    const { app } = store
    store.geschaefteKontakteIntern.fetching = true
    let geschaefteKontakteIntern = []
    try {
      geschaefteKontakteIntern = app.db
        .prepare('SELECT * FROM geschaefteKontakteIntern')
        .all()
    } catch (error) {
      store.geschaefteKontakteIntern.fetching = false
      store.addError(error)
      return
    }
    store.geschaefteKontakteIntern.fetching = false
    store.geschaefteKontakteIntern.geschaefteKontakteIntern = geschaefteKontakteIntern
  }),
  geschaeftKontaktInternNewCreate: action((idGeschaeft, idKontakt) => {
    const { app } = store
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
      return store.addError(error)
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
      return store.addError(error)
    }
    console.log({ geschaeftKontaktIntern })
    store.geschaefteKontakteIntern.geschaefteKontakteIntern.push(
      geschaeftKontaktIntern,
    )
  }),
  geschaeftKontaktInternDelete: action((idGeschaeft, idKontakt) => {
    store.geschaefteKontakteIntern.geschaefteKontakteIntern = store.geschaefteKontakteIntern.geschaefteKontakteIntern.filter(
      g => g.idGeschaeft !== idGeschaeft || g.idKontakt !== idKontakt,
    )
    store.geschaefteKontakteIntern.activeIdGeschaeft = null
    store.geschaefteKontakteIntern.activeIdKontakt = null
  }),
  geschaeftKontaktInternRemove: action((idGeschaeft, idKontakt) => {
    try {
      store.app.db
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
      return store.addError(error)
    }
    store.geschaefteKontakteIntern.willDelete = false
    store.geschaeftKontaktInternDelete(idGeschaeft, idKontakt)
  }),
})
