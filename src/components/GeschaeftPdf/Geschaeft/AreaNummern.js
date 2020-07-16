import React, { useContext, useState, useEffect } from 'react'
import { Label } from 'reactstrap'
//import Textarea from 'react-textarea-autosize'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../shared/ErrorBoundary'
import GekoNrField from './GekoNrField'
import storeContext from '../../../storeContext'
import Input from '../../shared/Input'

const Container = styled.div`
  grid-area: areaNummern;
  display: grid;
  grid-template-rows: auto;
  padding: 8px;
  /* can't use 1fr for first column - does not work correctly, no idea why */
  /*grid-template-columns: calc(100% - 151px) 8px 105px 8px 30px;*/
  grid-template-columns: 1fr 8px 105px;
  grid-template-areas:
    'areaNummernTitle areaNummernTitle areaNummernTitle'
    '. . labelNr'
    'labelIdGeschaeft . fieldIdGeschaeft'
    'labelGekoNr . fieldGekoNr' '. . .'
    'labelEntscheidAwel .fieldEntscheidAwel'
    'labelEntscheidBdv . fieldEntscheidBdv'
    'labelEntscheidRrb . fieldEntscheidRrb'
    'labelEntscheidBvv . fieldEntscheidBvv'
    'labelEntscheidKr . fieldEntscheidKr'
    'labelAktennummer . fieldAktennummer'
    'labelAktenstandort . fieldAktenstandort';
  border: none;
  border-collapse: collapse;
`
const LabelNr = styled(Label)`
  grid-area: labelNr;
  position: relative;
  min-height: 16px;
  margin-bottom: -2px;
  font-size: 12px;
  font-weight: 500;
`
const LabelNrDiv = styled.div`
  position: absolute;
  bottom: 1px;
`
const LabelHorizontal = styled(Label)`
  margin-top: 3px;
  text-align: right;
  font-size: 10px !important;
  font-weight: 500;
  color: #757575;
`
const AreaNummernTitle = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaNummernTitle;
`
const Field = styled.div`
  height: 17px;
`
const TextareaField = styled.div`
  input {
    font-size: 10px;
  }
`
const FieldIdGeschaeft = styled(Field)`
  grid-area: fieldIdGeschaeft;
`
const LabelIdGeschaeft = styled(LabelHorizontal)`
  grid-area: labelIdGeschaeft;
`
const FieldGekoNr = styled(TextareaField)`
  grid-area: fieldGekoNr;
`
const LabelGekoNr = styled(LabelHorizontal)`
  grid-area: labelGekoNr;
`
const FieldEntscheidAwel = styled(Field)`
  grid-area: fieldEntscheidAwel;
`
const LabelEntscheidAwel = styled(LabelHorizontal)`
  grid-area: labelEntscheidAwel;
`
const FieldEntscheidBdv = styled(Field)`
  grid-area: fieldEntscheidBdv;
`
const LabelEntscheidBdv = styled(LabelHorizontal)`
  grid-area: labelEntscheidBdv;
`
const FieldEntscheidKr = styled(Field)`
  grid-area: fieldEntscheidKr;
`
const LabelEntscheidKr = styled(LabelHorizontal)`
  grid-area: labelEntscheidKr;
`
const LabelAktennummer = styled(LabelHorizontal)`
  grid-area: labelAktennummer;
`
const LabelAktenstandort = styled(LabelHorizontal)`
  grid-area: labelAktenstandort;
`
const FieldEntscheidBvv = styled(Field)`
  grid-area: fieldEntscheidBvv;
`
const LabelEntscheidBvv = styled(LabelHorizontal)`
  grid-area: labelEntscheidBvv;
`
const FieldEntscheidRrb = styled(Field)`
  grid-area: fieldEntscheidRrb;
`
const LabelEntscheidRrb = styled(LabelHorizontal)`
  grid-area: labelEntscheidRrb;
`
const FieldAktenstandort = styled(Field)`
  grid-area: fieldAktenstandort;
  height: 17px;
`
const FieldAktennummer = styled(Field)`
  grid-area: fieldAktennummer;
  height: 17px;
`
const PdfField = styled.div`
  ${(props) =>
    props['data-fontsize'] &&
    `font-size: ${props['data-fontsize']}px !important;`}
  border-bottom: thin solid #ccc;
  padding-bottom: 3px;
  margin-bottom: 5px;
`

const AreaNummern = ({ viewIsNarrow, nrOfGFields, saveToDb }) => {
  const store = useContext(storeContext)

  const {
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    gekoOfActiveId,
  } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}
  const tabsToAdd = viewIsNarrow ? 0 : nrOfGFields
  const gekoValues = gekoOfActiveId.map((g) => g.gekoNr).sort()
  const gekoValuesString = gekoValues.join(', ')
  const gekoFields = gekoValues.map((g) => (
    <GekoNrField
      key={g || 0}
      idGeschaeft={geschaeft.idGeschaeft}
      gekoNr={g}
      tabsToAdd={tabsToAdd}
    />
  ))
  gekoFields.push(
    <GekoNrField
      key={0}
      idGeschaeft={geschaeft.idGeschaeft}
      gekoNr=""
      tabsToAdd={tabsToAdd}
    />,
  )

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [geschaeft.idGeschaeft])

  return (
    <ErrorBoundary>
      <Container>
        <AreaNummernTitle>Nummern</AreaNummernTitle>
        <LabelNr>
          <LabelNrDiv>Nr.</LabelNrDiv>
        </LabelNr>
        <LabelIdGeschaeft>ID</LabelIdGeschaeft>
        <FieldIdGeschaeft>
          <Input
            key={`${geschaeft.idGeschaeft}idGeschaeft`}
            type="number"
            value={geschaeft.idGeschaeft}
            field="idGeschaeft"
            error={errors.idGeschaeft}
            disabled
            background="transparent"
          />
        </FieldIdGeschaeft>
        {!!gekoValuesString && (
          <>
            <LabelGekoNr>Geko</LabelGekoNr>
            <FieldGekoNr>
              <PdfField>{gekoValuesString}</PdfField>
            </FieldGekoNr>
          </>
        )}
        {!!geschaeft.entscheidAwel && (
          <>
            <LabelEntscheidAwel>AWEL</LabelEntscheidAwel>
            <FieldEntscheidAwel>
              <Input
                key={`${geschaeft.idGeschaeft}entscheidAwel`}
                value={geschaeft.entscheidAwel}
                field="entscheidAwel"
                saveToDb={saveToDb}
                error={errors.entscheidAwel}
                tabIndex={2 + tabsToAdd}
              />
            </FieldEntscheidAwel>
          </>
        )}
        {!!geschaeft.entscheidBdv && (
          <>
            <LabelEntscheidBdv>BDV</LabelEntscheidBdv>
            <FieldEntscheidBdv>
              <Input
                key={`${geschaeft.idGeschaeft}entscheidBdv`}
                value={geschaeft.entscheidBdv}
                field="entscheidBdv"
                saveToDb={saveToDb}
                error={errors.entscheidBdv}
                tabIndex={4 + tabsToAdd}
              />
            </FieldEntscheidBdv>
          </>
        )}
        {!!geschaeft.entscheidRrb && (
          <>
            <LabelEntscheidRrb>RRB</LabelEntscheidRrb>
            <FieldEntscheidRrb>
              <Input
                key={`${geschaeft.idGeschaeft}entscheidRrb`}
                value={geschaeft.entscheidRrb}
                field="entscheidRrb"
                saveToDb={saveToDb}
                error={errors.entscheidRrb}
                tabIndex={6 + tabsToAdd}
              />
            </FieldEntscheidRrb>
          </>
        )}
        {!!geschaeft.entscheidBvv && (
          <>
            <LabelEntscheidBvv>BVV</LabelEntscheidBvv>
            <FieldEntscheidBvv>
              <Input
                key={`${geschaeft.idGeschaeft}entscheidBvv`}
                value={geschaeft.entscheidBvv}
                field="entscheidBvv"
                saveToDb={saveToDb}
                error={errors.entscheidBvv}
                tabIndex={8 + tabsToAdd}
              />
            </FieldEntscheidBvv>
          </>
        )}
        {!!geschaeft.entscheidKr && (
          <>
            <LabelEntscheidKr>KR</LabelEntscheidKr>
            <FieldEntscheidKr>
              <Input
                key={`${geschaeft.idGeschaeft}entscheidKr`}
                value={geschaeft.entscheidKr}
                field="entscheidKr"
                saveToDb={saveToDb}
                error={errors.entscheidKr}
                tabIndex={10 + tabsToAdd}
              />
            </FieldEntscheidKr>
          </>
        )}
        {!!geschaeft.aktenstandort && (
          <>
            <LabelAktenstandort>Akten</LabelAktenstandort>
            <FieldAktenstandort>
              <Input
                key={`${geschaeft.idGeschaeft}aktenstandort`}
                value={geschaeft.aktenstandort}
                field="aktenstandort"
                saveToDb={saveToDb}
                error={errors.aktenstandort}
                tabIndex={12 + tabsToAdd}
              />
            </FieldAktenstandort>
          </>
        )}
        {!!geschaeft.aktennummer && (
          <>
            <LabelAktennummer>Akt.Nr.</LabelAktennummer>
            <FieldAktennummer>
              <Input
                key={`${geschaeft.idGeschaeft}aktennummer`}
                value={geschaeft.aktennummer}
                field="aktennummer"
                saveToDb={saveToDb}
                error={errors.aktennummer}
                tabIndex={13 + tabsToAdd}
              />
            </FieldAktennummer>
          </>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaNummern)
