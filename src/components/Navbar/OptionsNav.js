import React, { useContext } from 'react'
import { NavDropdown, MenuItem } from 'react-bootstrap'
import styled from 'styled-components'
import { shell } from 'electron'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext'

const StyledNavDropdown = styled(NavDropdown)`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 10px;
  width: 20px;
  > a {
    font-size: 28px !important;
    color: #9d9d9d;
  }
  > a:hover {
    color: white;
    text-decoration: none !important;
  }
  > a:focus {
    color: white;
    text-decoration: none !important;
    background-color: transparent !important;
    border-color: transparent !important;
  }
`
const DbPathDiv = styled.div`
  color: rgba(0, 0, 0, 0.47);
`
const Version = styled.div`
  padding: 0 20px 8px 20px;
  color: rgba(0, 0, 0, 0.47);
  user-select: none;
`

const onGetProjektbeschreibung = () => {
  shell.openItem(
    'https://github.com/barbalex/kapla3/raw/master/app/etc/Projektbeschreibung.pdf',
  )
}
const onClickIssues = () => {
  shell.openItem('https://github.com/barbalex/kapla3/issues')
}

const OptionsNav = () => {
  const store = useContext(storeContext)
  const { config, dbGet } = store.app

  return (
    <StyledNavDropdown title="&#8942;" id="last-nav-dropdown" noCaret>
      <MenuItem onClick={dbGet}>
        Datenbank wählen
        {config.dbPath && <DbPathDiv>Aktuell: {config.dbPath}</DbPathDiv>}
      </MenuItem>
      <MenuItem divider />
      <MenuItem onClick={config.configUiReset}>
        Einstellungen zurücksetzen
      </MenuItem>
      <MenuItem divider />
      <MenuItem onClick={onGetProjektbeschreibung}>
        Projektbeschreibung herunterladen
      </MenuItem>
      <MenuItem divider />
      <MenuItem onClick={onClickIssues}>Fehler und Wünsche melden</MenuItem>
      <MenuItem divider />
      <Version>Version: 2.0.4 vom 23.10.2019</Version>
    </StyledNavDropdown>
  )
}

export default observer(OptionsNav)
