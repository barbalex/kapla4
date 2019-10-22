import React, { useContext, useCallback } from 'react'
import { NavItem } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { observer } from 'mobx-react'

import storeContext from '../../storeContext'

const NavbarTableRowNeuNav = () => {
  const store = useContext(storeContext)
  const onClick = useCallback(
    () => store.tableRowNewCreate(store.table.table),
    [store],
  )

  return (
    <NavItem onClick={onClick} title="neuer Datensatz">
      <FaPlus />
    </NavItem>
  )
}

export default observer(NavbarTableRowNeuNav)
