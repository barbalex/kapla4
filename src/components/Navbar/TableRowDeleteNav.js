import React, { useContext } from 'react'
import { NavItem } from 'react-bootstrap'
import { FaTrashAlt } from 'react-icons/fa'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

import storeContext from '../../storeContext'

// eslint-disable-next-line no-unused-vars
const StyledNavItem = styled(({ showTableNavs, children, ...rest }) => (
  <NavItem {...rest}>{children}</NavItem>
))`
  border-right: ${props =>
    props['data-showtablenavs'] ? 'solid grey 1px' : 'dotted #505050 1px'};
`

const enhance = compose(observer)

const NavbarTableRowDeleteNav = ({ showTableNavs }) => {
  const store = useContext(storeContext)
  const { tableRowRemove } = store
  const { table, id } = store.table

  return (
    <StyledNavItem
      onClick={() => tableRowRemove(table, id)}
      title="Datensatz löschen"
      disabled={!id}
      data-showtablenavs={showTableNavs}
    >
      <FaTrashAlt />
    </StyledNavItem>
  )
}

export default enhance(NavbarTableRowDeleteNav)
