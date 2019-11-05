import React, { useContext, useState, useEffect } from 'react'
import { FormControl, ControlLabel } from 'react-bootstrap'
import { FormGroup, Label, Input } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'

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
  border: ${props => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
  border-left: none;
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
const StyledLabel = styled(Label)`
  display: block;
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
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}
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
              options={parlVorstossTypOptions.map(o => ({
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
              <div>
                <ControlLabel>Stufe</ControlLabel>
                <FormControl
                  type="text"
                  defaultValue={stufeValue}
                  bsSize="small"
                  tabIndex={2 + nrOfFieldsBeforePv}
                />
              </div>
            ) : (
              <FormGroup tag="fieldset">
                <StyledTitleLabel>Stufe</StyledTitleLabel>
                <FormGroup check>
                  <StyledLabel check>
                    <Input
                      type="radio"
                      data-value="1"
                      checked={geschaeft.parlVorstossStufe === '1'}
                      name="parlVorstossStufe"
                      onChange={change}
                      tabIndex={2 + nrOfFieldsBeforePv}
                    />
                    1: nicht überwiesen
                  </StyledLabel>

                  <StyledLabel check>
                    <Input
                      type="radio"
                      data-value="2"
                      checked={geschaeft.parlVorstossStufe === '2'}
                      name="parlVorstossStufe"
                      onChange={change}
                      tabIndex={3 + nrOfFieldsBeforePv}
                    />
                    2: überwiesen
                  </StyledLabel>
                </FormGroup>
              </FormGroup>
            )}
          </FieldStufe>
        )}
        {!(isPdf && !geschaeft.parlVorstossZustaendigkeitAwel) && (
          <FieldZustaendigkeit>
            {isPdf ? (
              <div>
                <ControlLabel>Zuständigkeit</ControlLabel>
                <FormControl
                  type="text"
                  defaultValue={zustaendigkeitValue}
                  bsSize="small"
                  tabIndex={6 + nrOfFieldsBeforePv}
                />
              </div>
            ) : (
              <FormGroup tag="fieldset">
                <StyledTitleLabel>Zuständigkeit</StyledTitleLabel>
                <FormGroup check>
                  <StyledLabel check>
                    <Input
                      type="radio"
                      data-value="hauptzuständig"
                      checked={
                        geschaeft.parlVorstossZustaendigkeitAwel ===
                        'hauptzuständig'
                      }
                      name="parlVorstossZustaendigkeitAwel"
                      onChange={change}
                      tabIndex={6 + nrOfFieldsBeforePv}
                    />
                    haupt
                  </StyledLabel>
                  <StyledLabel check>
                    <Input
                      type="radio"
                      data-value="mitberichtzuständig"
                      checked={
                        geschaeft.parlVorstossZustaendigkeitAwel ===
                        'mitberichtzuständig'
                      }
                      name="parlVorstossZustaendigkeitAwel"
                      onChange={change}
                      tabIndex={7 + nrOfFieldsBeforePv}
                    />
                    mitbericht
                  </StyledLabel>
                </FormGroup>
              </FormGroup>
            )}
          </FieldZustaendigkeit>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaParlVorstoss)
