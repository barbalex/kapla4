import React, { Component, useContext } from 'react'
import PropTypes from 'prop-types'
import { AutoSizer, List } from 'react-virtualized'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import RowRenderer from './RowRenderer'
import NoRowsRenderer from './NoRowsRenderer'
import storeContext from '../../storeContext'

const Container = styled.div`
  background-image: linear-gradient(
    45deg,
    rgba(235, 255, 229, 0.5) 10%,
    rgba(216, 255, 200, 0.7)
  );
  height: 100vh;
`
const StyledTable = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  -webkit-user-select: none;
`
const StyledHeader = styled.div`
  border-bottom: 2px solid #717171;
  font-weight: 700;
`
const StyledRow = styled.div`
  display: flex;
  padding: 5px;
  padding-right: ${props => (props['data-overflowing'] ? '17px' : '5px')};
`
const StyledId = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 44px;
  max-width: 44px;
`
const StyledGegenstand = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
`
const StyledStatus = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 120px;
  max-width: 120px;
`
const StyledKontakt = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 100px;
  max-width: 100px;
`
const StyledBody = styled.div`
  height: calc(100vh - 82px);
  overflow: hidden;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onChange: props => size =>
      props.store.configSetKey('geschaefteColumnWidth', size),
  }),
  observer,
)

/**
 * need to keep this as es6 class
 * at least: after refactoring to a functional component
 * the row renderer rendered no rows any more :-(
 */
class Geschaefte extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  render() {
    const { store } = this.props
    const { setGeschaefteListOverflowing } = store
    const { geschaefteListOverflowing } = store.ui
    const {
      activeId,
      geschaeftePlusFilteredAndSorted: geschaefte,
    } = store.geschaefte
    // get index of active id
    const indexOfActiveId = _.findIndex(
      geschaefte,
      g => g.idGeschaeft === activeId,
    )

    return (
      <Container>
        <StyledTable>
          <StyledHeader>
            <StyledRow data-overflowing={geschaefteListOverflowing}>
              <StyledId>ID</StyledId>
              <StyledGegenstand>Gegenstand</StyledGegenstand>
              <StyledStatus>Status</StyledStatus>
              <StyledKontakt>Verantwortlich</StyledKontakt>
            </StyledRow>
          </StyledHeader>
          <StyledBody
            ref={c => {
              this.tableBody = c
            }}
          >
            <AutoSizer>
              {({ height, width }) => {
                const overflowing = height < geschaefte.length * 77
                // need to setTimeout because changing state in render
                // is a no go
                setTimeout(() => setGeschaefteListOverflowing(overflowing))
                return (
                  <List
                    height={height}
                    rowCount={geschaefte.length}
                    rowHeight={77}
                    rowRenderer={RowRenderer}
                    noRowsRenderer={() => <NoRowsRenderer />}
                    width={width}
                    scrollToIndex={indexOfActiveId}
                    ref={c => {
                      this.reactList = c
                    }}
                    {...geschaefte}
                  />
                )
              }}
            </AutoSizer>
          </StyledBody>
        </StyledTable>
      </Container>
    )
  }
}

export default enhance(Geschaefte)
