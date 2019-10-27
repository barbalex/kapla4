import { types } from 'mobx-state-tree'

import Interne from './Interne'
import Externe from './Externe'
import Aktenstandort from './Aktenstandort'
import Geschaeftsart from './Geschaeftsart'
import ParlVorstossTyp from './ParlVorstossTyp'
import RechtsmittelInstanz from './RechtsmittelInstanz'
import RechtsmittelErledigung from './RechtsmittelErledigung'
import Status from './Status'

export default types
  .model('TableRows', {
    interne: types.array(Interne),
    externe: types.array(Externe),
    aktenstandort: types.array(Aktenstandort),
    geschaeftsart: types.array(Geschaeftsart),
    parlVorstossTyp: types.array(ParlVorstossTyp),
    rechtsmittelInstanz: types.array(RechtsmittelInstanz),
    rechtsmittelErledigung: types.array(RechtsmittelErledigung),
    status: types.array(Status),
  })
  .actions(self => ({
    setRows(table, rows) {
      self[table] = rows
    },
  }))
