import * as ActionTypes from '../constants/ActionTypes'

const initialState = {
  networks: [
    { name: 'MainNet', url: 'http://api.wallet.cityofzion.io', canDelete: false },
    { name: 'TestNet', url: 'http://testnet-api.wallet.cityofzion.io', canDelete: false },
    { name: 'CoZ TestNet', url: 'http://coz-privatenet.herokuapp.com/', canDelete: false },
  ],
}

const actionsMap = {
  [ActionTypes.ADD_CUSTOM_NETWORK] (state, action) {
    return {
      ...state,
      networks: state.networks.concat([{ name: action.name, url: action.url, canDelete: true }]),
    }
  },
  [ActionTypes.DELETE_CUSTOM_NETWORK] (state, action) {
    let networks = [...state.networks]
    networks.splice(action.id, 1)
    return {
      ...state,
      networks,
    }
  },
}

export default function config(state = initialState, action) {
  const reduceFn = actionsMap[action.type]
  if (!reduceFn) return state
  return reduceFn(state, action)
}
