import React from 'react'
import PropTypes from 'prop-types'
import { NavItem } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import { FaPlus } from 'react-icons/fa'

const enhance = compose(
  inject('store'),
  observer,
)

const NavbarGeschaeftNeuNav = ({ store }) => (
  <NavItem onClick={store.geschaeftNewCreate} title="neues Geschäft">
    <FaPlus />
  </NavItem>
)

NavbarGeschaeftNeuNav.displayName = 'NavbarGeschaeftNeuNav'

NavbarGeschaeftNeuNav.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(NavbarGeschaeftNeuNav)
