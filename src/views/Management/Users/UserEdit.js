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
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Collapse
} from 'reactstrap';
import 'react-table/react-table.css';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr'
import axios from 'axios';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class UserEdit extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      user: {},
      modalAddUser: false,
      modalEditUser: false,
      collapseAdvanced: false
    };
  
    console.log(this.props.action);
    console.log(this.props.userId);
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.validateUniqueUser = this.validateUniqueUser.bind(this);
    this.toggleAdvanced = this.toggleAdvanced.bind(this);
  }
  
  toggleModal() {
    this.props.callback();
  }
  
  handleChange(e) {
    let user = this.state.user;
    user[e.target.id] = e.target.value;
    this.setState({ user: user });
  }
  
  handleSubmit () {
    const { t } = this.props;
  
    console.log(this.state.user);
  
    const request = axios.post(`${ROOT_URL}/api/freeradius/user/radcheck`, {
      username: this.state.user.username,
      radcheck: [{
        username: this.state.user.username,
        attribute: 'Cleartext-Password',
        op: ':=',
        value: this.state.user.password
      }]
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status) {
          if (response.data.status === 'success') {
            toastr.success(t('freeradius.user.success-save'));
          } else {
            toastr.error(t('freeradius.user.error-save'), response.data.result.message);
          }
        } else {
          toastr.success(t('freeradius.user.success-save'));
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('freeradius.user.error-save'), error.message);
      });
    // this.props.callback();
  }
  
  validateUniqueUser (value, ctx, input, cb) {
    const { t } = this.props;
    let user = this.props.existingUsers.find(function(element) {
      return element.username === value;
    });
    cb((typeof user !== 'undefined') ? t('freeradius.user.error-username-exists') : true)
  }
  
  toggleAdvanced() {
    this.setState({ collapseAdvanced: !this.state.collapseAdvanced });
  }
  
  render() {
    const { t } = this.props;
    console.log(this.props)
    return (
      <Modal size='lg' isOpen={ this.props.modalUserOpen } toggle={ this.toggleModal } className={'modal-primary'}>
        <AvForm onValidSubmit={ this.handleSubmit }>
          <ModalHeader toggle={ this.toggleModal }>{t('freeradius.user.create')}</ModalHeader>
          <ModalBody>
            <AvGroup>
              <Label htmlFor='username'>{t('freeradius.user.username-label')}</Label>
              <AvField id='username' name='username' onChange={ this.handleChange.bind(this) } disabled={ this.props.action !== 'create' }
                       validate={{
                         minLength: { value: 3, errorMessage: t('freeradius.user.error-username-length', { lenUsername: 3 }) },
                         required: { errorMessage: t('freeradius.user.error-username-mandatory') },
                         async: this.validateUniqueUser
                       }}/>
            </AvGroup>
            <Row>
              <Col>
                <AvGroup>
                  <Label htmlFor='passwordtype'>{t('freeradius.user.passwordtype-label')}</Label>
                  <AvField type='select' id='passwordtype' name='passwordtype' disabled value={'Clear-text'}>
                    <option value={'Clear-text'}>Clear text password</option>
                  </AvField>
                </AvGroup>
              </Col>
              <Col>
                <AvGroup>
                  <Label htmlFor='password'>{t('freeradius.user.password-label')}</Label>
                  <AvField id='password' name='password' onChange={ this.handleChange.bind(this) }
                       validate={{
                         minLength: { value: 3, errorMessage: t('freeradius.user.error-password-length', { lenPassword: 3 }) },
                         required: { errorMessage: t('freeradius.user.error-password-mandatory') }
                       }}/>
                </AvGroup>
              </Col>
            </Row>
            <div className='kupiki-collapse-line' onClick={this.toggleAdvanced}>
              <span className='kupiki-collapse-title'>
                &nbsp;&nbsp;{t('freeradius.user.advancedconfiguration')}&nbsp;&nbsp;
              </span>
              { !this.state.collapseAdvanced && (
                <i className='fa fa-chevron-right kupiki-collapse-chevron float-right'></i>
              )}
              { this.state.collapseAdvanced && (
                <i className='fa fa-chevron-down kupiki-collapse-chevron float-right'></i>
              )}
            </div>
            <Collapse isOpen={this.state.collapseAdvanced}>
              <AvGroup>
                <Label htmlFor='firstname'>{t('freeradius.user.firstname-label')}</Label>
                <AvField id='firstname' name='firstname' onChange={ this.handleChange.bind(this) }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='lastname'>{t('freeradius.user.lastname-label')}</Label>
                <AvField id='lastname' name='lastname' onChange={ this.handleChange.bind(this) }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='email'>{t('freeradius.user.email-label')}</Label>
                <AvField id='email' name='email' onChange={ this.handleChange.bind(this) }
                         validate={{
                           email: { errorMessage: t('freeradius.user.error-email-format') }
                         }}/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='department'>{t('freeradius.user.department-label')}</Label>
                <AvField id='department' name='department' onChange={ this.handleChange.bind(this) }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='company'>{t('freeradius.user.company-label')}</Label>
                <AvField id='company' name='company' onChange={ this.handleChange.bind(this) }/>
              </AvGroup>
            </Collapse>
          </ModalBody>
          <ModalFooter>
            <Button type='submit' color='primary' size='sm'><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.save')}</Button>{' '}
            <Button color='secondary' size='sm' onClick={ this.toggleModal }><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }
}

export default translate()(UserEdit);
