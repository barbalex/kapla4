import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

const StyledNoRowsDiv = styled.div`
  padding: 10px;
  font-weight: bold;
`

const enhance = compose(inject('store'), observer)

const NoRowsRenderer = ({ store }) => {
  const { filterFields, filterFulltext, geschaefte } = store.geschaefte
  const isFiltered = geschaefte.length > 0 && (filterFields.length > 0 || !!filterFulltext)
  const text = isFiltered ? 'Keine Daten entsprechen dem Filter' : 'lade Daten...'
  return <StyledNoRowsDiv>{text}</StyledNoRowsDiv>
}

NoRowsRenderer.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(NoRowsRenderer)
