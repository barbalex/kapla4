import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'

// eslint-disable-next-line no-unused-vars
const HistoryField = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: 55px 75px calc(100% - 130px);
  grid-gap: 0;
  border-bottom: thin solid #cecbcb;
  border-collapse: collapse;
  padding-left: 13px;
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: center;
  &:first-of-type {
    border-top: thin solid #cecbcb;
  }
  &:hover {
    background-color: rgb(227, 232, 255);
  }
`
const IdGeschaeft = styled.div`
  grid-column: 1;
`
const Datum = styled.div`
  grid-column: 2;
`
const Gegenstand = styled.div`
  grid-column: 3;
`

const AreaHistoryRows = ({ id, index }) => {
  const store = useContext(storeContext)
  const { toggleActivatedById, activeId, geschaefte } = store.geschaefte

  const onClick = useCallback(() => {
    if (id !== activeId) {
      return toggleActivatedById(id)
    }
  }, [activeId, id, toggleActivatedById])

  const geschaeft = geschaefte.find((g) => g.idGeschaeft === id)
  if (!geschaeft) {
    return null
  }

  return (
    <HistoryField
      style={{
        cursor: id === activeId ? 'default' : 'pointer',
      }}
      onClick={onClick}
    >
      <IdGeschaeft>{id}</IdGeschaeft>
      <Datum>{geschaeft.datumEingangAwel}</Datum>
      <Gegenstand>{geschaeft.gegenstand}</Gegenstand>
    </HistoryField>
  )
}

export default observer(AreaHistoryRows)
