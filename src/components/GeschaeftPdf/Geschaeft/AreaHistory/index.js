import React, { useContext } from 'react'
import { Label } from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import Row from './Row'
import storeContext from '../../../../storeContext'
import Input from '../../../shared/Input'

// eslint-disable-next-line no-unused-vars
const Container = styled.div`
  grid-area: areaHistory;
  background-color: rgb(227, 232, 255);
  display: grid;
  grid-template-columns: calc(100% - 156px) 70px 70px;
  grid-template-areas:
    'areaHistoryTitle labelVorgeschaeft fieldVorgeschaeft'
    'areaHistoryFieldsContainer areaHistoryFieldsContainer areaHistoryFieldsContainer';
  grid-column-gap: 8px;
  padding: 8px;
  border-top: thin solid #ccc;
  border-bottom: thin solid #ccc;
  border-collapse: collapse;
  font-size: 10px;
  ${(props) => props['data-single-row'] && 'height: 50px;'}
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaHistoryTitle;
`
const FieldVorgeschaeft = styled.div`
  grid-area: fieldVorgeschaeft;
  > div {
    margin-bottom: 0 !important!;
  }
`
// eslint-disable-next-line no-unused-vars
const LabelVorgeschaeft = styled(Label)`
  grid-area: labelVorgeschaeft;
  margin-top: 2px;
  margin-bottom: 0;
  text-align: right;
`
const FieldsContainer = styled.div`
  grid-area: areaHistoryFieldsContainer;
  display: grid;
  grid-template-columns: 100%;
`

const AreaHistory = ({ saveToDb }) => {
  const store = useContext(storeContext)
  const {
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    historyOfActiveId,
  } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}

  return (
    <ErrorBoundary>
      <Container data-single-row={historyOfActiveId.length === 0}>
        <Title>Historie</Title>
        <LabelVorgeschaeft>Vorgeschäft</LabelVorgeschaeft>
        <FieldVorgeschaeft>
          <Input
            key={`${geschaeft.idGeschaeft}idVorgeschaeft`}
            type="number"
            value={
              geschaeft && geschaeft.idVorgeschaeft
                ? geschaeft.idVorgeschaeft
                : ''
            }
            field="idVorgeschaeft"
            label=""
            saveToDb={saveToDb}
            placeholder={null}
            tabIndex={99}
          />
        </FieldVorgeschaeft>
        <FieldsContainer>
          {historyOfActiveId.map((id, index) => (
            <Row id={id} key={`${id}${index}`} index={index} />
          ))}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaHistory)
