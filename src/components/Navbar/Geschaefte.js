import React, { useContext, useCallback } from 'react'
import { NavItem, NavLink, Button, UncontrolledTooltip } from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FaPlus, FaTrashAlt } from 'react-icons/fa'

import storeContext from '../../storeContext'

const Sup = styled.sup`
  padding-left: 3px;
`
const StyledNavItem = styled(NavItem)`
  display: flex;
  border: ${props =>
    props.active ? '1px solid rgb(255, 255, 255, .5)' : 'unset'};
  border-radius: 0.25rem;
  margin-right: 5px;
`
const StyledButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0) !important;
  border: unset !important;
`

const Geschaefte = () => {
  const store = useContext(storeContext)
  const { setLocation } = store
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const {
    geschaefteFilteredAndSorted,
    geschaefte,
    geschaeftInsert,
    geschaeftSetDeleteIntended,
    activeId,
    isFiltered,
  } = store.geschaefte
  const active = ['geschaefte', 'filterFields'].includes(activeLocation)

  const onClickGeschaefte = useCallback(() => {
    if (activeLocation !== 'geschaefte') setLocation(['geschaefte'])
  }, [activeLocation, setLocation])
  const onClickDelete = useCallback(
    () => geschaeftSetDeleteIntended(activeId),
    [activeId, geschaeftSetDeleteIntended],
  )

  const geschaefteSumSup = isFiltered
    ? `${geschaefteFilteredAndSorted.length}/${geschaefte.length}`
    : geschaefte.length

  return (
    <StyledNavItem active={active}>
      <NavLink id="geschaefte" onClick={onClickGeschaefte}>
        Geschäfte
        {active && <Sup>{geschaefteSumSup}</Sup>}
      </NavLink>
      {!active && (
        <UncontrolledTooltip placement="bottom" target="geschaefte">
          Geschäfte anzeigen
        </UncontrolledTooltip>
      )}
      {active && (
        <>
          <StyledButton id="newGeschaeftButton" onClick={geschaeftInsert}>
            <FaPlus />
          </StyledButton>
          <UncontrolledTooltip placement="bottom" target="newGeschaeftButton">
            neues Geschäft erfassen
          </UncontrolledTooltip>
          <StyledButton
            id="deleteGeschaeftButton"
            onClick={onClickDelete}
            disabled={!activeId}
          >
            <FaTrashAlt />
          </StyledButton>
          {activeId && (
            <UncontrolledTooltip
              placement="bottom"
              target="deleteGeschaeftButton"
            >
              markiertes Geschäft löschen
            </UncontrolledTooltip>
          )}
        </>
      )}
    </StyledNavItem>
  )
}

export default observer(Geschaefte)
