import React, { useContext, useState, useEffect } from 'react'
import { FormControl, ControlLabel } from 'react-bootstrap'
import moment from 'moment'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import Date from '../shared/Date'

import DateField from './DateField'
import storeContext from '../../storeContext'
import getDauerBisFristMitarbeiter from '../../src/getDauerBisFristMitarbeiter'

moment.locale('de')

const Container = styled.div`
  grid-area: areaFristen;
  background-color: rgb(252, 255, 194);
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 2px;
  padding: 8px;
  border: ${props => (props['data-ispdf'] ? '1px solid #CCC' : 'none')};
  border-bottom: ${props => (props['data-ispdf'] ? 'none' : 'inherit')};
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-column: 1;
`
const FieldFristDauerBisMitarbeiter = styled.div`
  grid-column: 1;
  font-weight: 700;
  font-size: 14px;
`
const StyledFristDauerBisMitarbeiter = styled(FormControl.Static)`
  font-weight: 900;
  letter-spacing: 0.13em;
  font-size: ${props => (props.isPdf ? '14px' : '16px')};
  padding-top: 0;
  padding-bottom: ${props => (props.isPdf ? 0 : 'inherit')};
  margin-top: 0;
  margin-bottom: ${props => (props['data-ispdf'] ? '-12px' : 'inherit')};
  -webkit-text-stroke-color: black;
  -webkit-text-stroke-width: 1px;
  -webkit-text-fill-color: ${props => props.color};
`

const AreaFristen = ({
  blur,
  change,
  saveToDb,
  nrOfFieldsBeforeFristen,
  onChangeDatePicker,
}) => {
  const store = useContext(storeContext)
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const { activeId, geschaefteFilteredAndSorted: geschaefte } = store.geschaefte
  const isPdf = activeLocation === 'geschaeftPdf'
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}
  const dauerBisFristMitarbeiter = getDauerBisFristMitarbeiter(geschaeft)
  let colorDauerBisFristMitarbeiter = 'black'
  if (!isPdf) {
    if (dauerBisFristMitarbeiter < 0) colorDauerBisFristMitarbeiter = 'red'
    if (dauerBisFristMitarbeiter === 0) colorDauerBisFristMitarbeiter = 'orange'
  } else if (isPdf) {
    if (dauerBisFristMitarbeiter === 0) colorDauerBisFristMitarbeiter = 'grey'
  }

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [geschaeft.idGeschaeft])

  return (
    <ErrorBoundary>
      <Container data-ispdf={isPdf}>
        <Title>Fristen</Title>
        {!(!geschaeft.datumEingangAwel && isPdf) && (
          <Date
            key={`${geschaeft.idGeschaeft}datumEingangAwel`}
            value={geschaeft.datumEingangAwel}
            field="datumEingangAwel"
            label="Datum des Eingangs im AWEL"
            saveToDb={saveToDb}
            error={errors.datumEingangAwel}
            tabIndex={1 + nrOfFieldsBeforeFristen}
          />
        )}
        {!(!geschaeft.fristAwel && isPdf) && (
          <DateField
            name="fristAwel"
            label="Frist für Erledigung durch AWEL"
            change={change}
            blur={blur}
            onChangeDatePicker={onChangeDatePicker}
            tabIndex={2 + nrOfFieldsBeforeFristen}
          />
        )}
        {!(!geschaeft.fristAmtschef && isPdf) && (
          <DateField
            name="fristAmtschef"
            label="Frist Vorlage an Amtschef"
            change={change}
            blur={blur}
            onChangeDatePicker={onChangeDatePicker}
            tabIndex={3 + nrOfFieldsBeforeFristen}
          />
        )}
        {!(!geschaeft.fristAbteilung && isPdf) && (
          <DateField
            name="fristAbteilung"
            label="Frist für Erledigung durch Abteilung"
            change={change}
            blur={blur}
            onChangeDatePicker={onChangeDatePicker}
            tabIndex={4 + nrOfFieldsBeforeFristen}
          />
        )}
        {!(!geschaeft.fristMitarbeiter && isPdf) && (
          <DateField
            name="fristMitarbeiter"
            label="Frist Erledigung nächster Schritt Re"
            change={change}
            blur={blur}
            onChangeDatePicker={onChangeDatePicker}
            tabIndex={5 + nrOfFieldsBeforeFristen}
          />
        )}
        {(!!geschaeft.dauerBisFristMitarbeiter ||
          geschaeft.dauerBisFristMitarbeiter === 0) && (
          <FieldFristDauerBisMitarbeiter>
            <ControlLabel>Tage bis Frist Mitarbeiter</ControlLabel>
            <StyledFristDauerBisMitarbeiter
              color={colorDauerBisFristMitarbeiter}
              data-ispdf={isPdf}
              className="formControlStatic"
            >
              {geschaeft.dauerBisFristMitarbeiter}
            </StyledFristDauerBisMitarbeiter>
          </FieldFristDauerBisMitarbeiter>
        )}
        {!(!geschaeft.datumAusgangAwel && isPdf) && (
          <DateField
            name="datumAusgangAwel"
            label="Datum Ausgang AWEL (erledigt)"
            change={change}
            blur={blur}
            onChangeDatePicker={onChangeDatePicker}
            tabIndex={6 + nrOfFieldsBeforeFristen}
          />
        )}
        {!(!geschaeft.fristDirektion && isPdf) && (
          <DateField
            name="fristDirektion"
            label="Frist für Erledigung durch Direktion"
            change={change}
            blur={blur}
            onChangeDatePicker={onChangeDatePicker}
            tabIndex={7 + nrOfFieldsBeforeFristen}
          />
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaFristen)
