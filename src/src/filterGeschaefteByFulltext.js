/*const primitiveSatisfies = ({ data, filter }) =>
  ('' + data).toLowerCase().includes(filter)*/

export default store => {
  const { app, addError } = store
  const { filterFulltext: filter, geschaefte } = store.geschaefte
  // convert to lower case if possibe
  let filterValue = filter.toLowerCase ? filter.toLowerCase() : filter
  if (filterValue.toString) {
    // a number is queried
    // convert to string to also find 7681 when filtering for 681
    filterValue = filterValue.toString()
  }

  console.log('filterGeschaefteByFulltext, filter:', filter)
  let result = []
  try {
    result = app.db
      .prepare(`select idGeschaeft from fts where value match '${filter}*'`)
      .all()
  } catch (error) {
    console.log('filterGeschaefteByFulltext, error:', error.message)
    addError(error)
    return geschaefte
  }
  console.log('filterGeschaefteByFulltext, error 2')
  const filteredIds = result.map(o => o.idGeschaeft)
  console.log('filterGeschaefteByFulltext, error 3, filteredIds:', filteredIds)

  return geschaefte.filter(g => filteredIds.includes(g.idGeschaeft))
}
