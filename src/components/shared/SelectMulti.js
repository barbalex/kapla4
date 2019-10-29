import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { Col, FormGroup, Label, FormFeedback } from 'reactstrap'
import Select from 'react-select'
import styled from 'styled-components'

const StyledSelect = styled(Select)`
  height: 38px;
  > div > div > div {
    top: 46% !important;
  }
  > div {
    background-color: rgba(255, 255, 255, 1) !important;
  }
  > div:focus-within {
    border-color: #80bdff !important;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  > div:hover {
    border-color: rgb(204, 204, 204);
  }
`
const NonRowLabel = styled(Label)`
  margin-bottom: 3px;
`
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${props => (props.row ? '16px' : '8px !important')};
`

const noOptionsMessage = () => '(keine)'

const SharedSelectMulti = ({
  value,
  field,
  label,
  options,
  add,
  remove,
  error,
  row = true,
}) => {
  const onChange = useCallback(
    (unusedOption, { action, option, removedValue }) => {
      if (action === 'select-option') {
        return add(option.value)
      }
      if (action === 'remove-value' && removedValue) {
        remove(removedValue.value)
      }
    },
    [add, remove],
  )

  return (
    <StyledFormGroup row={row}>
      {row ? (
        <>
          <Label for={field} sm={2}>
            {label}
          </Label>
          <Col sm={10}>
            <StyledSelect
              id={field}
              name={field}
              isMulti
              value={value || ''}
              options={options}
              onChange={onChange}
              hideSelectedOptions
              placeholder=""
              isClearable={false}
              isSearchable
              noOptionsMessage={noOptionsMessage}
              invalid={!!error}
            />
            <FormFeedback>{error}</FormFeedback>
          </Col>
        </>
      ) : (
        <>
          <NonRowLabel for={field}>{label}</NonRowLabel>
          <StyledSelect
            id={field}
            name={field}
            isMulti
            value={value || ''}
            options={options}
            onChange={onChange}
            hideSelectedOptions
            placeholder=""
            isClearable={false}
            isSearchable
            noOptionsMessage={noOptionsMessage}
            invalid={!!error}
          />
          <FormFeedback>{error}</FormFeedback>
        </>
      )}
    </StyledFormGroup>
  )
}

export default observer(SharedSelectMulti)
