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
              data-fontsize={
                geschaeft.gegenstand.length < 400
                  ? 13
                  : geschaeft.gegenstand.length < 700
                  ? 12
                  : geschaeft.gegenstand.length < 1000
                  ? 11
                  : geschaeft.gegenstand.length < 1500
                  ? 10
                  : geschaeft.gegenstand.length < 2000
                  ? 9
                  : 8
              }
            >
              {geschaeft.gegenstand}
            </PdfField>
          </Gegenstand>
        )}
        {!!geschaeft.ausloeser && (
          <Ausloeser>
            <NonRowLabel>Auslöser</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.ausloeser.length < 400
                  ? 13
                  : geschaeft.ausloeser.length < 700
                  ? 12
                  : geschaeft.ausloeser.length < 1000
                  ? 11
                  : geschaeft.ausloeser.length < 1500
                  ? 10
                  : geschaeft.ausloeser.length < 2000
                  ? 9
                  : 8
              }
            >
              {geschaeft.ausloeser}
            </PdfField>
          </Ausloeser>
        )}
        {!!geschaeft.ort && (
          <Ort>
            <NonRowLabel>Ort</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.ort.length < 400
                  ? 13
                  : geschaeft.ort.length < 700
                  ? 12
                  : geschaeft.ort.length < 1000
                  ? 11
                  : geschaeft.ort.length < 1500
                  ? 10
                  : geschaeft.ort.length < 2000
                  ? 9
                  : 8
              }
            >
              {geschaeft.ort}
            </PdfField>
          </Ort>
        )}
        {!!geschaeft.geschaeftsart && (
          <Geschaeftsart>
            <NonRowLabel>Geschäftsart</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.geschaeftsart.length < 400
                  ? 13
                  : geschaeft.geschaeftsart.length < 700
                  ? 12
                  : geschaeft.geschaeftsart.length < 1000
                  ? 11
                  : geschaeft.geschaeftsart.length < 1500
                  ? 10
                  : geschaeft.geschaeftsart.length < 2000
                  ? 9
                  : 8
              }
            >
              {geschaeft.geschaeftsart}
            </PdfField>
          </Geschaeftsart>
        )}
        {!!geschaeft.status && (
          <Status>
            <NonRowLabel>Status</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.status.length < 400
                  ? 13
                  : geschaeft.status.length < 700
                  ? 12
                  : geschaeft.status.length < 1000
                  ? 11
                  : geschaeft.status.length < 1500
                  ? 10
                  : geschaeft.status.length < 2000
                  ? 9
                  : 8
              }
            >
              {geschaeft.status}
            </PdfField>
          </Status>
        )}
        {!!geschaeft.abteilung && (
          <Abteilung>
            <NonRowLabel>Abteilung</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.abteilung.length < 400
                  ? 13
                  : geschaeft.abteilung.length < 700
                  ? 12
                  : geschaeft.abteilung.length < 1000
                  ? 11
                  : geschaeft.abteilung.length < 1500
                  ? 10
                  : geschaeft.abteilung.length < 2000
                  ? 9
                  : 8
              }
            >
              {geschaeft.abteilung}
            </PdfField>
          </Abteilung>
        )}
        {!!geschaeft.details && (
          <Details>
            <NonRowLabel>Details</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.details.length < 400
                  ? 13
                  : geschaeft.details.length < 700
                  ? 12
                  : geschaeft.details.length < 1000
                  ? 11
                  : geschaeft.details.length < 1500
                  ? 10
                  : geschaeft.details.length < 2000
                  ? 9
                  : 8
              }
            >
              {geschaeft.details}
            </PdfField>
          </Details>
        )}
        {!!geschaeft.naechsterSchritt && (
          <NaechsterSchritt>
            <NonRowLabel>Nächster Schritt</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.naechsterSchritt.length < 400
                  ? 13
                  : geschaeft.naechsterSchritt.length < 700
                  ? 12
                  : geschaeft.naechsterSchritt.length < 1000
                  ? 11
                  : geschaeft.naechsterSchritt.length < 1500
                  ? 10
                  : geschaeft.naechsterSchritt.length < 2000
                  ? 9
                  : 8
              }
            >
              {geschaeft.naechsterSchritt}
            </PdfField>
          </NaechsterSchritt>
        )}
        {!!geschaeft.vermerk && (
          <Vermerk>
            <NonRowLabel>Vermerk</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.vermerk.length < 400
                  ? 13
                  : geschaeft.vermerk.length < 700
                  ? 12
                  : geschaeft.vermerk.length < 1000
                  ? 11
                  : geschaeft.vermerk.length < 1500
                  ? 10
                  : geschaeft.vermerk.length < 2000
                  ? 9
                  : 8
              }
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
