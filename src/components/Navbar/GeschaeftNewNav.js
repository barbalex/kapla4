import React, { useContext } from 'react'
import { NavItem } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import { FaPlus } from 'react-icons/fa'

import storeContext from '../../storeContext'

const enhance = compose(observer)

const NavbarGeschaeftNeuNav = () => {
  const store = useContext(storeContext)

  return (
    <NavItem onClick={store.geschaeftNewCreate} title="neues Geschäft">
      <FaPlus />
    </NavItem>
  )
}

export default enhance(NavbarGeschaeftNeuNav)
