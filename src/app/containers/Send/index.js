import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { api } from '@cityofzion/neon-js'
import { Button } from 'rmwc/Button'
import { TextField } from 'rmwc/TextField'
import { Select } from 'rmwc/Select'
import '@material/button/dist/mdc.button.min.css'
import '@material/textfield/dist/mdc.textfield.min.css'
import '@material/select/dist/mdc.select.min.css'

import withLoginCheck from '../../components/Login/withLoginCheck'
import { toNumber } from '../../utils/math'

@connect(
  state => ({
    networks: state.config.networks,
    selectedNetworkId: state.config.selectedNetworkId,
    account: state.account,
  })
)

class Send extends Component {
  state = {
    errorMsg: '',
    loading: false,
    txid: '',
    assetType: 'NEO',
    address: '',
    amount: '',
  }

  _handleTextFieldChange = (e) => {
    const key = e.target.id
    this.setState({
      [key]: e.target.value,
    })
  }

  resetState = () => {
    this.setState({
      errorMsg: '',
      loading: false,
      txid: '',
      assetType: 1,
      address: '',
      amount: '',
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { selectedNetworkId, networks, account } = this.props
    const { assetType, address, amount } = this.state
    this.setState({
      loading: true,
      errorMsg: '',
      txid: '',
    })

    if (!this.state.address || !this.state.amount) {
      this.setState({
        loading: false,
        errorMsg: 'All fields are required',
      })

      return
    }

    // Validate Asset Type
    if (this.state.assetType !== 'NEO' && this.state.assetType !== 'GAS') {
      this.setState({
        loading: false,
        errorMsg: 'Asset Type invalid',
      })

      return
    }

    let amounts = {}
    amounts[assetType] = toNumber(amount)
    api.neonDB.doSendAsset(networks[selectedNetworkId].url, address, account.wif, amounts)
      .then((result) => {
        console.log(result)
        this.setState({
          loading: false,
          txid: result.txid,
        })
      })
      .catch((e) => {
        console.log(e)
        this.setState({
          loading: false,
          errorMsg: '' + e,
        })
      })
  }

  render() {
    const { txid, loading, errorMsg } = this.state

    return (
      <div>
        <form onSubmit={ this.handleSubmit }>
          <TextField
            type='text'
            placeholder='Address'
            value={ this.state.address }
            id='address'
            onChange={ this._handleTextFieldChange }
          />
          <TextField
            type='text'
            placeholder='Amount'
            value={ this.state.amount }
            id='amount'
            onChange={ this._handleTextFieldChange }
          />

          <Select label='Asset'
            cssOnly
            value={ this.state.assetType }
            onChange={ (e) => {
              this.setState({
                assetType: e.target.value,
              })
            } }
            options={ [
              {
                label: 'NEO',
                value: 'NEO',
              },
              {
                label: 'GAS',
                value: 'GAS',
              },
            ] }
          />

          <Button raised ripple>Send</Button>
        </form>
        <br />
        {txid &&
          <div>
            <div>Success!</div>
            <div style={ { wordWrap: 'break-word', wordBreak: 'break-all' } }>
              <div>Transaction ID:</div>
              <div>{txid}</div>
            </div>
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

export default withLoginCheck(Send)

Send.propTypes = {
  account: PropTypes.object,
  selectedNetworkId: PropTypes.string,
  networks: PropTypes.object,
}
