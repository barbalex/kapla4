import moment from 'moment'

const getDauerBisFristMitarbeiter = (geschaeft) => {
  if (!geschaeft || !geschaeft.fristMitarbeiter) return null
  // only warn for pendent or überwachen intern
  if (
    geschaeft.status &&
    ['überwachen int.', 'pendent'].includes(geschaeft.status)
  ) {
    const now = moment()
    const end = moment(geschaeft.fristMitarbeiter, 'DD.MM.YYYY')
    const duration = moment.duration(end.diff(now))
    const days = duration.asDays()
    return days ? Math.ceil(days) : ''
  }
  return null
}

export default getDauerBisFristMitarbeiter
