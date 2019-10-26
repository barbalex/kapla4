import React, { useContext, useCallback } from 'react'
import { NavItem } from 'react-bootstrap'
import { FaTrashAlt } from 'react-icons/fa'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext'

// eslint-disable-next-line no-unused-vars
const StyledNavItem = styled(({ showTableNavs, children, ...rest }) => (
  <NavItem {...rest}>{children}</NavItem>
))`
  border-right: ${props =>
    props['data-showtablenavs'] ? 'solid grey 1px' : 'dotted #505050 1px'};
`

const NavbarTableRowDeleteNav = ({ showTableNavs }) => {
  const store = useContext(storeContext)
  const { table, id, rowDelete } = store.table
  const onClick = useCallback(() => rowDelete(table, id), [
    id,
    table,
    rowDelete,
  ])

  return (
    <StyledNavItem
      onClick={onClick}
      title="Datensatz löschen"
      disabled={!id}
      data-showtablenavs={showTableNavs}
    >
      <FaTrashAlt />
    </StyledNavItem>
  )
}

export default observer(NavbarTableRowDeleteNav)
