import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'

const StyledP = styled.p`
  text-align: center;
  margin-top: 8px;
`

const enhance = compose(inject('store'), observer)

const ModalMessage = ({ store }) => {
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

ModalMessage.displayName = 'ModalMessage'

ModalMessage.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(ModalMessage)
