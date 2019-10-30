import React, { useContext, useCallback } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  UncontrolledTooltip,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import {
  MenuItem,
  Button,
  SplitButton,
  Navbar,
  FormControl,
} from 'react-bootstrap'
import { FaTimes } from 'react-icons/fa'
import moment from 'moment'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'

import filterForFaelligeGeschaefte from '../../src/filterForFaelligeGeschaefte'
import filterForVernehmlAngek from '../../src/filterForVernehmlAngek'
import filterForVernehmlLaeuft from '../../src/filterForVernehmlLaeuft'
import filterCriteriaToArrayOfStrings from '../../src/filterCriteriaToArrayOfStrings'
import sortCriteriaToArrayOfStrings from '../../src/sortCriteriaToArrayOfStrings'
import storeContext from '../../storeContext'

const VolltextInput = styled(Input)`
  background-color: ${props =>
    props['data-dataisfilteredbyfulltext'] ? '#FFBF73 !important' : 'white'};
`
const StyledVolltextControl = styled(FormControl)`
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  width: 186px !important;
  background-color: ${props =>
    props['data-dataisfilteredbyfulltext'] ? '#FFBF73 !important' : 'white'};
`
const StyledFilterDropdown = styled(SplitButton)`
  min-width: 160px !important;
  font-weight: 700 !important;
  border-radius: 0 !important;
  background-color: ${props =>
    props['data-dataisfilteredbyfields'] ? '#FFBF73 !important' : 'white'};
`
const StyledCriteria = styled.span`
  cursor: default !important;
  font-style: italic !important;
`
const FilterRemoveButton = styled(Button)`
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
`
const RemoveIcon = styled(FaTimes)`
  font-weight: 900;
  font-size: 1.1em;
  vertical-align: sub;
`

const FilterNav = () => {
  const store = useContext(storeContext)
  const { history } = store
  const {
    filterByFulltext,
    sortByFields,
    resetSort,
    geschaefte: geschaefteUnfiltered,
    removeFilters,
    filterByFields,
    filterFields,
    filterType,
    filterFulltext,
    sortFields,
    geschaeftePlusFilteredAndSorted: geschaefte,
  } = store.geschaefte
  const { username } = store.app.user
  const dataIsFilteredByFulltext =
    geschaefte.length !== geschaefteUnfiltered.length && filterFulltext
  const dataIsFilteredByFields =
    geschaefte.length !== geschaefteUnfiltered.length && !filterFulltext
  const dataIsFiltered = geschaefte.length !== geschaefteUnfiltered.length
  const activeFiltercriteria = dataIsFilteredByFields
    ? filterCriteriaToArrayOfStrings(filterFields).join(' & ')
    : '(es werden keine Felder gefiltert)'
  const activeSortcriteria =
    sortFields.length > 0
      ? sortCriteriaToArrayOfStrings(sortFields).join(' & ')
      : '(die Geschäfte werden nicht sortiert)'
  const title = filterType
    ? `Filter: ${filterType}`
    : 'Felder filtern / sortieren'

  const onChangeVolltextControl = useCallback(
    e => filterByFulltext(e.target.value),
    [filterByFulltext],
  )
  const onSelectFaelligeGeschaefte = useCallback(() => {
    filterByFields(filterForFaelligeGeschaefte, 'fällige')
    // order by frist desc
    resetSort()
    sortByFields('fristMitarbeiter', 'DESCENDING')
  }, [filterByFields, resetSort, sortByFields])
  const onSelectEigeneFaelligeGeschaefte = useCallback(() => {
    const now = moment().format('YYYY-MM-DD')
    const filter = [
      {
        field: 'fristMitarbeiter',
        value: now,
        comparator: '<=',
      },
      {
        field: 'kannFaelligSein',
        value: true,
        comparator: '===',
      },
      {
        field: 'verantwortlichItKonto',
        value: username,
        comparator: '===',
      },
    ]
    filterByFields(filter, 'eigene fällige')
    // order by frist desc
    resetSort()
    sortByFields('fristMitarbeiter', 'DESCENDING')
  }, [filterByFields, resetSort, sortByFields, username])
  const onSelectAngekVernehmlassungen = useCallback(() => {
    filterByFields(filterForVernehmlAngek, 'angekündigte Vernehmlassungen')
    resetSort()
    sortByFields('idGeschaeft', 'DESCENDING')
  }, [filterByFields, resetSort, sortByFields])
  const onSelectLaufendeVernehmlassungen = useCallback(() => {
    filterByFields(filterForVernehmlLaeuft, 'laufende Vernehmlassungen')
    resetSort()
    sortByFields('fristMitarbeiter', 'DESCENDING')
    sortByFields('idGeschaeft', 'DESCENDING')
  }, [filterByFields, resetSort, sortByFields])
  const onClickFilterDropdown = useCallback(() => {
    const path = history.location.pathname
    if (path !== '/filterFields') {
      history.push('/filterFields')
      removeFilters()
    }
  }, [removeFilters, history])

  return (
    <ErrorBoundary>
      <div>
        <InputGroup>
          <VolltextInput
            placeholder="Volltext filtern"
            onChange={onChangeVolltextControl}
            value={filterFulltext || ''}
            data-dataisfilteredbyfulltext={dataIsFilteredByFulltext}
            title="Zum Filtern drücken Sie die Enter-Taste"
          />
          <StyledFilterDropdown
            id="field-filter-dropdown"
            title={title}
            data-dataisfilteredbyfields={dataIsFilteredByFields}
            onClick={onClickFilterDropdown}
          >
            <MenuItem header>aktive Filterkriterien:</MenuItem>
            <MenuItem>
              <StyledCriteria>{activeFiltercriteria}</StyledCriteria>
            </MenuItem>
            <MenuItem header>aktive Sortierkriterien:</MenuItem>
            <MenuItem>
              <StyledCriteria>{activeSortcriteria}</StyledCriteria>
            </MenuItem>
            <MenuItem header>vorbereitete Filter:</MenuItem>
            <MenuItem
              onSelect={onSelectFaelligeGeschaefte}
              style={{
                backgroundColor: filterType === 'fällige' ? '#FFBF73' : null,
              }}
            >
              fällige Geschäfte
            </MenuItem>
            <MenuItem
              onSelect={onSelectEigeneFaelligeGeschaefte}
              style={{
                backgroundColor:
                  filterType === 'eigene fällige' ? '#FFBF73' : null,
              }}
            >
              eigene fällige Geschäfte
            </MenuItem>
            <MenuItem
              onSelect={onSelectAngekVernehmlassungen}
              style={{
                backgroundColor:
                  filterType === 'angekündigte Vernehmlassungen'
                    ? '#FFBF73'
                    : null,
              }}
            >
              angekündigte Vernehmlassungen
            </MenuItem>
            <MenuItem
              onSelect={onSelectLaufendeVernehmlassungen}
              style={{
                backgroundColor:
                  filterType === 'laufende Vernehmlassungen' ? '#FFBF73' : null,
              }}
            >
              laufende Vernehmlassungen
            </MenuItem>
          </StyledFilterDropdown>
          <FilterRemoveButton
            disabled={!dataIsFiltered}
            onClick={removeFilters}
          >
            <RemoveIcon title="Filter und Sortierung entfernen" />
          </FilterRemoveButton>
        </InputGroup>
      </div>
    </ErrorBoundary>
  )
}

export default observer(FilterNav)
