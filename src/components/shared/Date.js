import React, { useState, useCallback, useEffect, useContext } from 'react'
import {
  Col,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  FormFeedback,
} from 'reactstrap'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { FaCalendarAlt } from 'react-icons/fa'

import storeContext from '../../storeContext'

moment.locale('de')

const StyledFormGroup = styled(FormGroup)`
  grid-column: 1;
  margin-bottom: ${props => (props.row ? '16px' : '8px !important')};
  .react-datepicker-popper {
    z-index: 10;
  }
  .react-datepicker {
    font-size: 12px;
  }
  .react-datepicker__header {
    padding-top: 0.8em;
  }
  .react-datepicker__month {
    margin: 0.4em 1em;
  }
  .react-datepicker__day-name,
  .react-datepicker__day {
    width: 1.9em;
    line-height: 1.9em;
    margin: 0.166em;
  }
  .react-datepicker__current-month {
    font-size: 1em;
  }
  .react-datepicker__navigation {
    top: 1em;
    line-height: 1.7em;
    border: 0.45em solid transparent;
  }
  .react-datepicker__navigation--previous {
    border-right-color: #ccc;
    left: 1em;
  }
  .react-datepicker__navigation--next {
    border-left-color: #ccc;
    right: 1em;
  }
  .input-group-append {
    display: ${props => (props['data-ispdf'] ? 'none' : 'flex')};
  }
`
const StyledLabel = styled(Label)`
  color: #757575;
  font-size: 12px;
  font-weight: 500;
`
const NonRowLabel = styled(Label)`
  margin-bottom: -2px;
  color: #757575;
  font-size: 12px;
  font-weight: 500;
`
const StyledInputGroupAddon = styled(InputGroupAddon)`
  cursor: pointer;
  span {
    border-top-right-radius: 0.25rem !important;
    border-bottom-right-radius: 0.25rem !important;
  }
`

const DateField = ({
  value,
  field,
  label,
  saveToDb,
  change,
  blur,
  error,
  row = false,
  tabIndex,
}) => {
  const store = useContext(storeContext)
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const isPdf = activeLocation === 'geschaeftPdf'

  const [stateValue, setStateValue] = useState(
    value || value === 0 ? value : '',
  )

  const onChangeDatePicker = useCallback(
    date => {
      const myEvent = {
        target: {
          value: moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY'),
          name: field,
        },
      }
      change(myEvent)
      blur(myEvent)
    },
    [blur, change, field],
  )

  // without lifecycle state value does not immediately update
  // after user enters new date
  useEffect(() => {
    setStateValue(value || value === 0 ? value : '')
  }, [value])

  console.log('Date', {
    isValid: moment(stateValue, 'dd.mm.yyyy').isValid(),
    date: moment(stateValue, 'dd.mm.yyyy').toDate(),
    stateValue,
  })

  const CustomInput = ({ value, onClick }) => (
    <InputGroup>
      <Input
        id={field}
        type="text"
        name={field}
        value={stateValue}
        onChange={change}
        onBlur={blur}
        invalid={!!error}
        tabIndex={tabIndex}
      />
      <StyledInputGroupAddon
        addonType="append"
        id="datePickerInputGroup"
        onClick={onClick}
        title="Kalender öffnen"
      >
        <span className="input-group-text">
          <FaCalendarAlt />
        </span>
      </StyledInputGroupAddon>
      <FormFeedback>{error}</FormFeedback>
    </InputGroup>
  )

  return (
    <StyledFormGroup row={row} data-ispdf={isPdf}>
      {row ? (
        <>
          <StyledLabel for={field} sm={2}>
            {label}
          </StyledLabel>
          <Col sm={10}>
            <DatePicker
              selected={
                moment(stateValue, 'dd.mm.yyyy').isValid()
                  ? new Date(moment(stateValue, 'dd.mm.yyyy').toDate())
                  : null
              }
              onChange={onChangeDatePicker}
              dateFormat="dd.mm.yyyy"
              customInput={<CustomInput />}
              openToDate={new Date(stateValue)}
            />
          </Col>
        </>
      ) : (
        <>
          <NonRowLabel for={field}>{label}</NonRowLabel>
          <DatePicker
            selected={
              moment(stateValue, 'dd.mm.yyyy').isValid()
                ? moment(stateValue, 'dd.mm.yyyy').toDate()
                : null
            }
            onChange={onChangeDatePicker}
            dateFormat="dd.mm.yyyy"
            customInput={<CustomInput />}
            openToDate={
              moment(stateValue, 'dd.mm.yyyy').isValid()
                ? new Date(moment(stateValue, 'dd.mm.yyyy').toDate())
                : null
            }
          />
        </>
      )}
    </StyledFormGroup>
  )
}

export default observer(DateField)
