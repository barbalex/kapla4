import React from 'react'
import PropTypes from 'prop-types'
import { Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import Linkify from 'react-linkify'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

const verantwortlichData = (gKE, externeOptions) => {
  function addValueToInfo(info, value) {
    if (!value) return info
    if (info) return `${info}, ${value}`
    return value
  }
  const data = externeOptions.find(o => o.id === gKE.idKontakt)
  if (!data) return ''
  let info = ''
  const name = `${data.name || '(kein Name)'} ${data.vorname || '(kein Vorname)'}`
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
  grid-template-columns: ${props => (props['data-ispdf'] ? 'calc(100% - 10px)' : 'calc(100% - 20px) 20px')};
  grid-gap: 0;
  padding: 3px;
  margin-right: ${props => (props['data-ispdf'] ? '9px' : 'inherit')};
  align-items: center;
  min-height: ${props => (props['data-ispdf'] ? 0 : '35px')};
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
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
const GlyphiconDiv = styled.div`
  grid-column: 2 / span 1;
  margin-top: -2px;
  display: ${props => (props['data-ispdf'] ? 'none' : 'inherit')};
`
const StyledGlyphicon = styled(Glyphicon)`
  color: red;
  font-size: 18px;
  cursor: pointer;
`

const enhance = compose(inject('store'), observer)

const GeschaefteKontakteExtern = ({ store }) => {
  const { geschaeftKontaktExternRemove } = store
  const { externeOptions, activeId } = store.geschaefte
  const path = store.history.location.pathname
  const { geschaefteKontakteExtern } = store.geschaefteKontakteExtern
  const isPdf = path === '/geschaeftPdf'
  // filter for this geschaeft
  const gkIFiltered = geschaefteKontakteExtern.filter(g => g.idGeschaeft === activeId)
  const gKISorted = _.sortBy(gkIFiltered, g => {
    const intOption = externeOptions.find(o => o.id === g.idKontakt)
    return `${intOption.name} ${intOption.vorname}`.toLowerCase()
  })

  return (
    <Container>
      {gKISorted.map(gKE => (
        <Row key={`${gKE.idGeschaeft}${gKE.idKontakt}`} data-ispdf={isPdf}>
          <Field data-ispdf={isPdf}>{verantwortlichData(gKE, externeOptions)}</Field>
          <GlyphiconDiv data-ispdf={isPdf}>
            <StyledGlyphicon
              glyph="remove-circle"
              onClick={() => geschaeftKontaktExternRemove(activeId, gKE.idKontakt)}
              title={titleText(gKE.idKontakt, externeOptions)}
            />
          </GlyphiconDiv>
        </Row>
      ))}
    </Container>
  )
}

GeschaefteKontakteExtern.displayName = 'GeschaefteKontakteExtern'

GeschaefteKontakteExtern.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(GeschaefteKontakteExtern)
