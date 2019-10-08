import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled, { createGlobalStyle } from 'styled-components'

import FaelligeGeschaefteHeader from './faelligeGeschaefte/Header'
import FaelligeGeschaefteRows from './faelligeGeschaefte/Rows'
import VernehmlassungenHeader from './vernehmlassungen/Header'
import VernehmlassungenRows from './vernehmlassungen/Rows'
import List1Header from './list1/Header'
import List1Rows from './list1/Rows'
import filterCriteriaToArrayOfStrings from '../../src/filterCriteriaToArrayOfStrings'
import sortCriteriaToArrayOfStrings from '../../src/sortCriteriaToArrayOfStrings'
import logoImg from '../../etc/logo.png'
import PageTitle from './PageTitle'

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
  overflow-y: ${props => (props.building ? 'auto' : 'hidden')};
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
// eslint-disable-next-line no-unused-expressions
const GlobalStyle = createGlobalStyle`
  @page .querformat {
    size: A4 landscape;
  }
`

const enhance = compose(
  inject('store'),
  observer,
)

class Page extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    pageIndex: PropTypes.number.isRequired,
  }

  componentDidMount = () => {
    this.showPagesModal()
    // wait with next stepp until message is shown
    setTimeout(() => {
      this.nextStepp()
    }, 100)
  }

  componentDidUpdate = () => {
    const { reportType } = this.props.store.pages
    if (
      ['typFaelligeGeschaefte', 'angekVernehml', 'laufendeVernehml'].includes(
        reportType,
      )
    ) {
      // need to wait for next tick
      // otherwise in vernehmlassungen
      // some rows were only listed on second call
      setTimeout(() => this.nextStepp())
    } else {
      this.nextStepp()
    }
  }

  showPagesModal = () => {
    const { store } = this.props
    const { pagesModalShow } = store
    const { pages, remainingGeschaefte } = store.pages
    const { geschaeftePlusFilteredAndSorted } = store.geschaefte
    const msgLine2Txt = `Bisher ${pages.length} Seiten, ${
      remainingGeschaefte.length
    } Geschäfte noch zu verarbeiten`
    const msgLine2 =
      geschaeftePlusFilteredAndSorted.length > 50 ? msgLine2Txt : ''
    pagesModalShow(true, 'Der Bericht wird aufgebaut...', msgLine2)
  }

  nextStepp = () => {
    /**
     * - measure height of pageSize-component
     * - if > desired page height:
     *  - move last row to next page
     *  - render
     * - else:
     *  - insert next row
     *  - render
     */
    const { store, pageIndex } = this.props
    const {
      pageAddGeschaeft,
      pagesMoveGeschaeftToNewPage,
      pagesFinishedBuilding,
      pagesModalShow,
    } = store
    const { pages, activePageIndex, remainingGeschaefte } = store.pages

    // don't do anything on not active pages
    if (pageIndex === activePageIndex) {
      const rowsContainerPageIndex = this[`rowsContainer${pageIndex}`]
      const offsetHeight = rowsContainerPageIndex
        ? rowsContainerPageIndex.offsetHeight
        : null
      const scrollHeight = rowsContainerPageIndex
        ? rowsContainerPageIndex.scrollHeight
        : null
      const activePageIsFull = pages[pageIndex].full

      if (!activePageIsFull && remainingGeschaefte.length > 0) {
        if (offsetHeight < scrollHeight) {
          pagesMoveGeschaeftToNewPage(activePageIndex)
          this.showPagesModal()
        } else {
          pageAddGeschaeft()
        }
      }
      if (remainingGeschaefte.length === 0) {
        if (offsetHeight < scrollHeight) {
          pagesMoveGeschaeftToNewPage(activePageIndex)
          this.showPagesModal()
        } else {
          // for unknown reason setTimeout is needed
          setTimeout(() => {
            pagesModalShow(false, '', '')
            pagesFinishedBuilding()
          })
        }
      }
    }
  }

  tableRows = () => {
    const { store, pageIndex } = this.props
    const { reportType, pages } = store.pages
    const geschaefte = pages[pageIndex].geschaefte
    if (!geschaefte) return null

    return geschaefte.map((geschaeft, index) => {
      /**
       * for unknown reason in bericht "laufende Vernehmlassungen"
       * an undefined geschaeft exists
       * return null to prevent error
       */
      if (!geschaeft) return null
      if (reportType === 'typFaelligeGeschaefte') {
        return (
          <FaelligeGeschaefteRows
            geschaeft={geschaeft}
            key={geschaeft.idGeschaeft}
            rowIndex={index}
          />
        )
      }
      if (reportType === 'angekVernehml' || reportType === 'laufendeVernehml') {
        return (
          <VernehmlassungenRows
            geschaeft={geschaeft}
            key={geschaeft.idGeschaeft}
            rowIndex={index}
          />
        )
      }
      if (reportType === 'list1') {
        return (
          <List1Rows
            geschaeft={geschaeft}
            key={geschaeft.idGeschaeft}
            rowIndex={index}
          />
        )
      }
      return null
    })
  }

  render() {
    const { store, pageIndex } = this.props
    const { pages, building, reportType } = store.pages
    const { filterFields, sortFields } = store.geschaefte
    const firstPage = pageIndex === 0

    return (
      <PageContainer building={building} className="querformat">
        <GlobalStyle />
        <InnerPageContainer>
          <StyledRowsContainer
            building={building}
            ref={c => {
              this[`rowsContainer${pageIndex}`] = c
            }}
          >
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
              <StyledFilterCriteria>
                Filterkriterien:{' '}
                {filterCriteriaToArrayOfStrings(filterFields).join(' & ')}
              </StyledFilterCriteria>
            )}
            {firstPage && (
              <StyledSortCriteria>
                Sortierkriterien:{' '}
                {sortCriteriaToArrayOfStrings(sortFields).join(' & ')}
              </StyledSortCriteria>
            )}
            {reportType === 'typFaelligeGeschaefte' && (
              <FaelligeGeschaefteHeader />
            )}
            {(reportType === 'angekVernehml' ||
              reportType === 'laufendeVernehml') && <VernehmlassungenHeader />}
            {reportType === 'list1' && <List1Header />}
            {this.tableRows()}
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
}

export default enhance(Page)
