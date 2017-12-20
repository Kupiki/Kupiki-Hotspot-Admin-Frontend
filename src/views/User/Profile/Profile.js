import React, { Component } from 'react';
import {
  Row,
  Button,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Label,
  Input
} from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import axios from 'axios';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import {toastr} from 'react-redux-toastr'

i18next
  .use(XHR)
  .init({
    initImmediate: true,
    fallbackLng: 'en',
    backend: {
      loadPath: '/lang/locale-{{lng}}.json'
    }
  });

var Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class Profile extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      lng: localStorage.getItem('language'),
      _id: localStorage.getItem('_id'),
    };
    
    this.onLanguageChanged = this.onLanguageChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    i18next.changeLanguage(this.state.lng);
  }
  
  componentDidMount() {
    i18next.on('languageChanged', this.onLanguageChanged)
  }
  
  componentWillUnmount() {
    i18next.off('languageChanged', this.onLanguageChanged)
  }
  
  onLanguageChanged(lng) {
    this.setState({
      lng: lng
    })
  }
  
  handleSubmit(event, errors, values) {
    if (!errors.length) {
      const request = axios.put(`${ROOT_URL}/api/users/${this.state._id}/password`, {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.token}` }
      });
      request
        .then(response => {
          toastr.success(i18next.t('user.password.title'), i18next.t('user.password.success'));
          console.log(response)
        })
        .catch(error => {
          console.log(error)
          console.log(error.response)
          if (error.response) {
            if (error.response.status === 403) {
              toastr.error('Authorization error', 'Invalid password');
            } else {
              toastr.error('Authorization error', error.response.status + ' ' + error.response.statusText);
            }
          } else {
            toastr.error('Unknown error', '');
          }
        });
    }
  }
  
  render() {
    return (
      <div className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <AvForm onSubmit={this.handleSubmit}>
                <CardHeader>
                  {i18next.t('user.password.title')}
                </CardHeader>
                <CardBody>
                    <AvGroup>
                      <Label htmlFor="currentPassword">{i18next.t('user.password.current')}</Label>
                      <AvField type="password" id="currentPassword" name="currentPassword" validate={{
                        minLength: {value: 3, errorMessage: i18next.t('user.password.currentTooSmall')},
                        required: {errorMessage: i18next.t('user.password.currentMissing')}
                      }}/>
                    </AvGroup>
                    <AvGroup>
                      <Label htmlFor="newPassword">{i18next.t('user.password.new')}</Label>
                      <AvField type="password" id="newPassword" name="newPassword" validate={{
                        minLength: {value: 3, errorMessage: i18next.t('user.password.currentTooSmall')},
                        required: {errorMessage: i18next.t('user.password.currentMissing')}
                      }}/>
                    </AvGroup>
                    <AvGroup>
                      <Label htmlFor="confirmPassword">{i18next.t('user.password.confirm')}</Label>
                      <AvField type="password" id="confirmPassword" name="confirmPassword" validate={{
                        minLength: {value: 3, errorMessage: i18next.t('user.password.currentTooSmall')},
                        required: {errorMessage: i18next.t('user.password.currentMissing')},
                        match:{value:'newPassword', errorMessage: i18next.t('user.password.mismatch')}
                      }}/>
                    </AvGroup>
                </CardBody>
                <CardFooter>
                  <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> {i18next.t('actions.submit')}</Button>
                </CardFooter>
              </AvForm>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Profile;


