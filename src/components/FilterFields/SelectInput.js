import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, InputGroup } from 'react-bootstrap'
import { observer } from 'mobx-react'
import compose from 'recompose/compose'

import ComparatorSelector from './ComparatorSelector'
import SortSelector from './SortSelector'
import createOptions from '../../src/createOptions'

const enhance = compose(observer)

const SelectInput = ({ name, change, values, changeComparator, tabIndex, autoFocus = false, options = [] }) => (
  <InputGroup>
    <SortSelector name={name} />
    <ComparatorSelector name={name} changeComparator={changeComparator} />
    <FormControl componentClass="select" value={values[name] || ''} name={name} onChange={change} tabIndex={tabIndex} autoFocus={autoFocus}>
      {createOptions(options)}
    </FormControl>
  </InputGroup>
)

SelectInput.displayName = 'SelectInput'

/**
 * do not make options required
 * as they may be loaded after the component
 */
SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  change: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
  changeComparator: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  options: PropTypes.array,
}

export default enhance(SelectInput)
