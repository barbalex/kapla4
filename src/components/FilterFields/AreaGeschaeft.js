import React, { useContext } from 'react'
import { Label } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ErrorBoundary from '../shared/ErrorBoundary'
import SelectInput from './SelectInput'
import Input from './Input'
import storeContext from '../../storeContext'
import createOptions from '../../src/createOptions'

const Container = styled.div`
  grid-area: areaGeschaeft;
  background-color: white;
  box-shadow: inset 1em 1em 2em rgb(255, 186, 137),
    inset -1em -1em 2em rgb(255, 186, 137);
  outline: 1px solid #efefef;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto;
  grid-template-areas:
    'areaGeschaeftTitle' 'fieldGegenstand' 'fieldAusloeser'
    'fieldOrt' 'fieldGeschaeftsart' 'fieldStatus' 'fieldAbteilung'
    'fieldDetails' 'fieldNaechsterSchritt' 'fieldVermerk' 'fieldVermerkIntern';
  grid-column-gap: 5px;
  grid-row-gap: 2px;
  padding: 8px;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaGeschaeftTitle;
`
const FieldGegenstand = styled.div`
  grid-area: fieldGegenstand;
`
const FieldAusloeser = styled.div`
  grid-area: fieldAusloeser;
`
const FieldOrt = styled.div`
  grid-area: fieldOrt;
`
const FieldGeschaeftsart = styled.div`
  grid-area: fieldGeschaeftsart;
`
const FieldStatus = styled.div`
  grid-area: fieldStatus;
`
const FieldAbteilung = styled.div`
  grid-area: fieldAbteilung;
`
const FieldDetails = styled.div`
  grid-area: fieldDetails;
`
const FieldNaechsterSchritt = styled.div`
  grid-area: fieldNaechsterSchritt;
`
const FieldVermerk = styled.div`
  grid-area: fieldVermerk;
`
const FieldVermerkIntern = styled.div`
  grid-area: fieldVermerkIntern;
`
const StyledLabel = styled(Label)`
  font-size: 12px;
  color: #757575;
  margin: 0 0 -2px 0;
`

const AreaGeschaeft = ({ change, values, firstTabIndex, changeComparator }) => {
  const store = useContext(storeContext)
  const {
    statusOptions,
    geschaeftsartOptions,
    abteilungOptions,
  } = store.geschaefte

  const geschaeftsartOptionsComponent = createOptions(geschaeftsartOptions)

  return (
    <ErrorBoundary>
      <Container>
        <Title>Geschäft</Title>
        <FieldGegenstand>
          <StyledLabel>Gegenstand</StyledLabel>
          <Input
            name="gegenstand"
            change={change}
            values={values}
            changeComparator={changeComparator}
            tabIndex={1 + firstTabIndex}
          />
        </FieldGegenstand>
        <FieldAusloeser>
          <StyledLabel>Auslöser</StyledLabel>
          <Input
            name="ausloeser"
            change={change}
            values={values}
            changeComparator={changeComparator}
            tabIndex={2 + firstTabIndex}
          />
        </FieldAusloeser>
        <FieldOrt>
          <StyledLabel>Ort</StyledLabel>
          <Input
            name="ort"
            change={change}
            values={values}
            changeComparator={changeComparator}
            tabIndex={3 + firstTabIndex}
          />
        </FieldOrt>
        <FieldGeschaeftsart>
          <StyledLabel>Geschäftsart</StyledLabel>
          <SelectInput
            name="geschaeftsart"
            change={change}
            values={values}
            changeComparator={changeComparator}
            tabIndex={4 + firstTabIndex}
            options={geschaeftsartOptionsComponent}
          />
        </FieldGeschaeftsart>
        <FieldStatus>
          <StyledLabel>Status</StyledLabel>
          <SelectInput
            name="status"
            change={change}
            values={values}
            changeComparator={changeComparator}
            tabIndex={5 + firstTabIndex}
            options={createOptions(statusOptions)}
          />
        </FieldStatus>
        <FieldAbteilung>
          <StyledLabel>Abteilung</StyledLabel>
          <SelectInput
            name="abteilung"
            change={change}
            values={values}
            changeComparator={changeComparator}
            tabIndex={6 + firstTabIndex}
            options={createOptions(abteilungOptions)}
          />
        </FieldAbteilung>
        <FieldDetails>
          <StyledLabel>Details</StyledLabel>
          <Input
            name="details"
            change={change}
            values={values}
            changeComparator={changeComparator}
            tabIndex={7 + firstTabIndex}
          />
        </FieldDetails>
        <FieldNaechsterSchritt>
          <StyledLabel>Nächster Schritt</StyledLabel>
          <Input
            name="naechsterSchritt"
            change={change}
            values={values}
            changeComparator={changeComparator}
            tabIndex={8 + firstTabIndex}
          />
        </FieldNaechsterSchritt>
        <FieldVermerk>
          <StyledLabel>Vermerk</StyledLabel>
          <Input
            name="vermerk"
            change={change}
            values={values}
            changeComparator={changeComparator}
            tabIndex={9 + firstTabIndex}
          />
        </FieldVermerk>
        <FieldVermerkIntern>
          <StyledLabel>
            Vermerk intern (in Berichten nicht angezeigt)
          </StyledLabel>
          <Input
            name="vermerkIntern"
            change={change}
            values={values}
            changeComparator={changeComparator}
            tabIndex={10 + firstTabIndex}
          />
        </FieldVermerkIntern>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaGeschaeft)
