import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import Linkify from 'react-linkify'
import _ from 'lodash'
import $ from 'jquery'
import styled from 'styled-components'

const StyledRow = styled.div`
  border-bottom: 1px solid #bbbbbb;
  cursor: pointer;
  min-height: 38px;
  max-height: 38px;
  background-color: ${props => (props.isActive ? '#FFBF73' : 'inherit')};
  display: flex;
  padding: 5px;
`
const StyledBodyCell = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  max-width: ${props => `${props.maxWidth}px`};
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onClickTableRow: props => () => {
      const { store, index } = props
      const { tableRowToggleActivated } = store
      const { table, rows } = store.table
      const row = rows[index]
      tableRowToggleActivated(table, row.id)
    },
  }),
  observer,
)

const TableItem = ({ store, index, onClickTableRow }) => {
  const { rows, id } = store.table
  const row = rows[index]
  const { config } = store.app
  const keys = Object.keys(row)
  const values = _.values(row)
  const windowWidth = $(window).width()
  const tableWidth = windowWidth * config.tableColumnWidth / 100
  const normalFieldWidth = (tableWidth - 50) / (keys.length - 1)
  const isActive = !!id && id === row.id

  return (
    <StyledRow isActive={isActive}>
      {values.map((val, i) => (
        <StyledBodyCell // eslint-disable-line jsx-a11y/no-static-element-interactions
          key={i}
          maxWidth={keys[i] === 'id' ? 50 : normalFieldWidth}
          onClick={onClickTableRow}
        >
          <Linkify>{val}</Linkify>
        </StyledBodyCell>
      ))}
    </StyledRow>
  )
}

TableItem.displayName = 'TableItem'

TableItem.propTypes = {
  store: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onClickTableRow: PropTypes.func.isRequired,
}

export default enhance(TableItem)
