import React, { Component } from 'react'
import SendInvoke from '../SendInvoke'

import Header from '../../components/Header'
import ContentWrapper from '../../components/ContentWrapper'

import style from '../App/App.css'

export default class PopupWindow extends Component {
  state = {
    transaction: null,
    success: false
  }

  componentDidMount () {
    this.port = chrome.runtime.connect({name: "popup"})
    this.port.onMessage.addListener((message) => {
      if (message.operation === 'sendInvoke') {
        this.setState({
          transaction: message.txInfo
        })
        console.log('message', message)
      }
    })
  }

  onSuccess = (response) => {
    this.port.postMessage({ msg: 'sendInvokeResponse', status: 'success', txid: response.txid })
    this.setState({
      txid: response.txid
    })
  }

  render () {
    const { transaction, txid } = this.state

    return (
      <div className={style.popup}>
        <Header noMenu />
        <ContentWrapper>
          { txid
            ? (
              <div>
                <div>Success!</div>
                <div>Your transaction id is {txid}</div>
              </div>
            )
            : <SendInvoke transaction={transaction} onSuccess={this.onSuccess} />
          }
        </ContentWrapper>
      </div>
    )
  }
}
