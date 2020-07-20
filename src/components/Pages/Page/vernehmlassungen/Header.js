import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  border-bottom: 2px solid #717171;
`
const StyledRow = styled.div`
  display: flex;
  padding: 3px;
`
const StyledId = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 65px;
  max-width: 65px;
`
const StyledGegenstand = styled.div`
  flex: 1;
  padding: 2px;
  width: calc(100% - 290px);
`
const StyledStatus = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 140px;
  max-width: 140px;
`
const StyledKontaktIntern = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 100px;
  max-width: 100px;
`

const PageFristenHeader = () => (
  <Container>
    <StyledRow>
      <StyledId>
        <b>ID</b>
        <br />
        Geko Nr.
      </StyledId>
      <StyledGegenstand>
        <b>Gegenstand</b>
        <br />
        Auslöser / Details / Vermerk / nächster Schritt
      </StyledGegenstand>
      <StyledStatus>
        <b>Status</b>
        <br />
        Frist
      </StyledStatus>
      <StyledKontaktIntern>
        <b>Verantwortlich</b>
        <br />
        Abteilung
      </StyledKontaktIntern>
    </StyledRow>
  </Container>
)

export default PageFristenHeader
