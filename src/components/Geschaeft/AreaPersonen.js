import React, { useContext, useState, useEffect, useMemo } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import KontakteIntern from './KontakteIntern'
import KontakteExtern from './KontakteExtern'
import storeContext from '../../storeContext'
import Select from '../shared/Select'

const verantwortlichData = (geschaeft, interneOptions, isPdf) => {
  const data = interneOptions.find(o => {
    if (geschaeft && geschaeft.verantwortlich) {
      return o.kurzzeichen === geschaeft.verantwortlich
    }
    return false
  })
  if (!data) return ''
  let name = ''
  if (isPdf && data.name) {
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

const ContainerBase = styled.div`
  grid-area: areaPersonen;
`
const ContainerView = styled(ContainerBase)`
  background-color: rgb(246, 255, 245);
`
const ContainerPrint = styled(ContainerBase)`
  border: 1px solid #ccc;
  border-bottom: none;
  border-left: none;
`
const AreaPersonenDivBase = styled.div`
  display: grid;
  grid-column-gap: 10px;
  grid-row-gap: 2px;
  padding: 8px;
`
const AreaPersonenDivView = styled(AreaPersonenDivBase)`
  background-color: rgb(246, 255, 245);
  grid-template-columns: 260px calc((100% - 10px) - 260px);
  align-items: center;
`
const AreaPersonenDivPrint = styled(AreaPersonenDivBase)`
  grid-template-columns: 100%;
  align-items: flex-start;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-column: 1;
`
const SubtitleBase = styled.div`
  font-weight: 900;
`
const SubtitleView = styled(SubtitleBase)`
  font-size: 12px;
  margin-top: 5px;
  grid-column: 1 / span 2;
`
const SubtitlePrint = styled(SubtitleBase)`
  margin-top: 2px;
  grid-column: 1;
`
const VerantwortlichView = styled.div`
  grid-column: 1 / span 1;
`
const VerantwortlichPrint = styled.div`
  grid-column: 1;
  display: none;
`
const VerantwortlichNameView = styled.div`
  grid-column: 2 / span 1;
`
const VerantwortlichNamePrint = styled.div`
  grid-column: 1;
`
const VerantwortlichInfoView = styled.div`
  margin-top: -11px;
`
const VerantwortlichInfoPrint = styled.div`
  padding-top: 2px;
  padding-bottom: 2px;
  min-height: 0;
`

const AreaPersonen = ({ nrOfFieldsBeforePersonen = 0, change, saveToDb }) => {
  const store = useContext(storeContext)
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const {
    activeId,
    geschaefteFilteredAndSorted: geschaefte,
    interneOptions: interneOptionsPassed,
  } = store.geschaefte
  const isPdf = activeLocation === 'geschaeftPdf'
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}
  const Container = isPdf ? ContainerPrint : ContainerView
  const AreaPersonenDiv = isPdf ? AreaPersonenDivPrint : AreaPersonenDivView
  const Subtitle = isPdf ? SubtitlePrint : SubtitleView
  const Verantwortlich = isPdf ? VerantwortlichPrint : VerantwortlichView
  const VerantwortlichName = isPdf
    ? VerantwortlichNamePrint
    : VerantwortlichNameView
  const VerantwortlichInfo = isPdf
    ? VerantwortlichInfoPrint
    : VerantwortlichInfoView
  const interne = store.geschaefteKontakteIntern.geschaefteKontakteIntern.filter(
    k => k.idGeschaeft === activeId,
  )
  const externe = store.geschaefteKontakteExtern.geschaefteKontakteExtern.filter(
    k => k.idGeschaeft === activeId,
  )

  const interneOptions = useMemo(() => {
    return _.sortBy(interneOptionsPassed, o =>
      `${o.name || 'zz'} ${o.vorname || 'zz'} (${o.kurzzeichen})`.toLowerCase(),
    ).map(o => {
      const n = `${o.name || '(kein Nachname)'} ${o.vorname ||
        '(kein Vorname)'} (${o.kurzzeichen || 'kein Kurzzeichen'})`
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
                  error={errors.verantwortlich}
                  tabIndex={1 + nrOfFieldsBeforePersonen}
                />
              </Verantwortlich>
              <VerantwortlichName>
                <VerantwortlichInfo>
                  {verantwortlichData(geschaeft, interneOptionsPassed, isPdf)}
                </VerantwortlichInfo>
              </VerantwortlichName>
            </>
          )}
          {!(isPdf && interne.length === 0) && (
            <Subtitle>Interne Kontakte</Subtitle>
          )}
          {!(isPdf && interne.length === 0) && (
            <KontakteIntern tabIndex={nrOfFieldsBeforePersonen + 1} />
          )}
          {!(isPdf && externe.length === 0) && (
            <Subtitle>Externe Kontakte</Subtitle>
          )}
          {!(isPdf && externe.length === 0) && (
            <KontakteExtern tabIndex={nrOfFieldsBeforePersonen + 2} />
          )}
        </AreaPersonenDiv>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaPersonen)
