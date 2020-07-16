import React, { useContext, useState, useEffect, useMemo } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary'
import KontakteIntern from './KontakteIntern'
import KontakteExtern from './KontakteExtern'
import storeContext from '../../storeContext'
import Select from '../shared/Select'

const verantwortlichData = (geschaeft, interneOptions) => {
  const data = interneOptions.find((o) => {
    if (geschaeft && geschaeft.verantwortlich) {
      return o.kurzzeichen === geschaeft.verantwortlich
    }
    return false
  })
  if (!data) return ''
  const abt = data.abteilung ? `${data.abteilung}` : ''
  const emailHtml = <a href={`mailto:${data.eMail}`}>{data.eMail}</a>
  const telefon = data.telefon ? `, ${data.telefon}` : ''
  if (data.eMail) {
    return (
      <span>
        {`${abt}, `}
        {emailHtml}
        {`${telefon}`}
      </span>
    )
  }
  return <span>{`${abt}${telefon}`}</span>
}

const ContainerBase = styled.div`
  grid-area: areaPersonen;
`
const Container = styled(ContainerBase)`
  background-color: rgb(246, 255, 245);
`
const AreaPersonenDivBase = styled.div`
  display: grid;
  grid-column-gap: 10px;
  grid-row-gap: 2px;
  padding: 8px;
`
const AreaPersonenDiv = styled(AreaPersonenDivBase)`
  background-color: rgb(246, 255, 245);
  grid-template-columns: 260px calc((100% - 10px) - 260px);
  align-items: center;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-column: 1;
`
const SubtitleBase = styled.div`
  font-weight: 900;
`
const Subtitle = styled(SubtitleBase)`
  font-size: 12px;
  margin-top: 5px;
  grid-column: 1 / span 2;
`
const Verantwortlich = styled.div`
  grid-column: 1 / span 1;
`
const VerantwortlichName = styled.div`
  grid-column: 2 / span 1;
`
const VerantwortlichInfo = styled.div`
  margin-top: -11px;
`

const AreaPersonen = ({ nrOfFieldsBeforePersonen = 0, saveToDb }) => {
  const store = useContext(storeContext)
  const {
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    interneOptions: interneOptionsPassed,
  } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}

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

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [geschaeft.idGeschaeft])

  return (
    <ErrorBoundary>
      <Container>
        <AreaPersonenDiv>
          <Title>Personen</Title>
          <Subtitle>Verantwortlich</Subtitle>
          <Verantwortlich>
            <Select
              key={`${geschaeft.idGeschaeft}verantwortlich`}
              value={geschaeft.verantwortlich}
              field="verantwortlich"
              label=""
              options={interneOptions}
              saveToDb={saveToDb}
              error={errors.verantwortlich}
              tabIndex={1 + nrOfFieldsBeforePersonen}
            />
          </Verantwortlich>
          <VerantwortlichName>
            <VerantwortlichInfo>
              {verantwortlichData(geschaeft, interneOptionsPassed)}
            </VerantwortlichInfo>
          </VerantwortlichName>
          <Subtitle>Interne Kontakte</Subtitle>
          <KontakteIntern tabIndex={nrOfFieldsBeforePersonen + 1} />
          <Subtitle>Externe Kontakte</Subtitle>
          <KontakteExtern tabIndex={nrOfFieldsBeforePersonen + 2} />
        </AreaPersonenDiv>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaPersonen)
