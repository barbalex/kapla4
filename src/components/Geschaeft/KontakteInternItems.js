import React, { useContext } from 'react'
import { FaRegTimesCircle } from 'react-icons/fa'
import _ from 'lodash'
import Linkify from 'react-linkify'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import storeContext from '../../storeContext'

const titleText = (idKontakt, interneOptions) => {
  const data = interneOptions.find(o => o.id === idKontakt)
  if (!data) return 'Kontakt entfernen'
  return `${data.kurzzeichen} entfernen`
}

const verantwortlichData = (gkI, interneOptions) => {
  const data = interneOptions.find(o => o.id === gkI.idKontakt)
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
  grid-template-columns: ${props =>
    props['data-ispdf'] ? '100%' : 'calc(100% - 20px) 20px'};
  grid-gap: 0;
  padding: 3px;
  margin-right: ${props => (props['data-ispdf'] ? '9px' : 'inherit')};
  align-items: center;
  min-height: ${props => (props['data-ispdf'] ? 0 : '35px')};
  border-bottom: thin solid #cecbcb;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
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
// eslint-disable-next-line no-unused-vars
const RemoveIconContainer = styled.div`
  grid-column: 2 / span 1;
  margin-top: -2px;
  display: ${props => (props['data-ispdf'] ? 'none' : 'inherit')};
`
const RemoveIcon = styled(FaRegTimesCircle)`
  color: red;
  font-size: 18px;
  cursor: pointer;
`

const GeschaefteKontakteInternItems = () => {
  const store = useContext(storeContext)
  const { geschaeftKontaktInternRemove } = store
  const { interneOptions, activeId } = store.geschaefte
  const path = store.history.location.pathname
  const { geschaefteKontakteIntern } = store.geschaefteKontakteIntern
  const isPdf = path === '/geschaeftPdf'
  // filter for this geschaeft
  const gkIFiltered = geschaefteKontakteIntern.filter(
    g => g.idGeschaeft === activeId,
  )
  const gkISorted = _.sortBy(gkIFiltered, g => {
    const intOption = interneOptions.find(o => o.id === g.idKontakt)
    const sort = `${intOption.name} ${intOption.vorname}, ${intOption.kurzzeichen}`
    return sort.toLowerCase()
  })

  return (
    <ErrorBoundary>
      <Container>
        {gkISorted.map(gkI => (
          <Row key={`${gkI.idGeschaeft}${gkI.idKontakt}`} data-ispdf={isPdf}>
            <Fv>{verantwortlichData(gkI, interneOptions)}</Fv>
            <RemoveIconContainer data-ispdf={isPdf}>
              <RemoveIcon
                onClick={() =>
                  geschaeftKontaktInternRemove(activeId, gkI.idKontakt)
                }
                title={titleText(gkI.idKontakt, interneOptions)}
              />
            </RemoveIconContainer>
          </Row>
        ))}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(GeschaefteKontakteInternItems)
