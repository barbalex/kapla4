import React, { useState, useCallback, useEffect } from 'react'
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
`
const NonRowLabel = styled(Label)`
  margin-bottom: 3px;
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
  const [open, setOpen] = useState(false)
  const [stateValue, setStateValue] = useState(
    value || value === 0 ? value : '',
  )

  const openPicker = useCallback(() => setOpen(true), [])
  const closePicker = useCallback(() => setOpen(false), [])
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
      setTimeout(() => setOpen(false))
    },
    [blur, change, field],
  )

  // without lifecycle state value does not immediately update
  // after user enters new date
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
                onClick={openPicker}
                title="Kalender öffnen"
              >
                <span className="input-group-text">
                  <FaCalendarAlt />
                </span>
                {open && (
                  <DatePicker
                    selected={
                      moment(stateValue, 'DD.MM.YYYY').isValid()
                        ? moment(stateValue, 'DD.MM.YYYY').toDate()
                        : null
                    }
                    onChange={onChangeDatePicker}
                    dateFormat="DD.MM.YYYY"
                    withPortal
                    inline
                    onClickOutside={closePicker}
                  />
                )}
              </StyledInputGroupAddon>
              <FormFeedback>{error}</FormFeedback>
            </InputGroup>
          </Col>
        </>
      ) : (
        <>
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
              onClick={openPicker}
              title="Kalender öffnen"
            >
              <span className="input-group-text">
                <FaCalendarAlt />
              </span>
              {open && (
                <DatePicker
                  selected={
                    moment(stateValue, 'DD.MM.YYYY').isValid()
                      ? moment(stateValue, 'DD.MM.YYYY').toDate()
                      : null
                  }
                  onChange={onChangeDatePicker}
                  dateFormat="DD.MM.YYYY"
                  withPortal
                  inline
                  onClickOutside={closePicker}
                />
              )}
            </StyledInputGroupAddon>
            <FormFeedback>{error}</FormFeedback>
          </InputGroup>
        </>
      )}
    </StyledFormGroup>
  )
}

export default observer(DateField)
