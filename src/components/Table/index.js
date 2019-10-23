import React, { useContext, useEffect } from 'react'
import { AutoSizer, List } from 'react-virtualized'
import _ from 'lodash'
import $ from 'jquery'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import TableItem from './TableItem'
import mobxStoreContext from '../../mobxStoreContext'

const Container = styled.div`
  background-image: linear-gradient(
    45deg,
    rgba(235, 255, 229, 0.5) 10%,
    rgba(216, 255, 200, 0.7)
  );
  height: 100vh;
`
const StyledTable = styled.div`
  top: 52px;
  width: 100%;
`
const StyledTableHeader = styled.div`
  border-bottom: 2px solid #717171;
  font-weight: 700;
`
const StyledTableHeaderRow = styled.div`
  display: flex;
  padding: 5px;
  padding-right: ${props => props.paddingRight};
`
const StyledTableHeaderCell = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  max-width: ${props => `${props.maxWidth}px`};
`
const StyledTableBody = styled.div`
  overflow: auto;
  height: calc(100vh - 82px);
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
  const store = useContext(mobxStoreContext)
  const { tableReset } = store
  const { config } = store.app
  const { rows, id } = store.table

  const indexOfActiveId = _.findIndex(rows, r => r.id === id)
  const headers = Object.keys(rows[0] || {})
  const windowWidth = $(window).width()
  const tableWidth = (windowWidth * config.tableColumnWidth) / 100
  const normalFieldWidth = (tableWidth - 50) / (headers.length - 1)

  useEffect(() => {
    return () => tableReset()
  }, [tableReset])

  return (
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
                rowCount={rows.length}
                rowHeight={38}
                rowRenderer={rowRenderer}
                noRowsRenderer={noRowsRenderer}
                width={width}
                scrollToIndex={indexOfActiveId}
                {...rows}
              />
            )}
          </AutoSizer>
        </StyledTableBody>
      </StyledTable>
    </Container>
  )
}

export default observer(Table)
