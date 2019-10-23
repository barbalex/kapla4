import React from 'react'
import styled from 'styled-components'

import shorten from '../../../src/shortenGegenstandField'

const StyledRow = styled.div`
  display: flex;
  padding: 3px;
  background-color: ${props =>
    props.shaded ? 'rgba(0, 0, 0, 0.05)' : 'inherit'};
`
const FieldBold = styled.div`
  font-weight: 700;
`
const FieldVerticallyStacked = styled.div`
  padding-top: 5px;
`
const StyledId = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 65px;
  max-width: 65px;
`
const StyledGegenstand = styled.div`
  flex: 1;
  padding: 2px;
  width: calc(100% - 355px);
`
const StyledStatus = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 140px;
  max-width: 140px;
`
const StyledKontakt = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 100px;
  max-width: 100px;
`

function isOdd(num) {
  return num % 2
}

const PageFristenRows = ({ geschaeft, rowIndex }) => {
  const fristMitarbeiter = geschaeft.fristMitarbeiter
    ? `Frist: ${geschaeft.fristMitarbeiter}`
    : ''
  /**
   * need to enforce max string length
   * if a field contains more text than fits on a page
   * the page is (re-)created infinitely...
   */
  const totalString = `
    ${geschaeft.gegenstand || ''}
    ${geschaeft.ausloeser || ''}
    ${geschaeft.details || ''}
    ${geschaeft.naechsterSchritt || ''}
  `
  const maxStringLength = totalString.length > 2000 ? 700 : 2000
  const gegenstand = shorten(geschaeft.gegenstand, '', maxStringLength)
  const ausloeser = shorten(geschaeft.ausloeser, 'Auslöser', maxStringLength)
  const naechsterSchritt = shorten(
    geschaeft.naechsterSchritt,
    'Nächster Schritt',
    maxStringLength,
  )
  const details = shorten(geschaeft.details, 'Details', maxStringLength)
  const faelligkeitText = shorten(geschaeft.faelligkeitText, '', 200)

  const shaded = !isOdd(rowIndex)
  const verantwortlichName = `${geschaeft.verantwortlichName}${
    geschaeft.verantwortlich ? ` (${geschaeft.verantwortlich})` : ''
  }`

  return (
    <StyledRow key={geschaeft.idGeschaeft} shaded={shaded}>
      <StyledId>
        <FieldBold>{geschaeft.idGeschaeft}</FieldBold>
        {geschaeft.entscheidKr && (
          <FieldVerticallyStacked>
            {geschaeft.entscheidKr}
          </FieldVerticallyStacked>
        )}
      </StyledId>
      <StyledGegenstand>
        <FieldBold>{gegenstand}</FieldBold>
        {ausloeser && (
          <FieldVerticallyStacked>{ausloeser}</FieldVerticallyStacked>
        )}
        {details && <FieldVerticallyStacked>{details}</FieldVerticallyStacked>}
        {naechsterSchritt && (
          <FieldVerticallyStacked>{naechsterSchritt}</FieldVerticallyStacked>
        )}
      </StyledGegenstand>
      <StyledStatus>
        <FieldBold>{geschaeft.status}</FieldBold>
        <FieldVerticallyStacked>{fristMitarbeiter}</FieldVerticallyStacked>
        <FieldVerticallyStacked>{faelligkeitText}</FieldVerticallyStacked>
      </StyledStatus>
      <StyledKontakt>
        <FieldBold>{verantwortlichName}</FieldBold>
      </StyledKontakt>
    </StyledRow>
  )
}

export default PageFristenRows
