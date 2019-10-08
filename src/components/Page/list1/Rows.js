import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledRow = styled.div`
  display: flex;
  padding: 3px;
  background-color: ${props => (props.shaded ? 'rgba(0, 0, 0, 0.05)' : 'inherit')};
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

function isOdd(num) {
  return num % 2
}

const PageList1Rows = ({ geschaeft, rowIndex }) => {
  /**
   * need to enforce max string length
   * if a field contains more text than fits on a page
   * the page is (re-)created infinitely...
   */
  const maxStringLength = 2000
  let gegenstand = geschaeft.gegenstand
  if (geschaeft.ausloeser) {
    gegenstand = `${gegenstand}. Auslöser: ${geschaeft.ausloeser}`
  }
  if (gegenstand && gegenstand.length > maxStringLength) {
    gegenstand = gegenstand.substring(0, maxStringLength)
    gegenstand += '... (Text gekürzt)'
  }

  const shaded = !isOdd(rowIndex)

  return (
    <StyledRow key={geschaeft.idGeschaeft} shaded={shaded}>
      <StyledGegenstand>
        <div>{gegenstand}</div>
      </StyledGegenstand>
      <StyledGeschaeftsart>
        <div>{geschaeft.geschaeftsart}</div>
      </StyledGeschaeftsart>
      <StyledStatus>
        <div>{geschaeft.status}</div>
      </StyledStatus>
      <StyledVerantwortlich>
        <div>{geschaeft.verantwortlich}</div>
      </StyledVerantwortlich>
      <StyledFrist>
        <div>{geschaeft.fristMitarbeiter}</div>
      </StyledFrist>
      <StyledIdVg>
        <div>{geschaeft.idVorgeschaeft}</div>
      </StyledIdVg>
      <StyledId>
        <div>{geschaeft.idGeschaeft}</div>
      </StyledId>
    </StyledRow>
  )
}

PageList1Rows.displayName = 'PageList1Rows'

PageList1Rows.propTypes = {
  geschaeft: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
}

export default PageList1Rows
