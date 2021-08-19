import getUsername from 'username'
// WARNING
// v6.0.0 imports using esm
// this seems to break asset-relocator from the build process...

const fetchUsername = (store) => {
  const { setUsername } = store.app
  const username = getUsername.sync()
  if (username) {
    setUsername(username)
  } else {
    store.addErrorMessage('keinen Benutzernamen erhalten')
  }
}

export default fetchUsername
