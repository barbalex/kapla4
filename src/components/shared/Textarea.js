import React, { useContext, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Col, FormGroup, Label, FormFeedback } from 'reactstrap'
import Textarea from 'react-textarea-autosize'
import styled from 'styled-components'

import storeContext from '../../storeContext'

const NonRowLabel = styled(Label)`
  margin-bottom: 3px;
`
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${props => (props.row ? '16px' : '8px !important')};
`
const StyledTextarea = styled(Textarea)`
  display: block;
  width: 100%;
  min-height: 32px;
  padding: 6px 12px;
  line-height: 1.42857143;
  color: #555;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  &:focus {
    border-color: #66afe9;
    outline: 0;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(102, 175, 233, 0.6);
  }
`

const SharedTextarea = ({
  value,
  field,
  label,
  placeholder = '',
  disabled = false,
  saveToDb,
  error,
  row = false,
  tabIndex = 0,
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
            <StyledTextarea
              id={field}
              name={field}
              placeholder={placeholder}
              disabled={disabled}
              value={stateValue}
              onChange={onChange}
              onBlur={onBlur}
              tabIndex={tabIndex}
            />
            <FormFeedback>{error}</FormFeedback>
          </Col>
        </>
      ) : (
        <>
          <NonRowLabel for={field}>{label}</NonRowLabel>
          <StyledTextarea
            id={field}
            name={field}
            placeholder={placeholder}
            disabled={disabled}
            value={stateValue}
            onChange={onChange}
            onBlur={onBlur}
            tabIndex={tabIndex}
          />
          <FormFeedback>{error}</FormFeedback>
        </>
      )}
    </StyledFormGroup>
  )
}

export default observer(SharedTextarea)