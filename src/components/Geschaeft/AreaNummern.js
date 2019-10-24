import React, { useContext } from 'react'
import { FormControl, ControlLabel } from 'react-bootstrap'
import Textarea from 'react-textarea-autosize'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import GekoNrField from './GekoNrField'
import storeContext from '../../storeContext'

const StyledTextarea = styled(Textarea)`
  display: block;
  width: 100%;
  padding: 6px 12px;
  line-height: 1.42857143;
  color: #555;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
`
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
    'fieldAktenstandort . fieldAktennummer';
  border: 1px solid #ccc;
  border-bottom: none;
  border-left: none;
`
const LabelNr = styled(ControlLabel)`
  grid-area: labelNr;
  position: relative;
  min-height: 16px;
`
const LabelNrDiv = styled.div`
  position: absolute;
  bottom: 1px;
`
// eslint-disable-next-line no-unused-vars
const Slash = styled.div`
  margin-top: ${props => (props['data-ispdf'] ? '-3px' : '2px')};
  font-size: ${props => (props['data-ispdf'] ? '18px' : '22px')};
  height: ${props => (props['data-ispdf'] ? '17px' : 'auto')};
  color: #757575;
  margin-left: 1px;
`
// eslint-disable-next-line no-unused-vars
const SlashBvv = styled(Slash)`
  grid-area: slashBvv;
  margin-top: ${props => (props['data-ispdf'] ? '-7px' : 'inherit')};
  div {
    margin-left: -1px;
  }
`
// eslint-disable-next-line no-unused-vars
const LabelHorizontal = styled(ControlLabel)`
  margin-top: ${props => (props['data-ispdf'] ? '1px' : '9px')};
  text-align: right;
  font-size: ${props => (props['data-ispdf'] ? '10px !important' : '11px')};
  height: ${props => (props['data-ispdf'] ? '17px' : 'auto')};
`
const AreaNummernTitle = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaNummernTitle;
`
// eslint-disable-next-line no-unused-vars
const Field = styled.div`
  height: ${props => (props['data-ispdf'] ? '17px' : 'auto')};
  input {
    font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
  }
`
const TextareaField = styled.div`
  input {
    font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
  }
`
const FieldIdGeschaeft = styled(Field)`
  grid-area: fieldIdGeschaeft;
`
const LabelIdGeschaeft = styled(LabelHorizontal)`
  grid-area: labelIdGeschaeft;
`
const InputIdGeschaeft = styled(FormControl)`
  background: transparent !important;
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
// eslint-disable-next-line no-unused-vars
const FieldAktenstandort = styled(Field)`
  height: ${props => (props['data-ispdf'] ? '29px' : 'auto')};
  grid-area: fieldAktenstandort;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
  select,
  label {
    font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
  }
  select {
    height: ${props => (props['data-ispdf'] ? '15px !important' : '34px')};
    line-height: inherit !important;
  }
`
// eslint-disable-next-line no-unused-vars
const FieldAktennummer = styled(Field)`
  height: ${props => (props['data-ispdf'] ? '29px' : 'auto')};
  grid-area: fieldAktennummer;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
  input,
  label {
    font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
  }
`

const AreaNummern = ({ viewIsNarrow, nrOfGFields, change, blur }) => {
  const store = useContext(storeContext)
  const {
    aktenstandortOptions,
    activeId,
    geschaeftePlusFilteredAndSorted: geschaefte,
    gekoOfActiveId,
  } = store.geschaefte
  const path = store.history.location.pathname
  const isPdf = path === '/geschaeftPdf'
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}
  const tabsToAdd = viewIsNarrow ? 0 : nrOfGFields
  const Container = isPdf ? ContainerPrint : ContainerView
  const gekoValues = gekoOfActiveId.map(g => g.gekoNr).sort()
  const gekoValuesString = gekoValues.join(', ')
  const gekoFields = gekoValues.map(g => (
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

  return (
    <Container>
      <AreaNummernTitle>Nummern</AreaNummernTitle>
      <LabelNr>
        <LabelNrDiv>Nr.</LabelNrDiv>
      </LabelNr>
      <LabelIdGeschaeft data-ispdf={isPdf}>ID</LabelIdGeschaeft>
      <FieldIdGeschaeft data-ispdf={isPdf}>
        <InputIdGeschaeft
          type="number"
          value={geschaeft.idGeschaeft}
          bsSize="small"
          disabled
        />
      </FieldIdGeschaeft>
      {!(isPdf && !gekoValuesString) && (
        <LabelGekoNr data-ispdf={isPdf}>Geko</LabelGekoNr>
      )}
      {!(isPdf && !gekoValuesString) && (
        <FieldGekoNr data-ispdf={isPdf}>
          {isPdf && (
            <StyledTextarea
              value={gekoValuesString}
              name="gekoNr"
              tabIndex={1 + tabsToAdd}
            />
          )}
          {!isPdf && <div>{gekoFields}</div>}
        </FieldGekoNr>
      )}
      {!(isPdf && !geschaeft.entscheidAwel) && (
        <LabelEntscheidAwel data-ispdf={isPdf}>AWEL</LabelEntscheidAwel>
      )}
      {!(isPdf && !geschaeft.entscheidAwel) && (
        <FieldEntscheidAwel data-ispdf={isPdf}>
          <FormControl
            type="text"
            value={geschaeft.entscheidAwel || ''}
            name="entscheidAwel"
            onChange={change}
            onBlur={blur}
            bsSize="small"
            tabIndex={2 + tabsToAdd}
          />
        </FieldEntscheidAwel>
      )}
      {!(isPdf && !geschaeft.entscheidBdv) && (
        <LabelEntscheidBdv data-ispdf={isPdf}>BDV</LabelEntscheidBdv>
      )}
      {!(isPdf && !geschaeft.entscheidBdv) && (
        <FieldEntscheidBdv data-ispdf={isPdf}>
          <FormControl
            value={geschaeft.entscheidBdv || ''}
            name="entscheidBdv"
            onChange={change}
            onBlur={blur}
            bsSize="small"
            tabIndex={4 + tabsToAdd}
          />
        </FieldEntscheidBdv>
      )}
      {!(isPdf && !geschaeft.entscheidRrb) && (
        <LabelEntscheidRrb data-ispdf={isPdf}>RRB</LabelEntscheidRrb>
      )}
      {!(isPdf && !geschaeft.entscheidRrb) && (
        <FieldEntscheidRrb data-ispdf={isPdf}>
          <FormControl
            value={geschaeft.entscheidRrb || ''}
            name="entscheidRrb"
            onChange={change}
            onBlur={blur}
            bsSize="small"
            tabIndex={6 + tabsToAdd}
          />
        </FieldEntscheidRrb>
      )}
      {!(isPdf && !geschaeft.entscheidBvv) && (
        <LabelEntscheidBvv data-ispdf={isPdf}>BVV</LabelEntscheidBvv>
      )}
      {!(isPdf && !geschaeft.entscheidBvv) && (
        <FieldEntscheidBvv data-ispdf={isPdf}>
          <FormControl
            value={geschaeft.entscheidBvv || ''}
            name="entscheidBvv"
            onChange={change}
            onBlur={blur}
            bsSize="small"
            tabIndex={8 + tabsToAdd}
          />
        </FieldEntscheidBvv>
      )}
      {!(isPdf && !geschaeft.entscheidKr) && (
        <LabelEntscheidKr data-ispdf={isPdf}>KR</LabelEntscheidKr>
      )}
      {!(isPdf && !geschaeft.entscheidKr) && (
        <FieldEntscheidKr data-ispdf={isPdf}>
          <FormControl
            value={geschaeft.entscheidKr || ''}
            name="entscheidKr"
            onChange={change}
            onBlur={blur}
            bsSize="small"
            tabIndex={10 + tabsToAdd}
          />
        </FieldEntscheidKr>
      )}
      {!(isPdf && !geschaeft.aktenstandort) && (
        <FieldAktenstandort data-ispdf={isPdf}>
          <ControlLabel>Aktenstandort</ControlLabel>
          <FormControl
            componentClass="select"
            value={geschaeft.aktenstandort || ''}
            name="aktenstandort"
            onChange={change}
            bsSize="small"
            tabIndex={12 + tabsToAdd}
          >
            {aktenstandortOptions}
          </FormControl>
        </FieldAktenstandort>
      )}
      {!(isPdf && !geschaeft.aktenstandort) && (
        <FieldAktennummer data-ispdf={isPdf}>
          <ControlLabel>Nr.</ControlLabel>
          <FormControl
            type="text"
            value={geschaeft.aktennummer || ''}
            name="aktennummer"
            onChange={change}
            onBlur={blur}
            bsSize="small"
            tabIndex={13 + tabsToAdd}
          />
        </FieldAktennummer>
      )}
    </Container>
  )
}

export default observer(AreaNummern)
