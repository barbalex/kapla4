import React, { useContext } from 'react'
import { Modal, Button } from 'react-bootstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../storeContext'

const Body = styled(Modal.Body)`
  display: flex;
  justify-content: center;
  align-items: center;
`
const RightDiv = styled.div`
  padding-left: 30px;
`
const P = styled.p`
  text-align: center;
  margin-top: 3px;
  margin-bottom: 3px;
`

const PagesModal = () => {
  const store = useContext(storeContext)
  const { modalTextLine1, modalTextLine2, stop } = store.pages

  return (
    <Modal.Dialog bsSize={modalTextLine2 ? 'large' : 'small'}>
      <Body>
        <div>
          <P>{modalTextLine1}</P>
          {modalTextLine2 && <P>{modalTextLine2}</P>}
        </div>
        <RightDiv>
          <Button onClick={stop}>Abbrechen</Button>
        </RightDiv>
      </Body>
    </Modal.Dialog>
  )
}

export default observer(PagesModal)
