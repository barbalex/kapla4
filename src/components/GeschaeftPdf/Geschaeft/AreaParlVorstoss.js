import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ErrorBoundary from '../../shared/ErrorBoundary'
import storeContext from '../../../storeContext'
import Select from '../../shared/Select'
import InputComponent from '../../shared/Input'

const Container = styled.div`
  grid-area: areaForGeschaeftsart;
  background-color: rgb(255, 237, 199);
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: auto;
  grid-template-areas: 'areaParlVorstTitle areaParlVorstTitle' 'fieldParlVorstossTyp fieldParlVorstossTyp' 'fieldStufe fieldStufe' 'fieldZustaendigkeit fieldZustaendigkeit';
  grid-gap: 15px 8px;
  padding: 8px;
  padding-right: 15px;
  border-top: thin solid #ccc;
  border-collapse: collapse;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaParlVorstTitle;
`
const FieldParlVorstossTyp = styled.div`
  grid-area: fieldParlVorstossTyp;
`
const FieldStufe = styled.div`
  grid-area: fieldStufe;
`
const FieldZustaendigkeit = styled.div`
  grid-area: fieldZustaendigkeit;
`

const AreaParlVorstoss = ({ nrOfFieldsBeforePv, change, saveToDb }) => {
  const store = useContext(storeContext)
  const {
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    parlVorstossTypOptions,
  } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}
  let stufeValue = ''
  if (geschaeft.parlVorstossStufe === '1') stufeValue = '1: nicht überwiesen'
  if (geschaeft.parlVorstossStufe === '2') stufeValue = '2: überwiesen'
  const zustaendigkeitValue = geschaeft.parlVorstossZustaendigkeitAwel
    ? geschaeft.parlVorstossZustaendigkeitAwel.replace('zuständig', '')
    : ''

  return (
    <ErrorBoundary>
      <Container>
        <Title>Parlamentarischer Vorstoss</Title>
        {!!geschaeft.parlVorstossTyp && (
          <FieldParlVorstossTyp>
            <Select
              key={`${geschaeft.idGeschaeft}parlVorstossTyp`}
              value={geschaeft.parlVorstossTyp}
              field="parlVorstossTyp"
              label="Typ"
              options={parlVorstossTypOptions.map((o) => ({
                label: o,
                value: o,
              }))}
              saveToDb={saveToDb}
              tabIndex={1 + nrOfFieldsBeforePv}
            />
          </FieldParlVorstossTyp>
        )}
        {!!geschaeft.parlVorstossStufe && (
          <FieldStufe>
            <InputComponent
              key={`${geschaeft.idGeschaeft}stufe`}
              value={stufeValue}
              field="stufe"
              label="Stufe"
              saveToDb={() => {}}
              tabIndex={2 + nrOfFieldsBeforePv}
            />
          </FieldStufe>
        )}
        {!!geschaeft.parlVorstossZustaendigkeitAwel && (
          <FieldZustaendigkeit>
            <InputComponent
              key={`${geschaeft.idGeschaeft}zustaendigkeit`}
              value={zustaendigkeitValue}
              field="zustaendigkeit"
              label="Zuständigkeit"
              saveToDb={() => {}}
              tabIndex={6 + nrOfFieldsBeforePv}
            />
          </FieldZustaendigkeit>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaParlVorstoss)
