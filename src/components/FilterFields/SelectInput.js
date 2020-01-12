import React from 'react'
import { Input, InputGroup } from 'reactstrap'
import { observer } from 'mobx-react-lite'

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
    <Input
      type="select"
      value={values[name] || ''}
      name={name}
      onChange={change}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
    >
      {options}
    </Input>
  </InputGroup>
)

export default observer(SelectInput)
