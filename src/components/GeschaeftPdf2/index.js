import React from 'react'
import styled from 'styled-components'
/*
 * need defined height and overflow
 * to make the pages scrollable in UI
 * is removed in print
 */
const Container = styled.div`
  background-color: red;
  border: 2px solid black;
  height: 29.7cm;
  width: 21cm;
  /* get background colors to show */
  -webkit-print-color-adjust: exact;
`

const GeschaeftPdf = () => (
  <Container className="printer-content">GeschaeftPdf2</Container>
)

export default GeschaeftPdf
