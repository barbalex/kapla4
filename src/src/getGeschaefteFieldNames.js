// seems not to be in use

export default db => {
  let result = []
  try {
    result = db.pragma('table_info(geschaefte)')
  } catch (error) {
    throw error
  }
  return result
}
