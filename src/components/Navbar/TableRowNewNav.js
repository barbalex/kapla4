import React, { useContext } from 'react'
import { NavItem } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

import storeContext from '../../storeContext'

const enhance = compose(observer)

const NavbarTableRowNeuNav = () => {
  const store = useContext(storeContext)

  return (
    <NavItem
      onClick={() => store.tableRowNewCreate(store.table.table)}
      title="neuer Datensatz"
    >
      <FaPlus />
    </NavItem>
  )
}

export default enhance(NavbarTableRowNeuNav)
