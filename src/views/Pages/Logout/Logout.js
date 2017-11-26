import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../actions'
import { Redirect } from 'react-router';

class Logout extends Component {
  
  componentWillMount() {
    this.props.logoutUser()
  }
  
  render() {
    return <Redirect to={'/'}/>
  }
}

export default connect(null, actions)(Logout)
