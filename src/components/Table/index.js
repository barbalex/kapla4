import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, List } from 'react-virtualized';
import _ from 'lodash';
import $ from 'jquery';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import compose from 'recompose/compose';

import TableItem from './TableItem';

const Container = styled.div`
  background-image: linear-gradient(
    45deg,
    rgba(235, 255, 229, 0.5) 10%,
    rgba(216, 255, 200, 0.7)
  );
  height: 100vh;
`;
const StyledTable = styled.div`
  top: 52px;
  width: 100%;
`;
const StyledTableHeader = styled.div`
  border-bottom: 2px solid #717171;
  font-weight: 700;
`;
const StyledTableHeaderRow = styled.div`
  display: flex;
  padding: 5px;
  padding-right: ${props => props.paddingRight};
`;
const StyledTableHeaderCell = styled.div`
  flex: 1;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  max-width: ${props => `${props.maxWidth}px`};
`;
const StyledTableBody = styled.div`
  overflow: auto;
  height: calc(100vh - 82px);
`;
const StyledNoRowsDiv = styled.div`
  padding: 10px;
  font-weight: bold;
`;

const enhance = compose(
  inject('store'),
  observer
);

class Table extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  state = {
    tableBodyOverflows: true
  };

  componentDidUpdate = () => {
    /**
     * this only works in a setTimeout!
     * otherwise tableBody scrollHeight equals offsetHeight
     */
    setTimeout(() => this.setTableBodyOverflow(), 0);
  };

  componentWillUnmount = () => {
    const { tableReset } = this.props.store;
    tableReset();
  };

  setTableBodyOverflow = () => {
    const { tableBodyOverflows } = this.state;
    const overflows = this.doesTableBodyOverflow();
    if (overflows !== tableBodyOverflows) {
      this.setState({ tableBodyOverflows: !tableBodyOverflows });
    }
  };

  doesTableBodyOverflow = () =>
    this.tableBody.offsetHeight < this.tableBody.scrollHeight;

  tableHeaders = () => {
    const { rows } = this.props.store.table;
    const { config } = this.props.store.app;
    const headers = Object.keys(rows[0]);
    const windowWidth = $(window).width();
    const tableWidth = (windowWidth * config.tableColumnWidth) / 100;

    const normalFieldWidth = (tableWidth - 50) / (headers.length - 1);
    return headers.map((header, index) => (
      <StyledTableHeaderCell
        key={index}
        maxWidth={header === 'id' ? 50 : normalFieldWidth}
      >
        {header}
      </StyledTableHeaderCell>
    ));
  };

  rowRenderer = ({ key, index, style }) => (
    <div key={key} style={style}>
      <TableItem index={index} />
    </div>
  );

  noRowsRenderer = () => {
    const text = 'lade Daten...';
    return <StyledNoRowsDiv>{text}</StyledNoRowsDiv>;
  };

  render() {
    const { rows, id } = this.props.store.table;
    const { tableBodyOverflows } = this.state; // get index of active id
    const indexOfActiveId = _.findIndex(rows, r => r.id === id);

    return (
      <Container>
        <StyledTable>
          <StyledTableHeader>
            <StyledTableHeaderRow
              paddingRight={tableBodyOverflows ? '17px' : 'inherit'}
            >
              {this.tableHeaders()}
            </StyledTableHeaderRow>
          </StyledTableHeader>
          <StyledTableBody
            ref={c => {
              this.tableBody = c;
            }}
          >
            <AutoSizer>
              {({ height, width }) => (
                <List
                  height={height}
                  rowCount={rows.length}
                  rowHeight={38}
                  rowRenderer={this.rowRenderer}
                  noRowsRenderer={this.noRowsRenderer}
                  width={width}
                  scrollToIndex={indexOfActiveId}
                  ref={c => {
                    this.reactList = c;
                  }}
                  {...rows}
                />
              )}
            </AutoSizer>
          </StyledTableBody>
        </StyledTable>
      </Container>
    );
  }
}

export default enhance(Table);
