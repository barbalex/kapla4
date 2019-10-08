/**
 * using hooks here results in error:
 * Hooks can only be called inside the body of a function component.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { InputGroup, FormControl } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'

const enhance = compose(
  inject('store'),
  observer,
)

const StyledFormControl = styled(FormControl)`
  width: 55px !important;
  margin-right: -1px !important;
  border-radius: 0 !important;
  padding-left: 3px !important;
  padding-right: 0 !important;
  font-weight: 900;
  font-size: 14px !important;
`

const ComparatorSelector = ({ store, name, changeComparator }) => {
  const filterField = store.geschaefte.filterFields.find(
    ff => ff.field === name,
  )
  const comparatorValue = filterField ? filterField.comparator : ''

  return (
    <InputGroup.Button>
      <StyledFormControl
        componentClass="select"
        onChange={e => changeComparator(e.target.value, name)}
        value={comparatorValue}
      >
        <option value="" />
        <option value="=">&#8776;</option>
        <option value="===">=</option>
        <option value="!==">&#60;&#62;</option>
        <option value="<">&#60;</option>
        <option value="<=">&#60;=</option>
        <option value=">">&#62;</option>
      </StyledFormControl>
    </InputGroup.Button>
  )
}

ComparatorSelector.displayName = 'ComparatorSelector'

ComparatorSelector.propTypes = {
  store: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  changeComparator: PropTypes.func.isRequired,
}

export default enhance(ComparatorSelector)
