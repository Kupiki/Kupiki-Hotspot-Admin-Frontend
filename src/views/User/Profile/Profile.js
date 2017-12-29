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
import { toastr } from 'react-redux-toastr'
import { translate, i18next } from 'react-i18next';

var Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class Profile extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      lng: localStorage.getItem('language'),
      _id: localStorage.getItem('_id'),
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(event, errors, values) {
    if (!errors.length) {
      const { t } = this.props;

      const request = axios.put(`${ROOT_URL}/api/users/${this.state._id}/password`, {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.token}` }
      });
      request
        .then(response => {
          toastr.success(t('user.password.title'), t('user.password.success'));
          // console.log(response)
        })
        .catch(error => {
          console.log(error)
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
    const { t } = this.props;
  
    return (
      <div className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <AvForm onSubmit={this.handleSubmit}>
                <CardHeader>
                  {t('user.password.title')}
                </CardHeader>
                <CardBody>
                    <AvGroup>
                      <Label htmlFor="currentPassword">{t('user.password.current')}</Label>
                      <AvField type="password" id="currentPassword" name="currentPassword" validate={{
                        minLength: {value: 3, errorMessage: t('user.password.currentTooSmall')},
                        required: {errorMessage: t('user.password.currentMissing')}
                      }}/>
                    </AvGroup>
                    <AvGroup>
                      <Label htmlFor="newPassword">{t('user.password.new')}</Label>
                      <AvField type="password" id="newPassword" name="newPassword" validate={{
                        minLength: {value: 3, errorMessage: t('user.password.currentTooSmall')},
                        required: {errorMessage: t('user.password.currentMissing')}
                      }}/>
                    </AvGroup>
                    <AvGroup>
                      <Label htmlFor="confirmPassword">{t('user.password.confirm')}</Label>
                      <AvField type="password" id="confirmPassword" name="confirmPassword" validate={{
                        minLength: {value: 3, errorMessage: t('user.password.currentTooSmall')},
                        required: {errorMessage: t('user.password.currentMissing')},
                        match:{value:'newPassword', errorMessage: t('user.password.mismatch')}
                      }}/>
                    </AvGroup>
                </CardBody>
                <CardFooter>
                  <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> {t('actions.submit')}</Button>
                </CardFooter>
              </AvForm>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default translate()(Profile);


