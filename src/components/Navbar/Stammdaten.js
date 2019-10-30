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
  const path = store.history.location.pathname
  const isActive = path === '/table'

  return (
    <StamdatenContainer active={isActive}>
      <UncontrolledDropdown nav inNavbar active={isActive}>
        <DropdownToggle nav caret>
          {table ? (
            <span>
              {tableName}
              <Sup>{table ? rows[table].length : 0}</Sup>
            </span>
          ) : (
            'Stammdaten'
          )}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem name="interneWerte" onClick={fetchInterne}>
            Interne
          </DropdownItem>
          <DropdownItem name="externeWerte" onClick={fetchExterne}>
            Externe
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem header>Auswahllisten:</DropdownItem>
          <DropdownItem name="aktenstandortWerte" onClick={fetchAktenstandort}>
            Aktenstandort
          </DropdownItem>
          <DropdownItem name="geschaeftsartWerte" onClick={fetchGeschaeftsart}>
            Geschäftsart
          </DropdownItem>
          <DropdownItem
            name="parlVorstossTypWerte"
            onClick={fetchParlVorstossTyp}
          >
            Parlament. Vorstoss Typ
          </DropdownItem>
          <DropdownItem
            name="rechtsmittelInstanzWerte"
            onClick={fetchRechtsmittelInstanz}
          >
            Rechtsmittel-Instanz
          </DropdownItem>
          <DropdownItem
            name="rechtsmittelErledigungWerte"
            onClick={fetchRechtsmittelErledigung}
          >
            Rechtsmittel-Erledigung
          </DropdownItem>
          <DropdownItem name="statusWerte" onClick={fetchStatus}>
            Status
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
      {table && (
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
            disabled={!table}
          >
            <FaTrashAlt />
          </StyledButton>
          {!!table && (
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
