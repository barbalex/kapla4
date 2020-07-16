import React, { useContext, useState, useMemo } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary'
import Select from '../shared/Select'
import KontakteExternItems from './KontakteExternItems'
import storeContext from '../../storeContext'

const Container = styled.div`
  grid-column: 1 / span 2;
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 0;
`
const RowFvDropdown = styled.div`
  grid-column: 1 / span 1;
  display: grid;
  grid-template-columns: 260px calc(100% - 260px);
  grid-gap: 4px;
  margin-top: 5px;
`
const FvDropdown = styled.div`
  grid-column: 1 / span 1;
  display: grid;
`

const GeschaefteKontakteExtern = ({ tabIndex }) => {
  const store = useContext(storeContext)
  const { geschaeftKontaktExternNewCreate } = store
  const { externeOptions: externeOptionsPassed, activeId } = store.geschaefte
  const { geschaefteKontakteExtern } = store.geschaefteKontakteExtern

  const [value, setValue] = useState('')

  const externeOptions = useMemo(() => {
    // filter out options already choosen
    const kontakteInternOfActiveGeschaeft = geschaefteKontakteExtern.filter(
      (g) => g.idGeschaeft === activeId,
    )
    const idKontakteOfGkiOfActiveGeschaeft = kontakteInternOfActiveGeschaeft.map(
      (kI) => kI.idKontakt,
    )
    const externeOptionsFiltered = externeOptionsPassed.filter(
      (o) => !idKontakteOfGkiOfActiveGeschaeft.includes(o.id),
    )
    // sort externeOptions by nameVorname
    const externeOptionsSorted = _.sortBy(externeOptionsFiltered, (o) =>
      `${o.name} ${o.vorname}`.toLowerCase(),
    ).map((o) => ({ label: `${o.name} ${o.vorname}`, value: o.id }))
    return externeOptionsSorted
    // value is added to update list after adding Kontakt to remove choosen Kontakt from list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, externeOptionsPassed, geschaefteKontakteExtern, value])

  return (
    <ErrorBoundary>
      <Container>
        <KontakteExternItems
          refresh={() => {
            setValue(null)
            setValue('')
          }}
        />
        <RowFvDropdown>
          <FvDropdown>
            <Select
              value={value}
              field="not-relevant"
              placeholder="Externen Kontakt hinzufügen"
              options={externeOptions}
              saveToDb={({ value, field }) => {
                setValue(value)
                geschaeftKontaktExternNewCreate(activeId, value)
                // empty dropdown
                setTimeout(() => setValue(''), 1000)
              }}
              tabIndex={tabIndex}
            />
          </FvDropdown>
        </RowFvDropdown>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(GeschaefteKontakteExtern)
