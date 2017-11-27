import axios from 'axios'
import { UNAUTH_USER, AUTH_USER, AUTH_ERROR, FETCH_MESSAGE } from './types'
const ROOT_URL = 'http://192.168.10.160:4000'

export function loginUser({username, password}) {
  
  return function (dispatch) {
    
    // submit username and password to server
    const request = axios.post(`${ROOT_URL}/auth/local`, {username, password})
    request
      .then(response => {
        // -Save the JWT token
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('username', username)
        
        // -if request is good, we need to update state to indicate user is authenticated
        dispatch({type: AUTH_USER, username: username})
      })
      
      // If request is bad...
      // -Show an error to the user
      .catch(() => {
        dispatch(authError('bad login info'))
      })
    
  }
}

export function logoutUser() {
  localStorage.removeItem('token')
  return {
    type: UNAUTH_USER
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}
