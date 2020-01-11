import React, { useContext } from 'react'
import { CustomInput, Label, Input, InputGroup } from 'reactstrap'
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

const AreaParlVorstoss = ({
  values,
  firstTabIndex,
  change,
  changeComparator,
}) => {
  const store = useContext(storeContext)

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
          <StyledLabel>Stufe</StyledLabel>
          <CustomInput
            id="parlVorstossStufeCheckbox1"
            type="checkbox"
            data-value="1"
            checked={values.parlVorstossStufe === '1'}
            onChange={change}
            name="parlVorstossStufe"
            label="1: nicht überwiesen"
            tabIndex={2 + firstTabIndex}
          />
          <CustomInput
            id="parlVorstossStufeCheckbox2"
            type="checkbox"
            data-value="2"
            checked={values.parlVorstossStufe === '2'}
            onChange={change}
            name="parlVorstossStufe"
            label="2: überwiesen"
            tabIndex={3 + firstTabIndex}
          />
        </FieldStufe>
        <FieldZustaendigkeit>
          <StyledLabel>Zuständigkeit</StyledLabel>
          <CustomInput
            id="parlVorstossZustCheckbox1"
            type="checkbox"
            data-value="hauptzuständig"
            checked={values.parlVorstossZustaendigkeitAwel === 'hauptzuständig'}
            onChange={change}
            name="parlVorstossZustaendigkeitAwel"
            label="haupt"
            tabIndex={6 + firstTabIndex}
          />
          <CustomInput
            id="parlVorstossZustCheckbox2"
            type="checkbox"
            data-value="mitberichtzuständig"
            checked={
              values.parlVorstossZustaendigkeitAwel === 'mitberichtzuständig'
            }
            onChange={change}
            name="parlVorstossZustaendigkeitAwel"
            label="mitbericht"
            tabIndex={7 + firstTabIndex}
          />
        </FieldZustaendigkeit>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaParlVorstoss)
