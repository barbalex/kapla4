import React, { useContext, useState, useMemo } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import Select from '../shared/Select'
import KontakteInternItems from './KontakteInternItems'
import storeContext from '../../storeContext'

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
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const { geschaeftKontaktInternNewCreate } = store
  const { interneOptions: interneOptionsPassed, activeId } = store.geschaefte
  const { geschaefteKontakteIntern } = store.geschaefteKontakteIntern
  const isPdf = activeLocation === 'geschaeftPdf'

  const [value, setValue] = useState('')

  const interneOptions = useMemo(() => {
    // filter out options already choosen
    const kontakteInternOfActiveGeschaeft = geschaefteKontakteIntern.filter(
      g => g.idGeschaeft === activeId,
    )
    const idKontakteOfGkiOfActiveGeschaeft = kontakteInternOfActiveGeschaeft.map(
      kI => kI.idKontakt,
    )
    const interneOptionsFiltered = interneOptionsPassed.filter(
      o => !idKontakteOfGkiOfActiveGeschaeft.includes(o.id),
    )
    // sort interneOptions by kurzzeichen
    const interneOptionsSorted = _.sortBy(interneOptionsFiltered, o => {
      const name = o.name ? o.name.toLowerCase() : 'zz'
      const vorname = o.vorname ? o.vorname.toLowerCase() : 'zz'
      return `${name} ${vorname} ${o.kurzzeichen}`
    }).map(o => ({
      label: `${o.name || '(kein Nachname)'} ${o.vorname ||
        '(kein Vorname)'} (${o.kurzzeichen || 'kein Kurzzeichen'})`,
      value: o.id,
    }))
    return interneOptionsSorted
    // value is added to update list after adding Kontakt to remove choosen Kontakt from list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, geschaefteKontakteIntern, interneOptionsPassed, value])

  return (
    <ErrorBoundary>
      <Container data-ispdf={isPdf}>
        <KontakteInternItems
          refresh={() => {
            setValue(null)
            setValue('')
          }}
        />
        <RowfVDropdown data-ispdf={isPdf}>
          <FvDropdown data-ispdf={isPdf}>
            <Select
              value={value}
              field="not-relevant"
              placeholder="Internen Kontakt hinzufügen"
              options={interneOptions}
              saveToDb={({ value, field }) => {
                setValue(value)
                geschaeftKontaktInternNewCreate(activeId, value)
                // empty dropdown
                setTimeout(() => setValue(''), 1000)
              }}
              tabIndex={tabIndex}
            />
          </FvDropdown>
        </RowfVDropdown>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(GeschaefteKontakteIntern)
