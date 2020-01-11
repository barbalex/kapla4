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
  max-width: 45px !important;
  margin-right: -1px !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-top-left-radius: 4px !important;
  border-bottom-left-radius: 4px !important;
  padding-left: 6px;
  padding-right: 0;
  font-weight: 900;
  font-size: 14px;
`

const SortSelector = ({ name }) => {
  const store = useContext(storeContext)
  const { sortFields, sortByFields } = store.geschaefte
  const filterField = sortFields.find(ff => ff.field === name)
  const direction = filterField ? filterField.direction : ''

  return (
    <StyledInput
      type="select"
      onChange={e => sortByFields(name, e.target.value)}
      value={direction}
    >
      <option value="" />
      <option value="ASCENDING">&#8679;</option>
      <option value="DESCENDING">&#8681;</option>
    </StyledInput>
  )
}

export default observer(SortSelector)
