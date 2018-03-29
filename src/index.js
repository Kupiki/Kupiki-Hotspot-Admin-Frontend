import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, BrowserRouter, Route, Switch} from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';
import { AUTH_USER, UNAUTH_USER } from './actions/types';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import ReduxToastr from 'react-redux-toastr';
import ReduxSocket from './components/ReduxSocket/ReduxSocket';
import jwt from 'jsonwebtoken'
import { I18nextProvider } from 'react-i18next';
import i18n from './components/i18n';

// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss';
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

import axios from 'axios';
axios.interceptors.response.use(undefined, error => {
  if (error) {
    if(error.response.status === 401) {
      store.dispatch({type: UNAUTH_USER})
    }
    return Promise.reject(error);
  }
});
// if (token && username) {
//   store.dispatch({type: AUTH_USER, username: username, token: token});
// }

if (token) {
  const decodedToken = jwt.decode(token, {complete: true});
  // console.log(decodedToken)
  const dateNow = new Date();
  
  // console.log(decodedToken.payload.exp*1000)
  // console.log(dateNow.getTime())
  const validToken = (dateNow.getTime() < decodedToken.payload.exp * 1000);
  
  // console.log('validToken : ' + validToken)
  if (validToken && username) {
    store.dispatch({type: AUTH_USER, username: username, token: token});
  } else {
    store.dispatch({type: UNAUTH_USER});
  }
} else {
  store.dispatch({type: UNAUTH_USER});
}

// Containers
import Kupiki from './containers/Kupiki/';
// Views
import Login from './views/Pages/Login/';
import Logout from './views/Pages/Logout/';

ReactDOM.render((
  <I18nextProvider i18n={ i18n }>
    <Provider store={store}>
      <div>
        <Router>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login}/>
            <Route exact path="/logout" name="Logout Page" component={Logout}/>
            <PrivateRoute path="/" component={Kupiki}/>
          </Switch>
        </Router>
        <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="top-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar/>
        <ReduxSocket/>
      </div>
    </Provider>
  </I18nextProvider>
), document.getElementById('root'));
