import React from 'react'
import { FormControl, InputGroup } from 'react-bootstrap'
import { observer } from 'mobx-react'

import ComparatorSelector from './ComparatorSelector'
import SortSelector from './SortSelector'

const Input = ({
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
    <FormControl
      type={type}
      value={values[name] || ''}
      name={name}
      onChange={change}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
    />
  </InputGroup>
)

export default observer(Input)
