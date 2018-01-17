import React from 'react'
import PropTypes from 'prop-types'

import NetworkSwitcher from '../NetworkSwitcher'
import MainNav from '../MainNav'

import './Header.css'

const Header = (props) => {
  const { showMenu, setNetwork, network } = props

  return (
    <div styleName='header'>
      <NetworkSwitcher setNetwork={ setNetwork } network={ network } />
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
}

Header.defaultProps = {
  showMenu: true,
}

export default Header
