import React from 'react'
import { connect } from 'react-redux'

import Login from './'

function withLoginCheck(Component) {
  class WithLoginCheckComponent extends React.Component {
    render() {
      if (!this.props.account || !this.props.account.wif) {
        return <Login />
      } else {
        return <Component {...this.props} />
      }
    }
  }

  function mapStateToProps(state) {
    return { account: state.account }
  }

  return connect(mapStateToProps)(WithLoginCheckComponent)
}

export default withLoginCheck;

