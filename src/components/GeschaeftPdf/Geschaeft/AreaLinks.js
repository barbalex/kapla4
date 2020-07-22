import React, { useContext } from 'react'
import { shell } from 'electron'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ErrorBoundary from '../../shared/ErrorBoundary'
import storeContext from '../../../storeContext'

const Container = styled.div`
  grid-area: areaLinks;
  background-color: rgb(227, 232, 255);
  display: grid;
  grid-template-columns: 100%;
  grid-template-areas: 'title' 'links';
  grid-column-gap: 8px;
  grid-row-gap: 1px;
  padding: 8px;
  border-top: thin solid #ccc;
  border-collapse: collapse;
  font-size: 10px;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: title;
`
const Links = styled.div`
  grid-area: links;
  display: grid;
  grid-template-columns: 100%;
`
const Field = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: calc(100% - 20px) 20px;
  grid-gap: 0;
  border-bottom: thin solid #cecbcb;
  padding: 3px;
  align-items: center;
  min-height: 0;
  &:first-of-type {
    border-top: thin solid #cecbcb;
  }
  &:hover {
    background-color: #ceffe5;
  }
`
const UrlDiv = styled.div`
  grid-column: 1 / span 1;
  grid-column: 1;
`

const AreaLinks = () => {
  const store = useContext(storeContext)
  const { activeId, links } = store.geschaefte
  const myLinks = links.filter((l) => l.idGeschaeft === activeId)

  return (
    <ErrorBoundary>
      <Container>
        <Title>Links</Title>
        <Links>
          {myLinks.map((link) => (
            <Field key={`${link.idGeschaeft}${link.url}`}>
              <UrlDiv>
                <a
                  href={link.url}
                  onClick={(event) => {
                    event.preventDefault()
                    shell.openPath(link.url)
                  }}
                >
                  {link.url}
                </a>
              </UrlDiv>
            </Field>
          ))}
        </Links>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaLinks)
