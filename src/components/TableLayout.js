import React, { useContext, useCallback } from 'react'
import SplitPane from 'react-split-pane'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import TableRow from './Table/TableRow'
import Table from './Table'
import storeContext from '../storeContext'

const StyledSplitPane = styled(SplitPane)`
  top: 58px;
`

const TableLayout = () => {
  const store = useContext(storeContext)
  const { setTableColumnWidth, tableColumnWidth, saveConfig } = store.app
  const { id } = store.table

  const [saveConfigDebounced] = useDebouncedCallback(size => {
    saveConfig()
  }, 200)

  return (
    <StyledSplitPane
      split="vertical"
      minSize={100}
      defaultSize={tableColumnWidth}
      onChange={value => {
        setTableColumnWidth(value)
        saveConfigDebounced(value)
      }}
    >
      <Table />
      <div>{id && <TableRow />}</div>
    </StyledSplitPane>
  )
}

export default observer(TableLayout)
