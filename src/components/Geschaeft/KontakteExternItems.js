import React, { useContext } from 'react'
import { FaRegTimesCircle } from 'react-icons/fa'
import _ from 'lodash'
import Linkify from 'react-linkify'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import storeContext from '../../storeContext'

const verantwortlichData = (gKE, externeOptions) => {
  function addValueToInfo(info, value) {
    if (!value) return info
    if (info) return `${info}, ${value}`
    return value
  }
  const data = externeOptions.find(o => o.id === gKE.idKontakt)
  if (!data) return ''
  let info = ''
  const name = `${data.name || '(kein Name)'} ${data.vorname ||
    '(kein Vorname)'}`
  info = addValueToInfo(info, name)
  info = addValueToInfo(info, data.firma)
  info = addValueToInfo(info, data.eMail)
  info = addValueToInfo(info, data.telefon)
  return <Linkify>{info}</Linkify>
}

const titleText = (idKontakt, externeOptions) => {
  const data = externeOptions.find(o => o.id === idKontakt)
  if (!data) return 'Kontakt entfernen'
  return `${data.name} ${data.vorname} entfernen`
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
    props['data-ispdf'] ? 'calc(100% - 10px)' : 'calc(100% - 20px) 20px'};
  grid-gap: 0;
  padding: 3px;
  margin-right: ${props => (props['data-ispdf'] ? '9px' : 'inherit')};
  align-items: center;
  min-height: ${props => (props['data-ispdf'] ? 0 : '35px')};
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
    padding: ${props => (props['data-ispdf'] ? 0 : '7px')};
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

const GeschaefteKontakteExtern = ({ refresh }) => {
  const store = useContext(storeContext)
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const { geschaeftKontaktExternRemove } = store
  const { externeOptions, activeId } = store.geschaefte
  const { geschaefteKontakteExtern } = store.geschaefteKontakteExtern
  const isPdf = activeLocation === 'geschaeftPdf'
  // filter for this geschaeft
  const gkIFiltered = geschaefteKontakteExtern.filter(
    g => g.idGeschaeft === activeId,
  )
  const gKISorted = _.sortBy(gkIFiltered, g => {
    const intOption = externeOptions.find(o => o.id === g.idKontakt)
    return `${intOption.name} ${intOption.vorname}`.toLowerCase()
  })

  return (
    <ErrorBoundary>
      <Container>
        {gKISorted.map(gKE => (
          <Row key={`${gKE.idGeschaeft}${gKE.idKontakt}`} data-ispdf={isPdf}>
            <Field data-ispdf={isPdf}>
              {verantwortlichData(gKE, externeOptions)}
            </Field>
            <RemoveIconContainer data-ispdf={isPdf}>
              <RemoveIcon
                onClick={() => {
                  geschaeftKontaktExternRemove(activeId, gKE.idKontakt)
                  setTimeout(() => refresh())
                }}
                title={titleText(gKE.idKontakt, externeOptions)}
              />
            </RemoveIconContainer>
          </Row>
        ))}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(GeschaefteKontakteExtern)
