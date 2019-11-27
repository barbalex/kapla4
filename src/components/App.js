import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import useDetectPrint from 'use-detect-print'

import GeschaefteLayout from './GeschaefteLayout'
import FilterFieldsLayout from './FilterFieldsLayout'
import GeschaeftPdf from './GeschaeftPdf'
import TableLayout from './TableLayout'
import Navbar from './Navbar'
import Errors from './Errors'
import storeContext from '../storeContext'

const Container = styled.div`
  height: ${props => (props['data-is-printing'] ? '100%' : '100vh')};
`

const App = () => {
  const store = useContext(storeContext)
  const { activeId } = store.geschaefte

  const isPrinting = useDetectPrint()

  const location = store.location.toJSON()
  const activeLocation = location[0]
  const showGeschaefteLayout =
    ['geschaefte', 'pages', 'geschaeftPdf'].includes(activeLocation) &&
    !isPrinting
  const showFilterFieldsLayout =
    activeLocation === 'filterFields' && !isPrinting
  const showTableLayout = activeLocation === 'table' && !isPrinting
  const showGeschaeftPdf =
    isPrinting && activeLocation === 'geschaeftPdf' && !!activeId

  return (
    <Container data-is-printing={isPrinting}>
      <Navbar />
      {showGeschaefteLayout && <GeschaefteLayout />}
      {showFilterFieldsLayout && <FilterFieldsLayout />}
      {showTableLayout && <TableLayout />}
      {showGeschaeftPdf && <GeschaeftPdf />}
      <Errors />
    </Container>
  )
}

export default observer(App)
