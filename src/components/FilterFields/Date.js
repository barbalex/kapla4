import React, { useCallback, useState, useEffect } from 'react'
import { FormGroup, Label } from 'reactstrap'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ComparatorSelector from './ComparatorSelector'
import SortSelector from './SortSelector'

const StyledFormGroup = styled(FormGroup)`
  grid-area: ${props =>
    props['data-name'] === 'rechtsmittelEntscheidDatum'
      ? 'fieldEntscheidDatum'
      : 'unset'};
  grid-column: ${props =>
    props['data-name'] === 'rechtsmittelEntscheidDatum' ? 'unset' : 1};
  .react-datepicker-wrapper {
    width: calc(100% - 100px);
  }
`
const NonRowLabel = styled(Label)`
  margin-bottom: -2px;
  color: #757575;
  font-size: 12px;
  font-weight: 500;
`
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  height: 33.5px;
  min-height: 33.5px;
  padding: 0.25rem 0.5rem;
  line-height: 1.5;
  border-radius: 0.2rem;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`
const Row = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-content: stretch;
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
  values,
  name,
  label,
  change,
  changeComparator,
  tabIndex,
}) => {
  const [value, setValue] = useState(
    values[name] ? moment(values[name], 'YYYY-MM-DD').format('DD.MM.YYYY') : '',
  )
  useEffect(() => {
    setValue(
      values[name]
        ? moment(values[name], 'YYYY-MM-DD').format('DD.MM.YYYY')
        : '',
    )
  }, [name, value, values])

  const onChangeDatePicker = useCallback(
    date => {
      const fakeEvent = {
        target: {
          value: moment(date, 'YYYY-MM-DD').isValid()
            ? moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY')
            : null,
          name,
        },
      }
      change(fakeEvent)
    },
    [change, name],
  )
  const selected = moment(value, 'DD.MM.YYYY').isValid()
    ? new Date(moment(value, 'DD.MM.YYYY').toDate())
    : null

  return (
    <StyledFormGroup data-name={name}>
      <NonRowLabel for={name}>{label}</NonRowLabel>
      <Row>
        <SortSelector name={name} />
        <ComparatorSelector name={name} changeComparator={changeComparator} />
        <StyledDatePicker
          id={name}
          selected={selected}
          onChange={onChangeDatePicker}
          dateFormat={dateFormat}
          popperPlacement="auto"
        />
      </Row>
    </StyledFormGroup>
  )
}

export default observer(DateField)
