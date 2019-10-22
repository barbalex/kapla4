import React from 'react'
import PropTypes from 'prop-types'
import { NavItem } from 'react-bootstrap'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import { FaTrashAlt } from 'react-icons/fa'

// eslint-disable-next-line no-unused-vars
const StyledNavItem = styled(NavItem)`
  border-right: ${props =>
    props['data-showgeschaeftenavs'] ? 'solid grey 1px' : 'dotted #505050 1px'};
`

const enhance = compose(
  inject('store'),
  observer,
)

const NavbarGeschaeftLoeschenNav = ({ store }) => {
  const { geschaeftSetDeleteIntended, showGeschaefteNavs } = store
  const { activeId } = store.geschaefte
  return (
    <StyledNavItem
      onClick={() => geschaeftSetDeleteIntended(activeId)}
      title="Geschäft löschen"
      disabled={!activeId}
      data-showgeschaeftenavs={showGeschaefteNavs}
    >
      <FaTrashAlt />
    </StyledNavItem>
  )
}

NavbarGeschaeftLoeschenNav.displayName = 'NavbarGeschaeftLoeschenNav'

NavbarGeschaeftLoeschenNav.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(NavbarGeschaeftLoeschenNav)
