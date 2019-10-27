import React from 'react'
import { NavItem } from 'react-bootstrap'
import { MdPrint } from 'react-icons/md'
import styled from 'styled-components'
//import { remote } from 'electron'

const PrintIcon = styled(MdPrint)`
  font-size: 1.3em;
`

const onClickPrint = () => {
  // https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentsprintoptions
  /**
   * PROBLEM
   * with webContents.print marginsType can not be set
   * so this may be set by system settings, which could be different
   * from pc to pc!
   * Preset seems to be 0 for default margin
   * MUCH BETTER would be 1 for no margin
   * but: @page css to the rescue
   * plus: printBackground and landscape seem to also be ignored
   */
  /*const win = remote.getCurrentWindow()
  win.webContents.print(
    {
      marginsType: 0,
      printBackground: true,
      landscape: true,
    },
    (success, failureReason) => {
      console.log('print result', { success, failureReason })
    },
  )*/
  window.print()
}

const NavbarPrintNav = () => (
  <NavItem onClick={onClickPrint} title="Drucken">
    <PrintIcon />
  </NavItem>
)

export default NavbarPrintNav
