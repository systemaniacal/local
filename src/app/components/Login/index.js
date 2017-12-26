import React, {Component} from 'react'
import Neon, {wallet} from '@cityofzion/neon-js'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Button from 'preact-material-components/Button'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/Theme/style.css'

import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';

import * as AccountActions from '../../actions/account'


@connect(
  state => ({
    account: state.account
  }),
  dispatch => ({
    actions: bindActionCreators(AccountActions, dispatch)
  })
)

export default class Login extends Component {
  state = {
    errorMsg: '',
    loading: false,
    encryptedWif: '',
    passPhrase: ''
  }


  _handleTextFieldChange = (e) => {
    const key = e.target.id
    this.setState({
      [key]: e.target.value
    })
  }


  decryptWallet = (encryptedWif, passphrase) => {
    return new Promise((resolve, reject) => {
      const wif = wallet.decrypt(encryptedWif, passphrase)

      if (!wif) {
        reject(new Error("Couldn't load account"))
      } else {
        resolve(wif)
      }
    })
  }

  handleSubmit = (event) => {
    console.log('Submit');
    event.preventDefault()

    this.setState({
      loading: true,
      errorMsg: ''
    })

    this.decryptWallet(this.state.encryptedWif, this.state.passPhrase)
      .then((wif) => {
        const {actions} = this.props
        this.setState({loading: false})
        actions.setAccount(wif)
      })
      .catch((e) => {
        console.log('Incorrect credentials.')
        this.setState({loading: false, errorMessage: 'Incorrect credentials.'})
      })
  }

  handleClick = (e) => {
    const {actions} = this.props
    e.preventDefault()
    actions.setAccount('')
  }

  render() {
    const {loading, errorMsg} = this.state
    const {account} = this.props

    if (account.wif !== '') {
      const myAccount = Neon.create.account(account.wif)
      return (
        <div>
          <Button ripple raised onClick={this.handleClick}>
            Logout
          </Button>
          <div style="margin-top:20px;">
            <div style="width:200px; display:block; word-wrap: break-word;"><span
              style="word-wrap: break-word;">Address: {myAccount.address}</span></div>
            <div style="margin-top:10px; width:200px; display:block; word-wrap: break-word;"><span
              style="word-wrap: break-word;">Public key encoded: {myAccount.getPublicKey(true)}</span></div>
          </div>
        </div>
      )
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            type='text'
            placeholder='Encrypted WIF'
            value={this.state.encryptedWif}
            id="encryptedWif"
            onChange={this._handleTextFieldChange}
          />
          <TextField
            type='password'
            placeholder='Passphrase'
            value={this.state.passPhrase}
            id="passPhrase"
            onChange={this._handleTextFieldChange}
          />
          <div>
            <Button raised ripple>Login</Button>
          </div>
        </form>
        {loading &&
        <div>Loading...</div>
        }
        {errorMsg !== '' &&
        <div>ERROR: {errorMsg}</div>
        }
      </div>
    )
  }
}
