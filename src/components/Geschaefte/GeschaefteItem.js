import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import storeContext from '../../storeContext'

const StyledId = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  min-height: 67px;
  max-height: 67px;
  min-width: 44px;
  max-width: 44px;
`
const StyledGegenstand = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  min-height: 67px;
  max-height: 67px;
  width: 100%;
`
const StyledStatus = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  min-height: 67px;
  max-height: 67px;
  min-width: 120px;
  max-width: 120px;
`
const StyledKontakt = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  min-height: 67px;
  max-height: 67px;
  min-width: 100px;
  max-width: 100px;
`
const FristMitarbeiterWarnungDiv = styled.div`
  font-weight: ${props => (props.fristInStyle ? 900 : 'inherit')};
  letter-spacing: ${props => (props.fristInStyle ? '0.35em' : 'inherit')};
  font-size: ${props => (props.fristInStyle ? '16px' : 'inherit')};
  -webkit-text-stroke-color: ${props =>
    props.fristInStyle ? 'black' : 'inherit'};
  -webkit-text-stroke-width: ${props =>
    props.fristInStyle ? '1.3px' : 'inherit'};
  -webkit-text-fill-color: ${props => {
    if (props.fristInStyle === 'red') return 'red'
    if (props.fristInStyle === 'yellow') return 'yellow'
    return 'inherit'
  }};
`
const StyledRow = styled.div`
  display: flex;
  padding: 5px;
  /* Scrollbar overlays row so need to add 12px padding */
  padding-right: 17px;
  border-bottom: 1px solid #bbbbbb;
  cursor: pointer;
  min-height: 77px;
  max-height: 77px;
  background-color: ${props => (props.active ? '#FFBF73' : 'inherit')};
`
const GegenstandDiv = styled.div`
  font-weight: 700;
  /**
   * show ellipsis ... when text
   * overflows three lines
   * source: http://stackoverflow.com/a/18458345/712005;
   */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  max-height: 4.1em;
  overflow: hidden;
`
const getStatusFristInStyle = fristMitarbeiterWarnung => {
  if (fristMitarbeiterWarnung === 'FÄLLIG') return 'red'
  if (fristMitarbeiterWarnung === 'HEUTE') return 'yellow'
  return null
}

const GeschaefteItem = ({ index }) => {
  const store = useContext(storeContext)
  const { geschaeftToggleActivated } = store
  const {
    activeId,
    geschaeftePlusFilteredAndSorted: geschaefte,
  } = store.geschaefte
  const geschaeft = geschaefte[index]
  const active = activeId && activeId === geschaeft.idGeschaeft

  const onClick = useCallback(() => {
    const path = store.history.location.pathname
    const geschaeft = geschaefte[index]
    // if path is not '/geschaefte', make it that
    // because this is also called from '/fieldFilter'
    if (path === '/filterFields') {
      store.history.push('/geschaefte')
    }
    geschaeftToggleActivated(geschaeft.idGeschaeft)
  }, [geschaeftToggleActivated, geschaefte, index, store.history])
  // make sure geschaeft exists
  if (!geschaeft) return null
  const fristMitarbeiter = geschaeft.fristMitarbeiter
    ? `Frist: ${geschaeft.fristMitarbeiter}`
    : ''

  return (
    <StyledRow active={active} onClick={onClick}>
      <StyledId>
        <div>{geschaeft.idGeschaeft}</div>
      </StyledId>
      <StyledGegenstand>
        <GegenstandDiv>{geschaeft.gegenstand}</GegenstandDiv>
      </StyledGegenstand>
      <StyledStatus>
        <div>{geschaeft.status}</div>
        <div>{fristMitarbeiter}</div>
        <FristMitarbeiterWarnungDiv
          fristInStyle={getStatusFristInStyle(
            geschaeft.fristMitarbeiterWarnung,
          )}
        >
          {geschaeft.fristMitarbeiterWarnung}
        </FristMitarbeiterWarnungDiv>
      </StyledStatus>
      <StyledKontakt>
        <div>{geschaeft.verantwortlichName}</div>
        <div>{geschaeft.verantwortlich}</div>
      </StyledKontakt>
    </StyledRow>
  )
}

export default observer(GeschaefteItem)
