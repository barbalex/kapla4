import React, { useContext } from 'react'
import moment from 'moment'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ErrorBoundary from '../../shared/ErrorBoundary'
import storeContext from '../../../storeContext'
import getDauerBisFristMitarbeiter from '../../../src/getDauerBisFristMitarbeiter'
import Input from '../../shared/Input'

moment.locale('de')

const Container = styled.div`
  grid-area: areaFristen;
  background-color: rgb(252, 255, 194);
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 2px;
  padding: 8px;
  border: thin solid #ccc;
  border-bottom: none;
  border-left: none;
  border-collapse: collapse;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-column: 1;
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

  return (
    <ErrorBoundary>
      <Container>
        <Title>Fristen</Title>
        {!!geschaeft.datumEingangAwel && (
          <Input
            key={`${geschaeft.idGeschaeft}datumEingangAwel`}
            value={geschaeft.datumEingangAwel}
            field="datumEingangAwel"
            label="Datum des Eingangs im AWEL"
            disabled
            tabIndex={1 + nrOfFieldsBeforeFristen}
          />
        )}
        {!!geschaeft.fristAwel && (
          <Input
            key={`${geschaeft.idGeschaeft}fristAwel`}
            value={geschaeft.fristAwel}
            field="fristAwel"
            label="Frist für Erledigung durch AWEL"
            disabled
            tabIndex={2 + nrOfFieldsBeforeFristen}
          />
        )}
        {!!geschaeft.fristAmtschef && (
          <Input
            key={`${geschaeft.idGeschaeft}fristAmtschef`}
            value={geschaeft.fristAmtschef}
            field="fristAmtschef"
            label="Frist Vorlage an Amtschef"
            disabled
            tabIndex={3 + nrOfFieldsBeforeFristen}
          />
        )}
        {!!geschaeft.fristAbteilung && (
          <Input
            key={`${geschaeft.idGeschaeft}fristAbteilung`}
            value={geschaeft.fristAbteilung}
            field="fristAbteilung"
            label="Frist für Erledigung durch Abteilung"
            disabled
            tabIndex={4 + nrOfFieldsBeforeFristen}
          />
        )}
        {!!geschaeft.fristMitarbeiter && (
          <Input
            key={`${geschaeft.idGeschaeft}fristMitarbeiter`}
            value={geschaeft.fristMitarbeiter}
            field="fristMitarbeiter"
            label="Frist Erledigung nächster Schritt Re"
            disabled
            tabIndex={5 + nrOfFieldsBeforeFristen}
          />
        )}
        {(!!dauerBisFristMitarbeiter || dauerBisFristMitarbeiter === 0) && (
          <Input
            key={`${geschaeft.idGeschaeft}dauerBisFristMitarbeiter`}
            value={dauerBisFristMitarbeiter}
            field="dauerBisFristMitarbeiter"
            label="Tage bis Frist Mitarbeiter"
            disabled
          />
        )}
        {!!geschaeft.datumAusgangAwel && (
          <Input
            key={`${geschaeft.idGeschaeft}datumAusgangAwel`}
            value={geschaeft.datumAusgangAwel}
            field="datumAusgangAwel"
            label="Datum Ausgang AWEL (erledigt)"
            disabled
            tabIndex={6 + nrOfFieldsBeforeFristen}
          />
        )}
        {!!geschaeft.fristDirektion && (
          <Input
            key={`${geschaeft.idGeschaeft}fristDirektion`}
            value={geschaeft.fristDirektion}
            field="fristDirektion"
            label="Frist für Erledigung durch Direktion"
            disabled
            tabIndex={7 + nrOfFieldsBeforeFristen}
          />
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaFristen)
