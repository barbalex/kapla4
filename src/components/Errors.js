// @flow
import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../storeContext'
import ErrorBoundary from '../components/shared/ErrorBoundary'

const Container = styled.div`
  position: absolute;
  left: 5px;
  bottom: 5px;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  z-index: 2000;
  min-width: 300px;
  /*min-height: 100px;*/
`
const ErrorDiv = styled.div`
  padding: 10px 10px;
  margin: 5px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #424242;
  color: white;
  max-width: 500px;
  font-size: 14px;
  position: relative;
`

const Errors = () => {
  const { errors } = useContext(storeContext)
  // example error to test placement
  /*const errors = [
    'this is an error message',
    'this is an error message this is an error message this is an error message this is an error message ',
  ]*/

  if (errors.length === 0) return null

  return (
    <ErrorBoundary>
      <Container>
        {errors.map((message, index) => (
          <ErrorDiv key={index}>{`Fehler: ${message}`}</ErrorDiv>
        ))}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Errors)
