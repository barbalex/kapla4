/* eslint-disable no-param-reassign */
import { action } from 'mobx'

export default store => ({
  geschaefteKontakteExternGet: action(() => {
    store.geschaefteKontakteExtern.fetching = true
  }),
  geschaefteKontakteExternGetSuccess: action(geschaefteKontakteExtern => {
    store.geschaefteKontakteExtern.fetching = false
    store.geschaefteKontakteExtern.geschaefteKontakteExtern = geschaefteKontakteExtern
  }),
  geschaefteKontakteExternGetError: action(error => {
    store.geschaefteKontakteExtern.fetching = false
    store.addError(error)
  }),
  getGeschaefteKontakteExtern: action(() => {
    const { app } = store
    store.geschaefteKontakteExternGet()
    let geschaefteKontakteExtern
    try {
      geschaefteKontakteExtern = app.db
        .prepare('SELECT * FROM geschaefteKontakteExtern')
        .all()
    } catch (error) {
      store.geschaefteKontakteExternGetError(error)
    }
    store.geschaefteKontakteExternGetSuccess(geschaefteKontakteExtern)
  }),
  geschaeftKontaktExternNew: action(geschaeftKontaktExtern =>
    store.geschaefteKontakteExtern.geschaefteKontakteExtern.push(
      geschaeftKontaktExtern,
    ),
  ),
  geschaeftKontaktExternNewError: action(error => store.addError(error)),
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
      return store.geschaeftKontaktExternNewError(error)
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
      return store.geschaeftKontaktExternNewError(error)
    }
    store.geschaeftKontaktExternNew(geschaeftKontaktExtern)
  }),
  geschaeftKontaktExternRemoveDeleteIntended: action(() => {
    store.geschaefteKontakteExtern.willDelete = false
  }),
  geschaeftKontaktExternDelete: action((idGeschaeft, idKontakt) => {
    store.geschaefteKontakteExtern.geschaefteKontakteExtern = store.geschaefteKontakteExtern.geschaefteKontakteExtern.filter(
      g => g.idGeschaeft !== idGeschaeft || g.idKontakt !== idKontakt,
    )
    store.geschaefteKontakteExtern.activeIdGeschaeft = null
    store.geschaefteKontakteExtern.activeIdKontakt = null
  }),
  geschaeftKontaktExternDeleteError: action(error => store.addError(error)),
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
      return store.geschaeftKontaktExternDeleteError(error)
    }
    store.geschaeftKontaktExternRemoveDeleteIntended(idGeschaeft, idKontakt)
    store.geschaeftKontaktExternDelete(idGeschaeft, idKontakt)
  }),
  geschaefteKontakteExternChangeDbError: action(error => store.addError(error)),
})
