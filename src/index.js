import React from 'react'
import { render } from 'react-dom'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import App from './components/App'
import { Provider as MstProvider } from './storeContext'
import createGlobalStyle from './src/createGlobalStyle'
import createStore from './store'
const store = createStore().create()

registerLocale('de', de)
setDefaultLocale('de')

// make store accessible in dev
window.store = store

const GlobalStyle = createGlobalStyle()

render(
  <MstProvider value={store}>
    <>
      <GlobalStyle />
      <App />
    </>
  </MstProvider>,
  document.getElementById('root'),
)
