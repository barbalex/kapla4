import React, { useContext } from 'react'
import { Modal } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import mobxStoreContext from '../mobxStoreContext'

const StyledP = styled.p`
  text-align: center;
  margin-top: 8px;
`

const ModalMessage = () => {
  const store = useContext(mobxStoreContext)
  const { messageTextLine1, messageTextLine2 } = store.app

  return (
    <Modal.Dialog bsSize={messageTextLine2 ? 'large' : 'small'}>
      <Modal.Body>
        <StyledP>{messageTextLine1}</StyledP>
        {messageTextLine2 && <StyledP>{messageTextLine2}</StyledP>}
      </Modal.Body>
    </Modal.Dialog>
  )
}

export default observer(ModalMessage)
