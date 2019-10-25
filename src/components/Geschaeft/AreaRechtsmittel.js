import React, { useContext } from 'react'
import { FormControl, ControlLabel } from 'react-bootstrap'
import Textarea from 'react-textarea-autosize'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import DateField from './DateField'
import storeContext from '../../storeContext'
import createOptions from '../../src/createOptions'

const Container = styled.div`
  grid-area: areaForGeschaeftsart;
  background-color: rgb(255, 237, 199);
  display: grid;
  grid-template-columns: ${props =>
    props['data-ispdf']
      ? 'calc((100% - 8px) * 0.4) calc((100% - 8px) * 0.6)'
      : 'calc(100% - 138px) 130px'};
  grid-template-rows: auto;
  grid-template-areas:
    'areaRechtsmittelTitle areaRechtsmittelTitle' 'fieldInstanz fieldInstanz' 'fieldEntscheidNr fieldEntscheidDatum'
    'fieldErledigung fieldErledigung' 'fieldRechtsmittelTxt fieldRechtsmittelTxt';
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  padding: 8px;
  border: ${props => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
  border-left: none;
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
const StyledTextarea = styled(Textarea)`
  display: block;
  width: 100%;
  padding: 6px 12px;
  line-height: 1.42857143;
  color: #555;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  &:focus {
    border-color: #66afe9;
    outline: 0;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(102, 175, 233, 0.6);
  }
`

const AreaRechtsmittel = ({
  nrOfFieldsBeforePv,
  change,
  blur,
  onChangeDatePicker,
}) => {
  const store = useContext(storeContext)
  const {
    activeId,
    geschaeftePlusFilteredAndSorted: geschaefte,
    rechtsmittelErledigungOptions,
    rechtsmittelInstanzOptions,
  } = store.geschaefte
  const path = store.history.location.pathname
  const isPdf = path === '/geschaeftPdf'
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}

  return (
    <Container data-ispdf={isPdf}>
      <Title>Rekurs / Beschwerde</Title>
      {!(isPdf && !geschaeft.rechtsmittelInstanz) && (
        <FieldInstanz>
          <ControlLabel>Instanz</ControlLabel>
          <FormControl
            componentClass="select"
            value={geschaeft.rechtsmittelInstanz || ''}
            name="rechtsmittelInstanz"
            onChange={change}
            bsSize="small"
            tabIndex={1 + nrOfFieldsBeforePv}
          >
            {createOptions(rechtsmittelInstanzOptions)}
          </FormControl>
        </FieldInstanz>
      )}
      {!(isPdf && !geschaeft.rechtsmittelEntscheidNr) && (
        <FieldEntscheidNr>
          <ControlLabel>Entscheid Nr.</ControlLabel>
          <FormControl
            type="text"
            value={geschaeft.rechtsmittelEntscheidNr || ''}
            name="rechtsmittelEntscheidNr"
            onChange={change}
            onBlur={blur}
            bsSize="small"
            tabIndex={2 + nrOfFieldsBeforePv}
          />
        </FieldEntscheidNr>
      )}
      {!(isPdf && !geschaeft.rechtsmittelEntscheidDatum) && (
        <FieldEntscheidDatum>
          <DateField
            name="rechtsmittelEntscheidDatum"
            label="Entscheid Datum"
            change={change}
            blur={blur}
            onChangeDatePicker={onChangeDatePicker}
            tabIndex={3 + nrOfFieldsBeforePv}
          />
        </FieldEntscheidDatum>
      )}
      {!(isPdf && !geschaeft.rechtsmittelErledigung) && (
        <FieldErledigung>
          <ControlLabel>Erledigung</ControlLabel>
          <FormControl
            componentClass="select"
            value={geschaeft.rechtsmittelErledigung || ''}
            name="rechtsmittelErledigung"
            onChange={change}
            bsSize="small"
            tabIndex={4 + nrOfFieldsBeforePv}
          >
            {createOptions(rechtsmittelErledigungOptions)}
          </FormControl>
        </FieldErledigung>
      )}
      {!(isPdf && !geschaeft.rechtsmittelTxt) && (
        <FieldRechtsmittelTxt>
          <ControlLabel>Bemerkungen</ControlLabel>
          <StyledTextarea
            value={geschaeft.rechtsmittelTxt || ''}
            name="rechtsmittelTxt"
            onChange={change}
            onBlur={blur}
            tabIndex={5 + nrOfFieldsBeforePv}
          />
        </FieldRechtsmittelTxt>
      )}
    </Container>
  )
}

export default observer(AreaRechtsmittel)
