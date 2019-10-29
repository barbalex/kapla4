import React, { useContext } from 'react'
import { FormControl, ControlLabel } from 'react-bootstrap'
import Textarea from 'react-textarea-autosize'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'

import storeContext from '../../storeContext'
import createOptions from '../../src/createOptions'
import Select from '../shared/Select'

const Container = styled.div`
  grid-area: areaGeschaeft;
  background-color: ${props => (props.isPdf ? 'white' : 'rgb(255, 186, 137)')};
  display: grid;
  grid-template-columns: repeat(12, calc((100% - 55px) / 12));
  grid-template-rows: auto;
  grid-template-areas:
    'areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle areaGeschaeftTitle'
    'fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand fieldGegenstand'
    'fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser fieldAusloeser'
    'fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt fieldOrt'
    'fieldGeschaeftsart fieldGeschaeftsart fieldGeschaeftsart fieldGeschaeftsart fieldGeschaeftsart fieldStatus fieldStatus fieldStatus fieldStatus fieldStatus fieldAbteilung fieldAbteilung'
    'fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails fieldDetails'
    'fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt fieldNaechsterSchritt'
    'fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk fieldVermerk'
    'fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern fieldVermerkIntern';
  grid-column-gap: 5px;
  grid-row-gap: 2px;
  padding: 8px;
  border: ${props => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaGeschaeftTitle;
`
const StyledTextarea = styled(Textarea)`
  display: block;
  width: 100%;
  padding: 6px 12px;
  line-height: 1.42857143;
  color: #555;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  &:focus {
    border-color: #66afe9;
    outline: 0;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(102, 175, 233, 0.6);
  }
`
const Ausloeser = styled.div`
  grid-area: fieldAusloeser;
`
const Ort = styled.div`
  grid-area: fieldOrt;
`
const Geschaeftsart = styled.div`
  grid-area: fieldGeschaeftsart;
`
const Gegenstand = styled.div`
  grid-area: fieldGegenstand;
`
const Details = styled.div`
  grid-area: fieldDetails;
`
const Status = styled.div`
  grid-area: fieldStatus;
`
const Abteilung = styled.div`
  grid-area: fieldAbteilung;
`
const NaechsterSchritt = styled.div`
  grid-area: fieldNaechsterSchritt;
`
const Vermerk = styled.div`
  grid-area: fieldVermerk;
`
const VermerkIntern = styled.div`
  grid-area: fieldVermerkIntern;
`

const AreaGeschaeft = ({
  blur,
  saveToDb,
  change,
  nrOfGFields,
  viewIsNarrow,
}) => {
  const store = useContext(storeContext)
  const {
    activeId,
    geschaeftePlusFilteredAndSorted: geschaefte,
    statusOptions,
    abteilungOptions,
    geschaeftsartOptions,
  } = store.geschaefte
  const path = store.history.location.pathname
  const isPdf = path === '/geschaeftPdf'
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}
  const tabsToAdd = viewIsNarrow ? nrOfGFields : 0

  const geschaeftsartOptionsComponent = createOptions(geschaeftsartOptions)

  return (
    <ErrorBoundary>
      <Container data-ispdf={isPdf}>
        <Title>Geschäft</Title>
        <Gegenstand>
          <ControlLabel>Gegenstand</ControlLabel>
          <StyledTextarea
            value={geschaeft.gegenstand || ''}
            name="gegenstand"
            onChange={change}
            onBlur={blur}
            tabIndex={1 + tabsToAdd}
          />
        </Gegenstand>
        {!(!geschaeft.ausloeser && isPdf) && (
          <Ausloeser>
            <ControlLabel>Auslöser</ControlLabel>
            <StyledTextarea
              value={geschaeft.ausloeser || ''}
              name="ausloeser"
              onChange={change}
              onBlur={blur}
              tabIndex={2 + tabsToAdd}
            />
          </Ausloeser>
        )}
        {!(!geschaeft.ort && isPdf) && (
          <Ort>
            <ControlLabel>Ort</ControlLabel>
            <FormControl
              type="text"
              value={geschaeft.ort || ''}
              name="ort"
              onChange={change}
              onBlur={blur}
              bsSize="small"
              tabIndex={3 + tabsToAdd}
            />
          </Ort>
        )}
        {!(!geschaeft.geschaeftsart && isPdf) && (
          <Geschaeftsart>
            <ControlLabel>Geschäftsart</ControlLabel>
            <FormControl
              componentClass="select"
              value={geschaeft.geschaeftsart || ''}
              name="geschaeftsart"
              onChange={change}
              bsSize="small"
              tabIndex={4 + tabsToAdd}
            >
              {geschaeftsartOptionsComponent}
            </FormControl>
          </Geschaeftsart>
        )}
        {!(!geschaeft.status && isPdf) && (
          <Status>
            <ControlLabel>Status</ControlLabel>
            <FormControl
              componentClass="select"
              value={geschaeft.status || ''}
              name="status"
              onChange={change}
              bsSize="small"
              tabIndex={5 + tabsToAdd}
            >
              {createOptions(statusOptions)}
            </FormControl>
          </Status>
        )}
        {!(!geschaeft.abteilung && isPdf) && (
          <Abteilung>
            <ControlLabel>Abteilung</ControlLabel>
            <Select
              key={`${geschaeft.idGeschaeft}abteilung`}
              value={geschaeft.abteilung}
              field="abteilung"
              label="Abteilung"
              options={abteilungOptions.map(o => ({ label: o, value: o }))}
              saveToDb={saveToDb}
              //error={errors.abteilung}
              row={false}
              bsSize="small"
              tabIndex={6 + tabsToAdd}
            />
          </Abteilung>
        )}
        {!(!geschaeft.details && isPdf) && (
          <Details>
            <ControlLabel>Details</ControlLabel>
            <StyledTextarea
              value={geschaeft.details || ''}
              name="details"
              onChange={change}
              onBlur={blur}
              tabIndex={7 + tabsToAdd}
            />
          </Details>
        )}
        {!(!geschaeft.naechsterSchritt && isPdf) && (
          <NaechsterSchritt>
            <ControlLabel>Nächster Schritt</ControlLabel>
            <StyledTextarea
              value={geschaeft.naechsterSchritt || ''}
              name="naechsterSchritt"
              onChange={change}
              onBlur={blur}
              tabIndex={8 + tabsToAdd}
            />
          </NaechsterSchritt>
        )}
        {!(!geschaeft.vermerk && isPdf) && (
          <Vermerk>
            <ControlLabel>Vermerk</ControlLabel>
            <StyledTextarea
              value={geschaeft.vermerk || ''}
              name="vermerk"
              onChange={change}
              onBlur={blur}
              tabIndex={9 + tabsToAdd}
            />
          </Vermerk>
        )}
        <VermerkIntern>
          <ControlLabel>
            Vermerk intern (in Berichten nicht angezeigt)
          </ControlLabel>
          <StyledTextarea
            value={geschaeft.vermerkIntern || ''}
            name="vermerkIntern"
            onChange={change}
            onBlur={blur}
            tabIndex={9 + tabsToAdd}
          />
        </VermerkIntern>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaGeschaeft)
