import React, { useContext } from 'react'
import { NavDropdown, MenuItem } from 'react-bootstrap'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

import filterForVernehmlAngek from '../../src/filterForVernehmlAngek'
import filterForVernehmlLaeuft from '../../src/filterForVernehmlLaeuft'
import filterForFaelligeGeschaefte from '../../src/filterForFaelligeGeschaefte'
import storeContext from '../../storeContext'

// eslint-disable-next-line no-unused-vars
const StyledNavDropdown = styled(NavDropdown)`
  border-left: ${props =>
    props['data-showberichtenavs'] ? 'solid grey 1px' : 'dotted #505050 1px'};
  border-right: ${props =>
    props['data-showberichtenavs'] ? 'none' : 'dotted #505050 1px'};
  /**
   * in react-bootstrap the active
   * prop of NavDropdown does not work
   * see: https://github.com/react-bootstrap/react-bootstrap/issues/1878
   */
  background-color: ${props => (props.active ? '#080808' : 'inherit')};
  > a {
    color: ${props => (props.active ? '#fff !important' : 'inherit')};
  }
`

const enhance = compose(observer)

const BerichteNav = ({ showBerichteNavs }) => {
  const store = useContext(storeContext)
  const {
    pages,
    pagesInitiate,
    geschaeftPdfShow,
    geschaefteFilterByFields,
    geschaefteSortByFields,
    geschaefteResetSort,
  } = store
  const { activeId } = store.geschaefte
  const path = store.history.location.pathname
  const isActive = path === '/pages'
  const nameObject = {
    typFaelligeGeschaefte: 'Bericht: Typ "fällige Geschäfte"',
    list1: 'Bericht: Einfache Liste',
    angekVernehml: 'Bericht: angekündigte Vernehmlassungen',
    laufendeVernehml: 'Bericht: laufende Vernehmlassungen',
  }
  const name = nameObject[pages.reportType] || 'Berichte'
  const title = isActive ? name : 'Berichte'
  return (
    <StyledNavDropdown
      data-showberichtenavs={showBerichteNavs}
      eventKey={7}
      title={title}
      id="reports-nav-dropdown"
      active={isActive}
      onSelect={eventKey => {
        /*
         * react-bootstrap has an error causing the dropdown to stay open
         * and the message modal not to show!!!!
         *
         * this is an elaborate hack
         * to get the menu item to close immediately
         */
        if (eventKey === 7.2) {
          setTimeout(() => {
            pagesInitiate('list1')
          }, 0)
        }
        if (eventKey === 7.7) {
          setTimeout(() => {
            geschaefteFilterByFields(filterForFaelligeGeschaefte, 'fällige')
            // only do this after former is finished
            setTimeout(() => {
              geschaefteResetSort()
              geschaefteSortByFields('idGeschaeft', 'DESCENDING')
              pagesInitiate('typFaelligeGeschaefte')
            }, 0)
          }, 0)
        }
        if (eventKey === 7.3) {
          setTimeout(() => {
            geschaefteFilterByFields(
              filterForVernehmlAngek,
              'angekündigte Vernehmlassungen',
            )
            // only do this after former is finished
            setTimeout(() => {
              geschaefteResetSort()
              geschaefteSortByFields('idGeschaeft', 'DESCENDING')
              pagesInitiate('angekVernehml')
            }, 0)
          }, 0)
        }
        if (eventKey === 7.4) {
          setTimeout(() => {
            geschaefteFilterByFields(
              filterForVernehmlLaeuft,
              'laufende Vernehmlassungen',
            )
            // only do this after former is finished
            setTimeout(() => {
              pagesInitiate('laufendeVernehml')
              geschaefteResetSort()
              geschaefteSortByFields('fristMitarbeiter', 'DESCENDING')
              geschaefteSortByFields('idGeschaeft', 'DESCENDING')
            })
          }, 0)
        }
        if (eventKey === 7.5) {
          setTimeout(() => {
            geschaeftPdfShow()
          }, 0)
        }
      }}
    >
      <MenuItem header>
        Vorlagen,
        <br />
        übernehmen den gesetzten Filter:
      </MenuItem>
      <MenuItem eventKey={7.2}>{'Vorlage "einfache Liste"'}</MenuItem>
      <MenuItem divider />
      <MenuItem header>
        Vorbereitete,
        <br />
        setzen einen eigenen Filter:
      </MenuItem>
      <MenuItem eventKey={7.7}>fällige Geschäfte</MenuItem>
      <MenuItem eventKey={7.3}>angekündigte Vernehmlassungen</MenuItem>
      <MenuItem eventKey={7.4}>laufende Vernehmlassungen</MenuItem>
      {activeId && <MenuItem divider />}
      {activeId && <MenuItem header>Für das aktive Geschäft:</MenuItem>}
      {activeId && <MenuItem eventKey={7.5}>Deckblatt</MenuItem>}
    </StyledNavDropdown>
  )
}

export default enhance(BerichteNav)
