import React from 'react'
import PropTypes from 'prop-types'
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

Input.displayName = 'Input'

/**
 * do not make options required
 * as they may be loaded after the component
 */
Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  change: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  changeComparator: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  autoFocus: PropTypes.bool,
}

export default observer(Input)
