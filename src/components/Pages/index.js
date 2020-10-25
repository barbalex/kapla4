import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled, { createGlobalStyle } from 'styled-components'

import Page from './Page'
import storeContext from '../../storeContext'

// https://github.com/twbs/bootstrap/issues/25629#issuecomment-606619398
// this is to counter a hack in bootstrap v4
// should not be necessary when using bootstrap v5
const GlobalStyle = createGlobalStyle`
  @page {
    size: auto;
  }
`
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
  height: calc(100vh - 61px);

  @media print {
    /* remove grey backgrond set for nice UI */
    background-color: #fff;
    /* with overflow auto an empty page is inserted between each page */
    overflow-y: visible !important;
    /* make sure body grows as needed */
    height: auto !important;
  }
`

const Pages = () => {
  const store = useContext(storeContext)

  return (
    <>
      <GlobalStyle />
      <Container className="printer-content">
        {store.pages.pages.map((page, pageIndex) => (
          <Page key={pageIndex} pageIndex={pageIndex} />
        ))}
      </Container>
    </>
  )
}

export default observer(Pages)
