import React, { useContext } from 'react'
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
  const tableName = tableNameObject[table] || table

  return (
    <StyledNavDropdown
      title={
        tableName ? (
          <span>
            {tableName} <sup>{rows.length}</sup>
          </span>
        ) : (
          <span>Stammdaten</span>
        )
      }
      id="stammdaten-nav-dropdown"
      data-showtablenavs={showTableNavs}
    >
      <MenuItem onClick={() => fetch('interne')} active={table === 'interne'}>
        Interne
      </MenuItem>
      <MenuItem onClick={() => fetch('externe')} active={table === 'externe'}>
        Externe
      </MenuItem>
      <MenuItem divider />
      <MenuItem header>Auswahllisten:</MenuItem>
      <MenuItem
        onClick={() => fetch('aktenstandort')}
        active={table === 'aktenstandort'}
      >
        Aktenstandort
      </MenuItem>
      <MenuItem
        onClick={() => fetch('geschaeftsart')}
        active={table === 'geschaeftsart'}
      >
        Geschäftsart
      </MenuItem>
      <MenuItem
        onClick={() => fetch('parlVorstossTyp')}
        active={table === 'parlVorstossTyp'}
      >
        Parlament. Vorstoss Typ
      </MenuItem>
      <MenuItem
        onClick={() => fetch('rechtsmittelInstanz')}
        active={table === 'rechtsmittelInstanz'}
      >
        Rechtsmittel-Instanz
      </MenuItem>
      <MenuItem
        onClick={() => fetch('rechtsmittelErledigung')}
        active={table === 'rechtsmittelErledigung'}
      >
        Rechtsmittel-Erledigung
      </MenuItem>
      <MenuItem onClick={() => fetch('status')} active={table === 'status'}>
        Status
      </MenuItem>
    </StyledNavDropdown>
  )
}

export default observer(NavbarStammdatenNav)
