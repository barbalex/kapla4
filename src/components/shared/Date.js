import React, { useState, useCallback, useEffect, useContext } from 'react'
import {
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

const Container = styled.div`
  grid-column: 1;
  margin-bottom: ${props => (props.row ? '16px' : '8px !important')};
`
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: 0 !important;
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker-popper {
    z-index: 10;
  }
  .react-datepicker {
    font-size: 12px;
    user-select: none !important;
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
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
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

  const CustomInputRow = ({ value, onClick }) => (
    <StyledFormGroup data-ispdf={isPdf}>
      <StyledLabel for={field} sm={2}>
        {label}
      </StyledLabel>
      <InputGroup size="sm">
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
    </StyledFormGroup>
  )
  const CustomInputNonRow = ({ value, onClick }) => (
    <StyledFormGroup data-ispdf={isPdf}>
      <NonRowLabel for={field}>{label}</NonRowLabel>
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
    </StyledFormGroup>
  )

  if (row)
    return (
      <Container row={row}>
        <StyledDatePicker
          selected={
            moment(stateValue, 'DD.MM.YYYY').isValid()
              ? new Date(moment(stateValue, 'DD.MM.YYYY').toDate())
              : null
          }
          onChange={onChangeDatePicker}
          dateFormat="dd.mm.yyyy"
          customInput={<CustomInputRow />}
          openToDate={
            moment(stateValue, 'DD.MM.YYYY').isValid()
              ? moment(stateValue, 'DD.MM.YYYY').toDate()
              : null
          }
        />
      </Container>
    )

  return (
    <Container row={row}>
      <StyledDatePicker
        selected={
          moment(stateValue, 'DD.MM.YYYY').isValid()
            ? new Date(moment(stateValue, 'DD.MM.YYYY').toDate())
            : null
        }
        onChange={onChangeDatePicker}
        dateFormat="dd.mm.yyyy"
        customInput={<CustomInputNonRow />}
        openToDate={
          moment(stateValue, 'DD.MM.YYYY').isValid()
            ? moment(stateValue, 'DD.MM.YYYY').toDate()
            : null
        }
      />
    </Container>
  )
}

export default observer(DateField)
