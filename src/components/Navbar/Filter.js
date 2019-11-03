import React, { useContext, useCallback, useState } from 'react'
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { FaTimes, FaCaretDown } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'

import filterForFaelligeGeschaefte from '../../src/filterForFaelligeGeschaefte'
import filterForVernehmlAngek from '../../src/filterForVernehmlAngek'
import filterForVernehmlLaeuft from '../../src/filterForVernehmlLaeuft'
import filterCriteriaToArrayOfStrings from '../../src/filterCriteriaToArrayOfStrings'
import sortCriteriaToArrayOfStrings from '../../src/sortCriteriaToArrayOfStrings'
import storeContext from '../../storeContext'

const Container = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`
const VolltextInput = styled(Input)`
  background-color: ${props =>
    props['data-isfiltered'] === 'true' ? '#FFBF73 !important' : 'white'};
`
const StyledInputGroupText = styled(InputGroupText)`
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-right: 0 !important;
  cursor: pointer;
  user-select: none;
  font-size: 12px !important;
  background-color: ${props =>
    props['data-isfiltered'] === 'true'
      ? '#FFBF73 !important'
      : 'white !important'};
`
const RemoveFilterButton = styled(InputGroupText)`
  background-color: ${props =>
    props['data-isfiltered'] === 'true'
      ? 'white !important'
      : '#d3d3d3 !important'};
  cursor: pointer;
`
const StyledDropdown = styled(Dropdown)`
  background-color: ${props =>
    props['data-isfiltered'] === 'true' ? '#FFBF73 !important' : 'white'};
  height: 30px;
  margin-left: 10px;
  cursor: pointer;
  .dropdown-toggle:after {
    vertical-align: unset !important;
  }
`
const StyledDropdownToggle = styled(DropdownToggle)`
  height: 100%;
  width: 20px;
  border-left: 1px solid #ced4da;
  svg {
    margin-top: 7px;
  }
`
const StyledDropdownItem = styled(DropdownItem)`
  background-color: ${props => (props.active ? '#FFBF73 !important' : 'unset')};
  color: ${props => (props.active ? '#212529 !important' : 'unset')};
`
const StyledCriteria = styled.span`
  cursor: default !important;
  font-style: italic !important;
`

const Filter = () => {
  const store = useContext(storeContext)
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const { setLocation } = store
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
    isFiltered,
    sortFields,
    geschaefteFilteredAndSorted: geschaefte,
  } = store.geschaefte
  const { username } = store.app.user
  const dataIsFilteredByFulltext =
    geschaefte.length !== geschaefteUnfiltered.length && !!filterFulltext
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
    const filter = [
      ...filterForFaelligeGeschaefte,
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
    if (activeLocation !== 'filterFields') {
      setLocation(['filterFields'])
      removeFilters()
    }
  }, [activeLocation, removeFilters, setLocation])

  return (
    <ErrorBoundary>
      <Container>
        <InputGroup>
          <VolltextInput
            placeholder="Volltext filtern"
            onChange={onChangeVolltextControl}
            value={filterFulltext || ''}
            data-isfiltered={dataIsFilteredByFulltext.toString()}
            title="Zum Filtern drücken Sie die Enter-Taste"
          />
          <InputGroupAddon addonType="append">
            <StyledInputGroupText
              onClick={onClickFilterFields}
              data-isfiltered={isFiltered.toString()}
            >
              {title}
              <StyledDropdown
                isOpen={filterDropdownIsOpen}
                toggle={toggleFilterDropdown}
                data-isfiltered={isFiltered.toString()}
                size="sm"
                title="Vorbereitete Filter öffnen"
              >
                <StyledDropdownToggle
                  tag="div"
                  onClick={toggleFilterDropdown}
                  data-toggle="dropdown"
                  aria-expanded={filterDropdownIsOpen}
                >
                  <FaCaretDown />
                </StyledDropdownToggle>
                <DropdownMenu right>
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
            <RemoveFilterButton
              id="emptyFilterAddon"
              onClick={removeFilters}
              data-isfiltered={dataIsFiltered.toString()}
              title={
                isFiltered
                  ? 'Filter und Sortierung entfernen'
                  : 'Daten sind nicht gefiltert'
              }
            >
              <FaTimes />
            </RemoveFilterButton>
          </InputGroupAddon>
        </InputGroup>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Filter)
