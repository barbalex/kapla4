import React, { useContext, useState } from 'react'
import { FormControl } from 'react-bootstrap'
import _ from 'lodash'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import KontakteExternItems from './KontakteExternItems'
import storeContext from '../../storeContext'

const optionsList = (externeOptions, geschaefteKontakteExtern, activeId) => {
  // filter out options already choosen
  const kontakteInternOfActiveGeschaeft = geschaefteKontakteExtern.filter(
    g => g.idGeschaeft === activeId,
  )
  const idKontakteOfGkiOfActiveGeschaeft = kontakteInternOfActiveGeschaeft.map(
    kI => kI.idKontakt,
  )
  const externeOptionsFiltered = externeOptions.filter(
    o => !idKontakteOfGkiOfActiveGeschaeft.includes(o.id),
  )
  // sort externeOptions by nameVorname
  const externeOptionsSorted = _.sortBy(externeOptionsFiltered, o =>
    o.nameVorname.toLowerCase(),
  )
  const options = externeOptionsSorted.map(o => (
    <option key={o.id} value={o.id}>
      {o.nameVorname}
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
const RowFvDropdown = styled.div`
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

const GeschaefteKontakteExtern = ({ tabIndex }) => {
  const store = useContext(storeContext)
  const { geschaeftKontaktExternNewCreate } = store
  const { externeOptions, activeId } = store.geschaefte
  const { geschaefteKontakteExtern } = store.geschaefteKontakteExtern
  const path = store.history.location.pathname
  const isPdf = path === '/geschaeftPdf'

  const [value, setValue] = useState('')

  return (
    <ErrorBoundary>
      <Container data-ispdf={isPdf}>
        <KontakteExternItems />
        <RowFvDropdown data-ispdf={isPdf}>
          <FvDropdown data-ispdf={isPdf}>
            <FormControl
              componentClass="select"
              bsSize="small"
              onChange={e => {
                const idKontakt = e.target.value
                setValue(idKontakt)
                geschaeftKontaktExternNewCreate(activeId, idKontakt)
                // need to empty dropdown
                setTimeout(() => setValue(''), 500)
              }}
              value={value}
              title="Neuen Kontakt hinzufügen"
              tabIndex={tabIndex}
            >
              {optionsList(externeOptions, geschaefteKontakteExtern, activeId)}
            </FormControl>
          </FvDropdown>
        </RowFvDropdown>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(GeschaefteKontakteExtern)
