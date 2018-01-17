import React from 'react'
import PropTypes from 'prop-types'

import NetworkSwitcher from '../NetworkSwitcher'
import MainNav from '../MainNav'

import './Header.css'

const Header = (props) => {
  const { showMenu, setNetwork, network, config } = props

  return (
    <div styleName='header'>
      <NetworkSwitcher setNetwork={ setNetwork } networkId={ network.id } networks={ config.networks }  />
      <div styleName='titleBar'>
        { showMenu ? <div styleName='menuNavWrapper'><MainNav /></div> : null }
        <div styleName='titleWrapper'>
          <span styleName='titleName'>NeoLink</span>
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {
  showMenu: PropTypes.bool,
  network: PropTypes.object,
  setNetwork: PropTypes.func,
  config: PropTypes.object,
}

Header.defaultProps = {
  showMenu: true,
}

export default Header
