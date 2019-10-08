import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'

import Page from './Page'

const Container = styled.div`
  background-color: #eee;
  font-size: 9pt;
  cursor: default;
  /*
  * need defined height and overflow
  * to make the pages scrollable in UI
  * is removed in print
  */
  overflow-y: auto;
  height: 100vh;

  @media print {
    /* remove grey backgrond set for nice UI */
    background-color: #fff;
    /* with overflow auto an empty page is inserted between each page */
    overflow-y: visible !important;
    /* make sure body grows as needed */
    height: auto !important;

    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`

const enhance = compose(inject('store'), observer)

const Pages = ({ store }) => (
  <Container>{store.pages.pages.map((page, pageIndex) => <Page key={pageIndex} pageIndex={pageIndex} />)}</Container>
)

Pages.displayName = 'Pages'

Pages.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Pages)
