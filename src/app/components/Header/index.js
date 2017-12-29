import React, { Component } from 'react'

import NetworkSwitcher from '../NetworkSwitcher'
import MainNav from '../MainNav'
import style from './Header.css'

type Props = {
  showMenu: boolean
}

const Header = ({ showMenu }: Props) => (
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

Header.defaultProps = {
  showMenu: true
}

export default Header
