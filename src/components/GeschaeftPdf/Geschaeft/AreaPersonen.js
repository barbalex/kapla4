import React, { useContext, useMemo } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../shared/ErrorBoundary'
import KontakteIntern from './KontakteIntern'
import KontakteExtern from './KontakteExtern'
import storeContext from '../../../storeContext'
import Select from '../../shared/Select'

const verantwortlichData = (geschaeft, interneOptions) => {
  const data = interneOptions.find((o) => {
    if (geschaeft && geschaeft.verantwortlich) {
      return o.kurzzeichen === geschaeft.verantwortlich
    }
    return false
  })
  if (!data) return ''
  let name = ''
  if (data.name) {
    name = `${data.name} ${data.vorname}, `
  }
  const abt = data.abteilung ? `${data.abteilung}` : ''
  const emailHtml = <a href={`mailto:${data.eMail}`}>{data.eMail}</a>
  const telefon = data.telefon ? `, ${data.telefon}` : ''
  if (data.eMail) {
    return (
      <span>
        {`${name}${abt}, `}
        {emailHtml}
        {`${telefon}`}
      </span>
    )
  }
  return <span>{`${name}${abt}${telefon}`}</span>
}

const Container = styled.div`
  grid-area: areaPersonen;
  border-top: thin solid #ccc;
  border-collapse: collapse;
`
const AreaPersonenDiv = styled.div`
  display: grid;
  grid-column-gap: 10px;
  grid-row-gap: 2px;
  padding: 8px;
  grid-template-columns: 100%;
  align-items: flex-start;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-column: 1;
`
const Subtitle = styled.div`
  font-weight: 900;
  margin-top: 2px;
  grid-column: 1;
`
const Verantwortlich = styled.div`
  grid-column: 1;
  display: none;
`
const VerantwortlichName = styled.div`
  grid-column: 1;
`
const VerantwortlichInfo = styled.div`
  padding-top: 2px;
  padding-bottom: 2px;
  min-height: 0;
`

const AreaPersonen = ({ nrOfFieldsBeforePersonen = 0, saveToDb }) => {
  const store = useContext(storeContext)
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const {
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    interneOptions: interneOptionsPassed,
  } = store.geschaefte
  const isPdf = activeLocation === 'geschaeftPdf'
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}
  const interne = store.geschaefteKontakteIntern.geschaefteKontakteIntern.filter(
    (k) => k.idGeschaeft === activeId,
  )
  const externe = store.geschaefteKontakteExtern.geschaefteKontakteExtern.filter(
    (k) => k.idGeschaeft === activeId,
  )

  const interneOptions = useMemo(() => {
    return _.sortBy(interneOptionsPassed, (o) =>
      `${o.name || 'zz'} ${o.vorname || 'zz'} (${o.kurzzeichen})`.toLowerCase(),
    ).map((o) => {
      const n = `${o.name || '(kein Nachname)'} ${
        o.vorname || '(kein Vorname)'
      } (${o.kurzzeichen || 'kein Kurzzeichen'})`
      return {
        label: n,
        value: o.kurzzeichen,
      }
    })
  }, [interneOptionsPassed])

  return (
    <ErrorBoundary>
      <Container>
        <AreaPersonenDiv>
          <Title>Personen</Title>
          {!(isPdf && !geschaeft.verantwortlich) && (
            <>
              <Subtitle>Verantwortlich</Subtitle>
              <Verantwortlich>
                <Select
                  key={`${geschaeft.idGeschaeft}verantwortlich`}
                  value={geschaeft.verantwortlich}
                  field="verantwortlich"
                  label=""
                  options={interneOptions}
                  saveToDb={saveToDb}
                  tabIndex={1 + nrOfFieldsBeforePersonen}
                />
              </Verantwortlich>
              <VerantwortlichName>
                <VerantwortlichInfo>
                  {verantwortlichData(geschaeft, interneOptionsPassed)}
                </VerantwortlichInfo>
              </VerantwortlichName>
            </>
          )}
          {!(interne.length === 0) && <Subtitle>Interne Kontakte</Subtitle>}
          {!(interne.length === 0) && <KontakteIntern />}
          {!(externe.length === 0) && <Subtitle>Externe Kontakte</Subtitle>}
          {!(externe.length === 0) && <KontakteExtern />}
        </AreaPersonenDiv>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaPersonen)
