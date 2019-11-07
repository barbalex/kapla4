import React, { useContext, useCallback, useState, useEffect } from 'react'
import { FormGroup, Form } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import storeContext from '../../storeContext'
import Input from '../shared/Input'

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
  margin-bottom: 3px !important;
`

const TableRow = () => {
  const store = useContext(storeContext)
  const { rows, id, table, updateInDb } = store.table
  const row = rows[table].find(r => r.id === id)

  const saveToDb = useCallback(
    ({ value, field }) => updateInDb(id, field, value),
    [id, updateInDb],
  )

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [row.id])

  if (row === undefined) return null

  return (
    <StyledRow>
      <Form>
        {Object.keys(row).map((fieldName, index) => {
          let value = row[fieldName]
          // react complains if value is null
          if (value === null) value = ''

          return (
            <StyledFormGroup key={index}>
              <Input
                key={`${row.id}${fieldName}`}
                value={value}
                field={fieldName}
                label={fieldName}
                saveToDb={saveToDb}
                error={errors[fieldName]}
              />
            </StyledFormGroup>
          )
        })}
      </Form>
    </StyledRow>
  )
}

export default observer(TableRow)
