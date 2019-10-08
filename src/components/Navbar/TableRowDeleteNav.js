import React from 'react'
import PropTypes from 'prop-types'
import { NavItem, Glyphicon } from 'react-bootstrap'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

// eslint-disable-next-line no-unused-vars
const StyledNavItem = styled(({ showTableNavs, children, ...rest }) => <NavItem {...rest}>{children}</NavItem>)`
  border-right: ${props => (props['data-showtablenavs'] ? 'solid grey 1px' : 'dotted #505050 1px')};
`

const enhance = compose(inject('store'), observer)

const NavbarTableRowDeleteNav = ({ store, showTableNavs }) => {
  const { tableRowRemove } = store
  const { table, id } = store.table

  return (
    <StyledNavItem onClick={() => tableRowRemove(table, id)} title="Datensatz löschen" disabled={!id} data-showtablenavs={showTableNavs}>
      <Glyphicon glyph="trash" />
    </StyledNavItem>
  )
}

NavbarTableRowDeleteNav.displayName = 'NavbarTableRowDeleteNav'

NavbarTableRowDeleteNav.propTypes = {
  store: PropTypes.object.isRequired,
  showTableNavs: PropTypes.bool.isRequired,
}

export default enhance(NavbarTableRowDeleteNav)
