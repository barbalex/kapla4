import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

const Container = styled.div`
  padding: 15px;
`
const Details = styled.details`
  margin-bottom: 25px;
`
const Summary = styled.summary`
  user-select: none;
  &:focus {
    outline: none !important;
  }
`
const PreWrapping = styled.pre`
  white-space: normal;
`
const Pre = styled.pre`
  background-color: rgba(128, 128, 128, 0.09);
`

const ErrorFallback = ({ error, componentStack, resetErrorBoundary }) => (
  <Container>
    <p>Sorry, ein Fehler ist aufgetreten:</p>
    <PreWrapping>{error.message}</PreWrapping>
    <Details>
      <Summary>Mehr Informationen</Summary>
      <Pre>{componentStack}</Pre>
    </Details>
  </Container>
)

const MyErrorBoundary = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
)

export default MyErrorBoundary
