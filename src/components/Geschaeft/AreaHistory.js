import React, { useContext } from 'react'
import { FormControl, ControlLabel } from 'react-bootstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import AreaHistoryRows from './AreaHistoryRows'
import mobxStoreContext from '../../mobxStoreContext'

// eslint-disable-next-line no-unused-vars
const Container = styled.div`
  grid-area: areaHistory;
  background-color: rgb(227, 232, 255);
  display: grid;
  grid-template-columns: calc(100% - 156px) 70px 70px;
  grid-template-areas:
    'areaHistoryTitle labelVorgeschaeft fieldVorgeschaeft'
    'areaHistoryFieldsContainer areaHistoryFieldsContainer areaHistoryFieldsContainer';
  grid-column-gap: 8px;
  grid-row-gap: ${props => (props['data-ispdf'] ? '1px' : '8px')};
  padding: 8px;
  border: ${props => (props['data-ispdf'] ? '1px solid #CCC' : 'inherit')};
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaHistoryTitle;
`
const FieldVorgeschaeft = styled.div`
  grid-area: fieldVorgeschaeft;
`
// eslint-disable-next-line no-unused-vars
const LabelVorgeschaeft = styled(ControlLabel)`
  grid-area: labelVorgeschaeft;
  margin-top: ${props => (props['data-ispdf'] ? 0 : '10px')};
  text-align: right;
`

const AreaHistory = ({ blur, change }) => {
  const store = useContext(mobxStoreContext)
  const {
    activeId,
    geschaeftePlusFilteredAndSorted: geschaefte,
  } = store.geschaefte
  const path = store.history.location.pathname
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}
  const isPdf = path === '/geschaeftPdf'

  return (
    <Container data-ispdf={isPdf}>
      <Title>Historie</Title>
      <LabelVorgeschaeft data-ispdf={isPdf}>Vorgeschäft</LabelVorgeschaeft>
      <FieldVorgeschaeft>
        <FormControl
          type="number"
          value={
            geschaeft && geschaeft.idVorgeschaeft
              ? geschaeft.idVorgeschaeft
              : ''
          }
          name="idVorgeschaeft"
          onChange={change}
          onBlur={blur}
          bsSize="small"
          placeholder={isPdf ? null : 'ID'}
          tabIndex={99} // eslint-disable-line
        />
      </FieldVorgeschaeft>
      <AreaHistoryRows />
    </Container>
  )
}

export default observer(AreaHistory)
