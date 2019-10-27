import React, { useContext, useCallback } from 'react'
import { NavDropdown, MenuItem } from 'react-bootstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext'

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

// eslint-disable-next-line no-unused-vars
const StyledNavDropdown = styled(NavDropdown)`
  border-left: ${props =>
    props['data-showtablenavs'] ? 'solid grey 1px' : 'dotted #505050 1px'};
  border-right: ${props =>
    props['data-showtablenavs'] ? 'none' : 'dotted #505050 1px'};
`

const NavbarStammdatenNav = ({ showTableNavs }) => {
  const store = useContext(storeContext)
  const { table, fetch, rows } = store.table
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

  return (
    <StyledNavDropdown
      title={
        table ? (
          <span>
            {tableName} <sup>{table ? rows[table].length : 0}</sup>
          </span>
        ) : (
          <span>Stammdaten</span>
        )
      }
      id="stammdaten-nav-dropdown"
      data-showtablenavs={showTableNavs}
    >
      <MenuItem onClick={fetchInterne} active={table === 'interne'}>
        Interne
      </MenuItem>
      <MenuItem onClick={fetchExterne} active={table === 'externe'}>
        Externe
      </MenuItem>
      <MenuItem divider />
      <MenuItem header>Auswahllisten:</MenuItem>
      <MenuItem onClick={fetchAktenstandort} active={table === 'aktenstandort'}>
        Aktenstandort
      </MenuItem>
      <MenuItem onClick={fetchGeschaeftsart} active={table === 'geschaeftsart'}>
        Geschäftsart
      </MenuItem>
      <MenuItem
        onClick={fetchParlVorstossTyp}
        active={table === 'parlVorstossTyp'}
      >
        Parlament. Vorstoss Typ
      </MenuItem>
      <MenuItem
        onClick={fetchRechtsmittelInstanz}
        active={table === 'rechtsmittelInstanz'}
      >
        Rechtsmittel-Instanz
      </MenuItem>
      <MenuItem
        onClick={fetchRechtsmittelErledigung}
        active={table === 'rechtsmittelErledigung'}
      >
        Rechtsmittel-Erledigung
      </MenuItem>
      <MenuItem onClick={fetchStatus} active={table === 'status'}>
        Status
      </MenuItem>
    </StyledNavDropdown>
  )
}

export default observer(NavbarStammdatenNav)
