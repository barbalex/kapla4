import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, InputGroup } from 'react-bootstrap'
import _ from 'lodash'
import Linkify from 'react-linkify'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled, { css } from 'styled-components'

import ComparatorSelector from './ComparatorSelector'
import SortSelector from './SortSelector'

const interneOptionsList = interneOptions => {
  // sort interneOptions by kurzzeichen
  const interneOptionsSorted = _.sortBy(interneOptions, o => {
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

const verantwortlichOptionsList = interneOptions => {
  // sort interneOptions by kurzzeichen
  const interneOptionsSorted = _.sortBy(interneOptions, o => {
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

const externeOptionsList = externeOptions => {
  // sort externeOptions by nameVorname
  const externeOptionsSorted = _.sortBy(externeOptions, o =>
    o.nameVorname.toLowerCase(),
  )
  const options = externeOptionsSorted.map((o, index) => (
    <option key={index + 1} value={o.nameVorname}>
      {o.nameVorname}
    </option>
  ))
  options.unshift(<option key={0} value="" />)
  return options
}

const verantwortlichData = (values, interneOptions) => {
  const data = interneOptions.find(o => o.kurzzeichen === values.verantwortlich)
  if (!data) return ''
  const abt = data.abteilung ? `${data.abteilung}` : ''
  const eMail = data.eMail ? `, ${data.eMail}` : ''
  const telefon = data.telefon ? `, ${data.telefon}` : ''
  return <Linkify>{`${abt}${eMail}${telefon}`}</Linkify>
}

const interneData = (values, interneOptions) => {
  const data = interneOptions.find(o => {
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
    o => o.nameVorname === values.kontaktExternNameVorname,
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
const VerantwortlichName = styled(FormControl.Static)`
  grid-column: 2 / span 1;
`
const InterneKontakteSubTitle = styled.div`
  ${subtitle} grid-column: 1 / span 2;
`
const InterneKontakteSelector = styled(InputGroup)`
  grid-column: 1 / span 1;
`
const InterneKontakteName = styled(FormControl.Static)`
  grid-column: 2 / span 1;
`
const ExterneKontakteSubTitle = styled.div`
  ${subtitle} grid-column: 1 / span 2;
`
const ExterneKontakteSelector = styled(InputGroup)`
  grid-column: 1 / span 1;
`
const ExterneKontakteName = styled(FormControl.Static)`
  grid-column: 2 / span 1;
`
const KontakteDropdown = styled(FormControl)`
  width: 80px;
`

const enhance = compose(
  inject('store'),
  observer,
)

const AreaPersonen = ({
  store,
  values,
  firstTabIndex = 0,
  change,
  changeComparator,
}) => (
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
        componentClass="select"
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
        componentClass="select"
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
        componentClass="select"
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
)

AreaPersonen.displayName = 'AreaPersonen'

/**
 * do not make options required
 * as they may be loaded after the component
 */
AreaPersonen.propTypes = {
  store: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  firstTabIndex: PropTypes.number.isRequired,
  change: PropTypes.func.isRequired,
  changeComparator: PropTypes.func.isRequired,
}

export default enhance(AreaPersonen)
