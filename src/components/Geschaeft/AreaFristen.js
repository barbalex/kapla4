import React, { useContext, useState, useEffect } from 'react'
import { Label } from 'reactstrap'
import moment from 'moment'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ErrorBoundary from '../shared/ErrorBoundary'
import storeContext from '../../storeContext'
import getDauerBisFristMitarbeiter from '../../src/getDauerBisFristMitarbeiter'
import Date from '../shared/Date'

moment.locale('de')

const Container = styled.div`
  grid-area: areaFristen;
  background-color: rgb(252, 255, 194);
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 2px;
  padding: 8px;
  border-left: none;
  border-collapse: collapse;
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
const StyledFristDauerBisMitarbeiter = styled.div`
  font-weight: 900;
  letter-spacing: 0.13em;
  font-size: 16px;
  padding-top: 0;
  margin-top: 0;
  -webkit-text-stroke-color: black;
  -webkit-text-stroke-width: 1px;
  -webkit-text-fill-color: ${(props) => props.color};
`
const NonRowLabel = styled(Label)`
  margin-bottom: -2px;
  color: #757575;
  font-size: 12px;
  font-weight: 500;
`

const AreaFristen = ({
  saveToDb,
  nrOfFieldsBeforeFristen,
  onChangeDatePicker,
  viewIsNarrow,
}) => {
  const store = useContext(storeContext)
  const { activeId, geschaefteFilteredAndSorted: geschaefte } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}
  const dauerBisFristMitarbeiter = getDauerBisFristMitarbeiter(geschaeft)
  let colorDauerBisFristMitarbeiter = 'black'
  if (dauerBisFristMitarbeiter < 0) colorDauerBisFristMitarbeiter = 'red'
  if (dauerBisFristMitarbeiter === 0) colorDauerBisFristMitarbeiter = 'orange'

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [geschaeft.idGeschaeft])

  const popperPlacement = viewIsNarrow ? 'left' : 'right'

  return (
    <ErrorBoundary>
      <Container>
        <Title>Fristen</Title>
        <Date
          key={`${geschaeft.idGeschaeft}datumEingangAwel`}
          value={geschaeft.datumEingangAwel}
          field="datumEingangAwel"
          label="Datum des Eingangs im AWEL"
          saveToDb={saveToDb}
          error={errors.datumEingangAwel}
          tabIndex={1 + nrOfFieldsBeforeFristen}
          popperPlacement={popperPlacement}
        />
        <Date
          key={`${geschaeft.idGeschaeft}fristAwel`}
          value={geschaeft.fristAwel}
          field="fristAwel"
          label="Frist für Erledigung durch AWEL"
          saveToDb={saveToDb}
          error={errors.fristAwel}
          tabIndex={2 + nrOfFieldsBeforeFristen}
          popperPlacement={popperPlacement}
        />
        <Date
          key={`${geschaeft.idGeschaeft}fristAmtschef`}
          value={geschaeft.fristAmtschef}
          field="fristAmtschef"
          label="Frist Vorlage an Amtschef"
          saveToDb={saveToDb}
          error={errors.fristAmtschef}
          tabIndex={3 + nrOfFieldsBeforeFristen}
          popperPlacement={popperPlacement}
        />
        <Date
          key={`${geschaeft.idGeschaeft}fristAbteilung`}
          value={geschaeft.fristAbteilung}
          field="fristAbteilung"
          label="Frist für Erledigung durch Abteilung"
          saveToDb={saveToDb}
          error={errors.fristAbteilung}
          tabIndex={4 + nrOfFieldsBeforeFristen}
          popperPlacement={popperPlacement}
        />
        <Date
          key={`${geschaeft.idGeschaeft}fristMitarbeiter`}
          value={geschaeft.fristMitarbeiter}
          field="fristMitarbeiter"
          label="Frist Erledigung nächster Schritt Re"
          saveToDb={saveToDb}
          error={errors.fristMitarbeiter}
          tabIndex={5 + nrOfFieldsBeforeFristen}
          popperPlacement={popperPlacement}
        />
        {(!!dauerBisFristMitarbeiter || dauerBisFristMitarbeiter === 0) && (
          <FieldFristDauerBisMitarbeiter>
            <NonRowLabel>Tage bis Frist Mitarbeiter</NonRowLabel>
            <StyledFristDauerBisMitarbeiter
              color={colorDauerBisFristMitarbeiter}
              className="formControlStatic"
            >
              {dauerBisFristMitarbeiter}
            </StyledFristDauerBisMitarbeiter>
          </FieldFristDauerBisMitarbeiter>
        )}
        <Date
          key={`${geschaeft.idGeschaeft}datumAusgangAwel`}
          value={geschaeft.datumAusgangAwel}
          field="datumAusgangAwel"
          label="Datum Ausgang AWEL (erledigt)"
          saveToDb={saveToDb}
          error={errors.datumAusgangAwel}
          tabIndex={6 + nrOfFieldsBeforeFristen}
          popperPlacement={popperPlacement}
        />
        <Date
          key={`${geschaeft.idGeschaeft}fristDirektion`}
          value={geschaeft.fristDirektion}
          field="fristDirektion"
          label="Frist für Erledigung durch Direktion"
          saveToDb={saveToDb}
          error={errors.fristDirektion}
          tabIndex={7 + nrOfFieldsBeforeFristen}
          popperPlacement={popperPlacement}
        />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaFristen)
