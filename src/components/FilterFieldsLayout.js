import React from 'react'
import PropTypes from 'prop-types'
import SplitPane from 'react-split-pane'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import FilterFields from './FilterFields'
import Geschaefte from './Geschaefte'

const StyledSplitPane = styled(SplitPane)`
  top: 52px;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onChange: props => size =>
      props.store.configSetKey('geschaefteColumnWidth', size),
  }),
  observer,
)

const FilterFieldsLayout = ({ store, onChange }) => (
  <StyledSplitPane
    split="vertical"
    minSize={100}
    defaultSize={store.app.config.geschaefteColumnWidth}
    onChange={onChange}
  >
    <Geschaefte />
    <FilterFields />
  </StyledSplitPane>
)

FilterFieldsLayout.propTypes = {
  store: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default enhance(FilterFieldsLayout)
