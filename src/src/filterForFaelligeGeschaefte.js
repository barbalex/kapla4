import moment from 'moment'

export default [
  {
    field: 'fristMitarbeiter',
    value: moment().format('YYYY-MM-DD'),
    comparator: '<=',
  },
  {
    field: 'kannFaelligSein',
    value: true,
    comparator: '===',
  },
]
