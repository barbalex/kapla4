import React, { useContext, useState, useEffect } from 'react'
import { FormGroup, Label, CustomInput } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ErrorBoundary from '../shared/ErrorBoundary'
import storeContext from '../../storeContext'
import Select from '../shared/Select'

const Container = styled.div`
  grid-area: areaForGeschaeftsart;
  background-color: rgb(255, 237, 199);
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: auto;
  grid-template-areas: 'areaParlVorstTitle areaParlVorstTitle' 'fieldParlVorstossTyp fieldParlVorstossTyp' 'fieldStufe fieldZustaendigkeit';
  grid-gap: 15px 8px;
  padding: 8px;
  padding-right: 15px;
  border-bottom: none;
  border-left: none;
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
const StyledTitleLabel = styled(Label)`
  margin-bottom: -2px;
  color: #757575;
  font-size: 12px;
  font-weight: 500;
`

const AreaParlVorstoss = ({ nrOfFieldsBeforePv, change, saveToDb }) => {
  const store = useContext(storeContext)
  const {
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    parlVorstossTypOptions,
  } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [geschaeft.idGeschaeft])

  return (
    <ErrorBoundary>
      <Container>
        <Title>Parlamentarischer Vorstoss</Title>
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
            error={errors.parlVorstossTyp}
            tabIndex={1 + nrOfFieldsBeforePv}
          />
        </FieldParlVorstossTyp>
        <FieldStufe>
          <FormGroup tag="fieldset">
            <StyledTitleLabel>Stufe</StyledTitleLabel>
            <CustomInput
              id="parlVorstossStufeCb1"
              type="checkbox"
              data-value="1"
              checked={geschaeft.parlVorstossStufe === '1'}
              onChange={change}
              name="parlVorstossStufe"
              label="1: nicht überwiesen"
              tabIndex={2 + nrOfFieldsBeforePv}
            />
            <CustomInput
              id="parlVorstossStufeCb2"
              type="checkbox"
              data-value="2"
              checked={geschaeft.parlVorstossStufe === '2'}
              onChange={change}
              name="parlVorstossStufe"
              label="2: überwiesen"
              tabIndex={3 + nrOfFieldsBeforePv}
            />
          </FormGroup>
        </FieldStufe>
        <FieldZustaendigkeit>
          <FormGroup tag="fieldset">
            <StyledTitleLabel>Zuständigkeit</StyledTitleLabel>
            <CustomInput
              id="parlVorstossZustCb1"
              type="checkbox"
              data-value="hauptzuständig"
              checked={
                geschaeft.parlVorstossZustaendigkeitAwel === 'hauptzuständig'
              }
              onChange={change}
              name="parlVorstossZustaendigkeitAwel"
              label="haupt"
              tabIndex={6 + nrOfFieldsBeforePv}
            />
            <CustomInput
              id="parlVorstossZustCb2"
              type="checkbox"
              data-value="mitberichtzuständig"
              checked={
                geschaeft.parlVorstossZustaendigkeitAwel ===
                'mitberichtzuständig'
              }
              onChange={change}
              name="parlVorstossZustaendigkeitAwel"
              label="mitbericht"
              tabIndex={7 + nrOfFieldsBeforePv}
            />
          </FormGroup>
        </FieldZustaendigkeit>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaParlVorstoss)
