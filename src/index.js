import React from 'react'
import { render } from 'react-dom'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import App from './components/App'
import { Provider as MobxProvider } from './storeContext'
import createGlobalStyle from './src/createGlobalStyle'

import store from './store'

registerLocale('de', de)
setDefaultLocale('de')

// make store accessible in dev
//window.store = store

const GlobalStyle = createGlobalStyle()

render(
  <MobxProvider value={store}>
    <>
      <GlobalStyle />
      <App />
    </>
  </MobxProvider>,
  document.getElementById('root'),
)
