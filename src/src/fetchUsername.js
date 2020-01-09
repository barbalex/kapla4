import getUsername from 'username'

export default store => {
  const { setUsername } = store.app
  const username = getUsername.sync()
  if (username) {
    setUsername(username)
  } else {
    addErrorMessage('keinen Benutzernamen erhalten')
  }
}