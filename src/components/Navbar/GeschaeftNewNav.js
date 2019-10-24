import React, { useContext, useCallback } from 'react'
import { NavItem } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { FaPlus } from 'react-icons/fa'

import storeContext from '../../storeContext'

const NavbarGeschaeftNeuNav = () => {
  const { geschaeftNewCreate } = useContext(storeContext)
  const onClick = useCallback(() => geschaeftNewCreate(), [geschaeftNewCreate])

  return (
    <NavItem onClick={onClick} title="neues Geschäft">
      <FaPlus />
    </NavItem>
  )
}

export default observer(NavbarGeschaeftNeuNav)
