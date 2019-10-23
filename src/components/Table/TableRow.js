import React, { useContext, useCallback } from 'react'
import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import storeContext from '../../storeContext'

const StyledRow = styled.div`
  background-image: linear-gradient(
    45deg,
    rgba(255, 236, 195, 0.5) 10%,
    rgba(255, 232, 147, 0.7)
  );
  height: calc(100vh - 52px);
  padding: 10px;
  overflow-y: auto;
`
const StyledFormGroup = styled(FormGroup)`
  padding-top: 3px;
  padding-bottom: 3px;
`

const TableRow = () => {
  const store = useContext(storeContext)
  const { tableChangeState, changeTableInDb } = store
  const { rows, id, table } = store.table
  const row = rows.find(r => r.id === id)

  const onBlur = useCallback(
    event => {
      const { type, name, dataset } = event.target
      let { value } = event.target
      if (type === 'radio') value = dataset.value
      changeTableInDb(table, id, name, value)
    },
    [changeTableInDb, id, table],
  )
  const onChange = useCallback(
    event => {
      const { type, name, dataset } = event.target
      let { value } = event.target
      if (type === 'radio') {
        value = dataset.value
        // onBlur does not occur in radio
        onBlur(event)
      }
      tableChangeState(id, name, value)
    },
    [id, onBlur, tableChangeState],
  )

  if (row === undefined) return null

  return (
    <StyledRow>
      <Form>
        {Object.keys(row).map((fieldName, index) => {
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
                onChange={onChange}
                onBlur={onBlur}
              />
            </StyledFormGroup>
          )
          return field
        })}
      </Form>
    </StyledRow>
  )
}

export default observer(TableRow)
