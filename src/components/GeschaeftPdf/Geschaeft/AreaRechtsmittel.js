import React, { useContext } from 'react'
import { Label } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import moment from 'moment'

import ErrorBoundary from '../../shared/ErrorBoundary'
import storeContext from '../../../storeContext'

const Container = styled.div`
  grid-area: areaForGeschaeftsart;
  background-color: rgb(255, 237, 199);
  display: grid;
  grid-template-columns: calc((100% - 8px) * 0.4) calc((100% - 8px) * 0.6);
  grid-template-rows: auto;
  grid-template-areas:
    'areaRechtsmittelTitle areaRechtsmittelTitle' 'fieldInstanz fieldInstanz' 'fieldEntscheidNr fieldEntscheidDatum'
    'fieldErledigung fieldErledigung' 'fieldRechtsmittelTxt fieldRechtsmittelTxt';
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  padding: 8px;
  border: thin solid #ccc;
  border-bottom: none;
  border-left: none;
  border-collapse: collapse;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaRechtsmittelTitle;
`
const FieldInstanz = styled.div`
  grid-area: fieldInstanz;
`
const FieldEntscheidNr = styled.div`
  grid-area: fieldEntscheidNr;
`
const FieldEntscheidDatum = styled.div`
  grid-area: fieldEntscheidDatum;
`
const FieldErledigung = styled.div`
  grid-area: fieldErledigung;
`
const FieldRechtsmittelTxt = styled.div`
  grid-area: fieldRechtsmittelTxt;
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

const AreaRechtsmittel = ({
  nrOfFieldsBeforePv,
  saveToDb,
  onChangeDatePicker,
}) => {
  const store = useContext(storeContext)
  const { activeId, geschaefteFilteredAndSorted: geschaefte } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}

  return (
    <ErrorBoundary>
      <Container>
        <Title>Rekurs / Beschwerde</Title>
        {!!geschaeft.rechtsmittelInstanz && (
          <FieldInstanz>
            <NonRowLabel>Instanz</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.rechtsmittelInstanz.length < 400
                  ? 13
                  : geschaeft.rechtsmittelInstanz.length < 700
                  ? 12
                  : geschaeft.rechtsmittelInstanz.length < 1000
                  ? 11
                  : geschaeft.rechtsmittelInstanz.length < 1500
                  ? 10
                  : geschaeft.rechtsmittelInstanz.length < 2000
                  ? 9
                  : 8
              }
            >
              {geschaeft.rechtsmittelInstanz}
            </PdfField>
          </FieldInstanz>
        )}
        {!!geschaeft.rechtsmittelEntscheidNr && (
          <FieldEntscheidNr>
            <NonRowLabel>Entscheid Nr.</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.rechtsmittelEntscheidNr.length < 400
                  ? 13
                  : geschaeft.rechtsmittelEntscheidNr.length < 700
                  ? 12
                  : geschaeft.rechtsmittelEntscheidNr.length < 1000
                  ? 11
                  : geschaeft.rechtsmittelEntscheidNr.length < 1500
                  ? 10
                  : geschaeft.rechtsmittelEntscheidNr.length < 2000
                  ? 9
                  : 8
              }
            >
              {geschaeft.rechtsmittelEntscheidNr}
            </PdfField>
          </FieldEntscheidNr>
        )}
        {!!geschaeft.rechtsmittelEntscheidDatum && (
          <FieldEntscheidDatum>
            <NonRowLabel>Entscheid Datum</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.rechtsmittelEntscheidDatum.length < 400
                  ? 13
                  : geschaeft.rechtsmittelEntscheidDatum.length < 700
                  ? 12
                  : geschaeft.rechtsmittelEntscheidDatum.length < 1000
                  ? 11
                  : geschaeft.rechtsmittelEntscheidDatum.length < 1500
                  ? 10
                  : geschaeft.rechtsmittelEntscheidDatum.length < 2000
                  ? 9
                  : 8
              }
            >
              {moment(
                geschaeft.rechtsmittelEntscheidDatum,
                'DD.MM.YYYY',
              ).format('DD.MM.YYYY')}
            </PdfField>
          </FieldEntscheidDatum>
        )}
        {!!geschaeft.rechtsmittelErledigung && (
          <FieldErledigung>
            <NonRowLabel>Erledigung</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.rechtsmittelErledigung.length < 400
                  ? 13
                  : geschaeft.rechtsmittelErledigung.length < 700
                  ? 12
                  : geschaeft.rechtsmittelErledigung.length < 1000
                  ? 11
                  : geschaeft.rechtsmittelErledigung.length < 1500
                  ? 10
                  : geschaeft.rechtsmittelErledigung.length < 2000
                  ? 9
                  : 8
              }
            >
              {geschaeft.rechtsmittelErledigung}
            </PdfField>
          </FieldErledigung>
        )}
        {!!geschaeft.rechtsmittelTxt && (
          <FieldRechtsmittelTxt>
            <NonRowLabel>Bemerkungen</NonRowLabel>
            <PdfField
              data-fontsize={
                geschaeft.rechtsmittelTxt.length < 400
                  ? 13
                  : geschaeft.rechtsmittelTxt.length < 700
                  ? 12
                  : geschaeft.rechtsmittelTxt.length < 1000
                  ? 11
                  : geschaeft.rechtsmittelTxt.length < 1500
                  ? 10
                  : geschaeft.rechtsmittelTxt.length < 2000
                  ? 9
                  : 8
              }
            >
              {geschaeft.rechtsmittelTxt}
            </PdfField>
          </FieldRechtsmittelTxt>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaRechtsmittel)
