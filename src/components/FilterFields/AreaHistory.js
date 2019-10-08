import React from 'react'
import PropTypes from 'prop-types'
import { ControlLabel } from 'react-bootstrap'
import { observer } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'

import Input from './Input'

const Container = styled.div`
  grid-area: areaHistory;
  background-color: white;
  box-shadow: inset 1em 1em 2em rgb(227, 232, 255), inset -1em -1em 2em rgb(227, 232, 255);
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

const enhance = compose(observer)

const AreaHistory = ({ values, change, changeComparator, firstTabIndex }) => (
  <Container>
    <Title>Historie</Title>
    <ControlLabel>Vorgeschäft</ControlLabel>
    <FieldVorgeschaeft>
      <Input name="idVorgeschaeft" type="number" change={change} values={values} changeComparator={changeComparator} tabIndex={1 + firstTabIndex} />
    </FieldVorgeschaeft>
  </Container>
)

AreaHistory.displayName = 'AreaHistory'

AreaHistory.propTypes = {
  values: PropTypes.object,
  change: PropTypes.func.isRequired,
  changeComparator: PropTypes.func.isRequired,
  firstTabIndex: PropTypes.number.isRequired,
}

export default enhance(AreaHistory)
