import React, { useContext } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import storeContext from '../storeContext'

const ModalGeschaeftDelete = () => {
  const store = useContext(storeContext)
  const { geschaeftRemove, geschaeftRemoveDeleteIntended } = store
  const { activeId } = store.geschaefte

  return (
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>Geschäft löschen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Möchten Sie das Geschäft Nr. {activeId} wirklich löschen?
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={geschaeftRemoveDeleteIntended}>Nein</Button>
        <Button bsStyle="primary" onClick={() => geschaeftRemove(activeId)}>
          Ja
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  )
}

export default observer(ModalGeschaeftDelete)
