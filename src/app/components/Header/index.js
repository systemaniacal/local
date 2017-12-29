import React, { Component } from 'react'
import PropTypes from 'prop-types'

import NetworkSwitcher from '../NetworkSwitcher'
import MainNav from '../MainNav'
import style from './Header.css'

const Header = ({ showMenu }) => (
  <div className={style.header}>
    <NetworkSwitcher />
    <div className={style.titleBar}>
      { showMenu ? <div className={style.menuNavWrapper}><MainNav /></div> : null }
      <div className={style.titleWrapper}>
        <span className={style.titleName}>NeoLink</span>
      </div>
    </div>
  </div>
)

Header.propTypes = {
  showMenu: PropTypes.bool
}

Header.defaultProps = {
  showMenu: true
}

export default Header
