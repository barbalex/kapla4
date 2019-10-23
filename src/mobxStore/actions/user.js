/* eslint-disable no-param-reassign */
import { action } from 'mobx'
/**
 * watch versions of username:
 * did not work on 2.2.2
 * see: https://github.com/sindresorhus/username/issues/9
 */
import getMyName from 'username'

export default store => ({
  getUsername: action(() => {
    store.user.fetching = true
    store.user.error = null
  }),
  gotUsername: action(username => {
    store.user.fetching = false
    store.user.error = null
    store.user.username = username
  }),
  didntGetUsername: action(error => {
    store.user.fetching = false
    store.user.error = error
    store.user.username = ''
  }),
  fetchUsername: action(() => {
    const { user } = store
    if (!user.username) {
      const username = getMyName.sync()
      if (username) {
        store.gotUsername(username)
      } else {
        store.didntGetUsername('keinen Benutzernamen erhalten')
      }
    }
  }),
})
