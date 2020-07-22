import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Label } from 'reactstrap'

import ErrorBoundary from '../../shared/ErrorBoundary'
import storeContext from '../../../storeContext'

const Container = styled.div`
  grid-area: areaGeschaeft;
  background-color: white;
  display: grid;
  grid-template-columns: repeat(12, calc((100% - 55px) / 12));
  grid-template-rows: auto;
  grid-template-areas:
    'areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle'
    'fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand'
    'fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser'
    'fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt'
    'fieldGeschaeftsart fieldGeschaeftsart fieldGeschaeftsart fieldGeschaeftsart fieldGeschaeftsart fieldStatus fieldStatus fieldStatus fieldStatus fieldStatus fieldAbteilung fieldAbteilung'
    'fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails'
    'fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt'
    'fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk'
    'fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern';
  grid-column-gap: 5px;
  grid-row-gap: 2px;
  padding: 8px;
  border: thin solid #ccc;
  border-bottom: none;
  border-left: none;
  border-top: none;
  border-collapse: collapse;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaGeschaeftTitle;
`
const Ausloeser = styled.div`
  grid-area: fieldAusloeser;
`
const Ort = styled.div`
  grid-area: fieldOrt;
`
const Geschaeftsart = styled.div`
  grid-area: fieldGeschaeftsart;
`
const Gegenstand = styled.div`
  grid-area: fieldGegenstand;
`
const Details = styled.div`
  grid-area: fieldDetails;
  max-height: 250px;
`
const Status = styled.div`
  grid-area: fieldStatus;
`
const Abteilung = styled.div`
  grid-area: fieldAbteilung;
`
const NaechsterSchritt = styled.div`
  grid-area: fieldNaechsterSchritt;
`
const Vermerk = styled.div`
  grid-area: fieldVermerk;
  max-height: 250px;
`
const NonRowLabel = styled(Label)`
  margin-bottom: -2px;
  color: #757575;
  font-size: 12px;
  font-weight: 500;
`
const PdfField = styled.div`
  ${(props) =>
    props['data-fontsize'] &&
    `font-size: ${props['data-fontsize']}px !important;`}
  border-bottom: thin solid #ccc;
  padding-bottom: 3px;
  margin-bottom: 5px;
`

const fontsizeFromValLength = (length) =>
  length < 400
    ? 13
    : length < 700
    ? 12
    : length < 1000
    ? 11
    : length < 1500
    ? 10
    : length < 2000
    ? 9
    : length < 2500
    ? 8
    : 7

const AreaGeschaeft = ({ saveToDb, nrOfGFields, viewIsNarrow }) => {
  const store = useContext(storeContext)
  const { activeId, geschaefteFilteredAndSorted: geschaefte } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}

  return (
    <ErrorBoundary>
      <Container>
        <Title>Geschäft</Title>
        {!!geschaeft.gegenstand && (
          <Gegenstand>
            <NonRowLabel>Gegenstand</NonRowLabel>
            <PdfField
              data-fontsize={fontsizeFromValLength(geschaeft.gegenstand.length)}
            >
              {geschaeft.gegenstand}
            </PdfField>
          </Gegenstand>
        )}
        {!!geschaeft.ausloeser && (
          <Ausloeser>
            <NonRowLabel>Auslöser</NonRowLabel>
            <PdfField
              data-fontsize={fontsizeFromValLength(geschaeft.ausloeser.length)}
            >
              {geschaeft.ausloeser}
            </PdfField>
          </Ausloeser>
        )}
        {!!geschaeft.ort && (
          <Ort>
            <NonRowLabel>Ort</NonRowLabel>
            <PdfField
              data-fontsize={fontsizeFromValLength(geschaeft.ort.length)}
            >
              {geschaeft.ort}
            </PdfField>
          </Ort>
        )}
        {!!geschaeft.geschaeftsart && (
          <Geschaeftsart>
            <NonRowLabel>Geschäftsart</NonRowLabel>
            <PdfField
              data-fontsize={fontsizeFromValLength(
                geschaeft.geschaeftsart.length,
              )}
            >
              {geschaeft.geschaeftsart}
            </PdfField>
          </Geschaeftsart>
        )}
        {!!geschaeft.status && (
          <Status>
            <NonRowLabel>Status</NonRowLabel>
            <PdfField
              data-fontsize={fontsizeFromValLength(geschaeft.status.length)}
            >
              {geschaeft.status}
            </PdfField>
          </Status>
        )}
        {!!geschaeft.abteilung && (
          <Abteilung>
            <NonRowLabel>Abteilung</NonRowLabel>
            <PdfField
              data-fontsize={fontsizeFromValLength(geschaeft.abteilung.length)}
            >
              {geschaeft.abteilung}
            </PdfField>
          </Abteilung>
        )}
        {!!geschaeft.details && (
          <Details>
            <NonRowLabel>Details</NonRowLabel>
            <PdfField
              data-fontsize={fontsizeFromValLength(geschaeft.details.length)}
            >
              {geschaeft.details}
            </PdfField>
          </Details>
        )}
        {!!geschaeft.naechsterSchritt && (
          <NaechsterSchritt>
            <NonRowLabel>Nächster Schritt</NonRowLabel>
            <PdfField
              data-fontsize={fontsizeFromValLength(
                geschaeft.naechsterSchritt.length,
              )}
            >
              {geschaeft.naechsterSchritt}
            </PdfField>
          </NaechsterSchritt>
        )}
        {!!geschaeft.vermerk && (
          <Vermerk>
            <NonRowLabel>Vermerk</NonRowLabel>
            <PdfField
              data-fontsize={fontsizeFromValLength(geschaeft.vermerk.length)}
            >
              {geschaeft.vermerk}
            </PdfField>
          </Vermerk>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaGeschaeft)
