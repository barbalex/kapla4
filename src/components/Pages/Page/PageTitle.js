import React, { useContext, useCallback } from 'react'
import { FormGroup, Input } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import storeContext from '../../../storeContext'

const Container = styled.div`
  @media print {
    page-break-before: avoid !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }
`
const StyledTitleInput = styled(Input)`
  margin-top: 3px;
  margin-bottom: 7px;
`
const StyledTitle = styled.div`
  cursor: pointer;
  font-weight: 700;
  font-size: 32px;
  padding-left: 5px;
  height: 56px;
  margin-top: -10px;

  @media print {
    page-break-before: avoid !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }
`

const Page = ({ firstPage }) => {
  const store = useContext(storeContext)
  const { queryTitle, title, pagesQueryTitle, setTitle } = store.pages

  const onClickH1 = useCallback(() => pagesQueryTitle(true), [pagesQueryTitle])
  const onKeyPressTitle = useCallback(
    (e) => {
      if (e.key === 'Enter' && title) {
        pagesQueryTitle(false)
      }
    },
    [pagesQueryTitle, title],
  )
  const onBlurTitle = useCallback(() => {
    if (title) pagesQueryTitle(false)
  }, [pagesQueryTitle, title])
  const changeQueryTitle = useCallback((e) => setTitle(e.target.value), [
    setTitle,
  ])

  return (
    <Container>
      {firstPage && queryTitle && (
        <FormGroup>
          <StyledTitleInput
            type="text"
            value={title}
            placeholder="Titel erfassen"
            onChange={changeQueryTitle}
            onKeyPress={onKeyPressTitle}
            onBlur={onBlurTitle}
            size="lg"
            autoFocus
          />
        </FormGroup>
      )}
      {firstPage && !queryTitle && (
        <StyledTitle onClick={onClickH1}>{title}</StyledTitle>
      )}
    </Container>
  )
}

export default observer(Page)
