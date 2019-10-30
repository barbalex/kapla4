import React, { useContext, useCallback } from 'react'
import SplitPane from 'react-split-pane'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import Geschaeft from './Geschaeft'
import Pages from './Pages'
import GeschaeftPdf from './GeschaeftPdf'
import Geschaefte from './Geschaefte'
import storeContext from '../storeContext'

const StyledSplitPane = styled(SplitPane)`
  top: 58px;
  @media print {
    top: 0;
  }
`

const GeschaefteLayout = () => {
  const store = useContext(storeContext)
  const { config } = store.app
  const { activeId } = store.geschaefte
  const path = store.history.location.pathname
  const showGeschaeft = path === '/geschaefte' && activeId
  const showPages = path === '/pages'
  const showGeschaeftPdf = path === '/geschaeftPdf' && activeId

  const onChange = useCallback(
    size => config.setKey('geschaefteColumnWidth', size),
    [config],
  )

  return (
    <StyledSplitPane
      split="vertical"
      minSize={100}
      defaultSize={config.geschaefteColumnWidth}
      onChange={onChange}
    >
      <Geschaefte />
      <div>
        {showGeschaeft && <Geschaeft />}
        {showPages && <Pages />}
        {showGeschaeftPdf && <GeschaeftPdf />}
      </div>
    </StyledSplitPane>
  )
}

export default observer(GeschaefteLayout)
