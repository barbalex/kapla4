import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import { Glyphicon } from 'react-bootstrap'
import { shell } from 'electron'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

const Container = styled.div`
  grid-area: areaLinks;
  background-color: ${props =>
    props['data-ispdf'] ? 'rgb(227, 232, 255)' : '#e3fff0'};
  display: grid;
  grid-template-columns: ${props =>
    props['data-ispdf'] ? '100%' : 'calc(100% - 308px) 300px'};
  grid-template-areas: ${props =>
    props['data-ispdf']
      ? "'title' 'links'"
      : "'title dropzone' 'links dropzone'"};
  grid-column-gap: 8px;
  grid-row-gap: ${props => (props['data-ispdf'] ? '1px' : '8px')};
  padding: 8px;
  border: ${props => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: title;
`
const Links = styled.div`
  grid-area: links;
  display: ${props => (props['data-ispdf'] ? 'grid' : 'block')};
  grid-template-columns: ${props => (props['data-ispdf'] ? '100%' : 'none')};
`
const Field = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: calc(100% - 20px) 20px;
  grid-gap: 0;
  border-bottom: thin solid #cecbcb;
  padding: 3px;
  align-items: center;
  min-height: ${props => (props['data-ispdf'] ? 0 : '35px')};
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
const RemoveGlyphiconDiv = styled.div`
  grid-column: 2 / span 1;
  margin-top: -2px;
  display: ${props => (props['data-ispdf'] ? 'none' : 'block')};
`
const RemoveGlyphicon = styled(Glyphicon)`
  color: red;
  font-size: 18px;
  cursor: pointer;
  display: ${props => (props['data-ispdf'] ? 'none' : 'block')};
`
const DropzoneContainer = styled.div`
  grid-area: dropzone;
  width: 100%;
  height: 100%;
  display: ${props => (props['data-ispdf'] ? 'none' : 'block')};
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

const enhance = compose(
  inject('store'),
  withHandlers({
    onDrop: props => files => {
      const { store } = props
      const { linkNewCreate } = store
      const { activeId } = store.geschaefte
      linkNewCreate(activeId, files[0].path)
    },
  }),
  observer,
)

const AreaLinks = ({ store, onDrop }) => {
  const { linkRemove } = store
  const { activeId, links } = store.geschaefte
  const myLinks = links.filter(l => l.idGeschaeft === activeId)
  const path = store.history.location.pathname
  const isPdf = path === '/geschaeftPdf'

  return (
    <Container data-ispdf={isPdf}>
      <Title>Links</Title>
      <Links data-ispdf={isPdf}>
        {myLinks.map(link => (
          <Field key={`${link.idGeschaeft}${link.url}`} data-ispdf={isPdf}>
            <UrlDiv>
              <a
                href={link.url}
                onClick={event => {
                  event.preventDefault()
                  shell.openItem(link.url)
                }}
              >
                {link.url}
              </a>
            </UrlDiv>
            <RemoveGlyphiconDiv data-ispdf={isPdf}>
              <RemoveGlyphicon
                glyph="remove-circle"
                onClick={() => linkRemove(activeId, link.url)}
                title="Link entfernen"
              />
            </RemoveGlyphiconDiv>
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
  )
}

AreaLinks.displayName = 'AreaLinks'

AreaLinks.propTypes = {
  store: PropTypes.object.isRequired,
  onDrop: PropTypes.func.isRequired,
}

export default enhance(AreaLinks)
