import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

const Container = styled.div`
  background-color: red;
  border: 2px solid black;
  height: 29.7cm;
  width: 21cm;
  /* get background colors to show */
  -webkit-print-color-adjust: exact;
`
// without @page the _second_ page printed (!) is A3
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
