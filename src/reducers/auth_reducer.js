import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, FETCH_MESSAGE } from '../actions/types'

export default function authReducer(state = {}, action) {
  switch (action.type) {
    case AUTH_USER:
      return {...state, error: '', authenticated: true, username: action.username}
    case UNAUTH_USER:
      return {...state, error: '', authenticated: false, username: null}
    case AUTH_ERROR:
      return {...state, error: action.payload, authenticated: false, username: null}
    // case FETCH_MESSAGE:
    //   return {...state, error: '', message: action.payload, authenticated: false}
    default:
      return state
  }
}
