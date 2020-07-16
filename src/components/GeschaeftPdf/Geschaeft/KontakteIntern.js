import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import KontakteInternItems from './KontakteInternItems'

const Container = styled.div`
  grid-column: 1 / span 1;
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 0;
`

const GeschaefteKontakteIntern = () => (
  <Container>
    <KontakteInternItems />
  </Container>
)

export default observer(GeschaefteKontakteIntern)
