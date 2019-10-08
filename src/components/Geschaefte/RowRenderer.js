import React from 'react'
import PropTypes from 'prop-types'

import GeschaefteItem from './GeschaefteItem'

const RowRenderer = ({ key, index, style }) => (
  <div key={key} style={style}>
    <GeschaefteItem index={index} />
  </div>
)

RowRenderer.propTypes = {
  key: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
}

export default RowRenderer
