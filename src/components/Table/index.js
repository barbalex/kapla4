import React, { useContext, useEffect } from 'react'
import { AutoSizer, List } from 'react-virtualized'
import _ from 'lodash'
import $ from 'jquery'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary'
import TableItem from './TableItem'
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
  top: 58px;
  width: 100%;
`
const StyledTableHeader = styled.div`
  border-bottom: 2px solid #717171;
  font-weight: 700;
`
const StyledTableHeaderRow = styled.div`
  display: flex;
  padding: 5px;
  padding-right: ${(props) => props.paddingRight};
`
const StyledTableHeaderCell = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  max-width: ${(props) => `${props.maxWidth}px`};
`
const StyledTableBody = styled.div`
  overflow: auto;
  height: calc(100vh - 96px);
`
const StyledNoRowsDiv = styled.div`
  padding: 10px;
  font-weight: bold;
`
const StyledList = styled(List)`
  overflow-y: overlay !important;
`

const rowRenderer = ({ key, index, style }) => (
  <div key={key} style={style}>
    <TableItem index={index} />
  </div>
)
const noRowsRenderer = () => <StyledNoRowsDiv>lade Daten...</StyledNoRowsDiv>

const Table = () => {
  const store = useContext(storeContext)
  const { tableColumnWidth } = store.app
  const { rows, id, table, reset } = store.table

  const indexOfActiveId = _.findIndex(rows[table], (r) => r.id === id)
  const headers = Object.keys(rows[table][0] || {})
  const windowWidth = $(window).width()
  const tableWidth = (windowWidth * tableColumnWidth) / 100
  const normalFieldWidth = (tableWidth - 50) / (headers.length - 1)

  useEffect(() => {
    return () => reset()
  }, [reset])

  return (
    <ErrorBoundary>
      <Container>
        <StyledTable>
          <StyledTableHeader>
            <StyledTableHeaderRow>
              {headers.map((header, index) => (
                <StyledTableHeaderCell
                  key={index}
                  maxWidth={header === 'id' ? 50 : normalFieldWidth}
                >
                  {header}
                </StyledTableHeaderCell>
              ))}
            </StyledTableHeaderRow>
          </StyledTableHeader>
          <StyledTableBody>
            <AutoSizer>
              {({ height, width }) => (
                <StyledList
                  height={height}
                  rowCount={rows[table].length}
                  rowHeight={38}
                  rowRenderer={rowRenderer}
                  noRowsRenderer={noRowsRenderer}
                  width={width}
                  scrollToIndex={indexOfActiveId}
                  {...rows[table]}
                />
              )}
            </AutoSizer>
          </StyledTableBody>
        </StyledTable>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Table)
