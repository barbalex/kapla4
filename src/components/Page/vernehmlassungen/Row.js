import React, { useMemo, useContext } from 'react'
import styled from 'styled-components'

import shorten from '../../../src/shortenGegenstandField'
import getVornameNameForVerantwortlich from '../../../src/getVornameNameForVerantwortlich'
import storeContext from '../../../storeContext'

const Row = styled.div`
  display: flex;
  padding: 3px;
  border-bottom: 1px solid #bbbbbb;
  background-color: ${props =>
    props.shaded ? 'rgba(0, 0, 0, 0.05)' : 'inherit'};
  /* get background colors to show */
  @media print {
    -webkit-print-color-adjust: exact;
  }
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
  width: calc(100% - 290px);
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
const BoldField = styled.div`
  font-weight: 700;
`
const VerticallyStackedFields = styled.div`
  padding-top: 5px;
`

const isOdd = num => num % 2

const PageVernehmlassungenRows = ({ geschaeft, rowIndex }) => {
  const store = useContext(storeContext)
  const { interneOptions, geko } = store.geschaefte

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
    ${geschaeft.vermerk || ''}
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
  const vermerk = shorten(geschaeft.vermerk, 'Vermerk', maxStringLength)

  const faelligkeitText = useMemo(() => {
    let fT = geschaeft.faelligkeitText
    if (fT && fT.length > maxStringLength) {
      fT = fT.substring(0, maxStringLength)
      fT += '... (Text gekürzt)'
    }
    return fT
  }, [geschaeft.faelligkeitText, maxStringLength])

  const shaded = !isOdd(rowIndex)
  const gekoValue = geko
    .filter(gko => gko.idGeschaeft === geschaeft.idGeschaeft)
    .map(g => g.gekoNr)
    .map(val => <div key={val}>{val}</div>)
  const verantwortlichNameName = getVornameNameForVerantwortlich(
    interneOptions,
    geschaeft.verantwortlich,
  )
  const verantwortlichName = `${verantwortlichNameName}${
    geschaeft.verantwortlich ? ` (${geschaeft.verantwortlich})` : ''
  }`

  return (
    <Row key={geschaeft.idGeschaeft} shaded={shaded}>
      <StyledId>
        <BoldField>{geschaeft.idGeschaeft}</BoldField>
        {gekoValue.length > 0 && (
          <VerticallyStackedFields>{gekoValue}</VerticallyStackedFields>
        )}
      </StyledId>
      <StyledGegenstand>
        <BoldField>{gegenstand}</BoldField>
        {ausloeser && (
          <VerticallyStackedFields>{ausloeser}</VerticallyStackedFields>
        )}
        {details && (
          <VerticallyStackedFields>{details}</VerticallyStackedFields>
        )}
        {vermerk && (
          <VerticallyStackedFields>{vermerk}</VerticallyStackedFields>
        )}
        {naechsterSchritt && (
          <VerticallyStackedFields>{naechsterSchritt}</VerticallyStackedFields>
        )}
      </StyledGegenstand>
      <StyledStatus>
        <BoldField>{geschaeft.status}</BoldField>
        {fristMitarbeiter && (
          <VerticallyStackedFields>{fristMitarbeiter}</VerticallyStackedFields>
        )}
        {faelligkeitText && (
          <VerticallyStackedFields>{faelligkeitText}</VerticallyStackedFields>
        )}
      </StyledStatus>
      <StyledKontakt>
        <BoldField>{verantwortlichName}</BoldField>
        {geschaeft.abteilung && (
          <VerticallyStackedFields>
            {geschaeft.abteilung}
          </VerticallyStackedFields>
        )}
      </StyledKontakt>
    </Row>
  )
}

export default PageVernehmlassungenRows
