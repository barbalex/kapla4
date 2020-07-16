import React, { useContext, useCallback } from 'react'
import Dropzone from 'react-dropzone'
import { FaRegTimesCircle } from 'react-icons/fa'
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
  border: thin solid #ccc;
  border-bottom: none;
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
const DropzoneContainer = styled.div`
  grid-area: dropzone;
  width: 100%;
  height: 100%;
  display: ${(props) => (props['data-ispdf'] ? 'none' : 'block')};
`
const StyledDropzone = styled(Dropzone)`
  width: 100%;
  height: 100%;
  border-color: transparent;
`
const DropzoneInnerDiv = styled.div`
  width: 100%;
  height: 100%;
  border-width: 2px;
  border-color: #666;
  border-style: dashed;
  border-radius: 5px;
  padding: 5px;
`

const AreaLinks = () => {
  const store = useContext(storeContext)
  const location = store.location.toJSON()
  const activeLocation = location[0]
  const { linkNewCreate } = store
  const { activeId, links } = store.geschaefte
  const myLinks = links.filter((l) => l.idGeschaeft === activeId)
  const isPdf = activeLocation === 'geschaeftPdf'

  const onDrop = useCallback(
    (files) => linkNewCreate(activeId, files[0].path),
    [activeId, linkNewCreate],
  )

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
        <DropzoneContainer data-ispdf={isPdf}>
          <StyledDropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
              if (isDragActive) {
                return (
                  <DropzoneInnerDiv {...getRootProps()}>
                    <div>jetzt fallen lassen...</div>
                  </DropzoneInnerDiv>
                )
              }
              if (isDragReject) {
                return (
                  <DropzoneInnerDiv {...getRootProps()}>
                    <div>Hm. Da ging etwas schief :-(</div>
                  </DropzoneInnerDiv>
                )
              }
              return (
                <DropzoneInnerDiv {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div>Datei hierhin ziehen...</div>
                  <div>...oder klicken, um sie zu wählen.</div>
                </DropzoneInnerDiv>
              )
            }}
          </StyledDropzone>
        </DropzoneContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AreaLinks)
