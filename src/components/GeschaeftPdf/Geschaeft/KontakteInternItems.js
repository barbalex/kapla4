import React, { useContext } from 'react'
import _ from 'lodash'
import Linkify from 'react-linkify'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../shared/ErrorBoundary'
import storeContext from '../../../storeContext'

const verantwortlichData = (gkI, interneOptions) => {
  const data = interneOptions.find((o) => o.id === gkI.idKontakt)
  if (!data) return ''
  const name = `${data.name} ${data.vorname}, ${data.kurzzeichen}`
  const abt = data.abteilung ? `, ${data.abteilung}` : ''
  const eMail = data.eMail ? `, ${data.eMail}` : ''
  const telefon = data.telefon ? `, ${data.telefon}` : ''
  const string = `${name}${abt}${eMail}${telefon}`
  return <Linkify>{string}</Linkify>
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
  grid-template-columns: 100%;
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
const Fv = styled.div`
  grid-column: 1 / span 1;
  /**
   * prevent pushing of following kontakt
   * when text breaks to next line
   */
  &p {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`

const GeschaefteKontakteInternItems = ({ refresh }) => {
  const store = useContext(storeContext)
  const { interneOptions, activeId } = store.geschaefte
  const { geschaefteKontakteIntern } = store.geschaefteKontakteIntern
  // filter for this geschaeft
  const gkIFiltered = geschaefteKontakteIntern.filter(
    (g) => g.idGeschaeft === activeId,
  )
  const gkISorted = _.sortBy(gkIFiltered, (g) => {
    const intOption = interneOptions.find((o) => o.id === g.idKontakt)
    const sort = `${intOption.name} ${intOption.vorname}, ${intOption.kurzzeichen}`
    return sort.toLowerCase()
  })

  return (
    <ErrorBoundary>
      <Container>
        {gkISorted.map((gkI) => (
          <Row key={`${gkI.idGeschaeft}${gkI.idKontakt}`}>
            <Fv>{verantwortlichData(gkI, interneOptions)}</Fv>
          </Row>
        ))}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(GeschaefteKontakteInternItems)
