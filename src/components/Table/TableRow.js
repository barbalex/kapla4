import React from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'

const StyledRow = styled.div`
  background-image: linear-gradient(45deg, rgba(255, 236, 195, 0.5) 10%, rgba(255, 232, 147, 0.7));
  height: calc(100vh - 52px);
  padding: 10px;
  overflow-y: auto;
`
const StyledFormGroup = styled(FormGroup)`
  padding-top: 3px;
  padding-bottom: 3px;
`

const change = ({ event, id, tableChangeState }) => {
  const { type, name, dataset } = event.target
  let { value } = event.target
  if (type === 'radio') {
    value = dataset.value
    // blur does not occur in radio
    blur(event)
  }
  tableChangeState(id, name, value)
}

const blur = ({ event, table, id, changeTableInDb }) => {
  const { type, name, dataset } = event.target
  let { value } = event.target
  if (type === 'radio') value = dataset.value
  changeTableInDb(table, id, name, value)
}

const fields = ({ row, table, id, tableChangeState, changeTableInDb }) =>
  Object.keys(row).map((fieldName, index) => {
    let value = row[fieldName]
    // react complains if value is null
    if (value === null) value = ''
    const field = (
      <StyledFormGroup key={index}>
        <ControlLabel>{fieldName}</ControlLabel>
        <FormControl
          type="text"
          name={fieldName}
          value={value}
          onChange={event => change({ event, table, id, tableChangeState })}
          onBlur={event => blur({ event, table, id, changeTableInDb })}
        />
      </StyledFormGroup>
    )
    return field
  })

const enhance = compose(inject('store'), observer)

const TableRow = ({ store }) => {
  const { tableChangeState, changeTableInDb } = store
  const { rows, id, table } = store.table
  const row = rows.find(r => r.id === id)

  if (row === undefined) return null

  return (
    <StyledRow>
      <Form>
        {fields({
          row,
          table,
          id,
          tableChangeState,
          changeTableInDb,
        })}
      </Form>
    </StyledRow>
  )
}

TableRow.displayName = 'TableRow'

TableRow.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(TableRow)
