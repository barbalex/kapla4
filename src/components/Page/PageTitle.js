import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormControl } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

const Container = styled.div`
  @media print {
    page-break-before: avoid !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }
`
const StyledTitleInput = styled(FormControl)`
  margin-top: 3px;
  margin-bottom: 7px;
`
const StyledTitle = styled.div`
  cursor: pointer;
  margin-top: 0;
  font-weight: 700;
  font-size: 32px;
  padding-left: 5px;

  @media print {
    page-break-before: avoid !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onClickH1: props => () => props.store.pagesQueryTitle(true),
    onKeyPressTitle: props => e => {
      const { pagesQueryTitle } = props.store
      const { title } = props.store.pages
      if (e.key === 'Enter' && title) {
        pagesQueryTitle(false)
      }
    },
    onBlurTitle: props => () => {
      const { pagesQueryTitle } = props.store
      const { title } = props.store.pages
      if (title) pagesQueryTitle(false)
    },
    changeQueryTitle: props => e => props.store.pagesSetTitle(e.target.value),
  }),
  observer,
)

const Page = ({ store, firstPage, onClickH1, onKeyPressTitle, onBlurTitle, changeQueryTitle }) => (
  <Container>
    {firstPage &&
      store.pages.queryTitle && (
        <FormGroup>
          <StyledTitleInput
            type="text"
            value={store.pages.title}
            placeholder="Titel erfassen"
            onChange={changeQueryTitle}
            onKeyPress={onKeyPressTitle}
            onBlur={onBlurTitle}
            bsSize="large"
            autoFocus
          />
        </FormGroup>
      )}
    {firstPage &&
      !store.pages.queryTitle && (
        <StyledTitle // eslint-disable-line jsx-a11y/no-static-element-interactions
          onClick={onClickH1}
        >
          {store.pages.title}
        </StyledTitle>
      )}
  </Container>
)

Page.propTypes = {
  store: PropTypes.object.isRequired,
  firstPage: PropTypes.bool.isRequired,
  onClickH1: PropTypes.func.isRequired,
  onKeyPressTitle: PropTypes.func.isRequired,
  onBlurTitle: PropTypes.func.isRequired,
  changeQueryTitle: PropTypes.func.isRequired,
}

export default enhance(Page)
