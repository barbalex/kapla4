import React, { useContext, useCallback } from 'react'
import { NavItem } from 'react-bootstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { FaTrashAlt } from 'react-icons/fa'

import storeContext from '../../storeContext'

const StyledNavItem = styled(NavItem)`
  border-right: ${props =>
    props['data-showgeschaeftenavs'] ? 'solid grey 1px' : 'dotted #505050 1px'};
`

const NavbarGeschaeftLoeschenNav = () => {
  const store = useContext(storeContext)
  const { geschaeftSetDeleteIntended, showGeschaefteNavs } = store
  const { activeId } = store.geschaefte
  const onClick = useCallback(() => geschaeftSetDeleteIntended(activeId), [
    activeId,
    geschaeftSetDeleteIntended,
  ])

  return (
    <StyledNavItem
      onClick={onClick}
      title="Geschäft löschen"
      disabled={!activeId}
      data-showgeschaeftenavs={showGeschaefteNavs}
    >
      <FaTrashAlt />
    </StyledNavItem>
  )
}

export default observer(NavbarGeschaeftLoeschenNav)
