export default (dauerBisFristMitarbeiter) => {
  if (dauerBisFristMitarbeiter === null) return null
  if (dauerBisFristMitarbeiter < 0) return 'FÄLLIG'
  if (dauerBisFristMitarbeiter === 0) return 'HEUTE'
  if (dauerBisFristMitarbeiter === 1) return `In ${dauerBisFristMitarbeiter} Tag`
  return `In ${dauerBisFristMitarbeiter} Tagen`
}
