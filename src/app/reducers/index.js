import { combineReducers } from 'redux'

import account from './account'
import network from './network'
import config from './config'

export default combineReducers({
  account,
  network,
  config,
})
