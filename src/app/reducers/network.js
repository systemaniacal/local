import * as ActionTypes from '../constants/ActionTypes'

const initialState = {
  id: 0,
}

const actionsMap = {
  [ActionTypes.SWITCH_NETWORK] (state, action) {
    return {
      ...state,
      id: action.id,
    }
  },
}

export default function network (state = initialState, action) {
  const reduceFn = actionsMap[action.type]
  if (!reduceFn) return state
  return reduceFn(state, action)
}
