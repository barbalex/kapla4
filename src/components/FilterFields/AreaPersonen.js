import React, { useContext } from 'react'
import { InputGroup, Input } from 'reactstrap'
import _ from 'lodash'
import Linkify from 'react-linkify'
import { observer } from 'mobx-react-lite'
import styled, { css } from 'styled-components'

import ErrorBoundary from '../shared/ErrorBoundary'
import ComparatorSelector from './ComparatorSelector'
import SortSelector from './SortSelector'
import storeContext from '../../storeContext'

const interneOptionsList = (interneOptions) => {
  // sort interneOptions by kurzzeichen
  const interneOptionsSorted = _.sortBy(interneOptions, (o) => {
    const sort = `${o.name || 'zz'} ${o.vorname || 'zz'} (${o.kurzzeichen})`
    return sort.toLowerCase()
  })
  const options = interneOptionsSorted.map((o, index) => {
    const name = `${o.vorname || ''} ${o.name || ''}`
    return (
      <option key={index + 1} value={name}>
        {`${o.name || '(kein Name)'} ${o.vorname || '(kein Vorname)'} (${
          o.kurzzeichen
        })`}
      </option>
    )
  })
  options.unshift(<option key={0} value="" />)
  return options
}

const verantwortlichOptionsList = (interneOptions) => {
  // sort interneOptions by kurzzeichen
  const interneOptionsSorted = _.sortBy(interneOptions, (o) => {
    const sort = `${o.name || 'zz'} ${o.vorname || 'zz'} (${o.kurzzeichen})`
    return sort.toLowerCase()
  })
  const options = interneOptionsSorted.map((o, index) => (
    <option key={index + 1} value={o.kurzzeichen}>
      {`${o.name || '(kein Name)'} ${o.vorname || '(kein Vorname)'} (${
        o.kurzzeichen
      })`}
    </option>
  ))
  options.unshift(<option key={0} value="" />)
  return options
}

const externeOptionsList = (externeOptions) => {
  // sort externeOptions by nameVorname
  const externeOptionsSorted = _.sortBy(externeOptions, (o) =>
    `${o.name} ${o.vorname}`.toLowerCase(),
  )
  const options = externeOptionsSorted.map((o, index) => (
    <option key={index + 1} value={`${o.name} ${o.vorname}`}>
      {`${o.name} ${o.vorname}`}
    </option>
  ))
  options.unshift(<option key={0} value="" />)
  return options
}

const verantwortlichData = (values, interneOptions) => {
  const data = interneOptions.find(
    (o) => o.kurzzeichen === values.verantwortlich,
  )
  if (!data) return ''
  const abt = data.abteilung ? `${data.abteilung}` : ''
  const eMail = data.eMail ? `, ${data.eMail}` : ''
  const telefon = data.telefon ? `, ${data.telefon}` : ''
  return <Linkify>{`${abt}${eMail}${telefon}`}</Linkify>
}

const interneData = (values, interneOptions) => {
  const data = interneOptions.find((o) => {
    const name = `${o.vorname || ''} ${o.name || ''}`
    return name === values.kontaktInternVornameName
  })
  if (!data) return ''
  const abt = data.abteilung ? `${data.abteilung}` : ''
  const eMail = data.eMail ? `, ${data.eMail}` : ''
  const telefon = data.telefon ? `, ${data.telefon}` : ''
  return <Linkify>{`${abt}${eMail}${telefon}`}</Linkify>
}

const externeData = (values, externeOptions) => {
  function addValueToInfo(info, value) {
    if (!value) return info
    if (info) return `${info}, ${value}`
    return value
  }
  const data = externeOptions.find(
    (o) => `${o.name} ${o.vorname}` === values.kontaktExternNameVorname,
  )
  if (!data) return ''
  let info = ''
  info = addValueToInfo(info, data.firma)
  info = addValueToInfo(info, data.email)
  info = addValueToInfo(info, data.telefon)
  return <Linkify>{info}</Linkify>
}
const Container = styled.div`
  grid-area: areaPersonen;
  background-color: white;
  box-shadow: inset 1em 1em 2em rgb(246, 255, 245),
    inset -1em -1em 2em rgb(246, 255, 245);
  outline: 1px solid #efefef;
  display: grid;
  grid-template-columns: 360px calc((100% - 10px) - 360px);
  grid-column-gap: 8px;
  grid-row-gap: 2px;
  padding: 8px;
  align-items: end;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-column: 1 / span 2;
`
const subtitle = css`
  font-weight: 900;
  font-size: 12px;
  margin-top: 5px;
`
const VerantwortlichSubTitle = styled.div`
  ${subtitle} grid-column: 1 / span 2;
`
const VerantwortlichSelector = styled(InputGroup)`
  grid-column: 1 / span 1;
`
const VerantwortlichName = styled.div`
  grid-column: 2 / span 1;
  height: 100%;
  display: flex;
  align-items: center;
`
const InterneKontakteSubTitle = styled.div`
  ${subtitle} grid-column: 1 / span 2;
`
const InterneKontakteSelector = styled(InputGroup)`
  grid-column: 1 / span 1;
`
const InterneKontakteName = styled.div`
  grid-column: 2 / span 1;
  height: 100%;
  display: flex;
  align-items: center;
`
const ExterneKontakteSubTitle = styled.div`
  ${subtitle} grid-column: 1 / span 2;
`
const ExterneKontakteSelector = styled(InputGroup)`
  grid-column: 1 / span 1;
`
const ExterneKontakteName = styled.div`
  grid-column: 2 / span 1;
  height: 100%;
  display: flex;
  align-items: center;
`
const KontakteDropdown = styled(Input)`
  width: 80px;
`

const AreaPersonen = ({
  values,
  firstTabIndex = 0,
  change,
  changeComparator,
}) => {
  const store = useContext(storeContext)

  return (
    <ErrorBoundary>
      <Container>
        <Title>Personen</Title>
        <VerantwortlichSubTitle>Verantwortlich</VerantwortlichSubTitle>
        <VerantwortlichSelector>
          <SortSelector name="verantwortlich" />
          <ComparatorSelector
            name="verantwortlich"
            changeComparator={changeComparator}
          />
          <KontakteDropdown
            type="select"
            value={values.verantwortlich || ''}
            name="verantwortlich"
            onChange={change}
            tabIndex={1 + firstTabIndex}
          >
            {verantwortlichOptionsList(store.geschaefte.interneOptions)}
          </KontakteDropdown>
        </VerantwortlichSelector>
        <VerantwortlichName>
          {verantwortlichData(values, store.geschaefte.interneOptions)}
        </VerantwortlichName>

        <InterneKontakteSubTitle>Interne Kontakte</InterneKontakteSubTitle>
        <InterneKontakteSelector>
          <SortSelector name="kontaktInternVornameName" />
          <ComparatorSelector
            name="kontaktInternVornameName"
            changeComparator={changeComparator}
          />
          <KontakteDropdown
            type="select"
            value={values.kontaktInternVornameName || ''}
            name="kontaktInternVornameName"
            onChange={change}
            tabIndex={2 + firstTabIndex}
          >
            {interneOptionsList(store.geschaefte.interneOptions)}
          </KontakteDropdown>
        </InterneKontakteSelector>
        <InterneKontakteName>
          {interneData(values, store.geschaefte.interneOptions)}
        </InterneKontakteName>

        <ExterneKontakteSubTitle>Externe Kontakte</ExterneKontakteSubTitle>
        <ExterneKontakteSelector>
          <SortSelector name="kontaktExternNameVorname" />
          <ComparatorSelector
            name="kontaktExternNameVorname"
            changeComparator={changeComparator}
          />
          <KontakteDropdown
            type="select"
            value={values.kontaktExternNameVorname || ''}
            name="kontaktExternNameVorname"
            onChange={change}
            tabIndex={3 + firstTabIndex}
          >
            {externeOptionsList(store.geschaefte.externeOptions)}
          </KontakteDropdown>
        </ExterneKontakteSelector>
        <ExterneKontakteName>
          {externeData(values, store.geschaefte.externeOptions)}
        </ExterneKontakteName>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaPersonen)
