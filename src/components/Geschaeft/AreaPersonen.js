import React, { useContext } from 'react'
import { FormControl } from 'react-bootstrap'
import _ from 'lodash'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import KontakteIntern from './KontakteIntern'
import KontakteExtern from './KontakteExtern'
import storeContext from '../../storeContext'

const verwantwortlichOptions = interneOptions => {
  // sort interneOptions by kurzzeichen
  const interneOptionsSorted = _.sortBy(interneOptions, o => {
    const sort = `${o.name || 'zz'} ${o.vorname || 'zz'} (${o.kurzzeichen})`
    return sort.toLowerCase()
  })
  const options = interneOptionsSorted.map(o => {
    const name = `${o.name || '(kein Name)'} ${o.vorname ||
      '(kein Vorname)'} (${o.kurzzeichen})`
    return (
      <option key={o.id} value={o.kurzzeichen}>
        {name}
      </option>
    )
  })
  options.unshift(<option key={0} value={undefined} />)
  return options
}

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
  font-size: 10px;
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
  font-size: 12px;
`
const VerantwortlichNamePrint = styled.div`
  grid-column: 1;
  font-size: 10px;
`
const StyledFormcontrolStaticView = styled(FormControl.Static)`
  padding-top: 9px;
  padding-bottom: 7px;
  min-height: 35px;
`
const StyledFormcontrolStaticPrint = styled(FormControl.Static)`
  padding-top: 2px;
  padding-bottom: 2px;
  min-height: 0;
`

const AreaPersonen = ({ nrOfFieldsBeforePersonen = 0, change }) => {
  const store = useContext(storeContext)
  const {
    activeId,
    geschaeftePlusFilteredAndSorted: geschaefte,
    interneOptions,
  } = store.geschaefte
  const path = store.history.location.pathname
  const isPdf = path === '/geschaeftPdf'
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}
  const Container = isPdf ? ContainerPrint : ContainerView
  const AreaPersonenDiv = isPdf ? AreaPersonenDivPrint : AreaPersonenDivView
  const Subtitle = isPdf ? SubtitlePrint : SubtitleView
  const Verantwortlich = isPdf ? VerantwortlichPrint : VerantwortlichView
  const VerantwortlichName = isPdf
    ? VerantwortlichNamePrint
    : VerantwortlichNameView
  const StyledFormcontrolStatic = isPdf
    ? StyledFormcontrolStaticPrint
    : StyledFormcontrolStaticView

  return (
    <ErrorBoundary>
      <Container>
        <AreaPersonenDiv>
          <Title>Personen</Title>
          {!(isPdf && !geschaeft.verantwortlich) && (
            <Subtitle>Verantwortlich</Subtitle>
          )}
          {!(isPdf && !geschaeft.verantwortlich) && (
            <Verantwortlich>
              <FormControl
                componentClass="select"
                value={geschaeft.verantwortlich || ''}
                name="verantwortlich"
                onChange={change}
                bsSize="small"
                tabIndex={1 + nrOfFieldsBeforePersonen}
              >
                {verwantwortlichOptions(interneOptions)}
              </FormControl>
            </Verantwortlich>
          )}
          {!(isPdf && !geschaeft.verantwortlich) && (
            <VerantwortlichName>
              <StyledFormcontrolStatic>
                {verantwortlichData(geschaeft, interneOptions, isPdf)}
              </StyledFormcontrolStatic>
            </VerantwortlichName>
          )}
          {!(isPdf && geschaeft.interne.length === 0) && (
            <Subtitle>Interne Kontakte</Subtitle>
          )}
          {!(isPdf && geschaeft.interne.length === 0) && (
            <KontakteIntern tabIndex={nrOfFieldsBeforePersonen + 1} />
          )}
          {!(isPdf && geschaeft.externe.length === 0) && (
            <Subtitle>Externe Kontakte</Subtitle>
          )}
          {!(isPdf && geschaeft.externe.length === 0) && (
            <KontakteExtern tabIndex={nrOfFieldsBeforePersonen + 2} />
          )}
        </AreaPersonenDiv>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaPersonen)
