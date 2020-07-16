import React, { useContext } from 'react'
import _ from 'lodash'
import Linkify from 'react-linkify'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../shared/ErrorBoundary'
import storeContext from '../../../storeContext'

const verantwortlichData = (gKE, externeOptions) => {
  function addValueToInfo(info, value) {
    if (!value) return info
    if (info) return `${info}, ${value}`
    return value
  }
  const data = externeOptions.find((o) => o.id === gKE.idKontakt)
  if (!data) return ''
  let info = ''
  const name = `${data.name || '(kein Name)'} ${
    data.vorname || '(kein Vorname)'
  }`
  info = addValueToInfo(info, name)
  info = addValueToInfo(info, data.firma)
  info = addValueToInfo(info, data.eMail)
  info = addValueToInfo(info, data.telefon)
  return <Linkify>{info}</Linkify>
}

const Container = styled.div`
  grid-column: 1 / span 2;
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 0;
`
// eslint-disable-next-line no-unused-vars
const Row = styled.div`
  grid-column: 1 / span 1;
  display: grid;
  grid-template-columns: calc(100% - 10px);
  grid-gap: 0;
  padding: 3px;
  margin-right: 9px;
  align-items: center;
  min-height: 0;
  border-bottom: thin solid #cecbcb;
  &:first-of-type {
    border-top: thin solid #cecbcb;
  }
  &:hover {
    background-color: rgba(208, 255, 202, 0.5);
  }
`
// eslint-disable-next-line no-unused-vars
const Field = styled.div`
  grid-column: 1 / span 1;
  /**
   * prevent pushing of following kontakt
   * when text breaks to next line
   */
  &p {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0;
  }
`

const GeschaefteKontakteExtern = () => {
  const store = useContext(storeContext)
  const { externeOptions, activeId } = store.geschaefte
  const { geschaefteKontakteExtern } = store.geschaefteKontakteExtern
  // filter for this geschaeft
  const gkIFiltered = geschaefteKontakteExtern.filter(
    (g) => g.idGeschaeft === activeId,
  )
  const gKISorted = _.sortBy(gkIFiltered, (g) => {
    const intOption = externeOptions.find((o) => o.id === g.idKontakt)
    return `${intOption.name} ${intOption.vorname}`.toLowerCase()
  })

  return (
    <ErrorBoundary>
      <Container>
        {gKISorted.map((gKE) => (
          <Row key={`${gKE.idGeschaeft}${gKE.idKontakt}`}>
            <Field>{verantwortlichData(gKE, externeOptions)}</Field>
          </Row>
        ))}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(GeschaefteKontakteExtern)
