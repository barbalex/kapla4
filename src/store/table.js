import { extendObservable } from 'mobx'

import tableStandardState from '../src/tableStandardState'

const table = {}
extendObservable(table, tableStandardState)

export default table
