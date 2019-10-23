import React from 'react'

import Row from './Row'

const List1Rows = ({ geschaefte }) =>
  geschaefte.map((geschaeft, index) => (
    <Row geschaeft={geschaeft} key={geschaeft.idGeschaeft} rowIndex={index} />
  ))

export default List1Rows
