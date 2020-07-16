import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import KontakteExternItems from './KontakteExternItems'

const Container = styled.div`
  grid-column: 1 / span 1;
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 0;
`

const GeschaefteKontakteExtern = ({ tabIndex }) => (
  <Container>
    <KontakteExternItems refresh={() => {}} />
  </Container>
)

export default observer(GeschaefteKontakteExtern)
