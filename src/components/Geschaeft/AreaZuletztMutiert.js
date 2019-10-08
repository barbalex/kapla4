import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

const Container = styled.div`
  grid-area: areaZuletztMutiert;
  background-color: rgba(239, 239, 239, 1);
  display: grid;
  grid-template-columns: 100%;
  padding: 8px;
  align-items: center;
`
// eslint-disable-next-line no-unused-vars
const Field = styled.div`
  grid-column: 1;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
`

const enhance = compose(inject('store'), observer)

const AreaZuletztMutiert = ({ store }) => {
  const { activeId, geschaeftePlusFilteredAndSorted: geschaefte, interneOptions } = store.geschaefte
  const path = store.history.location.pathname
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}
  const isPdf = path === '/geschaeftPdf'
  let zuletztMutiertText

  if (!geschaeft || !geschaeft.mutationsperson) {
    zuletztMutiertText = 'Bei diesem Geschäft wurde (noch) keine Mutationsperson gespeichert'
  } else {
    const mutPersonOptions = interneOptions.find(o => {
      if (o.itKonto) {
        // seems that data contains lower case differences
        // and whitespace
        return o.itKonto.toLowerCase().replace(/ /g, '') === geschaeft.mutationsperson.toLowerCase().replace(/ /g, '')
      }
      return false
    })
    const name = mutPersonOptions ? ` (${mutPersonOptions.vorname} ${mutPersonOptions.name})` : ''
    zuletztMutiertText = `Zuletzt mutiert durch ${geschaeft.mutationsperson}${name} am ${geschaeft.mutationsdatum}`
  }

  return (
    <Container>
      <Field data-ispdf={isPdf}>{zuletztMutiertText}</Field>
    </Container>
  )
}

AreaZuletztMutiert.displayName = 'AreaZuletztMutiert'

AreaZuletztMutiert.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(AreaZuletztMutiert)
