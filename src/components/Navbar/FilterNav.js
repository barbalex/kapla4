import React from 'react'
import PropTypes from 'prop-types'
import {
  MenuItem,
  Button,
  SplitButton,
  Navbar,
  Glyphicon,
  FormControl,
} from 'react-bootstrap'
import moment from 'moment'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import filterForFaelligeGeschaefte from '../../src/filterForFaelligeGeschaefte'
import filterForVernehmlAngek from '../../src/filterForVernehmlAngek'
import filterForVernehmlLaeuft from '../../src/filterForVernehmlLaeuft'
import filterCriteriaToArrayOfStrings from '../../src/filterCriteriaToArrayOfStrings'
import sortCriteriaToArrayOfStrings from '../../src/sortCriteriaToArrayOfStrings'

const Container = styled(Navbar.Form)`
  padding-right: 10px;
`
const SubContainer = styled.div`
  display: flex;
`
const StyledVolltextControl = styled(FormControl)`
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  width: 186px !important;
  background-color: ${props =>
    props['data-dataisfilteredbyfulltext'] ? '#FFBF73 !important' : 'white'};
`
const StyledFilterDropdown = styled(SplitButton)`
  border-radius: 0 !important;
  min-width: 160px !important;
  font-weight: 700 !important;
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

const enhance = compose(
  inject('store'),
  withHandlers({
    onChangeVolltextControl: ({ store }) => e =>
      store.geschaefteFilterByFulltext(e.target.value),
    onSelectFaelligeGeschaefte: ({ store }) => () => {
      const {
        geschaefteFilterByFields,
        geschaefteResetSort,
        geschaefteSortByFields,
      } = store
      geschaefteFilterByFields(filterForFaelligeGeschaefte, 'fällige')
      // order by frist desc
      geschaefteResetSort()
      geschaefteSortByFields('fristMitarbeiter', 'DESCENDING')
    },
    onSelectEigeneFaelligeGeschaefte: ({ store }) => () => {
      const {
        geschaefteFilterByFields,
        geschaefteResetSort,
        geschaefteSortByFields,
      } = store
      const { username } = store.user
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
      geschaefteFilterByFields(filter, 'eigene fällige')
      // order by frist desc
      geschaefteResetSort()
      geschaefteSortByFields('fristMitarbeiter', 'DESCENDING')
    },
    onSelectAngekVernehmlassungen: ({ store }) => () => {
      const {
        geschaefteFilterByFields,
        geschaefteResetSort,
        geschaefteSortByFields,
      } = store
      geschaefteFilterByFields(
        filterForVernehmlAngek,
        'angekündigte Vernehmlassungen',
      )
      geschaefteResetSort()
      geschaefteSortByFields('idGeschaeft', 'DESCENDING')
    },
    onSelectLaufendeVernehmlassungen: ({ store }) => () => {
      const {
        geschaefteFilterByFields,
        geschaefteResetSort,
        geschaefteSortByFields,
      } = store
      geschaefteFilterByFields(
        filterForVernehmlLaeuft,
        'laufende Vernehmlassungen',
      )
      geschaefteResetSort()
      geschaefteSortByFields('fristMitarbeiter', 'DESCENDING')
      geschaefteSortByFields('idGeschaeft', 'DESCENDING')
    },
    onClickFilterDropdown: ({ store }) => () => {
      const path = store.history.location.pathname
      if (path !== '/filterFields') {
        store.history.push('/filterFields')
        store.geschaefteRemoveFilters()
      }
    },
  }),
  observer,
)

const FilterNav = ({
  store,
  onChangeVolltextControl,
  onSelectFaelligeGeschaefte,
  onSelectEigeneFaelligeGeschaefte,
  onSelectAngekVernehmlassungen,
  onSelectLaufendeVernehmlassungen,
  onClickFilterDropdown,
}) => {
  const { geschaefteRemoveFilters } = store
  const {
    geschaefte: geschaefteUnfiltered,
    filterFields,
    filterType,
    filterFulltext,
    sortFields,
    geschaeftePlusFilteredAndSorted: geschaefte,
  } = store.geschaefte
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

  return (
    <Container pullLeft>
      <SubContainer>
        <StyledVolltextControl
          type="text"
          placeholder="Volltext filtern"
          value={filterFulltext}
          onChange={onChangeVolltextControl}
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
          onClick={() => geschaefteRemoveFilters()}
        >
          <Glyphicon glyph="remove" title="Filter und Sortierung entfernen" />
        </FilterRemoveButton>
      </SubContainer>
    </Container>
  )
}

FilterNav.displayName = 'FilterNav'

FilterNav.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(FilterNav)
