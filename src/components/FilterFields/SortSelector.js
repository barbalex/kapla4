/**
 * using hooks here results in error:
 * Hooks can only be called inside the body of a function component.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { InputGroup, FormControl } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'

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

const enhance = compose(
  inject('store'),
  observer,
)

const SortSelector = ({ store, name }) => {
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

SortSelector.displayName = 'SortSelector'

SortSelector.propTypes = {
  store: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
}

export default enhance(SortSelector)
