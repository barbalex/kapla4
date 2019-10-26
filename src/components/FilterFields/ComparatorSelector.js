/**
 * using hooks here results in error:
 * Hooks can only be called inside the body of a function component.
 */
import React, { useContext } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import storeContext from '../../storeContext'

const StyledFormControl = styled(FormControl)`
  width: 55px !important;
  margin-right: -1px !important;
  border-radius: 0 !important;
  padding-left: 3px !important;
  padding-right: 0 !important;
  font-weight: 900;
  font-size: 14px !important;
`

const ComparatorSelector = ({ name, changeComparator }) => {
  const store = useContext(storeContext)
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

export default observer(ComparatorSelector)
