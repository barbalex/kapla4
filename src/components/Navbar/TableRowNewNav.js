import React, { useContext, useCallback } from 'react'
import { NavItem } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext'

const NavbarTableRowNeuNav = () => {
  const store = useContext(storeContext)
  const { table, rows } = store.table
  const onClick = useCallback(() => rows.insert(table), [rows, table])

  return (
    <NavItem onClick={onClick} title="neuer Datensatz">
      <FaPlus />
    </NavItem>
  )
}

export default observer(NavbarTableRowNeuNav)
