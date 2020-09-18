import React, { useContext, useState, useCallback } from 'react'
import { Collapse, Navbar, NavbarToggler, Nav, Button } from 'reactstrap'
import { FaSave, FaRedoAlt } from 'react-icons/fa'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary'
import Geschaefte from './Geschaefte'
import ModalGeschaeftDelete from '../ModalGeschaeftDelete'
import ModalMessage from '../ModalMessage'
import PagesModal from '../PagesModal'
import Berichte from './Berichte'
import Stammdaten from './Stammdaten'
import Export from './Export'
import Filter from './Filter'
import More from './More'
import storeContext from '../../storeContext'
import fetchInitialData from '../../src/fetchInitialData'

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
    background-color: ${(props) =>
      props.disabled ? 'transparent !important' : '#6c757d !important'};
  }
`
const ReloadButton = styled(Button)`
  background-color: transparent !important;
  border: none !important;
`
const ReloadIcon = styled(FaRedoAlt)`
  ${(props) => props['data-spinning'] && 'animation: spin 4s linear infinite;'}
  ${(props) =>
    props['data-spinning'] &&
    '@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); }'}
`

const NavbarComponent = () => {
  const store = useContext(storeContext)
  const { fetching, setFetching } = store
  const location = store.location.toJSON()
  const activeLocation = location[0]

  const [open, setOpen] = useState(false)
  const toggleNavbar = useCallback(() => {
    setOpen(!open)
  }, [open])

  const onClickReload = useCallback(() => {
    console.log('reload button clicked')
    setFetching(true)
    // in case user edited before clicking to reload
    // wait to save
    setTimeout(() => fetchInitialData(store), 100)
  }, [setFetching, store])

  const { dirty } = store
  const { showMessageModal } = store.app
  const showPagesModal = store.pages.remainingGeschaefte.length > 0
  const { willDelete } = store.geschaefte
  const showBerichteNavs =
    activeLocation === 'pages' || activeLocation === 'geschaeftPdf'
  const showGeschaefteNavs =
    activeLocation === 'geschaefte' || activeLocation === 'filterFields'
  const showGeschaefteAndPrint = showBerichteNavs || showGeschaefteNavs
  const showTableNavs = activeLocation === 'table'

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
            <Nav className="ml-auto" navbar>
              <ReloadButton
                title="Alle Daten neu laden"
                onClick={onClickReload}
              >
                <ReloadIcon data-spinning={fetching} />
              </ReloadButton>
              <SaveButton
                disabled={!dirty}
                title={dirty ? 'speichern' : 'alles ist gespeichert'}
              >
                <FaSave />
              </SaveButton>
              {!showTableNavs && <Filter />}
              <More />
            </Nav>
          </Collapse>
        </StyledNavbar>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(NavbarComponent)
