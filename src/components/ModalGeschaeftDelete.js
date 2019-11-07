import React, { useContext } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { observer } from 'mobx-react-lite'

import storeContext from '../storeContext'

const ModalGeschaeftDelete = () => {
  const store = useContext(storeContext)
  const {
    geschaeftDelete,
    geschaeftRemoveDeleteIntended,
    activeId,
    willDelete,
  } = store.geschaefte

  return (
    <Modal isOpen={willDelete} toggle={geschaeftRemoveDeleteIntended}>
      <ModalHeader>Geschäft löschen</ModalHeader>
      <ModalBody>
        Möchten Sie das Geschäft Nr. {activeId} wirklich löschen?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={geschaeftRemoveDeleteIntended}>
          Nein
        </Button>
        <Button color="primary" onClick={() => geschaeftDelete(activeId)}>
          Ja
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default observer(ModalGeschaeftDelete)
