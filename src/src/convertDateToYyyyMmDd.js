import moment from 'moment'

export default date => {
  // make sure not to convert empty values
  if (!date) return ''
  return moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD')
}
