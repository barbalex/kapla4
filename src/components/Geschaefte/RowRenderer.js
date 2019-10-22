import React from 'react'

import GeschaefteItem from './GeschaefteItem'

const RowRenderer = ({ key, index, style }) => (
  <div key={key} style={style}>
    <GeschaefteItem index={index} />
  </div>
)

export default RowRenderer
