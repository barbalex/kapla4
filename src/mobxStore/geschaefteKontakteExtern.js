import { extendObservable } from 'mobx'

import geschaefteKontakteExternStandardState from '../src/geschaefteKontakteExternStandardState'

const geschaefteKontakteExtern = {}
extendObservable(geschaefteKontakteExtern, geschaefteKontakteExternStandardState)

export default geschaefteKontakteExtern
