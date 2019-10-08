import { extendObservable } from 'mobx'

import pagesStandardState from '../src/pagesStandardState'

const pages = {}
extendObservable(pages, pagesStandardState)

export default pages
