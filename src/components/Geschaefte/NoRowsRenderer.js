import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext'

const StyledNoRowsDiv = styled.div`
  padding: 10px;
  font-weight: bold;
`

const NoRowsRenderer = () => {
  const store = useContext(storeContext)
  const { filterFields, filterFulltext, geschaefte } = store.geschaefte
  const isFiltered =
    geschaefte.length > 0 && (filterFields.length > 0 || !!filterFulltext)
  const text = isFiltered
    ? 'Keine Daten entsprechen dem Filter'
    : 'lade Daten...'

  return <StyledNoRowsDiv>{text}</StyledNoRowsDiv>
}

export default observer(NoRowsRenderer)
