import React from 'react'
import { render } from 'react-dom'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import App from './components/App'
import { Provider as MstProvider } from './storeContext'
import createStore from './store'
import './styles.css'
const store = createStore().create()
store.app.config.get()

registerLocale('de', de)
setDefaultLocale('de')

// make store accessible in dev
window.store = store

render(
  <MstProvider value={store}>
    <App />
  </MstProvider>,
  document.getElementById('root'),
)
