import React from 'react'
import PropTypes from 'prop-types'
import { NavDropdown, MenuItem } from 'react-bootstrap'
import styled from 'styled-components'
import { shell } from 'electron'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

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

const enhance = compose(
  inject('store'),
  observer,
)

const OptionsNav = ({ store }) => {
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

OptionsNav.displayName = 'OptionsNav'

OptionsNav.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(OptionsNav)
