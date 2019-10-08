import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

const enhance = compose(
  inject('store'),
  observer
)

const ModalGeschaeftDelete = ({ store }) => {
  const { geschaeftRemove, geschaeftRemoveDeleteIntended } = store
  const { activeId } = store.geschaefte

  return (
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>
          Geschäft löschen
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Möchten Sie das Geschäft Nr. {activeId} wirklich löschen?
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={geschaeftRemoveDeleteIntended}
        >
          Nein
        </Button>
        <Button
          bsStyle="primary"
          onClick={() =>
            geschaeftRemove(activeId)
          }
        >
          Ja
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  )
}

ModalGeschaeftDelete.displayName = 'ModalGeschaeftDelete'

ModalGeschaeftDelete.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(ModalGeschaeftDelete)
