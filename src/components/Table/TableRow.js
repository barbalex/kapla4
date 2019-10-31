import React, { useContext, useCallback } from 'react'
import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import storeContext from '../../storeContext'

const StyledRow = styled.div`
  background-image: linear-gradient(
    45deg,
    rgba(255, 236, 195, 0.5) 10%,
    rgba(255, 232, 147, 0.7)
  );
  height: calc(100vh - 58px);
  padding: 10px;
  overflow-y: auto;
`
const StyledFormGroup = styled(FormGroup)`
  padding-top: 3px;
  padding-bottom: 3px;
`

const TableRow = () => {
  const store = useContext(storeContext)
  const { rows, id, table, changeState, updateInDb } = store.table
  const row = rows[table].find(r => r.id === id)

  /**
   * TODO:
   * somehow this is called with _last_ name
   * but next value when bluring next field
   */
  const onBlur = useCallback(
    event => {
      const { type, name, dataset } = event.target
      let { value } = event.target
      if (type === 'radio') value = dataset.value
      console.log('TableRow, onBlur', { name, value, id, table })
      updateInDb(id, name, value)
    },
    [updateInDb, id, table],
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
      console.log('TableRow, onChange', { name, value, id })
      changeState(id, name, value)
    },
    [id, onBlur, changeState],
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
