import React from 'react'

export default values => {
  if (!values) return []
  const options = values.map((val, index) => (
    <option key={index + 1} value={val}>
      {val}
    </option>
  ))
  options.unshift(<option key={0} value="" />)
  return options
}
