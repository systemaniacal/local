import React, { Component } from 'react'
import { withRouter } from 'react-router'

import { Link } from 'react-router-dom'

import { Menu, MenuItem, MenuAnchor } from 'rmwc/Menu'
import { Button } from 'rmwc/Button'
import '@material/menu/dist/mdc.menu.min.css'
import '@material/button/dist/mdc.button.min.css'

import style from './MainNav.css'

class MainNav extends Component {
  state = {
    menuIsOpen: false
  }

  render () {
    return (
      <div className={style.menu}>
        <MenuAnchor>
          <div
            className={style.menuButton}
            onClick={e => {
              this.setState({'menuIsOpen': !this.state.menuIsOpen})
            }}
          />
          <Menu
            open={this.state.menuIsOpen}
            onClose={evt => this.setState({menuIsOpen: false})}
          >
            <MenuItem className={style.menuItem} onClick={() => this.props.history.push(`/`)}>
              Home
            </MenuItem>
            <MenuItem className={style.menuItem} onClick={() => this.props.history.push(`/send`)}>
              Send
            </MenuItem>
            <MenuItem className={style.menuItem} onClick={() => this.props.history.push(`/testInvoke`)}>
              Test Invoke
            </MenuItem>
            <MenuItem className={style.menuItem} onClick={() => this.props.history.push(`/sendInvoke`)}>
              Send Invoke
            </MenuItem>
            <MenuItem className={style.menuItem} onClick={() => this.props.history.push(`/transactions`)}>
              Transactions
            </MenuItem>
            <MenuItem className={style.menuItem} onClick={() => this.props.history.push(`/balance`)}>
              Balance
            </MenuItem>
            <MenuItem className={style.menuItem} onClick={() => this.props.history.push(`/createWallet`)}>
              Create Wallet
            </MenuItem>
            <MenuItem className={style.menuItem} onClick={() => this.props.history.push(`/importWallet`)}>
              Import Wallet
            </MenuItem>
            <MenuItem className={style.menuItem} onClick={() => this.props.history.push(`/exportWallet`)}>
              Export Wallet
            </MenuItem>
            <MenuItem className={style.menuItem} onClick={() => this.props.history.push(`/config`)}>
              Config
            </MenuItem>
          </Menu>
        </MenuAnchor>
      </div>
    )
  }
}

export default withRouter(MainNav)
