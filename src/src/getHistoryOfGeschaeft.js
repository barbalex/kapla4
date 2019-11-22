import getIdVorgeschaeft from './getIdVorgeschaeft'
import getIdNachgeschaeft from './getIdNachgeschaeft'

export default (geschaefte, activeId) => {
  const history = activeId ? [activeId] : []
  let idVorgeschaeft = getIdVorgeschaeft(geschaefte, activeId)
  if (idVorgeschaeft) history.unshift(idVorgeschaeft)

  while (idVorgeschaeft) {
    idVorgeschaeft = getIdVorgeschaeft(geschaefte, idVorgeschaeft)
    // need to prevent endless loop when two geschaefte set each other as vorgeschaeft
    if (idVorgeschaeft && !history.includes(idVorgeschaeft)) {
      history.unshift(idVorgeschaeft)
    } else if (history.includes(idVorgeschaeft)) {
      idVorgeschaeft = null
    }
  }

  let idNachgeschaeft = getIdNachgeschaeft(geschaefte, activeId)
  if (idNachgeschaeft) history.push(idNachgeschaeft)
  while (idNachgeschaeft) {
    idNachgeschaeft = getIdNachgeschaeft(geschaefte, idNachgeschaeft)
    // need to prevent endless loop when two geschaefte set each other as nachgeschaeft
    if (idNachgeschaeft && !history.includes(idNachgeschaeft)) {
      history.push(idNachgeschaeft)
    } else if (history.includes(idNachgeschaeft)) {
      idNachgeschaeft = null
    }
  }
  // if no vor- or nachgeschaeft: return nothing
  if (history.length === 1 && history[0] === activeId) return []
  return history
}
