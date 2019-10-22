import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  FormGroup,
  InputGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { observer } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'
import { FaCalendarAlt } from 'react-icons/fa'

import ComparatorSelector from './ComparatorSelector'
import SortSelector from './SortSelector'
import getDateValidationStateDate from '../../src/getDateValidationStateDate'

moment.locale('de')

const StyledDatePicker = styled(DatePicker)`
  cursor: pointer;
`
const StyledFormGroup = styled(FormGroup)`
  grid-area: ${props =>
    props['data-name'] === 'rechtsmittelEntscheidDatum'
      ? 'fieldEntscheidDatum'
      : 'unset'};
  grid-column: ${props =>
    props['data-name'] === 'rechtsmittelEntscheidDatum' ? 'unset' : 1};
  .react-datepicker-popper {
    z-index: 10;
  }
  .react-datepicker {
    font-size: 1em;
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
const CalendarIconContainer = styled.div`
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 12px;
  padding-right: 12px;
`

const enhance = compose(observer)

class DateField extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    tabIndex: PropTypes.number.isRequired,
    values: PropTypes.object.isRequired,
    change: PropTypes.func.isRequired,
    changeComparator: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    const { values, name } = this.props
    let value = values[name]
    if (value) value = moment(value, 'YYYY-MM-DD').format('DD.MM.YYYY')
    this.state = { value }
  }

  componentDidUpdate(prevProps) {
    const { values, name } = this.props
    let value = values[name]
    const prevValue = prevProps.values[name]
    if (value !== prevValue) {
      if (value) value = moment(value, 'YYYY-MM-DD').format('DD.MM.YYYY')
      this.setState({ value })
    }
  }

  onChange = e => {
    this.setState({ value: e.target.value })
  }

  onBlur = () => {
    const { values, name, change } = this.props
    let { value } = this.state
    // only filter if value has changed
    if (value !== values[name]) {
      if (!value || moment(value, 'DD.MM.YYYY').isValid()) {
        if (value) {
          // convert value for local state
          value = moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY')
          this.setState({ value })
        }
        const e = {
          target: {
            type: 'text',
            name,
            value,
          },
        }
        change(e)
      } else {
        // TODO: tell user this is invalid
        console.log('DateField.js: invalid date') // eslint-disable-line no-console
      }
    }
  }

  onChangeDatePicker = date => {
    const { name } = this.props
    const rValForBlur = {
      target: {
        type: 'text',
        name,
        value: date,
      },
    }
    const rValForChange = {
      target: {
        type: 'text',
        name,
        value: moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY'),
      },
    }
    this.onChange(rValForChange)
    this.onBlur(rValForBlur)
  }

  render() {
    const { name, label, tabIndex, changeComparator } = this.props
    const { value } = this.state
    /**
     * need to give addon no padding
     * and the originally addon's padding to the glyphicon
     * to make entire addon clickable
     * for opening calendar
     */
    const datePickerAddonStyle = {
      padding: 0,
    }

    return (
      <StyledFormGroup
        data-name={name}
        // className={name === 'rechtsmittelEntscheidDatum' ? styles.fieldEntscheidDatum : styles.field}
        validationState={getDateValidationStateDate(value)}
      >
        <ControlLabel>{label}</ControlLabel>
        <InputGroup>
          <SortSelector name={name} />
          <ComparatorSelector name={name} changeComparator={changeComparator} />
          <FormControl
            type="text"
            value={value || ''}
            name={name}
            onChange={this.onChange}
            onBlur={this.onBlur}
            tabIndex={tabIndex}
          />
          <InputGroup.Addon style={datePickerAddonStyle}>
            <StyledDatePicker
              onChange={this.onChangeDatePicker}
              dateFormat="DD.MM.YYYY"
              //locale="de"
              customInput={
                <CalendarIconContainer>
                  <FaCalendarAlt />
                </CalendarIconContainer>
              }
              popperPlacement="top-end"
            />
          </InputGroup.Addon>
        </InputGroup>
      </StyledFormGroup>
    )
  }
}

export default enhance(DateField)
