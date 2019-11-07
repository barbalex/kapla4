import React, { useCallback } from 'react'
import { FormGroup, Label, FormFeedback } from 'reactstrap'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${props => (props.row ? '16px' : '8px !important')};
  .react-datepicker-wrapper {
    width: 100%;
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
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  height: calc(1.5em + 0.5rem + 2px);
  padding: 0.25rem 0.5rem;
  line-height: 1.5;
  border-radius: 0.2rem;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  min-height: 34px;
  &:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`
const dateFormat = [
  'dd.MM.yyyy',
  'd.MM.yyyy',
  'd.M.yyyy',
  'dd.M.yyyy',
  'dd.MM.yy',
  'd.MM.yy',
  'd.M.yy',
  'dd.M.yy',
  'd.M',
  'd.MM',
  'dd.M',
  'dd.MM',
  'd',
  'dd',
]

const DateField = ({
  value,
  field,
  label,
  saveToDb,
  error,
  row = false,
  tabIndex,
  popperPlacement = 'auto',
}) => {
  const onChangeDatePicker = useCallback(
    date =>
      saveToDb({
        value: moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY'),
        field,
      }),
    [field, saveToDb],
  )
  const selected = moment(value, 'DD.MM.YYYY').isValid()
    ? new Date(moment(value, 'DD.MM.YYYY').toDate())
    : null

  // for popperPlacement see https://github.com/Hacker0x01/react-datepicker/issues/1246#issuecomment-361833919
  if (row) {
    return (
      <StyledFormGroup row={row}>
        <StyledLabel for={field} sm={2}>
          {label}
        </StyledLabel>
        <StyledDatePicker
          id={field}
          selected={selected}
          onChange={onChangeDatePicker}
          dateFormat={dateFormat}
          popperPlacement={popperPlacement}
        />
        <FormFeedback>{error}</FormFeedback>
      </StyledFormGroup>
    )
  }
  return (
    <StyledFormGroup row={row}>
      <NonRowLabel for={field}>{label}</NonRowLabel>
      <StyledDatePicker
        id={field}
        selected={selected}
        onChange={onChangeDatePicker}
        dateFormat={dateFormat}
        popperPlacement={popperPlacement}
      />
      <FormFeedback>{error}</FormFeedback>
    </StyledFormGroup>
  )
}

export default observer(DateField)
