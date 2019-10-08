/* eslint-disable no-param-reassign */
import { action } from 'mobx'

export default store => ({
  geschaefteKontakteInternGet: action(() => {
    store.geschaefteKontakteIntern.fetching = true
  }),
  geschaefteKontakteInternGetSuccess: action(geschaefteKontakteIntern => {
    store.geschaefteKontakteIntern.fetching = false
    store.geschaefteKontakteIntern.geschaefteKontakteIntern = geschaefteKontakteIntern
  }),
  geschaefteKontakteInternGetError: action(error => {
    store.geschaefteKontakteIntern.fetching = false
    store.addError(error)
  }),
  getGeschaefteKontakteIntern: action(() => {
    const { app } = store
    store.geschaefteKontakteInternGet()
    let geschaefteKontakteIntern = []
    try {
      geschaefteKontakteIntern = app.db
        .prepare('SELECT * FROM geschaefteKontakteIntern')
        .all()
    } catch (error) {
      return store.geschaefteKontakteInternGetError(error)
    }
    store.geschaefteKontakteInternGetSuccess(geschaefteKontakteIntern)
  }),
  geschaeftKontaktInternNew: action(geschaeftKontaktIntern =>
    store.geschaefteKontakteIntern.geschaefteKontakteIntern.push(
      geschaeftKontaktIntern,
    ),
  ),
  geschaeftKontaktInternNewError: action(error => store.addError(error)),
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
      return store.geschaeftKontaktInternNewError(error)
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
      return store.geschaeftKontaktInternNewError(error)
    }
    console.log({ geschaeftKontaktIntern })
    store.geschaeftKontaktInternNew(geschaeftKontaktIntern)
  }),
  geschaeftKontaktInternRemoveDeleteIntended: action(() => {
    store.geschaefteKontakteIntern.willDelete = false
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
      return store.geschaeftKontaktInternDeleteError(error)
    }
    store.geschaeftKontaktInternRemoveDeleteIntended()
    store.geschaeftKontaktInternDelete(idGeschaeft, idKontakt)
  }),
  geschaeftKontaktInternDeleteError: action(error =>
    store.geschaeftKontaktInternDelete.push(error),
  ),
  geschaeftKontaktInternSetDeleteIntended: action((idGeschaeft, idKontakt) => {
    store.geschaefteKontakteIntern.willDelete = true
    store.geschaefteKontakteIntern.activeIdGeschaeft = idGeschaeft
    store.geschaefteKontakteIntern.activeIdKontakt = idKontakt
  }),
  geschaefteKontakteInternChangeDbError: action(error => store.addError(error)),
})
