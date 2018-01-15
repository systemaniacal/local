import * as types from '../constants/ActionTypes'

export function setNetwork (id) {
  return { type: types.SWITCH_NETWORK, id }
}
