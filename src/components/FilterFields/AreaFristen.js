import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import DateField from './DateField'

const Container = styled.div`
  grid-area: areaFristen;
  background-color: white;
  box-shadow: inset 1em 1em 2em rgb(252, 255, 194),
    inset -1em -1em 2em rgb(252, 255, 194);
  outline: 1px solid #efefef;
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 2px;
  padding: 8px;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-column: 1;
`

const AreaFristen = ({ values, firstTabIndex, change, changeComparator }) => (
  <Container>
    <Title>Fristen</Title>
    <DateField
      name="datumEingangAwel"
      label="Datum des Eingangs im AWEL"
      tabIndex={1 + firstTabIndex}
      values={values}
      change={change}
      changeComparator={changeComparator}
    />
    <DateField
      name="fristAwel"
      label="Frist für Erledigung durch AWEL"
      tabIndex={2 + firstTabIndex}
      values={values}
      change={change}
      changeComparator={changeComparator}
    />
    <DateField
      name="fristAmtschef"
      label="Frist Vorlage an Amtschef"
      tabIndex={3 + firstTabIndex}
      values={values}
      change={change}
      changeComparator={changeComparator}
    />
    <DateField
      name="fristAbteilung"
      label="Frist für Erledigung durch Abteilung"
      tabIndex={4 + firstTabIndex}
      values={values}
      change={change}
      changeComparator={changeComparator}
    />
    <DateField
      name="fristMitarbeiter"
      label="Frist Erledigung nächster Schritt Re"
      tabIndex={5 + firstTabIndex}
      values={values}
      change={change}
      changeComparator={changeComparator}
    />
    <DateField
      name="datumAusgangAwel"
      label="Datum Ausgang AWEL (erledigt)"
      tabIndex={6 + firstTabIndex}
      values={values}
      change={change}
      changeComparator={changeComparator}
    />
    <DateField
      name="fristDirektion"
      label="Frist für Erledigung durch Direktion"
      tabIndex={7 + firstTabIndex}
      values={values}
      change={change}
      changeComparator={changeComparator}
    />
  </Container>
)

AreaFristen.displayName = 'AreaFristen'

AreaFristen.propTypes = {
  values: PropTypes.object,
  change: PropTypes.func.isRequired,
  changeComparator: PropTypes.func.isRequired,
  firstTabIndex: PropTypes.number.isRequired,
}

export default observer(AreaFristen)
