import React, { useContext } from 'react'
import { Label } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import moment from 'moment'

import ErrorBoundary from '../../shared/ErrorBoundary'
import storeContext from '../../../storeContext'
import fontSizeFromLength from './fontSizeFromLength'

const Container = styled.div`
  grid-area: areaForGeschaeftsart;
  background-color: rgb(255, 237, 199);
  display: grid;
  grid-template-columns: calc((100% - 8px) * 0.4) calc((100% - 8px) * 0.6);
  grid-template-rows: auto;
  grid-template-areas:
    'areaRechtsmittelTitle areaRechtsmittelTitle' 'fieldInstanz fieldInstanz' 'fieldEntscheidNr fieldEntscheidNr' 'fieldEntscheidDatum fieldEntscheidDatum'
    'fieldErledigung fieldErledigung' 'fieldRechtsmittelTxt fieldRechtsmittelTxt';
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  padding: 8px;
  border-top: thin solid #ccc;
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
              data-fontsize={fontSizeFromLength(
                geschaeft.rechtsmittelInstanz.length,
              )}
            >
              {geschaeft.rechtsmittelInstanz}
            </PdfField>
          </FieldInstanz>
        )}
        {!!geschaeft.rechtsmittelEntscheidNr && (
          <FieldEntscheidNr>
            <NonRowLabel>Entscheid Nr.</NonRowLabel>
            <PdfField
              data-fontsize={fontSizeFromLength(
                geschaeft.rechtsmittelEntscheidNr.length,
              )}
            >
              {geschaeft.rechtsmittelEntscheidNr}
            </PdfField>
          </FieldEntscheidNr>
        )}
        {!!geschaeft.rechtsmittelEntscheidDatum && (
          <FieldEntscheidDatum>
            <NonRowLabel>Entscheid Datum</NonRowLabel>
            <PdfField
              data-fontsize={fontSizeFromLength(
                geschaeft.rechtsmittelEntscheidDatum.length,
              )}
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
              data-fontsize={fontSizeFromLength(
                geschaeft.rechtsmittelErledigung.length,
              )}
            >
              {geschaeft.rechtsmittelErledigung}
            </PdfField>
          </FieldErledigung>
        )}
        {!!geschaeft.rechtsmittelTxt && (
          <FieldRechtsmittelTxt>
            <NonRowLabel>Bemerkungen</NonRowLabel>
            <PdfField
              data-fontsize={fontSizeFromLength(
                geschaeft.rechtsmittelTxt.length,
              )}
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
