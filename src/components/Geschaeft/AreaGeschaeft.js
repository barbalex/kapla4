import React, { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'

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
  border: ${props => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
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
`
const VermerkIntern = styled.div`
  grid-area: fieldVermerkIntern;
`

const AreaGeschaeft = ({
  blur,
  saveToDb,
  change,
  nrOfGFields,
  viewIsNarrow,
}) => {
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
        {!(!geschaeft.ausloeser && isPdf) && (
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
        {!(!geschaeft.ort && isPdf) && (
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
        {!(!geschaeft.geschaeftsart && isPdf) && (
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
        {!(!geschaeft.status && isPdf) && (
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
        {!(!geschaeft.abteilung && isPdf) && (
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
        {!(!geschaeft.details && isPdf) && (
          <Details>
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
        {!(!geschaeft.naechsterSchritt && isPdf) && (
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
        {!(!geschaeft.vermerk && isPdf) && (
          <Vermerk>
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
        {!(!geschaeft.vermerkIntern && isPdf) && (
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
