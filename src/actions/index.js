import axios from 'axios'
import { UNAUTH_USER, AUTH_USER, AUTH_ERROR, FETCH_MESSAGE } from './types'

var Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('language');
  localStorage.removeItem('_id');
  return {
    type: UNAUTH_USER
  }
}

export function loginUser({username, password}) {
  
  return function (dispatch) {
    // submit username and password to server
    const request = axios.post(`${ROOT_URL}/auth/local`, {username, password});
    request
      .then(response => {
        // -Save the JWT token and username
        localStorage.setItem('token', response.data.token);
        const currentUser = axios.get(`${ROOT_URL}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${localStorage.token}` }
        });
        currentUser
          .then(function (response) {
            localStorage.setItem('username', username);
            localStorage.setItem('language', response.data.language);
            localStorage.setItem('_id', response.data._id);
  
            // -if request is good, we need to update state to indicate user is authenticated
            dispatch({type: AUTH_USER, username: username})
          })
          .catch(function (error) {
            console.log(error);
            dispatch(authError('bad login info'))
          });
      })
      
      // If request is bad...
      // -Show an error to the user
      .catch(() => {
        console.log('Error authentication')
        dispatch(authError('bad login info'))
      })
  }
}
