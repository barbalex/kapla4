import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ControlLabel } from 'react-bootstrap'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import SelectInput from './SelectInput'
import Input from './Input'
import storeContext from '../../storeContext'

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

const AreaGeschaeft = ({ change, values, firstTabIndex, changeComparator }) => {
  const store = useContext(storeContext)
  const {
    statusOptions,
    geschaeftsartOptions,
    abteilungOptions,
  } = store.geschaefte

  return (
    <Container>
      <Title>Geschäft</Title>
      <FieldGegenstand>
        <ControlLabel>Gegenstand</ControlLabel>
        <Input
          name="gegenstand"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={1 + firstTabIndex}
        />
      </FieldGegenstand>
      <FieldAusloeser>
        <ControlLabel>Auslöser</ControlLabel>
        <Input
          name="ausloeser"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={2 + firstTabIndex}
        />
      </FieldAusloeser>
      <FieldOrt>
        <ControlLabel>Ort</ControlLabel>
        <Input
          name="ort"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={3 + firstTabIndex}
        />
      </FieldOrt>
      <FieldGeschaeftsart>
        <ControlLabel>Geschäftsart</ControlLabel>
        <SelectInput
          name="geschaeftsart"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={4 + firstTabIndex}
          options={toJS(geschaeftsartOptions)}
        />
      </FieldGeschaeftsart>
      <FieldStatus>
        <ControlLabel>Status</ControlLabel>
        <SelectInput
          name="status"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={5 + firstTabIndex}
          options={toJS(statusOptions)}
        />
      </FieldStatus>
      <FieldAbteilung>
        <ControlLabel>Abteilung</ControlLabel>
        <SelectInput
          name="abteilung"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={6 + firstTabIndex}
          options={toJS(abteilungOptions)}
        />
      </FieldAbteilung>
      <FieldDetails>
        <ControlLabel>Details</ControlLabel>
        <Input
          name="details"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={7 + firstTabIndex}
        />
      </FieldDetails>
      <FieldNaechsterSchritt>
        <ControlLabel>Nächster Schritt</ControlLabel>
        <Input
          name="naechsterSchritt"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={8 + firstTabIndex}
        />
      </FieldNaechsterSchritt>
      <FieldVermerk>
        <ControlLabel>Vermerk</ControlLabel>
        <Input
          name="vermerk"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={9 + firstTabIndex}
        />
      </FieldVermerk>
      <FieldVermerkIntern>
        <ControlLabel>
          Vermerk intern (in Berichten nicht angezeigt)
        </ControlLabel>
        <Input
          name="vermerkIntern"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={10 + firstTabIndex}
        />
      </FieldVermerkIntern>
    </Container>
  )
}

AreaGeschaeft.displayName = 'AreaGeschaeft'

export default observer(AreaGeschaeft)
