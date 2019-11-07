import React, { useState, useCallback, useEffect, forwardRef } from 'react'
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

moment.locale('de')

const Container = styled.div`
  grid-column: 1;
  margin-bottom: ${props => (props.row ? '16px' : '8px !important')};
  .react-datepicker-wrapper {
    width: 100%;
  }
`
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: 0 !important;
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

  // need to forward refs to custom input
  // see: https://github.com/Hacker0x01/react-datepicker/issues/862#issuecomment-522333766
  const CustomInputRow = forwardRef(({ value, onClick }, ref) => (
    <StyledFormGroup>
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
  ))
  const CustomInputNonRow = forwardRef(({ value, onClick }, ref) => (
    <StyledFormGroup>
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
  ))

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
        customInput={row ? <CustomInputRow /> : <CustomInputNonRow />}
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
