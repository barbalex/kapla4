import _ from 'lodash'

export default geschaefte => {
  // build a map
  const historyMap = new Map(
    geschaefte.map(g => {
      const idArray = g.idVorgeschaeft
        ? [g.idVorgeschaeft, g.idGeschaeft]
        : [g.idGeschaeft]
      return [g.idGeschaeft, idArray]
    }),
  )
  geschaefte.forEach(g => {
    const idArray = historyMap.get(g.idGeschaeft)
    idArray.forEach(i => {
      const oldValue = historyMap.get(i)
      const newValue = _.union(historyMap.get(i), idArray)
      if (!_.isEqual(oldValue, newValue)) {
        historyMap.set(i, newValue)
      }
    })
  })
  return historyMap
}
