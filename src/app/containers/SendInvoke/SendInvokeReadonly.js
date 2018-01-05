import React, { Component } from 'react'

import { connect } from 'react-redux'

import Button from 'preact-material-components/Button'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/Theme/style.css'

import { callInvoke } from '../../utils/neonWrappers';

import style from './SendInvoke.css'
import globalStyle from '../../components/ContentWrapper/ContentWrapper.css'

@connect(
  state => ({
    network: state.network,
    account: state.account
  })
)

export default class SendInvokeReadonly extends Component {
  state = {
    loading: false,
    errorMsg: '',
    txid: ''
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const {network, account, transaction, onSuccess } = this.props

    this.setState({
      loading: true,
      errorMsg: '',
      txid: ''
    })

    const config = {
      scriptHash: transaction.scriptHash,
      operation: transaction.operation,
      arg1: transaction.args[0],
      arg2: transaction.args[1],
      amount: transaction.amount,
      assetType: transaction.type
    }

    callInvoke(network, account, config)
      .then((c) => {
        if (c.response.result === true) {
          this.setState({
            loading: false,
            txid: c.response.txid
          })

          if (onSuccess) {
            onSuccess(c.response)
          }
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
    const { loading, txid, errorMsg } = this.state
    const { transaction, account } = this.props

    if (!account || !account.wif) {
      return (
        <div>
          Please login through browser button and reinitiate this operation.
        </div>
      )
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit} style="padding-top:35px;">
          <div className={style.entryItem}>
            <span className={style.label}>Script Hash:</span>
            <span className={globalStyle.infoText}>{ transaction.scriptHash }</span>
          </div>
          <div className={style.entryItem}>
            <span className={style.label}>Operation:</span>
            <span className={globalStyle.infoText}>{ transaction.operation }</span>
          </div>
          <div className={style.entryItem}>
            <span className={style.label}>Argument 1:</span>
            <span className={globalStyle.infoText}>{ transaction.args[0] }</span>
          </div>
          <div className={style.entryItem}>
            <span className={style.label}>Argument 2:</span>
            <span className={globalStyle.infoText}>{ transaction.args[1] }</span>
          </div>
          <div className={style.entryItem}>
            <span className={style.label}>Amount:</span>
            <span className={globalStyle.infoText}>{ transaction.amount }</span>
          </div>
          <div className={style.entryItem}>
            <span className={style.label}>Asset:</span>
            <span className={globalStyle.infoText}>{ transaction.type }</span>
          </div>
          <Button raised ripple disabled={this.state.loading || this.state.success}>Invoke</Button>
        </form>
        { txid &&
          <div className={style.successBox}>
            <div>Success!</div>
            <span className={globalStyle.infoText}>txid: { txid }</span>
          </div>
        }
        { loading &&
          <div>Loading...</div>
        }
        { errorMsg !== '' &&
          <div>ERROR: {errorMsg}</div>
        }
      </div>
    )
  }
}
