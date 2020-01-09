import React, { useContext, useCallback } from 'react'
import SplitPane from 'react-split-pane'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import FilterFields from './FilterFields'
import Geschaefte from './Geschaefte'
import storeContext from '../storeContext'

const StyledSplitPane = styled(SplitPane)`
  top: 58px;
`

const FilterFieldsLayout = () => {
  const store = useContext(storeContext)
  const {setGeschaefteColumnWidth, geschaefteColumnWidth, saveConfig} = store.app

  const [saveConfigDebounced] = useDebouncedCallback(
    (size) => {
      saveConfig()
    },
    200
  )

  return (
    <StyledSplitPane
      split="vertical"
      minSize={100}
      defaultSize={geschaefteColumnWidth}
      onChange={(value) => {
        setGeschaefteColumnWidth(value)
        saveConfigDebounced(value)
      }}
    >
      <Geschaefte />
      <FilterFields />
    </StyledSplitPane>
  )
}

export default observer(FilterFieldsLayout)
