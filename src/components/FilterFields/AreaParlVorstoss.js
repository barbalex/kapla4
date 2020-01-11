import React, { useContext } from 'react'
import { Radio } from 'react-bootstrap'
import { FormGroup, Label, Input, InputGroup } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'

import ComparatorSelector from './ComparatorSelector'
import storeContext from '../../storeContext'
import createOptions from '../../src/createOptions'

const Container = styled.div`
  grid-area: areaForGeschaeftsart;
  background-color: white;
  box-shadow: inset 1em 1em 2em rgb(255, 237, 199),
    inset -1em -1em 2em rgb(255, 237, 199);
  outline: 1px solid #efefef;
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: auto;
  grid-template-areas: 'areaParlVorstTitle areaParlVorstTitle' 'fieldParlVorstossTyp fieldParlVorstossTyp' 'fieldStufe fieldZustaendigkeit';
  grid-gap: 15px 8px;
  padding: 8px;
  padding-right: 15px;
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
const StyledLabel = styled(Label)`
  font-size: 12px;
  color: #757575;
  margin: 0 0 -2px 0;
`
const StyledRadioLabel = styled(Label)`
  display: block;
`

const AreaParlVorstoss = ({
  values,
  firstTabIndex,
  change,
  changeComparator,
}) => {
  const store = useContext(storeContext)

  console.log('AreaParlVorstoss, values:', values)

  return (
    <ErrorBoundary>
      <Container>
        <Title>Parlamentarischer Vorstoss</Title>
        <FieldParlVorstossTyp>
          <StyledLabel>Typ</StyledLabel>
          <InputGroup>
            <ComparatorSelector
              name="parlVorstossTyp"
              changeComparator={changeComparator}
            />
            <Input
              type="select"
              value={values.parlVorstossTyp || ''}
              name="parlVorstossTyp"
              onChange={change}
              tabIndex={1 + firstTabIndex}
            >
              {createOptions(store.geschaefte.parlVorstossTypOptions)}
            </Input>
          </InputGroup>
        </FieldParlVorstossTyp>
        <FieldStufe>
          <FormGroup tag="fieldset">
            <StyledLabel>Stufe</StyledLabel>
            <FormGroup>
              <StyledRadioLabel check={values.parlVorstossStufe === '1'}>
                <Input
                  type="checkbox"
                  data-value="1"
                  checked={values.parlVorstossStufe === '1'}
                  onChange={change}
                  name="parlVorstossStufe"
                  tabIndex={2 + firstTabIndex}
                />
                1: nicht überwiesen
              </StyledRadioLabel>
              <StyledRadioLabel check={values.parlVorstossStufe === '2'}>
                <Input
                  type="checkbox"
                  data-value="2"
                  checked={values.parlVorstossStufe === '2'}
                  onChange={change}
                  name="parlVorstossStufe"
                  tabIndex={3 + firstTabIndex}
                />
                2: überwiesen
              </StyledRadioLabel>
            </FormGroup>
          </FormGroup>
        </FieldStufe>
        <FieldZustaendigkeit>
          <StyledLabel>Zuständigkeit</StyledLabel>
          <Radio
            data-value="hauptzuständig"
            checked={values.parlVorstossZustaendigkeitAwel === 'hauptzuständig'}
            name="parlVorstossZustaendigkeitAwel"
            onChange={change}
            tabIndex={6 + firstTabIndex}
          >
            haupt
          </Radio>
          <Radio
            data-value="mitberichtzuständig"
            checked={
              values.parlVorstossZustaendigkeitAwel === 'mitberichtzuständig'
            }
            name="parlVorstossZustaendigkeitAwel"
            onChange={change}
            tabIndex={7 + firstTabIndex}
          >
            mitbericht
          </Radio>
        </FieldZustaendigkeit>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaParlVorstoss)
