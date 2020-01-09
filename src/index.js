import React from 'react'
import { render } from 'react-dom'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import App from './components/App'
import { Provider as MstProvider } from './storeContext'
import createStore from './store'
import './styles.css'
import getDb from './src/getDb'
import fetchInitialData from './src/fetchInitialData'

const run = async () => {

const store = createStore().create()

let db
try {
  db = await getDb(store)
} catch (error) {
  store.addErrorMessage(error.message)
}
store.app.setDb(db)
fetchInitialData(store)

registerLocale('de', de)
setDefaultLocale('de')

// make store accessible in dev
window.store = store

render(
  <MstProvider value={store}>
    <App />
  </MstProvider>,
  document.getElementById('root'),
)}

run()
