/* eslint-disable no-param-reassign */
import { action } from 'mobx'
/**
 * watch versions of username:
 * did not work on 2.2.2
 * see: https://github.com/sindresorhus/username/issues/9
 */
import getMyName from 'username'

export default store => ({
  fetchUsername: action(() => {
    const { user } = store
    if (!user.username) {
      const username = getMyName.sync()
      if (username) {
        store.user.error = null
        store.user.username = username
      } else {
        store.user.error = 'keinen Benutzernamen erhalten'
        store.user.username = ''
      }
    }
  }),
})
