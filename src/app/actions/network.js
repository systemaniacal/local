import * as types from '../constants/ActionTypes'

export function setNetwork (network) {
  return { type: types.SWITCH_NETWORK, network }
}
