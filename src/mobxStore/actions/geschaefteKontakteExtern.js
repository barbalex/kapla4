/* eslint-disable no-param-reassign */
import { action } from 'mobx'

export default store => ({
  getGeschaefteKontakteExtern: action(() => {
    const { app } = store
    store.geschaefteKontakteExtern.fetching = true
    let geschaefteKontakteExtern
    try {
      geschaefteKontakteExtern = app.db
        .prepare('SELECT * FROM geschaefteKontakteExtern')
        .all()
    } catch (error) {
      store.geschaefteKontakteExtern.fetching = false
      store.addError(error)
    }
    store.geschaefteKontakteExtern.fetching = false
    store.geschaefteKontakteExtern.geschaefteKontakteExtern = geschaefteKontakteExtern
  }),
  geschaeftKontaktExternNewCreate: action((idGeschaeft, idKontakt) => {
    const { app } = store
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
      return store.addError(error)
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
      return store.addError(error)
    }
    store.geschaefteKontakteExtern.geschaefteKontakteExtern.push(
      geschaeftKontaktExtern,
    )
  }),
  geschaeftKontaktExternDelete: action((idGeschaeft, idKontakt) => {
    store.geschaefteKontakteExtern.geschaefteKontakteExtern = store.geschaefteKontakteExtern.geschaefteKontakteExtern.filter(
      g => g.idGeschaeft !== idGeschaeft || g.idKontakt !== idKontakt,
    )
    store.geschaefteKontakteExtern.activeIdGeschaeft = null
    store.geschaefteKontakteExtern.activeIdKontakt = null
  }),
  geschaeftKontaktExternRemove: action((idGeschaeft, idKontakt) => {
    try {
      store.app.db
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
      return store.addError(error)
    }
    store.geschaefteKontakteExtern.willDelete = false
    store.geschaeftKontaktExternDelete(idGeschaeft, idKontakt)
  }),
})
