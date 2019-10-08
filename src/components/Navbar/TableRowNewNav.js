import React from 'react'
import PropTypes from 'prop-types'
import {
  NavItem,
  Glyphicon,
} from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

const enhance = compose(
  inject('store'),
  observer
)

const NavbarTableRowNeuNav = ({ store }) =>
  <NavItem
    onClick={() =>
      store.tableRowNewCreate(store.table.table)
    }
    title="neuer Datensatz"
  >
    <Glyphicon glyph="plus" />
  </NavItem>

NavbarTableRowNeuNav.displayName = 'NavbarTableRowNeuNav'

NavbarTableRowNeuNav.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(NavbarTableRowNeuNav)
