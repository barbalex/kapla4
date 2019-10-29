import React, { useContext, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Col, FormGroup, Label, Input, FormFeedback } from 'reactstrap'
import styled from 'styled-components'

import storeContext from '../../storeContext'

const NonRowLabel = styled(Label)`
  margin-bottom: 3px;
`
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${props => (props.row ? '16px' : '8px !important')};
`

const SharedInput = ({
  value,
  field,
  label,
  type = 'text',
  rows = 1,
  placeholder = '',
  disabled = false,
  saveToDb,
  error,
  row = true,
}) => {
  const store = useContext(storeContext)
  const { showFilter, setDirty } = store
  const [stateValue, setStateValue] = useState(
    value || value === 0 ? value : '',
  )

  const onBlur = useCallback(
    event => {
      let newValue = event.target.value
      // save nulls if empty
      if (newValue === '') newValue = null
      // only save if value has changed
      if (!showFilter && (!newValue && !value && value !== 0 && newValue !== 0))
        return
      if (!showFilter && newValue === value) return
      saveToDb({ value: newValue, field })
      setDirty(false)
    },
    [field, saveToDb, setDirty, showFilter, value],
  )
  const onChange = useCallback(
    event => {
      setStateValue(event.target.value)
      if (event.target.value !== value) setDirty(true)
      if (showFilter) {
        // call onBlur to immediately update filters
        onBlur(event)
      }
    },
    [onBlur, setDirty, showFilter, value],
  )

  // need this check because of filtering:
  // when filter is emptied, value needs to reset
  useEffect(() => {
    setStateValue(value || value === 0 ? value : '')
  }, [value])

  return (
    <StyledFormGroup row={row}>
      {row ? (
        <>
          <Label for={field} sm={2}>
            {label}
          </Label>
          <Col sm={10}>
            <Input
              id={field}
              type={type}
              name={field}
              placeholder={placeholder}
              disabled={disabled}
              value={stateValue}
              onChange={onChange}
              onBlur={onBlur}
              rows={rows}
              invalid={!!error}
            />
            <FormFeedback>{error}</FormFeedback>
          </Col>
        </>
      ) : (
        <>
          <NonRowLabel for={field}>{label}</NonRowLabel>
          <Input
            id={field}
            type={type}
            name={field}
            placeholder={placeholder}
            disabled={disabled}
            value={stateValue}
            onChange={onChange}
            onBlur={onBlur}
            rows={rows}
            invalid={!!error}
          />
          <FormFeedback>{error}</FormFeedback>
        </>
      )}
    </StyledFormGroup>
  )
}

export default observer(SharedInput)
