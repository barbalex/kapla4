import React, { useContext, useCallback } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  UncontrolledTooltip,
} from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FaPlus, FaTrashAlt } from 'react-icons/fa'

import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import storeContext from '../../storeContext'

const Sup = styled.sup`
  padding-left: 3px;
`
const StamdatenContainer = styled.div`
  display: flex;
  border: ${props =>
    props.active ? '1px solid rgb(255, 255, 255, .5)' : 'unset'};
  border-radius: 0.25rem;
`
const StyledButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0) !important;
  border: unset !important;
`

const tableNameObject = {
  interne: 'Stammdaten: Interne',
  externe: 'Stammdaten: Externe',
  aktenstandort: 'Stammdaten: Aktenstandort',
  geschaeftsart: 'Stammdaten: Geschäftsart',
  parlVorstossTyp: 'Stammdaten: Parl. Vorstoss Typ',
  rechtsmittelInstanz: 'Stammdaten: Rechtsmittel-Instanz',
  rechtsmittelErledigung: 'Stammdaten: Rechtsmittel-Erledigung',
  status: 'Stammdaten: Status',
}

const Stammdaten = () => {
  const store = useContext(storeContext)
  const { table, id, rows, fetch } = store.table
  const tableName = table ? tableNameObject[table] || table : ''
  const fetchInterne = useCallback(() => fetch('interne'), [fetch])
  const fetchExterne = useCallback(() => fetch('externe'), [fetch])
  const fetchAktenstandort = useCallback(() => fetch('aktenstandort'), [fetch])
  const fetchGeschaeftsart = useCallback(() => fetch('geschaeftsart'), [fetch])
  const fetchParlVorstossTyp = useCallback(() => fetch('parlVorstossTyp'), [
    fetch,
  ])
  const fetchRechtsmittelInstanz = useCallback(
    () => fetch('rechtsmittelInstanz'),
    [fetch],
  )
  const fetchRechtsmittelErledigung = useCallback(
    () => fetch('rechtsmittelErledigung'),
    [fetch],
  )
  const fetchStatus = useCallback(() => fetch('status'), [fetch])
  const onClickInsert = useCallback(() => rows.insert(table), [rows, table])
  const onClickDelete = useCallback(() => rows.delete(table, id), [
    id,
    rows,
    table,
  ])

  return (
    <StamdatenContainer active={activeTable.includes('Werte')}>
      <UncontrolledDropdown nav inNavbar active={activeTable.includes('Werte')}>
        <DropdownToggle nav caret>
          {activeTable.includes('Werte') ? (
            <span>
              {activeTable}
              <Sup>{stammdatenCount}</Sup>
            </span>
          ) : (
            'Stammdaten'
          )}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem name="anredeWerte" onClick={onClickStatusTable}>
            Anrede
          </DropdownItem>
          <DropdownItem
            name="anwesenheitstagWerte"
            onClick={onClickStatusTable}
          >
            Anwesenheits-Tage
          </DropdownItem>
          <DropdownItem name="etikettWerte" onClick={onClickStatusTable}>
            Etikett
          </DropdownItem>
          <DropdownItem name="funktionWerte" onClick={onClickStatusTable}>
            Funktion
          </DropdownItem>
          <DropdownItem name="kaderFunktionWerte" onClick={onClickStatusTable}>
            Kader-Funktion
          </DropdownItem>
          <DropdownItem name="kostenstelleWerte" onClick={onClickStatusTable}>
            Kostenstelle
          </DropdownItem>
          <DropdownItem name="landWerte" onClick={onClickStatusTable}>
            Land
          </DropdownItem>
          <DropdownItem
            name="mobileAboKostenstelleWerte"
            onClick={onClickStatusTable}
          >
            Mobile Abo Kostenstelle
          </DropdownItem>
          <DropdownItem name="mobileAboTypWerte" onClick={onClickStatusTable}>
            Mobile Abo Typ
          </DropdownItem>
          <DropdownItem name="mutationArtWerte" onClick={onClickStatusTable}>
            Mutations-Art
          </DropdownItem>
          <DropdownItem
            name="schluesselAnlageWerte"
            onClick={onClickStatusTable}
          >
            Schlüssel Anlage
          </DropdownItem>
          <DropdownItem name="schluesselTypWerte" onClick={onClickStatusTable}>
            Schlüssel Typ
          </DropdownItem>
          <DropdownItem name="standortWerte" onClick={onClickStatusTable}>
            Standort
          </DropdownItem>
          <DropdownItem name="statusWerte" onClick={onClickStatusTable}>
            Status
          </DropdownItem>
          <DropdownItem name="telefonTypWerte" onClick={onClickStatusTable}>
            Telefon Typ
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
      {activeTable.includes('Werte') && (
        <>
          <StyledButton id="newStammdatenButton" onClick={onClickInsert}>
            <FaPlus />
          </StyledButton>
          <UncontrolledTooltip placement="bottom" target="newStammdatenButton">
            neuen Wert erfassen
          </UncontrolledTooltip>
          <StyledButton
            id="deleteStammdatenButton"
            onClick={onClickDelete}
            disabled={!existsActiveWert}
          >
            <FaTrashAlt />
          </StyledButton>
          {existsActiveWert && (
            <UncontrolledTooltip
              placement="bottom"
              target="deleteStammdatenButton"
            >
              markierten Wert löschen
            </UncontrolledTooltip>
          )}
        </>
      )}
    </StamdatenContainer>
  )
}

export default observer(Stammdaten)
