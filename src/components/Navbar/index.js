import React, { useEffect, useContext } from 'react'
import { Button, Navbar, Nav, NavItem } from 'react-bootstrap'
import { FaSave } from 'react-icons/fa'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import ModalGeschaeftDelete from '../ModalGeschaeftDelete'
import ModalMessage from '../ModalMessage'
import PagesModal from '../PagesModal'
import BerichteNav from './BerichteNav'
import GeschaeftNeuNav from './GeschaeftNewNav'
import GeschaeftLoeschenNav from './GeschaeftDeleteNav'
import TableRowNeuNav from './TableRowNewNav'
import TableRowDeleteNav from './TableRowDeleteNav'
import ExportGeschaefteNav from './ExportGeschaefteNav'
import PrintToPdfNav from './PrintToPdfNav'
import PrintNav from './PrintNav'
import StammdatenNav from './StammdatenNav'
import FilterNav from './FilterNav'
import OptionsNav from './OptionsNav'
import storeContext from '../../storeContext'

const Container = styled.div`
  @media print {
    display: none;
  }
`
const GeschaefteNavItem = styled(NavItem)`
  border-left: ${props =>
    props['data-showgeschaeftenavs'] ? 'solid grey 1px' : 'dotted #505050 1px'};
  border-right: ${props =>
    props['data-showgeschaeftenavs'] ? 'none' : 'dotted #505050 1px'};
`
const StyledBadge = styled.sup`
  color: ${props => (props.dataIsFiltered ? '#FF9416' : 'inherit')};
`
const StyledNavbar = styled(Navbar)`
  margin-bottom: 0;
  -webkit-user-select: none;
  a:not(.dropdown-header):not([role='menuitem']) {
    font-size: 15px;
    font-weight: 700;
  }
`
const NavRight = styled.div`
  display: flex;
`
const SaveButton = styled(Button)`
  background-color: transparent !important;
  border: none !important;
  &:hover {
    background-color: ${props =>
      props.disabled ? 'transparent !important' : '#6c757d !important'};
  }
`

const NavbarComponent = () => {
  const store = useContext(storeContext)

  useEffect(() => {
    store.configGet()
  }, [store])

  const { dirty } = store
  const { showMessageModal } = store.app
  const { showPagesModal } = store.pages
  const {
    geschaeftePlusFilteredAndSorted: geschaefte,
    willDelete,
  } = store.geschaefte
  const path = store.history.location.pathname
  const dataIsFiltered =
    geschaefte.length !== store.geschaefte.geschaefte.length
  const showBerichteNavs = path === '/pages' || path === '/geschaeftPdf'
  const showGeschaefteNavs = path === '/geschaefte' || path === '/filterFields'
  const showGeschaefteAndPrint = showBerichteNavs || showGeschaefteNavs
  const showTableNavs = path === '/table'

  console.log('Navbar, dirty:', dirty)

  return (
    <ErrorBoundary>
      <Container>
        {willDelete && <ModalGeschaeftDelete />}
        {showMessageModal && <ModalMessage />}
        {showPagesModal && <PagesModal />}
        <StyledNavbar inverse fluid>
          <Nav>
            <GeschaefteNavItem
              href="#"
              onClick={() => store.history.push('/geschaefte')}
              data-showgeschaeftenavs={showGeschaefteNavs}
            >
              Geschäfte{' '}
              <StyledBadge dataIsFiltered={dataIsFiltered}>
                {geschaefte.length}
              </StyledBadge>
            </GeschaefteNavItem>
            {showGeschaefteNavs && <GeschaeftNeuNav />}
            {showGeschaefteNavs && (
              <GeschaeftLoeschenNav
                data-showgeschaeftenavs={showGeschaefteNavs}
              />
            )}
            {showGeschaefteAndPrint && <ExportGeschaefteNav />}
            {showGeschaefteAndPrint && (
              <BerichteNav showBerichteNavs={showBerichteNavs} />
            )}
            {showBerichteNavs && <PrintNav />}
            {showBerichteNavs && (
              <PrintToPdfNav showBerichteNavs={showBerichteNavs} />
            )}
            <StammdatenNav showTableNavs={showTableNavs} />
            {showTableNavs && <TableRowNeuNav />}
            {showTableNavs && (
              <TableRowDeleteNav showTableNavs={showTableNavs} />
            )}
          </Nav>
          <Nav pullRight>
            <NavRight>
              <SaveButton
                disabled={!dirty}
                title={dirty ? 'speichern' : 'alles ist gespeichert'}
              >
                <FaSave />
              </SaveButton>
              {!showTableNavs && <FilterNav />}
              <OptionsNav />
            </NavRight>
          </Nav>
        </StyledNavbar>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(NavbarComponent)
