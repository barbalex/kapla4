import React, { useCallback, useMemo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Col, FormGroup, Label, FormFeedback } from 'reactstrap'
import Select from 'react-select'
import styled from 'styled-components'

import storeContext from '../../storeContext'

const StyledSelect = styled(Select)`
  height: ${props => (props['data-ispdf'] ? '30px' : '38px')};
  .react-select__control {
    ${props => props['data-ispdf'] && 'border-left: none !important;'}
    ${props => props['data-ispdf'] && 'border-top: none !important;'}
    ${props => props['data-ispdf'] && 'border-right: none !important;'}
    ${props => props['data-ispdf'] && 'border-radius: 0 !important;'}
    ${props => props['data-ispdf'] && 'min-height: 30px !important;'}
  }
  .react-select__control:focus-within {
    border-color: #80bdff !important;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  .react-select__value-container {
    ${props =>
      props['data-ispdf'] ? 'padding: 0 !important' : 'padding: 2px 8px'};
  }
  .react-select__indicators {
    ${props => (props['data-ispdf'] ? 'display: none' : 'display: flex')};
  }
  @media print {
    .react-select__control {
      border-left: none !important;
      border-top: none !important;
      border-right: none !important;
      border-radius: 0 !important;
    }
    .react-select__value-container {
      padding: 0 !important;
    }
    .react-select__indicators {
      display: none;
    }
  }
`
const NonRowLabel = styled(Label)`
  margin-bottom: -2px;
  color: #757575;
  font-size: 12px;
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
  placeholder = '',
}) => {
  const onChange = useCallback(
    option => saveToDb({ value: option ? option.value : null, field }),
    [field, saveToDb],
  )
  // need to return '' instead of undefined if no option is found
  // otherwise field does not update
  const option = useMemo(() => options.find(o => o.value === value) || '', [
    options,
    value,
  ])
  const store = useContext(storeContext)
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const isPdf = activeLocation === 'geschaeftPdf'

  return (
    <StyledFormGroup row={row}>
      {row ? (
        <>
          {!!label && (
            <Label for={field} sm={2}>
              {label}
            </Label>
          )}
          <Col sm={10}>
            <StyledSelect
              id={field}
              name={field}
              value={option}
              options={options}
              onChange={onChange}
              hideSelectedOptions
              placeholder={placeholder}
              isClearable
              isSearchable
              noOptionsMessage={noOptionsMessage}
              invalid={!!error}
              tabIndex={tabIndex}
              className="react-select-container"
              classNamePrefix="react-select"
              data-ispdf={isPdf}
            />
            {!!error && <FormFeedback>{error}</FormFeedback>}
          </Col>
        </>
      ) : (
        <>
          {!!label && <NonRowLabel for={field}>{label}</NonRowLabel>}
          <StyledSelect
            id={field}
            name={field}
            value={option}
            options={options}
            onChange={onChange}
            hideSelectedOptions
            placeholder={placeholder}
            isClearable
            isSearchable
            noOptionsMessage={noOptionsMessage}
            invalid={!!error}
            tabIndex={tabIndex}
            className="react-select-container"
            classNamePrefix="react-select"
            data-ispdf={isPdf}
          />
          {!!error && <FormFeedback>{error}</FormFeedback>}
        </>
      )}
    </StyledFormGroup>
  )
}

export default observer(SharedSelect)
