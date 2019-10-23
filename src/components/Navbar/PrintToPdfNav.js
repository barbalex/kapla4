import { remote, shell, ipcRenderer } from 'electron'
import React, { useContext, useCallback } from 'react'
import { NavItem } from 'react-bootstrap'
import { FaFile } from 'react-icons/fa'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import mobxStoreContext from '../../mobxStoreContext'

// eslint-disable-next-line no-unused-vars
const StyledNavItem = styled(NavItem)`
  border-right: ${props =>
    props['data-showberichtenavs'] ? 'solid grey 1px' : 'dotted #505050 1px'};
`
const Icon = styled(FaFile)`
  font-size: 1.3em;
`

const { dialog } = remote

const dialogOptions = {
  title: 'pdf speichern',
  filters: [
    {
      name: 'pdf',
      extensions: ['pdf'],
    },
  ],
}

const NavbarPrintNav = ({ showBerichteNavs }) => {
  const store = useContext(mobxStoreContext)

  const onClick = useCallback(
    async e => {
      e.preventDefault()
      const landscape = store.history.location.pathname === '/pages'
      const win = remote.getCurrentWindow()
      const printToPDFOptions = {
        marginsType: 0,
        pageSize: 'A4',
        landscape,
        printBackground: false,
      }

      // https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentsprinttopdfoptions-callback
      const data = await win.webContents.printToPDF(printToPDFOptions)
      const { filePath } = await dialog.showSaveDialog(dialogOptions)
      if (filePath) {
        ipcRenderer.send('SAVE_FILE', filePath, data)
        ipcRenderer.once('SAVED_FILE', () => {
          shell.openItem(filePath)
        })
        ipcRenderer.once('ERROR', error => {
          throw new Error(error)
        })
      }
    },
    [store.history.location.pathname],
  )

  return (
    <StyledNavItem
      onClick={onClick}
      title="PDF erzeugen"
      data-showberichtenavs={showBerichteNavs}
    >
      <Icon />
    </StyledNavItem>
  )
}

export default observer(NavbarPrintNav)
