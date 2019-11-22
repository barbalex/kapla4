import React, { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import { Label } from 'reactstrap'

import storeContext from '../../storeContext'
import Select from '../shared/Select'
import Input from '../shared/Input'
import Textarea from '../shared/Textarea'

const Container = styled.div`
  grid-area: areaGeschaeft;
  background-color: ${props => (props.isPdf ? 'white' : 'rgb(255, 186, 137)')};
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
  border: ${props => (props['data-ispdf'] ? 'thin solid #ccc' : 'none')};
  border-bottom: none;
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
  ${props => props['data-ispdf'] && 'max-height: 250px;'}
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
  ${props => props['data-ispdf'] && 'max-height: 250px;'}
`
const VermerkIntern = styled.div`
  grid-area: fieldVermerkIntern;
`
const NonRowLabel = styled(Label)`
  margin-bottom: -2px;
  color: #757575;
  font-size: 12px;
  font-weight: 500;
`
const PdfField = styled.div`
  ${props =>
    props['data-fontsize'] &&
    `font-size: ${props['data-fontsize']}px !important;`}
  border-bottom: thin solid #ccc;
  padding-bottom: 3px;
  margin-bottom: 5px;
`

const AreaGeschaeft = ({ saveToDb, nrOfGFields, viewIsNarrow }) => {
  const store = useContext(storeContext)
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const {
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    statusOptions,
    abteilungOptions,
    geschaeftsartOptions,
  } = store.geschaefte
  const isPdf = activeLocation === 'geschaeftPdf'
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}
  const tabsToAdd = viewIsNarrow ? nrOfGFields : 0

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [geschaeft.idGeschaeft])

  return (
    <ErrorBoundary>
      <Container data-ispdf={isPdf}>
        <Title>Geschäft</Title>
        {!isPdf && (
          <Gegenstand>
            <Textarea
              key={`${geschaeft.idGeschaeft}gegenstand`}
              value={geschaeft.gegenstand}
              field="gegenstand"
              label="Gegenstand"
              saveToDb={saveToDb}
              error={errors.gegenstand}
              tabIndex={1 + tabsToAdd}
            />
          </Gegenstand>
        )}
        {isPdf && !!geschaeft.gegenstand && (
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
        {!isPdf && (
          <Ausloeser>
            <Textarea
              key={`${geschaeft.idGeschaeft}ausloeser`}
              value={geschaeft.ausloeser}
              field="ausloeser"
              label="Auslöser"
              saveToDb={saveToDb}
              error={errors.ausloeser}
              tabIndex={2 + tabsToAdd}
            />
          </Ausloeser>
        )}
        {isPdf && !!geschaeft.ausloeser && (
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
        {!isPdf && (
          <Ort>
            <Input
              key={`${geschaeft.idGeschaeft}ort`}
              value={geschaeft.ort}
              field="ort"
              label="Ort"
              saveToDb={saveToDb}
              error={errors.ort}
              tabIndex={3 + tabsToAdd}
            />
          </Ort>
        )}
        {isPdf && !!geschaeft.ort && (
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
        {!isPdf && (
          <Geschaeftsart>
            <Select
              key={`${geschaeft.idGeschaeft}geschaeftsart`}
              value={geschaeft.geschaeftsart}
              field="geschaeftsart"
              label="Geschäftsart"
              options={geschaeftsartOptions.map(o => ({ label: o, value: o }))}
              saveToDb={saveToDb}
              error={errors.geschaeftsart}
              tabIndex={4 + tabsToAdd}
            />
          </Geschaeftsart>
        )}
        {isPdf && !!geschaeft.geschaeftsart && (
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
        {!isPdf && (
          <Status>
            <Select
              key={`${geschaeft.idGeschaeft}status`}
              value={geschaeft.status}
              field="status"
              label="Status"
              options={statusOptions.map(o => ({ label: o, value: o }))}
              saveToDb={saveToDb}
              error={errors.status}
              tabIndex={5 + tabsToAdd}
            />
          </Status>
        )}
        {isPdf && !!geschaeft.status && (
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
        {!isPdf && (
          <Abteilung>
            <Select
              key={`${geschaeft.idGeschaeft}abteilung`}
              value={geschaeft.abteilung}
              field="abteilung"
              label="Abteilung"
              options={abteilungOptions.map(o => ({ label: o, value: o }))}
              saveToDb={saveToDb}
              error={errors.abteilung}
              tabIndex={6 + tabsToAdd}
            />
          </Abteilung>
        )}
        {isPdf && !!geschaeft.abteilung && (
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
        {!isPdf && (
          <Details data-ispdf={isPdf}>
            <Textarea
              key={`${geschaeft.idGeschaeft}details`}
              value={geschaeft.details}
              field="details"
              label="Details"
              saveToDb={saveToDb}
              error={errors.details}
              tabIndex={7 + tabsToAdd}
            />
          </Details>
        )}
        {isPdf && !!geschaeft.details && (
          <Details data-ispdf={isPdf}>
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
        {!isPdf && (
          <NaechsterSchritt>
            <Textarea
              key={`${geschaeft.idGeschaeft}naechsterSchritt`}
              value={geschaeft.naechsterSchritt}
              field="naechsterSchritt"
              label="Nächster Schritt"
              saveToDb={saveToDb}
              error={errors.naechsterSchritt}
              tabIndex={8 + tabsToAdd}
            />
          </NaechsterSchritt>
        )}
        {isPdf && !!geschaeft.naechsterSchritt && (
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
        {!isPdf && (
          <Vermerk data-ispdf={isPdf}>
            <Textarea
              key={`${geschaeft.idGeschaeft}vermerk`}
              value={geschaeft.vermerk}
              field="vermerk"
              label="Vermerk"
              saveToDb={saveToDb}
              error={errors.vermerk}
              tabIndex={9 + tabsToAdd}
            />
          </Vermerk>
        )}
        {isPdf && !!geschaeft.vermerk && (
          <Vermerk data-ispdf={isPdf}>
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
        {!isPdf && (
          <VermerkIntern>
            <Textarea
              key={`${geschaeft.idGeschaeft}vermerkIntern`}
              value={geschaeft.vermerkIntern}
              field="vermerkIntern"
              label="Vermerk intern (in Berichten nicht angezeigt)"
              saveToDb={saveToDb}
              error={errors.vermerkIntern}
              tabIndex={10 + tabsToAdd}
            />
          </VermerkIntern>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaGeschaeft)
