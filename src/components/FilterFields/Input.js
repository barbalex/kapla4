import React from 'react'
import { InputGroup, Input } from 'reactstrap'
import { observer } from 'mobx-react-lite'

import ComparatorSelector from './ComparatorSelector'
import SortSelector from './SortSelector'

const InputControl = ({
  type = 'text',
  name,
  change,
  values,
  changeComparator,
  tabIndex,
  autoFocus = false,
}) => (
  <InputGroup>
    <SortSelector name={name} />
    <ComparatorSelector name={name} changeComparator={changeComparator} />
    <Input
      type={type}
      value={values[name] || ''}
      name={name}
      onChange={change}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
    />
  </InputGroup>
)

export default observer(InputControl)
