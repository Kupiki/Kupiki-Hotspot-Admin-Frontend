import { AUTH_USER, UNAUTH_USER, AUTH_ERROR } from '../actions/types'

export default function authReducer(state = {}, action) {
  switch (action.type) {
    case AUTH_USER:
      return {...state, errorMessage: '', authenticated: true, username: action.username, token: action.token};
    case UNAUTH_USER:
      return {...state, errorMessage: '', authenticated: false, username: null, token: null};
    case AUTH_ERROR:
      return {...state, errorMessage: action.payload, authenticated: false, username: null, token: null};
    default:
      return state;
  }
}
