import React from 'react'
import styled from 'styled-components'

const StyledHeader = styled.div`
  border-bottom: 2px solid #717171;
  font-weight: 700;
`
const StyledRow = styled.div`
  display: flex;
  padding: 3px;
`
const StyledGegenstand = styled.div`
  flex: 1;
  padding: 2px;
  min-width: calc(100% - 480px);
  max-width: calc(100% - 480px);
`
const StyledGeschaeftsart = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 140px;
  max-width: 140px;
`
const StyledStatus = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 110px;
  max-width: 110px;
`
const StyledVerantwortlich = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 60px;
  max-width: 60px;
`
const StyledFrist = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 70px;
  max-width: 70px;
`
const StyledIdVg = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 50px;
  max-width: 50px;
`
const StyledId = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 50px;
  max-width: 50px;
`

const PageList1Header = () => (
  <StyledHeader>
    <StyledRow>
      <StyledGegenstand>Gegenstand, Auslöser</StyledGegenstand>
      <StyledGeschaeftsart>Geschäftsart</StyledGeschaeftsart>
      <StyledStatus>Status</StyledStatus>
      <StyledVerantwortlich>Verant- wortlich</StyledVerantwortlich>
      <StyledFrist>Frist</StyledFrist>
      <StyledIdVg>Vorge- schäft</StyledIdVg>
      <StyledId>ID</StyledId>
    </StyledRow>
  </StyledHeader>
)

PageList1Header.displayName = 'PageList1Header'

export default PageList1Header
