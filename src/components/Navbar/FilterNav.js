import React, { useContext, useCallback, useState } from 'react'
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
    props['data-isfiltered'] ? '#FFBF73 !important' : 'white'};
`
const StyledInputGroupText = styled(InputGroupText)`
  background-color: ${props =>
    props['data-isfiltered'] === 'true' ? '#FFBF73 !important' : 'white'};
`
const StyledDropdown = styled(Dropdown)`
  margin-right: -12px;
  margin-top: -8px;
  margin-bottom: -8px;
  min-width: 23px;
  min-height: 38px;
  .dropdown-toggle {
    min-height: 38px;
    padding-top: 5px;
    padding-right: 4px;
    min-width: 23px;
    border-left: 1px solid #ced4da;
  }
`
const StyledDropdownItem = styled(DropdownItem)`
  background-color: ${props => (props.active ? '#f7f791 !important' : 'unset')};
  color: ${props => (props.active ? '#212529 !important' : 'unset')};
`
const StyledCriteria = styled.span`
  cursor: default !important;
  font-style: italic !important;
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

  const [filterDropdownIsOpen, setFilterDropdownIsOpen] = useState(false)
  const toggleFilterDropdown = useCallback(
    e => {
      setFilterDropdownIsOpen(!filterDropdownIsOpen)
      e.stopPropagation()
    },
    [filterDropdownIsOpen],
  )

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
  const onClickFilterFields = useCallback(() => {
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
            data-isfiltered={dataIsFilteredByFulltext}
            title="Zum Filtern drücken Sie die Enter-Taste"
          />
          <InputGroupAddon addonType="append">
            <StyledInputGroupText onClick={onClickFilterFields}>
              {title}
              <StyledDropdown
                isOpen={filterDropdownIsOpen}
                toggle={toggleFilterDropdown}
              >
                <DropdownToggle caret tag="div">
                  {' '}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>aktive Filterkriterien:</DropdownItem>
                  <StyledDropdownItem>
                    <StyledCriteria>{activeFiltercriteria}</StyledCriteria>
                  </StyledDropdownItem>
                  <DropdownItem header>aktive Sortierkriterien:</DropdownItem>
                  <StyledDropdownItem>
                    <StyledCriteria>{activeSortcriteria}</StyledCriteria>
                  </StyledDropdownItem>
                  <DropdownItem header>vorbereitete Filter:</DropdownItem>
                  <StyledDropdownItem
                    onClick={onSelectFaelligeGeschaefte}
                    style={{
                      backgroundColor:
                        filterType === 'fällige' ? '#FFBF73' : null,
                    }}
                  >
                    fällige Geschäfte
                  </StyledDropdownItem>
                  <StyledDropdownItem
                    onClick={onSelectEigeneFaelligeGeschaefte}
                    style={{
                      backgroundColor:
                        filterType === 'eigene fällige' ? '#FFBF73' : null,
                    }}
                  >
                    eigene fällige Geschäfte
                  </StyledDropdownItem>
                  <StyledDropdownItem
                    onClick={onSelectAngekVernehmlassungen}
                    style={{
                      backgroundColor:
                        filterType === 'angekündigte Vernehmlassungen'
                          ? '#FFBF73'
                          : null,
                    }}
                  >
                    angekündigte Vernehmlassungen
                  </StyledDropdownItem>
                  <StyledDropdownItem
                    onClick={onSelectLaufendeVernehmlassungen}
                    style={{
                      backgroundColor:
                        filterType === 'laufende Vernehmlassungen'
                          ? '#FFBF73'
                          : null,
                    }}
                  >
                    laufende Vernehmlassungen
                  </StyledDropdownItem>
                </DropdownMenu>
              </StyledDropdown>
            </StyledInputGroupText>
            {dataIsFiltered && (
              <StyledInputGroupText
                id="emptyFilterAddon"
                onClick={removeFilters}
                data-isfiltered={dataIsFiltered}
                title="Filter und Sortierung entfernen"
              >
                <FaTimes />
              </StyledInputGroupText>
            )}
          </InputGroupAddon>
        </InputGroup>
      </div>
    </ErrorBoundary>
  )
}

export default observer(FilterNav)
