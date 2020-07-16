import React, { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ErrorBoundary from '../shared/ErrorBoundary'
import Date from '../shared/Date'
import Select from '../shared/Select'
import Input from '../shared/Input'
import Textarea from '../shared/Textarea'
import storeContext from '../../storeContext'

const Container = styled.div`
  grid-area: areaForGeschaeftsart;
  background-color: rgb(255, 237, 199);
  display: grid;
  grid-template-columns: calc(100% - 138px) 130px;
  grid-template-rows: auto;
  grid-template-areas:
    'areaRechtsmittelTitle areaRechtsmittelTitle' 'fieldInstanz fieldInstanz' 'fieldEntscheidNr fieldEntscheidDatum'
    'fieldErledigung fieldErledigung' 'fieldRechtsmittelTxt fieldRechtsmittelTxt';
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  padding: 8px;
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

const AreaRechtsmittel = ({
  nrOfFieldsBeforePv,
  saveToDb,
  onChangeDatePicker,
}) => {
  const store = useContext(storeContext)
  const {
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    rechtsmittelErledigungOptions,
    rechtsmittelInstanzOptions,
  } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [geschaeft.idGeschaeft])

  return (
    <ErrorBoundary>
      <Container>
        <Title>Rekurs / Beschwerde</Title>
        <FieldInstanz>
          <Select
            key={`${geschaeft.idGeschaeft}rechtsmittelInstanz`}
            value={geschaeft.rechtsmittelInstanz}
            field="rechtsmittelInstanz"
            label="Instanz"
            options={rechtsmittelInstanzOptions.map((o) => ({
              label: o,
              value: o,
            }))}
            saveToDb={saveToDb}
            error={errors.rechtsmittelInstanz}
            tabIndex={1 + nrOfFieldsBeforePv}
          />
        </FieldInstanz>
        <FieldEntscheidNr>
          <Input
            key={`${geschaeft.idGeschaeft}rechtsmittelEntscheidNr`}
            value={geschaeft.rechtsmittelEntscheidNr}
            field="rechtsmittelEntscheidNr"
            label="Entscheid Nr."
            saveToDb={saveToDb}
            error={errors.rechtsmittelEntscheidNr}
            tabIndex={2 + nrOfFieldsBeforePv}
          />
        </FieldEntscheidNr>
        <FieldEntscheidDatum>
          <Date
            key={`${geschaeft.idGeschaeft}rechtsmittelEntscheidDatum`}
            value={geschaeft.rechtsmittelEntscheidDatum}
            field="rechtsmittelEntscheidDatum"
            label="Entscheid Datum"
            saveToDb={saveToDb}
            error={errors.rechtsmittelEntscheidDatum}
            tabIndex={3 + nrOfFieldsBeforePv}
            popperPlacement="left"
          />
        </FieldEntscheidDatum>
        <FieldErledigung>
          <Select
            key={`${geschaeft.idGeschaeft}rechtsmittelErledigung`}
            value={geschaeft.rechtsmittelErledigung}
            field="rechtsmittelErledigung"
            label="Erledigung"
            options={rechtsmittelErledigungOptions.map((o) => ({
              label: o,
              value: o,
            }))}
            saveToDb={saveToDb}
            error={errors.rechtsmittelErledigung}
            tabIndex={4 + nrOfFieldsBeforePv}
          />
        </FieldErledigung>
        <FieldRechtsmittelTxt>
          <Textarea
            key={`${geschaeft.idGeschaeft}rechtsmittelTxt`}
            value={geschaeft.rechtsmittelTxt}
            field="rechtsmittelTxt"
            label="Bemerkungen"
            saveToDb={saveToDb}
            error={errors.rechtsmittelTxt}
            tabIndex={5 + nrOfFieldsBeforePv}
          />
        </FieldRechtsmittelTxt>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaRechtsmittel)
