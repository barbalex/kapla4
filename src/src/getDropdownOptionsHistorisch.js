export default (store, name) => {
  let result = []
  try {
    result = store.app.db
      .prepare(`SELECT ${name} FROM ${name} ORDER BY sort`)
      .all()
  } catch (error) {
    store.addErrorMessage(error.message)
  }
  const options = result.map((res) => res[name])
  return options
}
