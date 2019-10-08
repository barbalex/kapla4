import { extendObservable } from 'mobx'

const user = {}
extendObservable(user, {
  fetching: false,
  error: null,
  username: null,
})

export default user
