import React, { useContext } from 'react'
import { FormControl, ControlLabel, Radio } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'

import storeContext from '../../storeContext'
import createOptions from '../../src/createOptions'

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

const AreaParlVorstoss = ({ nrOfFieldsBeforePv, change }) => {
  const store = useContext(storeContext)
  const {
    activeId,
    geschaeftePlusFilteredAndSorted: geschaefte,
    parlVorstossTypOptions,
  } = store.geschaefte
  const path = store.history.location.pathname
  const isPdf = path === '/geschaeftPdf'
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}
  let stufeValue = ''
  if (geschaeft.parlVorstossStufe === '1') stufeValue = '1: nicht überwiesen'
  if (geschaeft.parlVorstossStufe === '2') stufeValue = '2: überwiesen'
  const zustaendigkeitValue = geschaeft.parlVorstossZustaendigkeitAwel
    ? geschaeft.parlVorstossZustaendigkeitAwel.replace('zuständig', '')
    : ''

  return (
    <ErrorBoundary>
      <Container data-ispdf={isPdf}>
        <Title>Parlamentarischer Vorstoss</Title>
        {!(isPdf && !geschaeft.parlVorstossTyp) && (
          <FieldParlVorstossTyp>
            <ControlLabel>Typ</ControlLabel>
            <FormControl
              componentClass="select"
              value={geschaeft.parlVorstossTyp || ''}
              name="parlVorstossTyp"
              onChange={change}
              bsSize="small"
              tabIndex={1 + nrOfFieldsBeforePv}
            >
              {createOptions(parlVorstossTypOptions)}
            </FormControl>
          </FieldParlVorstossTyp>
        )}
        {!(isPdf && !geschaeft.parlVorstossStufe) && (
          <FieldStufe>
            {!isPdf && (
              <div>
                <ControlLabel>Stufe</ControlLabel>
                <Radio
                  data-value="1"
                  checked={geschaeft.parlVorstossStufe === '1'}
                  onChange={change}
                  bsSize="small"
                  name="parlVorstossStufe"
                  tabIndex={2 + nrOfFieldsBeforePv}
                >
                  1: nicht überwiesen
                </Radio>
                <Radio
                  data-value="2"
                  checked={geschaeft.parlVorstossStufe === '2'}
                  name="parlVorstossStufe"
                  onChange={change}
                  bsSize="small"
                  tabIndex={3 + nrOfFieldsBeforePv}
                >
                  2: überwiesen
                </Radio>
              </div>
            )}
            {isPdf && (
              <div>
                <ControlLabel>Stufe</ControlLabel>
                <FormControl
                  type="text"
                  defaultValue={stufeValue}
                  bsSize="small"
                  tabIndex={2 + nrOfFieldsBeforePv}
                />
              </div>
            )}
          </FieldStufe>
        )}
        {!(isPdf && !geschaeft.parlVorstossZustaendigkeitAwel) && (
          <FieldZustaendigkeit>
            {isPdf && (
              <div>
                <ControlLabel>Zuständigkeit</ControlLabel>
                <FormControl
                  type="text"
                  defaultValue={zustaendigkeitValue}
                  bsSize="small"
                  tabIndex={6 + nrOfFieldsBeforePv}
                />
              </div>
            )}
            {!isPdf && (
              <div>
                <ControlLabel>Zuständigkeit</ControlLabel>
                <Radio
                  data-value="hauptzuständig"
                  checked={
                    geschaeft.parlVorstossZustaendigkeitAwel ===
                    'hauptzuständig'
                  }
                  name="parlVorstossZustaendigkeitAwel"
                  onChange={change}
                  bsSize="small"
                  tabIndex={6 + nrOfFieldsBeforePv}
                >
                  haupt
                </Radio>
                <Radio
                  data-value="mitberichtzuständig"
                  checked={
                    geschaeft.parlVorstossZustaendigkeitAwel ===
                    'mitberichtzuständig'
                  }
                  name="parlVorstossZustaendigkeitAwel"
                  onChange={change}
                  bsSize="small"
                  tabIndex={7 + nrOfFieldsBeforePv}
                >
                  mitbericht
                </Radio>
              </div>
            )}
          </FieldZustaendigkeit>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaParlVorstoss)
