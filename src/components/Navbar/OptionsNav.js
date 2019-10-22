import React, { useContext } from 'react'
import { NavDropdown, MenuItem } from 'react-bootstrap'
import styled from 'styled-components'
import { shell } from 'electron'
import { observer } from 'mobx-react'

import storeContext from '../../storeContext'

const DbPathDiv = styled.div`
  font-style: italic;
`
const Version = styled.div`
  padding: 12px 20px;
  color: rgba(0, 0, 0, 0.87);
  user-select: none;
  font-style: italic;
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
  const { dbGet, configUiReset } = store
  const { config } = store.app

  return (
    <NavDropdown title="&#8942;" id="last-nav-dropdown" noCaret>
      <MenuItem onClick={dbGet}>
        Datenbank wählen
        {config.dbPath && <DbPathDiv>Aktuell: {config.dbPath}</DbPathDiv>}
      </MenuItem>
      <MenuItem divider />
      <MenuItem onClick={configUiReset}>Einstellungen zurücksetzen</MenuItem>
      <MenuItem divider />
      <MenuItem onClick={onGetProjektbeschreibung}>
        Projektbeschreibung herunterladen
      </MenuItem>
      <MenuItem onClick={onClickIssues}>Fehler und Wünsche melden</MenuItem>
      <Version>Version: 2.0.3 vom 24.07.2019</Version>
    </NavDropdown>
  )
}

export default observer(OptionsNav)
