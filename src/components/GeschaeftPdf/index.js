import React from 'react'
import moment from 'moment'
import styled, { createGlobalStyle } from 'styled-components'

import Geschaeft from './Geschaeft'

// https://github.com/twbs/bootstrap/issues/25629#issuecomment-606619398
const GlobalStyle = createGlobalStyle`
  @page {
    size: auto;
  }
`
/*
 * need defined height and overflow
 * to make the pages scrollable in UI
 * is removed in print
 */
const Container = styled.div`
  background-color: #eee;
  font-size: 9pt;
  cursor: default;
  overflow-y: auto;
  height: 100vh;

  & div {
    background-color: white !important;
  }
  & * {
    background-color: transparent !important;
  }
  & input,
  & textarea,
  & select {
    -webkit-appearance: none;
    border: none;
    border-bottom: thin solid #ccc;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    overflow-y: visible;
  }
  & .form-control {
    height: auto;
  }
  & .input-group-addon {
    display: none;
  }

  @media print {
    /* remove grey backgrond set for nice UI */
    background-color: #fff;
    /* with overflow auto an empty page is inserted between each page */
    overflow-y: visible;
    height: 297mm;
    width: 210mm;
    /* make sure body grows as needed */
    /*height: auto !important;*/

    page-break-inside: avoid;
    page-break-before: avoid;
    page-break-after: avoid;
  }
`
const PageContainer = styled.div`
  /* this part is for when page preview is shown */
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: 1cm auto;
  /* Define a white paper background that sticks out from the darker overall background */
  background: #fff;
  /* Show a drop shadow beneath each page */
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  /* set dimensions */
  height: 297mm;
  width: 210mm;
  padding: 10mm;

  overflow-y: visible;

  @media print {
    margin: 0 !important;
    padding: 10mm !important;
    overflow-y: hidden !important;
    /* get background colors to show */
    -webkit-print-color-adjust: exact;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`
const Footer = styled.div`
  padding-top: 5px;
  @media print {
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`

const GeschaeftPdf = () => (
  <Container className="printer-content">
    <GlobalStyle />
    <PageContainer>
      <Geschaeft />
      <Footer>{moment().format('DD.MM.YYYY')}</Footer>
    </PageContainer>
  </Container>
)

export default GeschaeftPdf
