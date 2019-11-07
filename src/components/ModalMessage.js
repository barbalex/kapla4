import React, { useContext } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import storeContext from '../storeContext'

const StyledP = styled.p`
  text-align: center;
  margin-top: 8px;
`

const ModalMessage = () => {
  const store = useContext(storeContext)
  const { messageTextLine1, messageTextLine2 } = store.app

  return (
    <Modal isOpen={true} size={messageTextLine2 ? 'lg' : 'sm'}>
      <ModalBody>
        <StyledP>{messageTextLine1}</StyledP>
        {messageTextLine2 && <StyledP>{messageTextLine2}</StyledP>}
      </ModalBody>
    </Modal>
  )
}

export default observer(ModalMessage)
