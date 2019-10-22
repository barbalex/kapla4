import React, { useContext } from 'react'
import { NavItem } from 'react-bootstrap'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import { FaTrashAlt } from 'react-icons/fa'

import storeContext from '../../storeContext'

// eslint-disable-next-line no-unused-vars
const StyledNavItem = styled(NavItem)`
  border-right: ${props =>
    props['data-showgeschaeftenavs'] ? 'solid grey 1px' : 'dotted #505050 1px'};
`

const enhance = compose(observer)

const NavbarGeschaeftLoeschenNav = () => {
  const store = useContext(storeContext)
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

export default enhance(NavbarGeschaeftLoeschenNav)
