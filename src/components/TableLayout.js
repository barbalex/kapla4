import React from 'react'
import PropTypes from 'prop-types'
import SplitPane from 'react-split-pane'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import TableRow from './Table/TableRow'
import Table from './Table'

const StyledSplitPane = styled(SplitPane)`top: 52px;`

const enhance = compose(
  inject('store'),
  withHandlers({
    onChange: props => size => props.store.configSetKey('tableColumnWidth', size),
  }),
  observer,
)

const TableLayout = ({ store, onChange }) => {
  const { config } = store.app
  const { id } = store.table

  return (
    <StyledSplitPane split="vertical" minSize={100} defaultSize={config.tableColumnWidth} onChange={onChange}>
      <Table />
      <div>{id && <TableRow />}</div>
    </StyledSplitPane>
  )
}

TableLayout.propTypes = {
  store: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default enhance(TableLayout)
