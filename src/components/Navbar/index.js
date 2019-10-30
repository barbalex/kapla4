import React, { useEffect, useContext, useState, useCallback } from 'react'
import { Collapse, Navbar, NavbarToggler, Nav, Button } from 'reactstrap'
import { FaSave } from 'react-icons/fa'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import Geschaefte from './Geschaefte'
import ModalGeschaeftDelete from '../ModalGeschaeftDelete'
import ModalMessage from '../ModalMessage'
import PagesModal from '../PagesModal'
import Berichte from './Berichte'
import Stammdaten from './Stammdaten'
import Export from './Export'
import FilterNav from './FilterNav'
import OptionsNav from './OptionsNav'
import storeContext from '../../storeContext'

const Container = styled.div`
  font-size: 1.4em;
  font-weight: 500;
  @media print {
    display: none;
  }
`
const StyledNavbar = styled(Navbar)`
  @media print {
    display: none;
  }
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

  const [open, setOpen] = useState(false)
  const toggleNavbar = useCallback(() => {
    setOpen(!open)
  }, [open])

  const { dirty } = store
  const { showMessageModal, config } = store.app
  const { showPagesModal } = store.pages
  const {
    //geschaeftePlusFilteredAndSorted: geschaefte,
    willDelete,
  } = store.geschaefte
  const path = store.history.location.pathname
  /*const dataIsFiltered =
    geschaefte.length !== store.geschaefte.geschaefte.length*/
  const showBerichteNavs = path === '/pages' || path === '/geschaeftPdf'
  const showGeschaefteNavs = path === '/geschaefte' || path === '/filterFields'
  const showGeschaefteAndPrint = showBerichteNavs || showGeschaefteNavs
  const showTableNavs = path === '/table'

  useEffect(() => {
    config.get()
  }, [config])

  console.log('Navbar, dirty:', dirty)

  return (
    <ErrorBoundary>
      <Container>
        {willDelete && <ModalGeschaeftDelete />}
        {showMessageModal && <ModalMessage />}
        {showPagesModal && <PagesModal />}
        <StyledNavbar color="dark" dark expand="xl">
          <NavbarToggler onClick={toggleNavbar} />
          <Collapse isOpen={open} navbar>
            <Nav className="mr-auto" navbar>
              <Geschaefte />
              {showGeschaefteAndPrint && (
                <>
                  <Export />
                  <Berichte />
                </>
              )}
              <Stammdaten />
            </Nav>
            <Nav className="mr-auto" navbar>
              <SaveButton
                disabled={!dirty}
                title={dirty ? 'speichern' : 'alles ist gespeichert'}
              >
                <FaSave />
              </SaveButton>
              {!showTableNavs && <FilterNav />}
              <OptionsNav />
            </Nav>
          </Collapse>
        </StyledNavbar>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(NavbarComponent)
