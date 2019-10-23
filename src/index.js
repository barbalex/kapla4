import React from 'react'
import { render } from 'react-dom'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import App from './components/App'
import { Provider as MobxProvider } from './mobxStoreContext'
import { Provider as MstProvider } from './storeContext'
import createGlobalStyle from './src/createGlobalStyle'

import mobxStore from './mobxStore'
import store from './store'

registerLocale('de', de)
setDefaultLocale('de')

// make store accessible in dev
//window.mobxStore = mobxStore

const GlobalStyle = createGlobalStyle()

render(
  <MobxProvider value={mobxStore}>
    <MstProvider value={store}>
      <>
        <GlobalStyle />
        <App />
      </>
    </MstProvider>
  </MobxProvider>,
  document.getElementById('root'),
)
