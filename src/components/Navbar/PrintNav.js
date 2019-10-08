import React from 'react'
import { NavItem, Glyphicon } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

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
   */
  // win.webContents.print()
  window.print()
}

const enhance = compose(inject('store'), observer)

const NavbarPrintNav = () => (
  <NavItem onClick={onClickPrint} title="Drucken">
    <Glyphicon glyph="print" />
  </NavItem>
)

NavbarPrintNav.displayName = 'NavbarPrintNav'

export default enhance(NavbarPrintNav)
