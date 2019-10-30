import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import storeContext from '../../storeContext'

const FieldsContainer = styled.div`
  grid-area: areaHistoryFieldsContainer;
  display: grid;
  grid-template-columns: 100%;
`
// eslint-disable-next-line no-unused-vars
const HistoryField = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: ${props =>
    props['data-ispdf']
      ? '40px 65px calc(100% - 105px)'
      : '55px 75px calc(100% - 130px)'};
  grid-gap: 0;
  border-bottom: thin solid #cecbcb;
  padding-left: ${props => (props['data-ispdf'] ? 0 : '13px')};
  padding-top: ${props => (props['data-ispdf'] ? '2px' : '10px')};
  padding-bottom: ${props => (props['data-ispdf'] ? '2px' : '10px')};
  align-items: center;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};

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

const AreaHistoryRows = () => {
  const store = useContext(storeContext)
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const {
    toggleActivatedById,
    activeId,
    geschaeftePlusFilteredAndSorted: geschaefte,
    historyOfActiveId,
  } = store.geschaefte
  const isPdf = activeLocation === 'geschaeftPdf'
  const history = historyOfActiveId

  return (
    <ErrorBoundary>
      <FieldsContainer>
        {history.map((id, index) => {
          const geschaeft = geschaefte.find(g => g.idGeschaeft === id)
          if (!geschaeft) {
            return null
          }
          return (
            <HistoryField
              // add index for cases where two geschaefte
              // reference each other...
              key={`${id}${index}`}
              style={{
                cursor: id === activeId ? 'default' : 'pointer',
              }}
              onClick={() => {
                if (id !== activeId) {
                  return toggleActivatedById(id)
                }
              }}
              data-ispdf={isPdf}
            >
              <IdGeschaeft>{id}</IdGeschaeft>
              <Datum>{geschaeft.datumEingangAwel}</Datum>
              <Gegenstand>{geschaeft.gegenstand}</Gegenstand>
            </HistoryField>
          )
        })}
      </FieldsContainer>
    </ErrorBoundary>
  )
}

export default observer(AreaHistoryRows)
