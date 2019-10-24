import { extendObservable } from 'mobx'

const user = {}
extendObservable(user, {
  error: null,
  username: null,
})

export default user
