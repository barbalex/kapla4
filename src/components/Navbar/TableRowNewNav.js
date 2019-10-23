import React, { useContext, useCallback } from 'react'
import { NavItem } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { observer } from 'mobx-react'

import storeContext from '../../storeContext'

const NavbarTableRowNeuNav = () => {
  const { tableRowNewCreate, table } = useContext(storeContext)
  const onClick = useCallback(() => tableRowNewCreate(table.table), [
    table.table,
    tableRowNewCreate,
  ])

  return (
    <NavItem onClick={onClick} title="neuer Datensatz">
      <FaPlus />
    </NavItem>
  )
}

export default observer(NavbarTableRowNeuNav)
