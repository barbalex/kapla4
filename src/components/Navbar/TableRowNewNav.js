import React from 'react'
import PropTypes from 'prop-types'
import { NavItem } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

const enhance = compose(
  inject('store'),
  observer,
)

const NavbarTableRowNeuNav = ({ store }) => (
  <NavItem
    onClick={() => store.tableRowNewCreate(store.table.table)}
    title="neuer Datensatz"
  >
    <FaPlus />
  </NavItem>
)

NavbarTableRowNeuNav.displayName = 'NavbarTableRowNeuNav'

NavbarTableRowNeuNav.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(NavbarTableRowNeuNav)
