import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { getSnapshot } from 'mobx-state-tree'

import Page from './Page'
import storeContext from '../storeContext'

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

const Pages = () => {
  const store = useContext(storeContext)
  console.log('Pages, pages:', getSnapshot(store.pages.pages))

  return (
    <Container>
      {store.pages.pages.map((page, pageIndex) => (
        <Page key={pageIndex} pageIndex={pageIndex} />
      ))}
    </Container>
  )
}

export default observer(Pages)
