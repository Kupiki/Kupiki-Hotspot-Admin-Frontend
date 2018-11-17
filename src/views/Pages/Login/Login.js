import React, { Component } from 'react';
import { Container, Row, Col, CardGroup, Card, CardBody, Label, Button } from 'reactstrap';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import BackgroundImage from '../../../components/BackgroundImage/';
import { translate } from 'react-i18next';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';

class Login extends Component {
  constructor(props) {
    super(props);

    this.images = [
      'img/backgrounds/0.jpg',
      'img/backgrounds/1.jpg',
      'img/backgrounds/2.jpg',
      'img/backgrounds/3.jpg',
      'img/backgrounds/4.jpg',
      'img/backgrounds/5.jpg'
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
    this.timeoutVar = setTimeout(function () {
      this.changeImage();
    }.bind(this), 5000)
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutVar);
    document.body.style.overflow = 'auto';
  }

  changeImage() {
    if (this.state.imageIndex === this.images.length - 1) {
      this.setState({ imageIndex: 0 });
    } else {
      this.setState({ imageIndex: this.state.imageIndex + 1 });
    }

    this.timeoutVar = setTimeout(function () {
      this.changeImage();
    }.bind(this), 5000)
  }

  getRedirectPath() {
    const locationState = this.props.location.state;
    if (locationState && locationState.from.pathname) {
      return locationState.from.pathname // redirects to referring url
    } else {
      return '/'
    }
  }

  handleChange(event) {
    const field = event.target.name;
    const userTmp = this.state.user;
    userTmp[field] = event.target.value;
    return this.setState({user: userTmp});
  }

  handleSubmit(event){
    event.preventDefault();

    let payload={
      'username':this.state.user.username,
      'password':this.state.user.password
    };
    this.props.loginUser(payload);
  }

  render() {
    const { t } = this.props;

    return (this.props.authenticated) ?
      <Redirect to={{
        pathname: this.getRedirectPath(), state: {
          from: this.props.location
        }
      }}/>
      :
      <div className='app flex-row align-items-center'>
        <BackgroundImage src={this.images[this.state.imageIndex]} duration={1500} style={{ maxWidth: '', maxHeight: ''}}/>
        <Container>
          <Row className='justify-content-center'>
            <Col md='8'>
              <CardGroup>
                <Card className='p-4 bg-primary'>
                  <AvForm onValidSubmit={this.handleSubmit}>
                    <CardBody>
                      <h1>{ t('login.title') }</h1>
                      <AvGroup>
                        <Label htmlFor='username'>{t('login.username')}</Label>
                        <AvField id='username' name='username' onChange={ this.handleChange }
                                 validate={{
                                   required: { errorMessage: t('login.usernameMissing') }
                                 }}/>
                      </AvGroup>
                      <AvGroup>
                        <Label htmlFor='password'>{t('login.password')}</Label>
                        <AvField type="password" id='password' name='password' onChange={ this.handleChange }
                                 validate={{
                                   required: { errorMessage: t('login.passwordMissing') }
                                 }}/>
                      </AvGroup>
                      { this.props.errorMessage && (
                        <div className='text-danger' style={{fontWeight: 'bold'}}>{ this.props.errorMessage }</div>
                      )}
                      <Button type='submit' size='sm' color='secondary'><i className='fa fa-dot-circle-o'></i> {t('login.connect')}</Button>
                    </CardBody>

                  </AvForm>
                </Card>
                <Card className='text-white py-5 d-md-down-none' style={{width: 44 + '%'}}>
                  <CardBody className='text-center kupiki-logo'>
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
    errorMessage: state.auth.errorMessage
  }
}

export default translate()(connect(mapStateToProps, actions)(Login))