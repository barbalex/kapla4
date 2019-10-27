import React, { useContext, useCallback } from 'react'
import SplitPane from 'react-split-pane'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import TableRow from './Table/TableRow'
import Table from './Table'
import storeContext from '../storeContext'

const StyledSplitPane = styled(SplitPane)`
  top: 52px;
`

const TableLayout = () => {
  const store = useContext(storeContext)
  const { config, configSetKey } = store.app
  const { id } = store.table

  const onChange = useCallback(size => configSetKey('tableColumnWidth', size), [
    configSetKey,
  ])

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
