/**
 * using hooks here results in error:
 * Hooks can only be called inside the body of a function component.
 */
import React, { useContext } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import mobxStoreContext from '../../mobxStoreContext'

const StyledFormControl = styled(FormControl)`
  width: 45px !important;
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
  const store = useContext(mobxStoreContext)
  const filterField = store.geschaefte.sortFields.find(ff => ff.field === name)
  const direction = filterField ? filterField.direction : ''

  return (
    <InputGroup.Button>
      <StyledFormControl
        componentClass="select"
        onChange={e => store.geschaefteSortByFields(name, e.target.value)}
        value={direction}
      >
        <option value="" />
        <option value="ASCENDING">&#8679;</option>
        <option value="DESCENDING">&#8681;</option>
      </StyledFormControl>
    </InputGroup.Button>
  )
}

export default observer(SortSelector)
