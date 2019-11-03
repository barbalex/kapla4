import React, { useContext, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Input } from 'reactstrap'
import styled from 'styled-components'

import storeContext from '../../storeContext'

const StyledInput = styled(Input)`
  min-height: 32px;
`

const GekoNrField = ({ idGeschaeft, gekoNr: gekoNrPassed, tabsToAdd }) => {
  const store = useContext(storeContext)
  const { gekoRemove, gekoNewCreate } = store

  const [gekoNr, setGekoNr] = useState(gekoNrPassed)
  const [oldGekoNr, setOldGekoNr] = useState(gekoNrPassed)

  useEffect(() => {
    setOldGekoNr(gekoNrPassed)
  }, [gekoNrPassed, idGeschaeft])

  const onChange = useCallback(e => setGekoNr(e.target.value), [])
  const onBlur = useCallback(() => {
    // need old value
    if (gekoNr && oldGekoNr && gekoNr !== oldGekoNr) {
      gekoRemove(idGeschaeft, oldGekoNr)
      gekoNewCreate(idGeschaeft, gekoNr)
    } else if (gekoNr && !oldGekoNr) {
      gekoNewCreate(idGeschaeft, gekoNr)
      setGekoNr('')
    } else if (!gekoNr && oldGekoNr) {
      gekoRemove(idGeschaeft, oldGekoNr)
    }
  }, [gekoNewCreate, gekoNr, gekoRemove, idGeschaeft, oldGekoNr])

  return (
    <StyledInput
      type="text"
      value={gekoNr}
      onChange={onChange}
      onBlur={onBlur}
      tabIndex={1 + tabsToAdd}
    />
  )
}

export default observer(GekoNrField)
