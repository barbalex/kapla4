import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormControl } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

const enhance = compose(inject('store'), observer)

class GekoNrField extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    // id seems missing when deleting geschaeft
    // so not required
    idGeschaeft: PropTypes.number,
    gekoNr: PropTypes.string.isRequired,
    tabsToAdd: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
    const { gekoNr } = this.props
    this.state = {
      gekoNr,
      oldGekoNr: gekoNr,
    }
  }

  onChange = e => {
    this.setState({ gekoNr: e.target.value })
  }

  onBlur = () => {
    const { idGeschaeft, store } = this.props
    const { gekoRemove, gekoNewCreate } = store
    const { gekoNr, oldGekoNr } = this.state
    // need old value
    if (gekoNr && oldGekoNr && gekoNr !== oldGekoNr) {
      gekoRemove(idGeschaeft, oldGekoNr)
      gekoNewCreate(idGeschaeft, gekoNr)
    } else if (gekoNr && !oldGekoNr) {
      gekoNewCreate(idGeschaeft, gekoNr)
      this.setState({ gekoNr: '' })
    } else if (!gekoNr && oldGekoNr) {
      gekoRemove(idGeschaeft, oldGekoNr)
    }
  }

  render() {
    const { tabsToAdd } = this.props
    const { gekoNr } = this.state

    return <FormControl type="text" value={gekoNr} onChange={this.onChange} onBlur={this.onBlur} bsSize="small" tabIndex={1 + tabsToAdd} />
  }
}

export default enhance(GekoNrField)
