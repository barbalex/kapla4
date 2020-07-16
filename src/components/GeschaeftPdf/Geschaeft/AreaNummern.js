import React, { useContext, useState, useEffect } from 'react'
import { Label } from 'reactstrap'
//import Textarea from 'react-textarea-autosize'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../shared/ErrorBoundary'
import GekoNrField from './GekoNrField'
import storeContext from '../../../storeContext'
import Select from '../../shared/Select'
import Input from '../../shared/Input'

const ContainerBase = styled.div`
  grid-area: areaNummern;
  display: grid;
  grid-template-rows: auto;
  padding: 8px;
`
const ContainerView = styled(ContainerBase)`
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
const ContainerPrint = styled(ContainerBase)`
  /* can't use 1fr for first column - does not work correctly, no idea why */
  /*grid-template-columns: calc(100% - 151px) 8px 105px 8px 30px;*/
  grid-template-columns: 1fr 8px 105px;
  grid-template-areas:
    'areaNummernTitle areaNummernTitle areaNummernTitle'
    '. . labelNr'
    'labelIdGeschaeft . fieldIdGeschaeft'
    'labelGekoNr . fieldGekoNr' '. . .'
    'labelEntscheidAwel .fieldEntscheidAwel'
    'labelEntscheidBdv . fieldEntscheidBdv'
    'labelEntscheidRrb . fieldEntscheidRrb'
    'labelEntscheidBvv . fieldEntscheidBvv'
    'labelEntscheidKr . fieldEntscheidKr'
    'labelAktennummer . fieldAktennummer'
    'labelAktenstandort . fieldAktenstandort';
  border: none;
  border-collapse: collapse;
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
  margin-top: ${(props) => (props['data-ispdf'] ? '3px' : '9px')};
  text-align: right;
  font-size: ${(props) => (props['data-ispdf'] ? '10px !important' : '12px')};
  font-weight: 500;
  color: #757575;
`
const AreaNummernTitle = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaNummernTitle;
`
const Field = styled.div`
  height: ${(props) => (props['data-ispdf'] ? '17px' : 'auto')};
`
const TextareaField = styled.div`
  input {
    ${(props) => props['data-ispdf'] && 'font-size: 10px;'}
  }
`
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
const LabelAktennummer = styled(LabelHorizontal)`
  grid-area: labelAktennummer;
`
const LabelAktenstandort = styled(LabelHorizontal)`
  grid-area: labelAktenstandort;
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
  ${(props) => props['data-ispdf'] && 'height: 17px;'}
`
const FieldAktennummer = styled(Field)`
  grid-area: fieldAktennummer;
  ${(props) => props['data-ispdf'] && 'height: 17px;'}
`
const PdfField = styled.div`
  ${(props) =>
    props['data-fontsize'] &&
    `font-size: ${props['data-fontsize']}px !important;`}
  border-bottom: thin solid #ccc;
  padding-bottom: 3px;
  margin-bottom: 5px;
`

const AreaNummern = ({ viewIsNarrow, nrOfGFields, saveToDb }) => {
  const store = useContext(storeContext)
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const isPdf = activeLocation === 'geschaeftPdf'

  const {
    aktenstandortOptions,
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    gekoOfActiveId,
  } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}
  const tabsToAdd = viewIsNarrow ? 0 : nrOfGFields
  const Container = isPdf ? ContainerPrint : ContainerView
  const gekoValues = gekoOfActiveId.map((g) => g.gekoNr).sort()
  const gekoValuesString = gekoValues.join(', ')
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
        <LabelIdGeschaeft data-ispdf={isPdf}>ID</LabelIdGeschaeft>
        <FieldIdGeschaeft data-ispdf={isPdf}>
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
        {!(isPdf && !gekoValuesString) && (
          <>
            <LabelGekoNr data-ispdf={isPdf}>Geko</LabelGekoNr>
            <FieldGekoNr data-ispdf={isPdf}>
              {isPdf && <PdfField>{gekoValuesString}</PdfField>}
              {!isPdf && <div>{gekoFields}</div>}
            </FieldGekoNr>
          </>
        )}
        {!(isPdf && !geschaeft.entscheidAwel) && (
          <>
            <LabelEntscheidAwel data-ispdf={isPdf}>AWEL</LabelEntscheidAwel>
            <FieldEntscheidAwel data-ispdf={isPdf}>
              <Input
                key={`${geschaeft.idGeschaeft}entscheidAwel`}
                value={geschaeft.entscheidAwel}
                field="entscheidAwel"
                saveToDb={saveToDb}
                error={errors.entscheidAwel}
                tabIndex={2 + tabsToAdd}
              />
            </FieldEntscheidAwel>
          </>
        )}
        {!(isPdf && !geschaeft.entscheidBdv) && (
          <>
            <LabelEntscheidBdv data-ispdf={isPdf}>BDV</LabelEntscheidBdv>
            <FieldEntscheidBdv data-ispdf={isPdf}>
              <Input
                key={`${geschaeft.idGeschaeft}entscheidBdv`}
                value={geschaeft.entscheidBdv}
                field="entscheidBdv"
                saveToDb={saveToDb}
                error={errors.entscheidBdv}
                tabIndex={4 + tabsToAdd}
              />
            </FieldEntscheidBdv>
          </>
        )}
        {!(isPdf && !geschaeft.entscheidRrb) && (
          <>
            <LabelEntscheidRrb data-ispdf={isPdf}>RRB</LabelEntscheidRrb>
            <FieldEntscheidRrb data-ispdf={isPdf}>
              <Input
                key={`${geschaeft.idGeschaeft}entscheidRrb`}
                value={geschaeft.entscheidRrb}
                field="entscheidRrb"
                saveToDb={saveToDb}
                error={errors.entscheidRrb}
                tabIndex={6 + tabsToAdd}
              />
            </FieldEntscheidRrb>
          </>
        )}
        {!(isPdf && !geschaeft.entscheidBvv) && (
          <>
            <LabelEntscheidBvv data-ispdf={isPdf}>BVV</LabelEntscheidBvv>
            <FieldEntscheidBvv data-ispdf={isPdf}>
              <Input
                key={`${geschaeft.idGeschaeft}entscheidBvv`}
                value={geschaeft.entscheidBvv}
                field="entscheidBvv"
                saveToDb={saveToDb}
                error={errors.entscheidBvv}
                tabIndex={8 + tabsToAdd}
              />
            </FieldEntscheidBvv>
          </>
        )}
        {!(isPdf && !geschaeft.entscheidKr) && (
          <>
            <LabelEntscheidKr data-ispdf={isPdf}>KR</LabelEntscheidKr>
            <FieldEntscheidKr data-ispdf={isPdf}>
              <Input
                key={`${geschaeft.idGeschaeft}entscheidKr`}
                value={geschaeft.entscheidKr}
                field="entscheidKr"
                saveToDb={saveToDb}
                error={errors.entscheidKr}
                tabIndex={10 + tabsToAdd}
              />
            </FieldEntscheidKr>
          </>
        )}
        {!isPdf && (
          <FieldAktenstandort data-ispdf={isPdf}>
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
        )}
        {isPdf && !!geschaeft.aktenstandort && (
          <>
            <LabelAktenstandort data-ispdf={isPdf}>Akten</LabelAktenstandort>
            <FieldAktenstandort data-ispdf={isPdf}>
              <Input
                key={`${geschaeft.idGeschaeft}aktenstandort`}
                value={geschaeft.aktenstandort}
                field="aktenstandort"
                saveToDb={saveToDb}
                error={errors.aktenstandort}
                tabIndex={12 + tabsToAdd}
              />
            </FieldAktenstandort>
          </>
        )}
        {!isPdf && (
          <FieldAktennummer data-ispdf={isPdf}>
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
        )}
        {isPdf && !!geschaeft.aktennummer && (
          <>
            <LabelAktennummer data-ispdf={isPdf}>Akt.Nr.</LabelAktennummer>
            <FieldAktennummer data-ispdf={isPdf}>
              <Input
                key={`${geschaeft.idGeschaeft}aktennummer`}
                value={geschaeft.aktennummer}
                field="aktennummer"
                saveToDb={saveToDb}
                error={errors.aktennummer}
                tabIndex={13 + tabsToAdd}
              />
            </FieldAktennummer>
          </>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaNummern)
