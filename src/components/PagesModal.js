import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

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

const enhance = compose(
  inject('store'),
  observer
)

const PagesModal = ({ store }) => {
  const { pagesStop } = store
  const { modalTextLine1, modalTextLine2 } = store.pages

  return (
    <Modal.Dialog
      bsSize={modalTextLine2 ? 'large' : 'small'}
    >
      <Body>
        <div>
          <P>
            {modalTextLine1}
          </P>
          {
            modalTextLine2 &&
            <P>
              {modalTextLine2}
            </P>
          }
        </div>
        <RightDiv>
          <Button onClick={pagesStop}>
            Abbrechen
          </Button>
        </RightDiv>
      </Body>
    </Modal.Dialog>
  )
}

PagesModal.displayName = 'PagesModal'

PagesModal.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(PagesModal)
