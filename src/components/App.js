import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import useDetectPrint from 'use-detect-print'
import styled from 'styled-components'

import GeschaefteLayout from './GeschaefteLayout'
import FilterFieldsLayout from './FilterFieldsLayout'
import TableLayout from './TableLayout'
import Navbar from './Navbar'
import Errors from './Errors'
import storeContext from '../storeContext'
import GeschaeftPdf from './GeschaeftPdf'

// need this container to set Error component at bottom left
const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
`

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
  } else if (isPrinting) {
    console.log('printing')
    return <GeschaefteLayout />
  }

  return (
    <Container>
      <Navbar />
      {showGeschaefteLayout && <GeschaefteLayout />}
      {showFilterFieldsLayout && <FilterFieldsLayout />}
      {showTableLayout && <TableLayout />}
      <Errors />
    </Container>
  )
}

export default observer(App)
