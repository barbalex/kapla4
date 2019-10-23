import { extendObservable } from 'mobx'

import geschaefteKontakteInternStandardState from '../src/geschaefteKontakteInternStandardState'

const geschaefteKontakteIntern = {}
extendObservable(geschaefteKontakteIntern, geschaefteKontakteInternStandardState)

export default geschaefteKontakteIntern
