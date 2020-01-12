/**
 * using hooks here results in error:
 * Hooks can only be called inside the body of a function component.
 */
import React, { useContext } from 'react'
import { Input } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import storeContext from '../../storeContext'

const StyledInput = styled(Input)`
  max-width: 55px !important;
  margin-right: -1px !important;
  border-radius: 0 !important;
  border-top-left-radius: ${props =>
    `${props['data-radius-left']}px !important`};
  border-bottom-left-radius: ${props =>
    `${props['data-radius-left']}px !important`};
  padding-left: 3px !important;
  padding-right: 0 !important;
  font-weight: 900;
`

const ComparatorSelector = ({ name, changeComparator, radiusLeft = 0 }) => {
  const store = useContext(storeContext)
  const filterField = store.geschaefte.filterFields.find(
    ff => ff.field === name,
  )
  const comparatorValue = filterField ? filterField.comparator : ''

  return (
    <StyledInput
      type="select"
      onChange={e => changeComparator(e.target.value, name)}
      value={comparatorValue}
      data-radius-left={radiusLeft}
    >
      <option value="" />
      <option value="=">&#8776;</option>
      <option value="===">=</option>
      <option value="!==">&#60;&#62;</option>
      <option value="<">&#60;</option>
      <option value="<=">&#60;=</option>
      <option value=">">&#62;</option>
    </StyledInput>
  )
}

export default observer(ComparatorSelector)
