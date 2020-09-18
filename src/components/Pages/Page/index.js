/**
 * This is A LOT SLOWER than the version using classes
 * Do not know why
 */
import React, { useContext, useCallback, useEffect, useRef } from 'react'
import moment from 'moment'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import FaelligeGeschaefteHeader from './faelligeGeschaefte/Header'
import FaelligeGeschaefteRows from './faelligeGeschaefte/Rows'
import VernehmlassungenHeader from './vernehmlassungen/Header'
import VernehmlassungenRows from './vernehmlassungen/Rows'
import List1Header from './list1/Header'
import List1Rows from './list1/Rows'
import filterCriteriaToArrayOfStrings from '../../../src/filterCriteriaToArrayOfStrings'
import sortCriteriaToArrayOfStrings from '../../../src/sortCriteriaToArrayOfStrings'
import logoImg from '../../../etc/logo.png'
import PageTitle from './PageTitle'
import storeContext from '../../../storeContext'

/**
 * The size of PageContainer is set in Print by @page, together with portrait/landscape
 * That is necessary because otherwise portrait/landscape is not set correctly
 * This only works when width and height are NOT set in @media print!!!!
 */
const PageContainer = styled.div`
  /* Divide single pages with some space and center all pages horizontally */
  margin: 1cm auto;
  /* Define a white paper background that sticks out from the darker overall background */
  background: #fff;

  /* Show a drop shadow beneath each page */
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);

  /* set page size and padding for screen */
  width: 29.7cm;
  height: 20.95cm;
  padding: 1.5cm;

  overflow: hidden;
  overflow-y: visible;

  /* When the document is actually printed */
  @media print {
    /**
     * something seems to change the measurements
     * if they are not repeated here using important
     * seems like export to pdf is moved right down
     * without this
     */
    width: inherit;
    height: inherit;

    /* gingerly set margins and padding */
    /**
     * this is somehow completely fucked up:
     * would want to set margins and padding to 0 and set inner div's size to A4
     * that works nicely in printToPdf
     * but in regular print it DOUBLES padding!!!!!!!!
     * so after working for hours it seems that below magical numbers make page look same
     * on printing to pdf and not pdf
     */
    margin-top: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-bottom: 0 !important;
    padding-top: 0.5cm !important;
    padding-left: 0.5cm !important;
    padding-right: 0 !important;
    padding-bottom: 0 !important;

    overflow: hidden !important;

    page-break-inside: avoid !important;
    page-break-before: always !important;
    page-break-after: always !important;
  }
`
/**
 * width of PageContainer is set in print by @page
 * somehow this makes positioning of its children not react as usual
 * flex and relative/absolute positioning behave as if the page were not full size
 * but would grow with the rowsContainer
 * Solution:
 * set a InnerPageContainer inside PageContainer
 * and give it full page size
 */
const InnerPageContainer = styled.div`
  width: 26.7cm;
  height: 17.95cm;

  /* place rowsContainer top and footer bottom */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const StyledRowsContainer = styled.div`
  max-height: 17.2cm;
  max-width: 26.7cm;
  /*
   * need overflow while building list
   * so list does not flow outside padding
   */
  overflow-y: ${(props) => (props.building ? 'auto' : 'hidden')};
  overflow-x: hidden;

  @media print {
    page-break-before: avoid !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }
`
const StyledFilterCriteria = styled.div`
  margin-top: 10px;
  margin-bottom: 0;
  padding-left: 5px;
`
const StyledSortCriteria = styled.div`
  margin-top: 0;
  margin-bottom: 10px;
  padding-left: 5px;
`
const StyledFooter = styled.div`
  height: 0.4cm !important;
  max-height: 0.4cm !important;
  width: 26.7cm;
  max-width: 26.7cm;

  display: flex;
  justify-content: space-between;

  div {
    /* push down as far as possible */
    margin-bottom: 0;
    text-align: right;
  }

  div:first-of-type {
    text-align: left;
  }

  @media print {
    page-break-before: avoid !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }
`

const Page = ({ pageIndex }) => {
  const store = useContext(storeContext)
  const {
    activePageIndex,
    addGeschaeft,
    building,
    finishedBuilding,
    moveGeschaeftToNewPage,
    pages,
    remainingGeschaefte,
    reportType,
    showModal,
  } = store.pages
  const {
    geschaefteFilteredAndSorted,
    filterFields,
    sortFields,
  } = store.geschaefte

  const geschaefteIds = pages[pageIndex].geschaefte
  const geschaefte = geschaefteFilteredAndSorted
    .filter((g) => geschaefteIds.includes(g.idGeschaeft))
    /**
     * for unknown reason in bericht "laufende Vernehmlassungen"
     * an undefined geschaeft exists
     */
    .filter((g) => !!g)
  const firstPage = pageIndex === 0

  const showPagesModal = useCallback(() => {
    const msgLine2Txt = `Bisher ${pages.length} Seiten, ${remainingGeschaefte.length} Geschäfte noch zu verarbeiten`
    const msgLine2 = geschaefteFilteredAndSorted.length > 50 ? msgLine2Txt : ''
    showModal(true, 'Der Bericht wird aufgebaut...', msgLine2)
  }, [
    geschaefteFilteredAndSorted.length,
    pages.length,
    showModal,
    remainingGeschaefte.length,
  ])

  const rowsContainer = useRef(null)

  useEffect(() => {
    /**
     * - measure height of pageSize-component
     * - if > desired page height:
     *  - move last row to next page
     *  - render
     * - else:
     *  - insert next row
     *  - render
     */

    // for some reason need to wait
    // maybe for filtering to have happended?
    setTimeout(() => {
      // don't do anything on not active pages
      if (pageIndex === activePageIndex) {
        const offsetHeight = rowsContainer
          ? rowsContainer.current.offsetHeight
          : null
        const scrollHeight = rowsContainer
          ? rowsContainer.current.scrollHeight
          : null
        const activePageIsFull = pages[pageIndex].full

        if (!activePageIsFull && remainingGeschaefte.length > 0) {
          if (offsetHeight < scrollHeight) {
            moveGeschaeftToNewPage(activePageIndex)
            showPagesModal()
          } else {
            addGeschaeft()
          }
        }
        if (remainingGeschaefte.length === 0) {
          if (offsetHeight < scrollHeight) {
            moveGeschaeftToNewPage(activePageIndex)
            showPagesModal()
          } else {
            // for unknown reason setTimeout is needed
            setTimeout(() => {
              showModal(false, '', '')
              finishedBuilding()
            })
          }
        }
      }
    })
  }, [
    activePageIndex,
    addGeschaeft,
    finishedBuilding,
    moveGeschaeftToNewPage,
    pageIndex,
    pages,
    remainingGeschaefte.length,
    showModal,
    showPagesModal,
  ])

  return (
    <PageContainer building={building}>
      <InnerPageContainer>
        <StyledRowsContainer building={building} ref={rowsContainer}>
          {firstPage && (
            <img
              src={logoImg}
              height="70"
              style={{ marginBottom: 15 }}
              alt="Logo"
            />
          )}
          <PageTitle firstPage={firstPage} />
          {firstPage && (
            <>
              <StyledFilterCriteria>
                Filterkriterien:{' '}
                {filterCriteriaToArrayOfStrings(filterFields).join(' & ')}
              </StyledFilterCriteria>
              <StyledSortCriteria>
                Sortierkriterien:{' '}
                {sortCriteriaToArrayOfStrings(sortFields).join(' & ')}
              </StyledSortCriteria>
            </>
          )}
          {reportType === 'typFaelligeGeschaefte' && (
            <FaelligeGeschaefteHeader />
          )}
          {(reportType === 'angekVernehml' ||
            reportType === 'laufendeVernehml') && <VernehmlassungenHeader />}
          {reportType === 'list1' && <List1Header />}
          {reportType === 'typFaelligeGeschaefte' && (
            <FaelligeGeschaefteRows geschaefte={geschaefte} />
          )}
          {reportType === 'angekVernehml' && (
            <VernehmlassungenRows geschaefte={geschaefte} />
          )}
          {reportType === 'laufendeVernehml' && (
            <VernehmlassungenRows geschaefte={geschaefte} />
          )}
          {reportType === 'list1' && <List1Rows geschaefte={geschaefte} />}
        </StyledRowsContainer>
        <StyledFooter>
          <div>{moment().format('DD.MM.YYYY')}</div>
          <div>
            Seite {pageIndex + 1}/{pages.length}
          </div>
        </StyledFooter>
      </InnerPageContainer>
    </PageContainer>
  )
}

export default observer(Page)
