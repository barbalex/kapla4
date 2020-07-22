import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

const Container = styled.div`
  background-color: white;
  height: 297mm;
  width: 210mm;
  /* get background colors to show */
  -webkit-print-color-adjust: exact;
  box-shadow: inset 0 0 1px 1px red !important;
`
// without @page the _second_ page printed (!) is A3 in printToPdf
const GlobalStyle = createGlobalStyle`
  @page {
    size: A4 portrait;
  }
`

const GeschaeftPdf = () => (
  <>
    <GlobalStyle />
    <Container className="printer-content">GeschaeftPdf2</Container>
  </>
)

export default GeschaeftPdf
