import React, { Component } from 'react'
import PropTypes from 'prop-types'

import style from './NetworkSwitcher.css'

class NetworkSwitcher extends Component {
  change = (event) => {
    const { setNetwork } = this.props
    setNetwork(parseInt(event.target.value))
  }

  generateNetworkOptions(networks) {
    const networkOptions = []

    networks.forEach((network, index) => {
      networkOptions.push((
        <option key={ `option-key-${index}` } value={ index }>{ network.name }</option>
      ))
    })

    return networkOptions
  }

  render () {
    const { networkId, networks } = this.props

    const networkOptions = this.generateNetworkOptions(networks)

    return (
      <div>
        <select className={ style.switcher } defaultValue={ networkId } onChange={ this.change }>
          { networkOptions }
        </select>
      </div>
    )
  }
}

NetworkSwitcher.propTypes = {
  networkId: PropTypes.number,
  setNetwork: PropTypes.func,
  networks: PropTypes.array,
}

export default NetworkSwitcher
