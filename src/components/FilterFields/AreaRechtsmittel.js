import React, { useContext } from 'react'
import { Label, Input, InputGroup } from 'reactstrap'
import moment from 'moment'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ErrorBoundary from '../shared/ErrorBoundary'
import ComparatorSelector from './ComparatorSelector'
import createOptions from '../../src/createOptions'
import Date from './Date'
import InputCompoment from './Input'
import storeContext from '../../storeContext'

moment.locale('de')

const Container = styled.div`
  grid-area: areaForGeschaeftsart;
  background-color: white;
  box-shadow: inset 1em 1em 2em rgb(255, 237, 199),
    inset -1em -1em 2em rgb(255, 237, 199);
  outline: 1px solid #efefef;
  display: grid;
  grid-template-columns: calc((100% - 8px) * 0.4) calc((100% - 8px) * 0.6);
  grid-template-rows: auto;
  grid-template-areas:
    'areaRechtsmittelTitle areaRechtsmittelTitle' 'fieldInstanz fieldInstanz' 'fieldEntscheidNr fieldEntscheidDatum'
    'fieldErledigung fieldErledigung' 'fieldRechtsmittelTxt fieldRechtsmittelTxt';
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  padding: 8px;
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
const StyledLabel = styled(Label)`
  font-size: 12px;
  color: #757575;
  margin: 0 0 -2px 0;
`

const AreaRechtsmittel = ({
  values,
  firstTabIndex,
  change,
  changeComparator,
}) => {
  const store = useContext(storeContext)

  return (
    <ErrorBoundary>
      <Container>
        <Title>Rekurs / Beschwerde</Title>
        <FieldInstanz>
          <StyledLabel>Instanz</StyledLabel>
          <InputGroup>
            <ComparatorSelector
              name="rechtsmittelInstanz"
              changeComparator={changeComparator}
              radiusLeft={4}
            />
            <Input
              type="select"
              value={values.rechtsmittelInstanz || ''}
              name="rechtsmittelInstanz"
              onChange={change}
              tabIndex={1 + firstTabIndex}
            >
              {createOptions(store.geschaefte.rechtsmittelInstanzOptions)}
            </Input>
          </InputGroup>
        </FieldInstanz>
        <FieldEntscheidNr>
          <StyledLabel>Entscheid Nr.</StyledLabel>
          <InputGroup>
            <ComparatorSelector
              name="rechtsmittelEntscheidNr"
              changeComparator={changeComparator}
              radiusLeft={4}
            />
            <Input
              type="text"
              value={values.rechtsmittelEntscheidNr || ''}
              name="rechtsmittelEntscheidNr"
              onChange={change}
              tabIndex={2 + firstTabIndex}
            />
          </InputGroup>
        </FieldEntscheidNr>
        <FieldEntscheidDatum>
          <Date
            name="rechtsmittelEntscheidDatum"
            label="Entscheid Datum"
            tabIndex={3 + firstTabIndex}
            values={values}
            change={change}
            changeComparator={changeComparator}
          />
        </FieldEntscheidDatum>
        <FieldErledigung>
          <StyledLabel>Erledigung</StyledLabel>
          <InputGroup>
            <ComparatorSelector
              name="rechtsmittelErledigung"
              changeComparator={changeComparator}
              radiusLeft={4}
            />
            <Input
              type="select"
              value={values.rechtsmittelErledigung || ''}
              name="rechtsmittelErledigung"
              onChange={change}
              tabIndex={4 + firstTabIndex}
            >
              {createOptions(store.geschaefte.rechtsmittelErledigungOptions)}
            </Input>
          </InputGroup>
        </FieldErledigung>
        <FieldRechtsmittelTxt>
          <StyledLabel>Bemerkungen</StyledLabel>
          <InputCompoment
            name="rechtsmittelTxt"
            change={change}
            values={values}
            changeComparator={changeComparator}
            tabIndex={5 + firstTabIndex}
          />
        </FieldRechtsmittelTxt>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaRechtsmittel)
