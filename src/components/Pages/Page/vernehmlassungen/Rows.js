import React from 'react'

import Row from './Row'

const VernehmlassungenRows = ({ geschaefte }) =>
  geschaefte.map((geschaeft, index) => (
    <Row geschaeft={geschaeft} key={geschaeft.idGeschaeft} rowIndex={index} />
  ))

export default VernehmlassungenRows
