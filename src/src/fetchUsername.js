import { username as getUsername } from 'username'

const fetchUsername = async (store) => {
  const { setUsername } = store.app
  const username = await getUsername()

  if (username) {
    setUsername(username)
  } else {
    store.addErrorMessage('keinen Benutzernamen erhalten')
  }
}

export default fetchUsername
