import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { setNetwork } from '../../actions/network'

import Header from './Header'

const mapStateToProps = (state: Object) => ({
  network: state.network
})

const actionCreators = {
  setNetwork
}

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)
