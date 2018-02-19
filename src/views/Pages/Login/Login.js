import React, { Component } from 'react';
import { Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { Form, FormGroup, Label } from 'reactstrap';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import BackgroundImage from '../../../components/BackgroundImage/';

class Login extends Component {
  constructor(props) {
    super(props);
  
    this.images = [
      "img/backgrounds/0.jpg",
      "img/backgrounds/1.jpg",
      "img/backgrounds/2.jpg",
      "img/backgrounds/3.jpg",
      "img/backgrounds/4.jpg",
      "img/backgrounds/5.jpg"
    ];
  
    this.timeoutVar = null;
    this.state = {
      errors: [],
      background: {
      
      },
      imageIndex: 0,
      user: {
        username: '',
        password: ''
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeImage = this.changeImage.bind(this);
  }
  
  componentDidMount() {
    document.body.style.overflow = 'hidden';
    // document.body.classList.toggle('overrideClass', true)
    this.timeoutVar = setTimeout(function () {
      this.changeImage();
    }.bind(this), 5000)
  }
  
  componentWillUnmount() {
    clearTimeout(this.timeoutVar);
    document.body.style.overflow = 'auto';
    // document.body.classList.remove('overrideClass')
  }
  
  changeImage() {
    if (this.state.imageIndex === this.images.length - 1) {
      // this.state.imageIndex = 0;
      this.setState({ imageIndex: 0 });
    } else {
      this.setState({ imageIndex: this.state.imageIndex + 1 });
      // this.state.imageIndex++;
    }
  
    this.timeoutVar = setTimeout(function () {
      this.changeImage();
    }.bind(this), 5000)
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
  
    let payload={
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
        <BackgroundImage src={this.images[this.state.imageIndex]} duration={1500} style={{ maxWidth: '', maxHeight: ''}}/>
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4 bg-primary">
                  <CardBody>
                    <h1>Login</h1>
                    {/*<p className="text-muted">Sign In to your account</p>*/}
                    <p>Sign In to your account</p>
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
                            <Button type="submit">Login</Button>
                          </Col>
                        </FormGroup>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white py-5 d-md-down-none" style={{width: 44 + '%'}}>
                  <CardBody className="text-center kupiki-logo">
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
