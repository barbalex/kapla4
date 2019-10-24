import React from 'react'
import { render } from 'react-dom'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import App from './components/App'
import { Provider as MobxProvider } from './storeContext'
import { Provider as MstProvider } from './storeContext'
import createGlobalStyle from './src/createGlobalStyle'
import mobxStore from './mobxStore'
import createStore from './store'
const store = createStore().create()

console.log('index.js', { store, mobxStore })

registerLocale('de', de)
setDefaultLocale('de')

// make store accessible in dev
window.mobxStore = mobxStore
window.store = store

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
