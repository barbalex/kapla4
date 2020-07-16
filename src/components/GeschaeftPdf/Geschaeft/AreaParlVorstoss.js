import React, { useContext, useState, useEffect } from 'react'
import { FormGroup, Label, CustomInput } from 'reactstrap'
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
  grid-template-areas: 'areaParlVorstTitle areaParlVorstTitle' 'fieldParlVorstossTyp fieldParlVorstossTyp' 'fieldStufe fieldZustaendigkeit';
  grid-gap: 15px 8px;
  padding: 8px;
  padding-right: 15px;
  ${(props) => props['data-ispdf'] && 'border: thin solid #ccc;'}
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
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const {
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    parlVorstossTypOptions,
  } = store.geschaefte
  const isPdf = activeLocation === 'geschaeftPdf'
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}
  let stufeValue = ''
  if (geschaeft.parlVorstossStufe === '1') stufeValue = '1: nicht überwiesen'
  if (geschaeft.parlVorstossStufe === '2') stufeValue = '2: überwiesen'
  const zustaendigkeitValue = geschaeft.parlVorstossZustaendigkeitAwel
    ? geschaeft.parlVorstossZustaendigkeitAwel.replace('zuständig', '')
    : ''

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [geschaeft.idGeschaeft])

  return (
    <ErrorBoundary>
      <Container data-ispdf={isPdf}>
        <Title>Parlamentarischer Vorstoss</Title>
        {!(isPdf && !geschaeft.parlVorstossTyp) && (
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
        )}
        {!(isPdf && !geschaeft.parlVorstossStufe) && (
          <FieldStufe>
            {isPdf ? (
              <InputComponent
                key={`${geschaeft.idGeschaeft}stufe`}
                value={stufeValue}
                field="stufe"
                label="Stufe"
                saveToDb={() => {}}
                tabIndex={2 + nrOfFieldsBeforePv}
              />
            ) : (
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
            )}
          </FieldStufe>
        )}
        {!(isPdf && !geschaeft.parlVorstossZustaendigkeitAwel) && (
          <FieldZustaendigkeit>
            {isPdf ? (
              <InputComponent
                key={`${geschaeft.idGeschaeft}zustaendigkeit`}
                value={zustaendigkeitValue}
                field="zustaendigkeit"
                label="Zuständigkeit"
                saveToDb={() => {}}
                tabIndex={6 + nrOfFieldsBeforePv}
              />
            ) : (
              <FormGroup tag="fieldset">
                <StyledTitleLabel>Zuständigkeit</StyledTitleLabel>
                <CustomInput
                  id="parlVorstossZustCb1"
                  type="checkbox"
                  data-value="hauptzuständig"
                  checked={
                    geschaeft.parlVorstossZustaendigkeitAwel ===
                    'hauptzuständig'
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
            )}
          </FieldZustaendigkeit>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaParlVorstoss)
