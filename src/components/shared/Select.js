import React, { useCallback, useMemo } from 'react'
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
  margin-bottom: -2px;
  color: #757575;
  font-size: 11px;
  font-weight: 500;
`
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${props => (props.row ? '16px' : '8px !important')};
`

const noOptionsMessage = () => '(keine)'

const SharedSelect = ({
  value,
  field,
  label,
  options,
  saveToDb,
  error,
  row = false,
  tabIndex = 0,
}) => {
  const onChange = useCallback(
    option => saveToDb({ value: option ? option.value : null, field }),
    [field, saveToDb],
  )
  // need to return null instead of undefined if no option is found
  // otherwise field does not update
  const option = useMemo(() => options.find(o => o.value === value) || null, [
    options,
    value,
  ])

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
              value={option}
              options={options}
              onChange={onChange}
              hideSelectedOptions
              placeholder=""
              isClearable
              isSearchable
              noOptionsMessage={noOptionsMessage}
              invalid={!!error}
              tabIndex={tabIndex}
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
            value={option}
            options={options}
            onChange={onChange}
            hideSelectedOptions
            placeholder=""
            isClearable
            isSearchable
            noOptionsMessage={noOptionsMessage}
            invalid={!!error}
            tabIndex={tabIndex}
          />
          <FormFeedback>{error}</FormFeedback>
        </>
      )}
    </StyledFormGroup>
  )
}

export default observer(SharedSelect)
