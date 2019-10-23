import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import GeschaefteLayout from './GeschaefteLayout'
import FilterFieldsLayout from './FilterFieldsLayout'
import TableLayout from './TableLayout'
import Navbar from './Navbar'
import Errors from './Errors'
import mobxStoreContext from '../mobxStoreContext'

const Container = styled.div`
  height: 100vh;
`

const App = () => {
  const store = useContext(mobxStoreContext)
  const { pathname } = store.history.location
  const showGeschaefteLayout = [
    '/geschaefte',
    '/pages',
    '/geschaeftPdf',
  ].includes(pathname)
  const showFilterFieldsLayout = pathname === '/filterFields'
  const showTableLayout = pathname === '/table'

  return (
    <Container>
      <Navbar />
      {showGeschaefteLayout && <GeschaefteLayout />}
      {showFilterFieldsLayout && <FilterFieldsLayout />}
      {showTableLayout && <TableLayout />}
      <Errors />
    </Container>
  )
}

export default observer(App)
