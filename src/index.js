import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, BrowserRouter, Route, Switch} from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';
import { AUTH_USER } from './actions/types';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import ReduxToastr from 'react-redux-toastr';

import { I18nextProvider } from 'react-i18next';
import i18n from './components/i18n';

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

ReactDOM.render((
  <I18nextProvider i18n={ i18n }>
    <Provider store={store}>
      <div>
        <Router>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login}/>
            <Route exact path="/logout" name="Logout Page" component={Logout}/>
            {/*<PrivateRoute exact path="/user/profile" name="User Profile" component={Profile}/>*/}
            {/*<PrivateRoute exact path="/system/dashboard" name="Dashboard" component={Kupiki}/>*/}
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
      </div>
    </Provider>
  </I18nextProvider>
), document.getElementById('root'));
