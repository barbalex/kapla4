import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../shared/ErrorBoundary'
import storeContext from '../../../storeContext'

const Container = styled.div`
  grid-area: areaZuletztMutiert;
  background-color: rgba(239, 239, 239, 1);
  display: grid;
  grid-template-columns: 100%;
  ${(props) => props['data-border-top'] && 'border-top: thin solid #CCC;'}
  padding: 2px 8px;
  align-items: center;
`
// eslint-disable-next-line no-unused-vars
const Field = styled.div`
  grid-column: 1;
  font-size: 10px;
`

const AreaZuletztMutiert = () => {
  const store = useContext(storeContext)
  const {
    activeId,
    historyOfActiveId,
    geschaefteFilteredAndSorted: geschaefte,
    interneOptions,
  } = store.geschaefte
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}
  let zuletztMutiertText

  if (!geschaeft || !geschaeft.mutationsperson) {
    zuletztMutiertText =
      'Bei diesem Geschäft wurde (noch) keine Mutationsperson gespeichert'
  } else {
    const mutPersonOptions = interneOptions.find((o) => {
      if (o.itKonto) {
        // seems that data contains lower case differences
        // and whitespace
        return (
          o.itKonto.toLowerCase().replace(/ /g, '') ===
          geschaeft.mutationsperson.toLowerCase().replace(/ /g, '')
        )
      }
      return false
    })
    const name = mutPersonOptions
      ? ` (${mutPersonOptions.vorname} ${mutPersonOptions.name})`
      : ''
    zuletztMutiertText = `Zuletzt mutiert durch ${geschaeft.mutationsperson}${name} am ${geschaeft.mutationsdatum}`
  }

  return (
    <ErrorBoundary>
      <Container data-border-top={!historyOfActiveId.length}>
        <Field>{zuletztMutiertText}</Field>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaZuletztMutiert)
