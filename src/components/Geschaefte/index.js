import React, { useContext } from 'react'
import { AutoSizer, List } from 'react-virtualized'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'

import RowRenderer from './RowRenderer'
import NoRowsRenderer from './NoRowsRenderer'
import storeContext from '../../storeContext'

const Container = styled.div`
  background-image: linear-gradient(
    45deg,
    rgba(235, 255, 229, 0.5) 10%,
    rgba(216, 255, 200, 0.7)
  );
  height: 100vh;
`
const StyledTable = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  -webkit-user-select: none;
`
const StyledHeader = styled.div`
  border-bottom: 2px solid #717171;
  font-weight: 700;
`
const StyledRow = styled.div`
  display: flex;
  padding: 5px;
  padding-right: 17px;
`
const StyledId = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 44px;
  max-width: 44px;
`
const StyledGegenstand = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
`
const StyledStatus = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 120px;
  max-width: 120px;
`
const StyledKontakt = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 100px;
  max-width: 100px;
`
const StyledBody = styled.div`
  height: calc(100vh - 82px);
  overflow: hidden;
`
const StyledList = styled(List)`
  overflow-y: overlay !important;
`

const Geschaefte = () => {
  const store = useContext(storeContext)
  const {
    activeId,
    geschaeftePlusFilteredAndSorted: geschaefte,
  } = store.geschaefte
  // get index of active id
  const indexOfActiveId = _.findIndex(
    geschaefte,
    g => g.idGeschaeft === activeId,
  )

  return (
    <ErrorBoundary>
      <Container>
        <StyledTable>
          <StyledHeader>
            <StyledRow>
              <StyledId>ID</StyledId>
              <StyledGegenstand>Gegenstand</StyledGegenstand>
              <StyledStatus>Status</StyledStatus>
              <StyledKontakt>Verantwortlich</StyledKontakt>
            </StyledRow>
          </StyledHeader>
          <StyledBody>
            <AutoSizer>
              {({ height, width }) => (
                <StyledList
                  height={height}
                  rowCount={geschaefte.length}
                  rowHeight={77}
                  rowRenderer={RowRenderer}
                  noRowsRenderer={() => <NoRowsRenderer />}
                  width={width}
                  scrollToIndex={indexOfActiveId}
                  {...geschaefte}
                />
              )}
            </AutoSizer>
          </StyledBody>
        </StyledTable>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Geschaefte)
