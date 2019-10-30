import React, { useContext, useCallback } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { remote, shell, ipcRenderer } from 'electron'

import storeContext from '../../storeContext'

const { dialog } = remote

const StyledUncontrolledDropdown = styled(UncontrolledDropdown)`
  display: flex;
  border: ${props =>
    props.active ? '1px solid rgb(255, 255, 255, .5)' : 'unset'};
  border-radius: 0.25rem;
  margin-right: 5px;
`
const StyledButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0) !important;
  border: unset !important;
`

const Berichte = () => {
  const store = useContext(storeContext)
  const { navigateToGeschaeftPdf, history } = store
  const { sortByFields, resetSort, filterByFields, activeId } = store.geschaefte
  const { initiate, reportType } = store.pages
  const path = history.location.pathname
  const isActive = path === '/pages'
  const nameObject = {
    typFaelligeGeschaefte: 'Bericht: Typ "fällige Geschäfte"',
    list1: 'Bericht: Einfache Liste',
    angekVernehml: 'Bericht: angekündigte Vernehmlassungen',
    laufendeVernehml: 'Bericht: laufende Vernehmlassungen',
  }
  const name = nameObject[reportType] || 'Berichte'
  const title = isActive ? name : 'Berichte'

  return (
    <StyledUncontrolledDropdown nav inNavbar active={isActive}>
      <DropdownToggle nav caret>
        {title}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Vorlagen: übernehmen Filter</DropdownItem>
        <DropdownItem
          onClick={() => {
            setLocation(['Personen'])
            setActivePrintForm('personFunktionen')
            store.personPages.initiate()
          }}
        >
          Personen: Funktionen
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem header>Vorbereitete: setzen eigenen Filter</DropdownItem>
        <DropdownItem
          onClick={() => {
            setLocation(['Personen'])
            emptyFilter()
            setFilterPersonKader(true)
            setTimeout(() => {
              setActivePrintForm('personKader')
              store.personPages.initiate()
            }, 1000)
          }}
        >
          Personen: Kader
        </DropdownItem>
        {showPD && (
          <>
            <DropdownItem divider />
            <DropdownItem header>Für den aktiven Datensatz</DropdownItem>
            <DropdownItem onClick={onClickPD}>Personal-Blatt</DropdownItem>
            <DropdownItem onClick={onClickMutationsFormular}>
              Mutations-Formular
            </DropdownItem>
          </>
        )}
      </DropdownMenu>
      {!!activePrintForm && (
        <>
          <StyledButton title="drucken" onClick={onClickPrint}>
            <FaPrint />
          </StyledButton>
          <StyledButton title="PDF erzeugen" onClick={onClickCreatePdf}>
            <FaRegFilePdf />
          </StyledButton>
        </>
      )}
    </StyledUncontrolledDropdown>
  )
}

export default observer(Berichte)
