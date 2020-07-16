import React, { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ErrorBoundary from '../shared/ErrorBoundary'
import storeContext from '../../storeContext'
import Select from '../shared/Select'
import Input from '../shared/Input'
import Textarea from '../shared/Textarea'

const Container = styled.div`
  grid-area: areaGeschaeft;
  background-color: rgb(255, 186, 137);
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

const AreaGeschaeft = ({ saveToDb, nrOfGFields, viewIsNarrow }) => {
  const store = useContext(storeContext)
  const {
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    statusOptions,
    abteilungOptions,
    geschaeftsartOptions,
  } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}
  const tabsToAdd = viewIsNarrow ? nrOfGFields : 0

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [geschaeft.idGeschaeft])

  return (
    <ErrorBoundary>
      <Container>
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
        <Geschaeftsart>
          <Select
            key={`${geschaeft.idGeschaeft}geschaeftsart`}
            value={geschaeft.geschaeftsart}
            field="geschaeftsart"
            label="Geschäftsart"
            options={geschaeftsartOptions.map((o) => ({
              label: o,
              value: o,
            }))}
            saveToDb={saveToDb}
            error={errors.geschaeftsart}
            tabIndex={4 + tabsToAdd}
          />
        </Geschaeftsart>
        <Status>
          <Select
            key={`${geschaeft.idGeschaeft}status`}
            value={geschaeft.status}
            field="status"
            label="Status"
            options={statusOptions.map((o) => ({ label: o, value: o }))}
            saveToDb={saveToDb}
            error={errors.status}
            tabIndex={5 + tabsToAdd}
          />
        </Status>
        <Abteilung>
          <Select
            key={`${geschaeft.idGeschaeft}abteilung`}
            value={geschaeft.abteilung}
            field="abteilung"
            label="Abteilung"
            options={abteilungOptions.map((o) => ({ label: o, value: o }))}
            saveToDb={saveToDb}
            error={errors.abteilung}
            tabIndex={6 + tabsToAdd}
          />
        </Abteilung>
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
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaGeschaeft)
