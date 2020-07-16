import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import useDetectPrint from 'use-detect-print'
import 'mobx-react-lite/batchingForReactDom'

import GeschaefteLayout from './GeschaefteLayout'
import FilterFieldsLayout from './FilterFieldsLayout'
import TableLayout from './TableLayout'
import Navbar from './Navbar'
import Errors from './Errors'
import storeContext from '../storeContext'
import GeschaeftPdf from './GeschaeftPdf2'

const App = () => {
  const store = useContext(storeContext)

  const isPrinting = useDetectPrint()
  //console.log('App, isPrinting:', isPrinting)

  const location = store.location.toJSON()
  const activeLocation = location[0]
  const showGeschaefteLayout = ['geschaefte', 'pages', 'geschaeftPdf'].includes(
    activeLocation,
  )
  const showFilterFieldsLayout =
    activeLocation === 'filterFields' && !isPrinting
  const showTableLayout = activeLocation === 'table' && !isPrinting

  if (isPrinting && activeLocation === 'geschaeftPdf') {
    console.log('App, directly printing GeschaeftPdf')
    return <GeschaeftPdf />
  }

  return (
    <>
      <Navbar />
      {showGeschaefteLayout && <GeschaefteLayout />}
      {showFilterFieldsLayout && <FilterFieldsLayout />}
      {showTableLayout && <TableLayout />}
      <Errors />
    </>
  )
}

export default observer(App)
