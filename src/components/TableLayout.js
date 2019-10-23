import React, { useContext, useCallback } from 'react'
import SplitPane from 'react-split-pane'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import TableRow from './Table/TableRow'
import Table from './Table'
import mobxStoreContext from '../mobxStoreContext'

const StyledSplitPane = styled(SplitPane)`
  top: 52px;
`

const TableLayout = () => {
  const store = useContext(mobxStoreContext)
  const { config } = store.app
  const { id } = store.table

  const onChange = useCallback(
    size => store.configSetKey('tableColumnWidth', size),
    [store],
  )

  return (
    <StyledSplitPane
      split="vertical"
      minSize={100}
      defaultSize={config.tableColumnWidth}
      onChange={onChange}
    >
      <Table />
      <div>{id && <TableRow />}</div>
    </StyledSplitPane>
  )
}

export default observer(TableLayout)
