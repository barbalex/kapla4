import React from 'react'
import { ControlLabel } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'

import Input from './Input'

const Container = styled.div`
  grid-area: areaHistory;
  background-color: white;
  box-shadow: inset 1em 1em 2em rgb(227, 232, 255),
    inset -1em -1em 2em rgb(227, 232, 255);
  outline: 1px solid #efefef;
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 2px;
  padding: 8px;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-column: 1;
`
const FieldVorgeschaeft = styled.div`
  grid-column: 1;
  width: 175px;
`

const AreaHistory = ({ values, change, changeComparator, firstTabIndex }) => (
  <ErrorBoundary>
    <Container>
      <Title>Historie</Title>
      <ControlLabel>Vorgeschäft</ControlLabel>
      <FieldVorgeschaeft>
        <Input
          name="idVorgeschaeft"
          type="number"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={1 + firstTabIndex}
        />
      </FieldVorgeschaeft>
    </Container>
  </ErrorBoundary>
)

export default observer(AreaHistory)
