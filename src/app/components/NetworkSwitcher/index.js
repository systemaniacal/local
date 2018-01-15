import React, { Component } from 'react'
import PropTypes from 'prop-types'

import style from './NetworkSwitcher.css'

class NetworkSwitcher extends Component {
  change = (event) => {
    const { setNetwork } = this.props
    setNetwork(event.target.value)
  }

  render () {
    const { network } = this.props
    return (
      <div>
        <select className={ style.switcher } defaultValue={ network.name } onChange={ this.change }>
          <option value='TestNet'>TestNet</option>
          <option value='MainNet'>MainNet</option>
        </select>
      </div>
    )
  }
}

NetworkSwitcher.propTypes = {
  network: PropTypes.object,
  setNetwork: PropTypes.func,
}

export default NetworkSwitcher
