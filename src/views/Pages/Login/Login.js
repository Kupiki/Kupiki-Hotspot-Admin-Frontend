import React, {Component} from 'react';
import {Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon} from 'reactstrap';
import {Form, FormGroup, Label} from 'reactstrap';
import { Redirect } from 'react-router';

import {connect} from 'react-redux';
import * as actions from '../../../actions';

// import * as sessionActions from '../../../actions/sessionActions';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      user: {
        username: '',
        password: ''
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  
    console.log(this.props)
    console.log(this.state)
  }
  
  getRedirectPath() {
    const locationState = this.props.location.state
    if (locationState && locationState.from.pathname) {
      return locationState.from.pathname // redirects to referring url
    } else {
      return '/'
    }
  }
  
  handleChange(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    return this.setState({user: user});
  }
  
  handleSubmit(event){
    event.preventDefault();
  
    var payload={
      "username":this.state.user.username,
      "password":this.state.user.password
    };
    this.props.loginUser(payload);
  }
  
  render() {
    return (this.props.authenticated) ?
      <Redirect to={{
        pathname: this.getRedirectPath(), state: {
          from: this.props.location
        }
      }}/>
      :
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <Form onSubmit={this.handleSubmit}>
                      <FormGroup>
                        <InputGroup className="mb-3">
                          <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                          <Input type="text" name="username" placeholder="Username" required onChange={this.handleChange}/>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="mb-3">
                          <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                          <Input type="password" name="password" placeholder="Password" required onChange={this.handleChange}/>
                        </InputGroup>
                      </FormGroup>
                      <Row>
                        <FormGroup check row>
                          <Col sm={{ size: 10, offset: 2 }}>
                            <Button type="submit">Submit</Button>
                          </Col>
                        </FormGroup>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{width: 44 + '%'}}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Button color="primary" className="mt-3" active>Register Now!</Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    errorMessage: state.auth.error
  }
}

export default connect(mapStateToProps, actions)(Login)
