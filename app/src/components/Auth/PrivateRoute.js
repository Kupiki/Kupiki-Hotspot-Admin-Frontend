import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom'

export const PrivateRoute = ({component: ComposedComponent, ...rest}) => {
  
  class Authentication extends Component {
    
    // redirect if not authenticated; otherwise, return the component inputted into <PrivateRoute />
    handleRender(props) {
      if (!this.props.authenticated) {
        return <Redirect to={{
          pathname: '/login',
          state: {
            from: props.location,
            error: 'SIGNIN_REQUESTED'
          }
        }}/>
      } else {
        return <ComposedComponent {...props}/>;
      }
    }
    
    render() {
      return (
        <Route {...rest} render={this.handleRender.bind(this)}/>
      );
    }
  }
  
  function mapStateToProps(state) {
    return {
      authenticated: state.auth.authenticated,
      username: state.auth.username,
      token: state.auth.token,
    };
  }
  
  const AuthenticationContainer = connect(mapStateToProps)(Authentication);
  return <AuthenticationContainer/>;
};
