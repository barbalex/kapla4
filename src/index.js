import React from 'react'
import { render } from 'react-dom'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import App from './components/App'
import { Provider as MobxProvider } from './mobxStoreContext'
import createGlobalStyle from './src/createGlobalStyle'

import mobxStore from './mobxStore'

registerLocale('de', de)
setDefaultLocale('de')

// make store accessible in dev
//window.mobxStore = mobxStore

const GlobalStyle = createGlobalStyle()

render(
  <MobxProvider value={mobxStore}>
    <>
      <GlobalStyle />
      <App />
    </>
  </MobxProvider>,
  document.getElementById('root'),
)
