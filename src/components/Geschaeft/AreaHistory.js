import React, { useContext, useState, useEffect } from 'react'
import { Label } from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary'
import AreaHistoryRow from './AreaHistoryRows'
import storeContext from '../../storeContext'
import Input from '../shared/Input'

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
  ${(props) => props['data-ispdf'] && 'border: thin solid #CCC;'}
  border-left: none;
  border-collapse: collapse;
  ${(props) => props['data-ispdf'] && 'font-size: 10px;'}
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
  margin-top: ${(props) => (props['data-ispdf'] ? '2px' : '7px')};
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
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const {
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    historyOfActiveId,
  } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}
  const isPdf = activeLocation === 'geschaeftPdf'

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [geschaeft.idGeschaeft])

  return (
    <ErrorBoundary>
      <Container
        data-ispdf={isPdf}
        data-single-row={historyOfActiveId.length === 0}
      >
        <Title>Historie</Title>
        <LabelVorgeschaeft data-ispdf={isPdf}>Vorgeschäft</LabelVorgeschaeft>
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
            error={errors.idVorgeschaeft}
            placeholder={isPdf ? null : 'ID'}
            tabIndex={99}
          />
        </FieldVorgeschaeft>
        <FieldsContainer>
          {historyOfActiveId.map((id, index) => (
            <AreaHistoryRow id={id} key={id} index={index} />
          ))}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaHistory)
