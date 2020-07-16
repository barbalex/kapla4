import React, { useContext, useState, useEffect } from 'react'
import { Label } from 'reactstrap'
//import Textarea from 'react-textarea-autosize'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary'
import GekoNrField from './GekoNrField'
import storeContext from '../../storeContext'
import Select from '../shared/Select'
import Input from '../shared/Input'

const Container = styled.div`
  grid-area: areaNummern;
  display: grid;
  grid-template-rows: auto;
  padding: 8px;
  background-color: rgba(239, 239, 239, 1);
  grid-template-columns: 1fr 8px 120px;
  grid-template-areas:
    'areaNummernTitle areaNummernTitle labelNr'
    'labelIdGeschaeft . fieldIdGeschaeft'
    'labelGekoNr . fieldGekoNr'
    'labelEntscheidAwel . fieldEntscheidAwel'
    'labelEntscheidBdv . fieldEntscheidBdv'
    'labelEntscheidRrb . fieldEntscheidRrb'
    'labelEntscheidBvv . fieldEntscheidBvv'
    'labelEntscheidKr . fieldEntscheidKr'
    'fieldAktenstandort . fieldAktennummer';
  grid-row-gap: 2px;
`
const LabelNr = styled(Label)`
  grid-area: labelNr;
  position: relative;
  min-height: 16px;
  margin-bottom: -2px;
  font-size: 12px;
  font-weight: 500;
`
const LabelNrDiv = styled.div`
  position: absolute;
  bottom: 1px;
`
const LabelHorizontal = styled(Label)`
  margin-top: 9px;
  text-align: right;
  font-size: 12px;
  font-weight: 500;
  color: #757575;
`
const AreaNummernTitle = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaNummernTitle;
`
const Field = styled.div`
  height: auto;
`
const TextareaField = styled.div``
const FieldIdGeschaeft = styled(Field)`
  grid-area: fieldIdGeschaeft;
`
const LabelIdGeschaeft = styled(LabelHorizontal)`
  grid-area: labelIdGeschaeft;
`
const FieldGekoNr = styled(TextareaField)`
  grid-area: fieldGekoNr;
`
const LabelGekoNr = styled(LabelHorizontal)`
  grid-area: labelGekoNr;
`
const FieldEntscheidAwel = styled(Field)`
  grid-area: fieldEntscheidAwel;
`
const LabelEntscheidAwel = styled(LabelHorizontal)`
  grid-area: labelEntscheidAwel;
`
const FieldEntscheidBdv = styled(Field)`
  grid-area: fieldEntscheidBdv;
`
const LabelEntscheidBdv = styled(LabelHorizontal)`
  grid-area: labelEntscheidBdv;
`
const FieldEntscheidKr = styled(Field)`
  grid-area: fieldEntscheidKr;
`
const LabelEntscheidKr = styled(LabelHorizontal)`
  grid-area: labelEntscheidKr;
`
const FieldEntscheidBvv = styled(Field)`
  grid-area: fieldEntscheidBvv;
`
const LabelEntscheidBvv = styled(LabelHorizontal)`
  grid-area: labelEntscheidBvv;
`
const FieldEntscheidRrb = styled(Field)`
  grid-area: fieldEntscheidRrb;
`
const LabelEntscheidRrb = styled(LabelHorizontal)`
  grid-area: labelEntscheidRrb;
`
const FieldAktenstandort = styled(Field)`
  grid-area: fieldAktenstandort;
`
const FieldAktennummer = styled(Field)`
  grid-area: fieldAktennummer;
`

const AreaNummern = ({ viewIsNarrow, nrOfGFields, saveToDb }) => {
  const store = useContext(storeContext)
  const {
    aktenstandortOptions,
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    gekoOfActiveId,
  } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}
  const tabsToAdd = viewIsNarrow ? 0 : nrOfGFields
  const gekoValues = gekoOfActiveId.map((g) => g.gekoNr).sort()
  const gekoFields = gekoValues.map((g) => (
    <GekoNrField
      key={g || 0}
      idGeschaeft={geschaeft.idGeschaeft}
      gekoNr={g}
      tabsToAdd={tabsToAdd}
    />
  ))
  gekoFields.push(
    <GekoNrField
      key={0}
      idGeschaeft={geschaeft.idGeschaeft}
      gekoNr=""
      tabsToAdd={tabsToAdd}
    />,
  )

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [geschaeft.idGeschaeft])

  return (
    <ErrorBoundary>
      <Container>
        <AreaNummernTitle>Nummern</AreaNummernTitle>
        <LabelNr>
          <LabelNrDiv>Nr.</LabelNrDiv>
        </LabelNr>
        <LabelIdGeschaeft>ID</LabelIdGeschaeft>
        <FieldIdGeschaeft>
          <Input
            key={`${geschaeft.idGeschaeft}idGeschaeft`}
            type="number"
            value={geschaeft.idGeschaeft}
            field="idGeschaeft"
            error={errors.idGeschaeft}
            disabled
            background="transparent"
          />
        </FieldIdGeschaeft>
        <LabelGekoNr>Geko</LabelGekoNr>
        <FieldGekoNr>
          <div>{gekoFields}</div>
        </FieldGekoNr>
        <LabelEntscheidAwel>AWEL</LabelEntscheidAwel>
        <FieldEntscheidAwel>
          <Input
            key={`${geschaeft.idGeschaeft}entscheidAwel`}
            value={geschaeft.entscheidAwel}
            field="entscheidAwel"
            saveToDb={saveToDb}
            error={errors.entscheidAwel}
            tabIndex={2 + tabsToAdd}
          />
        </FieldEntscheidAwel>
        <LabelEntscheidBdv>BDV</LabelEntscheidBdv>
        <FieldEntscheidBdv>
          <Input
            key={`${geschaeft.idGeschaeft}entscheidBdv`}
            value={geschaeft.entscheidBdv}
            field="entscheidBdv"
            saveToDb={saveToDb}
            error={errors.entscheidBdv}
            tabIndex={4 + tabsToAdd}
          />
        </FieldEntscheidBdv>
        <LabelEntscheidRrb>RRB</LabelEntscheidRrb>
        <FieldEntscheidRrb>
          <Input
            key={`${geschaeft.idGeschaeft}entscheidRrb`}
            value={geschaeft.entscheidRrb}
            field="entscheidRrb"
            saveToDb={saveToDb}
            error={errors.entscheidRrb}
            tabIndex={6 + tabsToAdd}
          />
        </FieldEntscheidRrb>
        <LabelEntscheidBvv>BVV</LabelEntscheidBvv>
        <FieldEntscheidBvv>
          <Input
            key={`${geschaeft.idGeschaeft}entscheidBvv`}
            value={geschaeft.entscheidBvv}
            field="entscheidBvv"
            saveToDb={saveToDb}
            error={errors.entscheidBvv}
            tabIndex={8 + tabsToAdd}
          />
        </FieldEntscheidBvv>
        <LabelEntscheidKr>KR</LabelEntscheidKr>
        <FieldEntscheidKr>
          <Input
            key={`${geschaeft.idGeschaeft}entscheidKr`}
            value={geschaeft.entscheidKr}
            field="entscheidKr"
            saveToDb={saveToDb}
            error={errors.entscheidKr}
            tabIndex={10 + tabsToAdd}
          />
        </FieldEntscheidKr>
        <FieldAktenstandort>
          <Select
            key={`${geschaeft.idGeschaeft}aktenstandort`}
            value={geschaeft.aktenstandort}
            field="aktenstandort"
            label="Aktenstandort"
            options={aktenstandortOptions.map((o) => ({
              label: o,
              value: o,
            }))}
            saveToDb={saveToDb}
            error={errors.aktenstandort}
            tabIndex={12 + tabsToAdd}
          />
        </FieldAktenstandort>
        <FieldAktennummer>
          <Input
            key={`${geschaeft.idGeschaeft}aktennummer`}
            value={geschaeft.aktennummer}
            field="aktennummer"
            label="Nr."
            saveToDb={saveToDb}
            error={errors.aktennummer}
            tabIndex={13 + tabsToAdd}
            minHeight={38}
          />
        </FieldAktennummer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaNummern)
