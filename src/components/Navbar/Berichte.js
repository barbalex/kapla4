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
import filterForFaelligeGeschaefte from '../../src/filterForFaelligeGeschaefte'
import filterForVernehmlAngek from '../../src/filterForVernehmlAngek'
import filterForVernehmlLaeuft from '../../src/filterForVernehmlLaeuft'

const { dialog } = remote

const dialogOptions = {
  title: 'pdf speichern',
  filters: [
    {
      name: 'pdf',
      extensions: ['pdf'],
    },
  ],
}

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
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const { navigateToGeschaeftPdf } = store
  const { sortByFields, resetSort, filterByFields, activeId } = store.geschaefte
  const { initiate, reportType } = store.pages
  const isActive = ['geschaeftPdf', 'pages'].includes(activeLocation)
  const nameObject = {
    typFaelligeGeschaefte: 'Bericht: Typ "fällige Geschäfte"',
    list1: 'Bericht: Einfache Liste',
    angekVernehml: 'Bericht: angekündigte Vernehmlassungen',
    laufendeVernehml: 'Bericht: laufende Vernehmlassungen',
  }
  let name = 'Berichte'
  if (nameObject[reportType]) name = nameObject[reportType]
  if (activeLocation === 'geschaeftPdf') name = 'Deckblatt'
  const title = isActive ? name : 'Berichte'

  const onClickList1 = useCallback(() => {
    setTimeout(() => initiate('list1'))
  }, [initiate])
  const onClickFällige = useCallback(() => {
    setTimeout(() => {
      filterByFields(filterForFaelligeGeschaefte, 'fällige')
      // only do this after former is finished
      setTimeout(() => {
        resetSort()
        sortByFields('idGeschaeft', 'DESCENDING')
        initiate('typFaelligeGeschaefte')
      })
    })
  }, [filterByFields, initiate, resetSort, sortByFields])
  const onClickAngekündigteV = useCallback(() => {
    setTimeout(() => {
      filterByFields(filterForVernehmlAngek, 'angekündigte Vernehmlassungen')
      // only do this after former is finished
      setTimeout(() => {
        resetSort()
        sortByFields('idGeschaeft', 'DESCENDING')
        initiate('angekVernehml')
      })
    })
  }, [filterByFields, initiate, resetSort, sortByFields])
  const onClickLaufendeV = useCallback(() => {
    setTimeout(() => {
      filterByFields(filterForVernehmlLaeuft, 'laufende Vernehmlassungen')
      // only do this after former is finished
      setTimeout(() => {
        initiate('laufendeVernehml')
        resetSort()
        sortByFields('fristMitarbeiter', 'DESCENDING')
        sortByFields('idGeschaeft', 'DESCENDING')
      })
    })
  }, [filterByFields, initiate, resetSort, sortByFields])
  const onClickDeckblatt = useCallback(() => {
    setTimeout(() => navigateToGeschaeftPdf())
  }, [navigateToGeschaeftPdf])
  const onClickPrint = () => {
    // https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentsprintoptions
    /**
     * PROBLEM
     * with webContents.print marginsType can not be set
     * so this may be set by system settings, which could be different
     * from pc to pc!
     * Preset seems to be 0 for default margin
     * MUCH BETTER would be 1 for no margin
     * but: @page css to the rescue
     * plus: printBackground and landscape seem to also be ignored
     */
    /*const win = remote.getCurrentWindow()
    win.webContents.print(
      {
        marginsType: 0,
        printBackground: true,
        landscape: true,
      },
      (success, failureReason) => {
        console.log('print result', { success, failureReason })
      },
    )*/
    window.print()
  }
  const onClickCreatePdf = useCallback(
    async e => {
      e.preventDefault()
      const landscape = activeLocation === 'pages'
      const win = remote.getCurrentWindow()
      const printToPDFOptions = {
        marginsType: 0,
        pageSize: 'A4',
        landscape,
        printBackground: false,
      }

      // https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentsprinttopdfoptions-callback
      const data = await win.webContents.printToPDF(printToPDFOptions)
      const { filePath } = await dialog.showSaveDialog(dialogOptions)
      if (filePath) {
        ipcRenderer.send('SAVE_FILE', filePath, data)
        ipcRenderer.once('SAVED_FILE', () => {
          shell.openItem(filePath)
        })
        ipcRenderer.once('ERROR', error => {
          throw new Error(error)
        })
      }
    },
    [activeLocation],
  )

  return (
    <StyledUncontrolledDropdown nav inNavbar active={isActive}>
      <DropdownToggle nav caret>
        {title}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Vorlagen: übernehmen Filter</DropdownItem>
        <DropdownItem onClick={onClickList1}>
          {'Vorlage "einfache Liste"'}
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem header>Vorbereitete: setzen eigenen Filter</DropdownItem>
        <DropdownItem onClick={onClickFällige}>fällige Geschäfte</DropdownItem>
        <DropdownItem onClick={onClickAngekündigteV}>
          angekündigte Vernehmlassungen
        </DropdownItem>
        <DropdownItem onClick={onClickLaufendeV}>
          laufende Vernehmlassungen
        </DropdownItem>
        {!!activeId && (
          <>
            <DropdownItem divider />
            <DropdownItem header>Für das aktive Geschäft:</DropdownItem>
            <DropdownItem onClick={onClickDeckblatt}>Deckblatt</DropdownItem>
          </>
        )}
      </DropdownMenu>
      {isActive && (
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
