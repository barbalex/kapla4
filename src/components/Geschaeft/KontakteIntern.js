import React, { useContext, useState } from 'react'
import { FormControl } from 'react-bootstrap'
import _ from 'lodash'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import KontakteInternItems from './KontakteInternItems'
import storeContext from '../../storeContext'

const optionsList = (interneOptions, geschaefteKontakteIntern, activeId) => {
  // filter out options already choosen
  const kontakteInternOfActiveGeschaeft = geschaefteKontakteIntern.filter(
    g => g.idGeschaeft === activeId,
  )
  const idKontakteOfGkiOfActiveGeschaeft = kontakteInternOfActiveGeschaeft.map(
    kI => kI.idKontakt,
  )
  const interneOptionsFiltered = interneOptions.filter(
    o => !idKontakteOfGkiOfActiveGeschaeft.includes(o.id),
  )
  // sort interneOptions by kurzzeichen
  const interneOptionsSorted = _.sortBy(interneOptionsFiltered, o => {
    const name = o.name ? o.name.toLowerCase() : 'zz'
    const vorname = o.vorname ? o.vorname.toLowerCase() : 'zz'
    return `${name} ${vorname} ${o.kurzzeichen}`
  })
  const options = interneOptionsSorted.map(o => (
    <option key={o.id} value={o.id}>
      {`${o.name ? o.name : '(kein Name)'} ${
        o.vorname ? o.vorname : '(kein Vorname)'
      } (${o.kurzzeichen})`}
    </option>
  ))
  options.unshift(<option key={0} value="" />)
  return options
}
const Container = styled.div`
  grid-column: ${props => (props['data-ispdf'] ? '1 / span 1' : '1 / span 2')};
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 0;
`
// eslint-disable-next-line no-unused-vars
const RowfVDropdown = styled.div`
  grid-column: 1 / span 1;
  display: ${props => (props['data-ispdf'] ? 'none' : 'grid')};
  grid-template-columns: ${props =>
    props['data-ispdf']
      ? '160px calc(100% - 160px)'
      : '260px calc(100% - 260px)'};
  grid-gap: 4px;
  margin-top: 5px;
`
// eslint-disable-next-line no-unused-vars
const FvDropdown = styled.div`
  grid-column: 1 / span 1;
  display: ${props => (props['data-ispdf'] ? 'none' : 'inherit')};
`

const GeschaefteKontakteIntern = ({ tabIndex }) => {
  const store = useContext(storeContext)
  const { geschaeftKontaktInternNewCreate } = store
  const { interneOptions, activeId } = store.geschaefte
  const { geschaefteKontakteIntern } = store.geschaefteKontakteIntern
  const path = store.history.location.pathname
  const isPdf = path === '/geschaeftPdf'

  const [value, setValue] = useState('')

  return (
    <Container data-ispdf={isPdf}>
      <KontakteInternItems />
      <RowfVDropdown data-ispdf={isPdf}>
        <FvDropdown data-ispdf={isPdf}>
          <FormControl
            componentClass="select"
            bsSize="small"
            onChange={e => {
              const idKontakt = e.target.value
              setValue(idKontakt)
              geschaeftKontaktInternNewCreate(activeId, idKontakt)
              // need to empty dropdown
              setTimeout(() => setValue(''), 500)
            }}
            value={value}
            title="Neuen Kontakt hinzufügen"
            tabIndex={tabIndex}
          >
            {optionsList(interneOptions, geschaefteKontakteIntern, activeId)}
          </FormControl>
        </FvDropdown>
      </RowfVDropdown>
    </Container>
  )
}

export default observer(GeschaefteKontakteIntern)
