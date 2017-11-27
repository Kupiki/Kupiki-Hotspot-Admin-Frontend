import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, BrowserRouter, Route, Switch} from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';
import { AUTH_USER } from './actions/types';
import { PrivateRoute } from './components/Auth/PrivateRoute'

// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss'


const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

if (token && username) {
  store.dispatch({type: AUTH_USER, username: username})
}

// Containers
import Kupiki from './containers/Kupiki/'

// Views
import Login from './views/Pages/Login/';
import Logout from './views/Pages/Logout/';

// import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'

// const store = configureStore();

ReactDOM.render((
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/login" name="Login Page" component={Login}/>
        <Route exact path="/logout" name="Logout Page" component={Logout}/>
        {/*<Route exact path="/register" name="Register Page" component={Register}/>*/}
        <PrivateRoute exact path="/404" name="Page 404" component={Page404}/>
        <Route exact path="/500" name="Page 500" component={Page500}/>
        <PrivateRoute exact path="/dashboard" name="Dashboard" component={Kupiki}/>
        <PrivateRoute path="/" exact component={Kupiki}/>
      </Switch>
    </Router>
  </Provider>
), document.getElementById('root'));
