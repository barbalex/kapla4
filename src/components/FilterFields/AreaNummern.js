import React, { useContext } from 'react'
import { ControlLabel } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { toJS } from 'mobx'

import Input from './Input'
import SelectInput from './SelectInput'
import mobxStoreContext from '../../mobxStoreContext'

const Container = styled.div`
  grid-area: areaNummern;
  background-color: white;
  box-shadow: inset 1em 1em 2em rgb(239, 239, 239),
    inset -1em -1em 2em rgb(239, 239, 239);
  outline: 1px solid #efefef;
  display: grid;
  /* can't use 1fr for first column - does not work correctly, no idea why */
  grid-template-columns: calc(100% - 183px) 8px 175px;
  grid-template-rows: auto;
  grid-template-areas:
    'areaNummernTitle areaNummernTitle labelNr'
    'labelIdGeschaeft . fieldIdGeschaeft'
    'labelGekoNr . fieldGekoNr'
    'labelEntscheidAwel . fieldEntscheidAwel'
    'labelEntscheidBdv . fieldEntscheidBdv'
    'labelEntscheidRrb . fieldEntscheidRrb'
    'labelEntscheidBvv . fieldEntscheidBvv'
    'labelEntscheidKr . fieldEntscheidKr'
    'fieldAktenstandort . fieldAktennummer';
  grid-row-gap: 2px;
  padding: 8px;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaNummernTitle;
`
const LabelNrDiv = styled.div`
  position: absolute;
  bottom: 1px;
`
const LabelIdGeschaeft = styled(ControlLabel)`
  margin-top: 11px;
  text-align: right;
  grid-area: labelIdGeschaeft;
`
const FieldIdGeschaeft = styled.div`
  grid-area: fieldIdGeschaeft;
`
const LabelGekoNr = styled(ControlLabel)`
  margin-top: 11px;
  text-align: right;
  grid-area: labelGekoNr;
`
const FieldGekoNr = styled.div`
  grid-area: fieldGekoNr;
`
const LabelJahre = styled.div`
  color: #757575;
  font-size: 11px;
  font-weight: 500;
  grid-area: labelJahre;
  position: relative;
  min-height: 16px;
`
const LabelEntscheidAwel = styled(ControlLabel)`
  margin-top: 11px;
  text-align: right;
  grid-area: labelEntscheidAwel;
`
const FieldEntscheidAwel = styled.div`
  grid-area: fieldEntscheidAwel;
`
const LabelEntscheidBdv = styled(ControlLabel)`
  margin-top: 11px;
  text-align: right;
  grid-area: labelEntscheidBdv;
`
const FieldEntscheidBdv = styled.div`
  grid-area: fieldEntscheidBdv;
`
const LabelEntscheidRrb = styled(ControlLabel)`
  margin-top: 11px;
  text-align: right;
  grid-area: labelEntscheidRrb;
`
const FieldEntscheidRrb = styled.div`
  grid-area: fieldEntscheidRrb;
`
const LabelEntscheidBvv = styled(ControlLabel)`
  margin-top: 11px;
  text-align: right;
  grid-area: labelEntscheidBvv;
`
const FieldEntscheidBvv = styled.div`
  grid-area: fieldEntscheidBvv;
`
const LabelEntscheidKr = styled(ControlLabel)`
  margin-top: 11px;
  text-align: right;
  grid-area: labelEntscheidKr;
`
const FieldEntscheidKr = styled.div`
  grid-area: fieldEntscheidKr;
`
const FieldAktenstandort = styled.div`
  grid-area: fieldAktenstandort;
`
const FieldAktennummer = styled.div`
  grid-area: fieldAktennummer;
`

const AreaNummern = ({ values, firstTabIndex, change, changeComparator }) => {
  const store = useContext(mobxStoreContext)
  const { aktenstandortOptions } = store.geschaefte

  return (
    <Container>
      <Title>Nummern</Title>
      <LabelIdGeschaeft>ID</LabelIdGeschaeft>
      <FieldIdGeschaeft>
        <Input
          type="number"
          name="idGeschaeft"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={1 + firstTabIndex}
        />
      </FieldIdGeschaeft>
      <LabelGekoNr>Geko</LabelGekoNr>
      <FieldGekoNr>
        <Input
          type="text"
          name="gekoNr"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={2 + firstTabIndex}
        />
      </FieldGekoNr>
      <LabelJahre>
        <LabelNrDiv>Jahr</LabelNrDiv>
      </LabelJahre>
      <LabelEntscheidAwel>AWEL</LabelEntscheidAwel>
      <FieldEntscheidAwel>
        <Input
          name="entscheidAwel"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={3 + firstTabIndex}
        />
      </FieldEntscheidAwel>
      <LabelEntscheidBdv>BDV</LabelEntscheidBdv>
      <FieldEntscheidBdv>
        <Input
          name="entscheidBdv"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={5 + firstTabIndex}
        />
      </FieldEntscheidBdv>
      <LabelEntscheidRrb>RRB</LabelEntscheidRrb>
      <FieldEntscheidRrb>
        <Input
          name="entscheidRrb"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={7 + firstTabIndex}
        />
      </FieldEntscheidRrb>
      <LabelEntscheidBvv>BVV</LabelEntscheidBvv>
      <FieldEntscheidBvv>
        <Input
          name="entscheidBvv"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={9 + firstTabIndex}
        />
      </FieldEntscheidBvv>
      <LabelEntscheidKr>KR</LabelEntscheidKr>
      <FieldEntscheidKr>
        <Input
          name="entscheidKr"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={11 + firstTabIndex}
        />
      </FieldEntscheidKr>
      <FieldAktenstandort>
        <ControlLabel>Aktenstandort</ControlLabel>
        <SelectInput
          name="aktenstandort"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={13 + firstTabIndex}
          options={toJS(aktenstandortOptions)}
        />
      </FieldAktenstandort>
      <FieldAktennummer>
        <ControlLabel>Nr.</ControlLabel>
        <Input
          type="text"
          name="aktennummer"
          change={change}
          values={values}
          changeComparator={changeComparator}
          tabIndex={14 + firstTabIndex}
        />
      </FieldAktennummer>
    </Container>
  )
}

export default observer(AreaNummern)
