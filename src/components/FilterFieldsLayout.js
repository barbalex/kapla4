import React, { useContext, useCallback } from 'react'
import SplitPane from 'react-split-pane'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import FilterFields from './FilterFields'
import Geschaefte from './Geschaefte'
import storeContext from '../storeContext'

const StyledSplitPane = styled(SplitPane)`
  top: 52px;
`

const FilterFieldsLayout = () => {
  const store = useContext(storeContext)
  const onChange = useCallback(
    size => store.configSetKey('geschaefteColumnWidth', size),
    [store],
  )

  return (
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
}

export default observer(FilterFieldsLayout)
