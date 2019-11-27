import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled, { createGlobalStyle } from 'styled-components'
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
const A4Portrait = createGlobalStyle`
  @page {
    size: A4 portrait;
  }
`
const GlobalStyle = createGlobalStyle`
  @media print {

  /*
  * hide everything BUT what shall be printed
  */
  body * {
    visibility: hidden;
  }

  .printer-content,
  .printer-content * {
    visibility: visible !important;
  }

  .printer-content {
    position: absolute;
    left: 0;
    top: 0;
  }

  /**
  * ensure html and body
  * have no margins, no padding,
  * grow and overflow as needed
  */
  html,
  body,
  #root {
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
    width: auto !important;
    overflow: visible !important;
  }
  }
`

const App = () => {
  const store = useContext(storeContext)
  const { activeId } = store.geschaefte

  const isPrinting = useDetectPrint()
  console.log('App, isPrinting:', isPrinting)

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
      <GlobalStyle />
      <Navbar />
      {showGeschaefteLayout && <GeschaefteLayout />}
      {showFilterFieldsLayout && <FilterFieldsLayout />}
      {showTableLayout && <TableLayout />}
      {showGeschaeftPdf && (
        <>
          <A4Portrait />
          <GeschaeftPdf />
        </>
      )}
      <Errors />
    </Container>
  )
}

export default observer(App)
