import React, {Component} from 'react'
import {connect} from 'react-redux'

import Neon, {api} from '@cityofzion/neon-js'

import style from './SendInvoke.css'

import Button from 'preact-material-components/Button'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/Theme/style.css'
import TextField from 'preact-material-components/TextField'
import 'preact-material-components/TextField/style.css'
import Select from 'preact-material-components/Select'
import 'preact-material-components/List/style.css'
import 'preact-material-components/Menu/style.css'
import 'preact-material-components/Select/style.css'

@connect(
  state => ({
    network: state.network,
    account: state.account
  })
)

/*
  Test call ...
  {
    scriptHash: 'b3a14d99a3fb6646c78bf2f4e2f25a7964d2956a',
    operation: 'putvalue',
    arg1: 'test',
    arg2: '1',
    assetType: 'GAS',
    assetAmount: '.00025'
  }
*/

export default class SendInvoke extends Component {
  state = {
    errorMsg: '',
    loading: false
  }

  resetState = () => {
    this.setState({
      errorMsg: '',
      loading: false,
      txid: ''
    })
  }

  _handleTextFieldChange = (e) => {
    const key = e.target.id
    this.setState({
      [key]: e.target.value
    })
  }

  String2Hex(tmp) {
    var str = ''
    for (var i = 0; i < tmp.length; i++) {
      str += tmp[i].charCodeAt(0).toString(16)
    }
    return str
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const {network, account} = this.props
    this.setState({
      loading: true,
      errorMsg: '',
      txid: ''
    })

    //Set Asset Type
    let assetType
    if (this.state.assetType === 0) {
      assetType = 'NEO'
    } else {
      assetType = 'GAS'
    }

    if (!this.state.scriptHash || !this.state.operation || !this.state.amount) {
      this.setState({
        loading: false,
        errorMsg: 'Error! Script hash, operation and amount are all required!'
      })

      return
    }

    const txArgs = [this.state.arg1, this.state.arg2]
    const args = []
    txArgs.forEach((arg) => {
      if (arg !== '') args.push(this.String2Hex(arg))
    })

    const myAccount = Neon.create.account(account.wif)

    const config = {
      net: network.name,
      privateKey: myAccount.privateKey,
      address: myAccount.address,
      intents: [{
        assetId: Neon.CONST.ASSET_ID[assetType],
        value: parseFloat(this.state.amount),
        scriptHash: this.state.scriptHash
      }],
      script: {scriptHash: this.state.scriptHash, operation: this.state.operation, args: args},
      gas: 0
    }

    return api.doInvoke(config)
      .then((c) => {
        if (c.response.result === true) {
          this.setState({
            loading: false,
            txid: c.response.txid
          })
        } else {
          this.setState({
            loading: false,
            errorMsg: 'Invoke failed'
          })
        }
      })
      .catch((e) => {
        console.log('e', e)
        this.setState({
          loading: false,
          errorMsg: 'Invoke failed'
        })
      })
  }

  render() {
    const {txid, loading, errorMsg} = this.state

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            type='text'
            placeholder='Script Hash'
            value={this.state.scriptHash}
            id="scriptHash"
            onChange={this._handleTextFieldChange}
          />
          <TextField
            type='text'
            placeholder='Operation'
            value={this.state.operation}
            id="operation"
            onChange={this._handleTextFieldChange}
          />
          <TextField
            type='text'
            placeholder='Argument 1'
            value={this.state.arg1}
            id="arg1"
            onChange={this._handleTextFieldChange}
          />
          <TextField
            type='text'
            placeholder='Argument 2'
            value={this.state.arg2}
            id="arg2"
            onChange={this._handleTextFieldChange}
          />
          <TextField
            type='text'
            placeholder='Amount'
            value={this.state.amount}
            id="amount"
            onChange={this._handleTextFieldChange}
          />

          <Select hintText="Asset"
                  ref={(input) => {
                    this.type = input
                  }}
                  selectedIndex={this.state.assetType}
                  onChange={(e) => {
                    this.setState({
                      assetType: [e.selectedIndex]
                    })
                  }}
          >
            <Select.Item>NEO</Select.Item>
            <Select.Item>GAS</Select.Item>
          </Select>
          <button disabled={loading}>Invoke</button>
        </form>

        {txid &&
        <div>
          Success! txid: <span className={style.transactionId}>{txid}</span>
        </div>
        }
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
