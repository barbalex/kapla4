import moment from 'moment'

export default date => {
  if (!date) return true
  return moment(date, 'DD.MM.YYYY').isValid()
}
