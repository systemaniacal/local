import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { setNetwork } from '../../actions/network'

import { addCustomNetwork, deleteCustomNetwork } from '../../actions/config'

import Config from './Config'

const mapStateToProps = (state: Object) => ({
  network: state.network,
  config: state.config,
})

const actionCreators = {
  addCustomNetwork,
  deleteCustomNetwork,
  setNetwork,
}

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Config)
