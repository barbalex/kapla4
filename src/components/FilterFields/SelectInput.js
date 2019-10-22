import React from 'react'
import { FormControl, InputGroup } from 'react-bootstrap'
import { observer } from 'mobx-react'

import ComparatorSelector from './ComparatorSelector'
import SortSelector from './SortSelector'

const SelectInput = ({
  name,
  change,
  values,
  changeComparator,
  tabIndex,
  autoFocus = false,
  options = [],
}) => (
  <InputGroup>
    <SortSelector name={name} />
    <ComparatorSelector name={name} changeComparator={changeComparator} />
    <FormControl
      componentClass="select"
      value={values[name] || ''}
      name={name}
      onChange={change}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
    >
      {options}
    </FormControl>
  </InputGroup>
)

export default observer(SelectInput)
