import { remote, shell } from 'electron'
import fs from 'fs'
import React, { useContext } from 'react'
import { NavItem } from 'react-bootstrap'
import { FaFile } from 'react-icons/fa'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

import storeContext from '../../storeContext'

// eslint-disable-next-line no-unused-vars
const StyledNavItem = styled(NavItem)`
  border-right: ${props =>
    props['data-showberichtenavs'] ? 'solid grey 1px' : 'dotted #505050 1px'};
`
const Icon = styled(FaFile)`
  font-size: 1.3em;
`

const { dialog } = remote

const onClickPrint = (e, path) => {
  e.preventDefault()
  const landscape = path === '/pages'
  const win = remote.getCurrentWindow()
  const printToPDFOptions = {
    marginsType: 0,
    pageSize: 'A4',
    landscape,
    printBackground: false,
  }
  const dialogOptions = {
    title: 'pdf speichern',
    filters: [
      {
        name: 'pdf',
        extensions: ['pdf'],
      },
    ],
  }

  // https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentsprinttopdfoptions-callback
  win.webContents.printToPDF(printToPDFOptions, (error, data) => {
    if (error) throw error
    dialog.showSaveDialog(dialogOptions, filePath => {
      if (filePath) {
        fs.writeFile(filePath, data, err => {
          if (err) throw err
          shell.openItem(filePath)
        })
      }
    })
  })
}

const enhance = compose(observer)

const NavbarPrintNav = ({ showBerichteNavs }) => {
  const store = useContext(storeContext)

  return (
    <StyledNavItem
      onClick={e => onClickPrint(e, store.history.location.pathname)}
      title="PDF erzeugen"
      data-showberichtenavs={showBerichteNavs}
    >
      <Icon />
    </StyledNavItem>
  )
}

export default enhance(NavbarPrintNav)
