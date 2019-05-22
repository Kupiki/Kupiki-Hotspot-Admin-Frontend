import React, { Component } from 'react';
import {
  Row,
  Button,
  Col,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Collapse
} from 'reactstrap';
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
      editUser: false,
      collapseAdvanced: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.validateUniqueUser = this.validateUniqueUser.bind(this);
		this.toggleAdvanced = this.toggleAdvanced.bind(this);
  }

  componentWillReceiveProps(nextProps) {
		if (nextProps.action === 'create') {
      this.setState({ user: {}, editUser: false, collapseAdvanced: false });
		} else if (typeof nextProps.user !== 'undefined' && nextProps.user !== this.state.user) {
      this.setState({ user: nextProps.user, editUser: true, collapseAdvanced: false });
    }
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
    const request = axios.post(`${ROOT_URL}/api/freeradius/radcheck`, {
			username: this.state.user.username,
      attributes: [{
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
            // Save userinfo record
            const requestInfo = axios.post(`${ROOT_URL}/api/freeradius/userinfo`, {
              userinfo: this.state.user
            }, {
              headers: { 'Authorization': `Bearer ${localStorage.token}` }
            });
            requestInfo
              .then(response => {
                if (response.data && response.data.status && response.data.status === 'success') {
                    toastr.success(t('freeradius.user.success-save'));
                    this.props.callback();
                } else {
                  toastr.error(t('freeradius.user.error-save'), response.data.message)
                }
              })
              .catch(error => {
                console.log(error);
                toastr.error(t('freeradius.user.error-save'), error.message);
              });
          } else {
            toastr.error(t('freeradius.user.error-save'), response.data.message);
          }
        } else {
          toastr.error(t('freeradius.user.error-save'), response.data.message)
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('freeradius.user.error-save'), error.message);
			});
  }

  validateUniqueUser (value, ctx, input, cb) {
    const { t } = this.props;
    let user = this.props.existingUsers.find( element => {
      return element.username === value;
    });
    cb((typeof user !== 'undefined' && this.props.action === 'create') ? t('freeradius.user.error-username-exists') : true)
  }

  toggleAdvanced() {
    this.setState({ collapseAdvanced: !this.state.collapseAdvanced });
  }

  render() {
    const { t, action, modalUserOpen } = this.props;

    return (
      <Modal size='lg' isOpen={ modalUserOpen } toggle={ this.toggleModal } className={'modal-primary'}>
        <AvForm onValidSubmit={ this.handleSubmit }>
          <ModalHeader toggle={ this.toggleModal }>
            {!this.state.editUser && (
              <span>{t('freeradius.user.create')}</span>
            )}
            {this.state.editUser && (
              <span>{t('freeradius.user.edit')}</span>
            )}
          </ModalHeader>
          <ModalBody>
            <AvGroup>
              <Label htmlFor='username'>{t('freeradius.user.username-label')}</Label>
              <AvField id='username' name='username' onChange={ this.handleChange.bind(this) } disabled={ action !== 'create' }
                       value={ this.state.user.username || '' }
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
                       value={ this.state.user.password }
                       validate={{
                         minLength: { value: 3, errorMessage: t('freeradius.user.error-password-length', { lenPassword: 3 }) },
                         required: { errorMessage: t('freeradius.user.error-password-mandatory') }
                       }}/>
                </AvGroup>
              </Col>
            </Row>
            <Collapse isOpen={this.state.collapseAdvanced}>
							<AvGroup>
                <Label htmlFor='firstname'>{t('freeradius.user.firstname-label')}</Label>
                <AvField id='firstname' name='firstname' onChange={ this.handleChange.bind(this) } value={ this.state.user.firstname }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='lastname'>{t('freeradius.user.lastname-label')}</Label>
                <AvField id='lastname' name='lastname' onChange={ this.handleChange.bind(this) } value={ this.state.user.lastname }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='email'>{t('freeradius.user.email-label')}</Label>
                <AvField id='email' name='email' onChange={ this.handleChange.bind(this) } value={ this.state.user.email }
                         validate={{
                           email: { errorMessage: t('freeradius.user.error-email-format') }
                         }}/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='department'>{t('freeradius.user.department-label')}</Label>
                <AvField id='department' name='department' onChange={ this.handleChange.bind(this) } value={ this.state.user.department }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='company'>{t('freeradius.user.company-label')}</Label>
                <AvField id='company' name='company' onChange={ this.handleChange.bind(this) } value={ this.state.user.company }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='workphone'>{t('freeradius.user.workphone-label')}</Label>
                <AvField id='workphone' name='workphone' onChange={ this.handleChange.bind(this) } value={ this.state.user.workphone }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='homephone'>{t('freeradius.user.homephone-label')}</Label>
                <AvField id='homephone' name='homephone' onChange={ this.handleChange.bind(this) } value={ this.state.user.homephone }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='mobilephone'>{t('freeradius.user.mobilephone-label')}</Label>
                <AvField id='mobilephone' name='mobilephone' onChange={ this.handleChange.bind(this) } value={ this.state.user.mobilephone }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='address'>{t('freeradius.user.address-label')}</Label>
                <AvField id='address' name='address' onChange={ this.handleChange.bind(this) } value={ this.state.user.address }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='city'>{t('freeradius.user.city-label')}</Label>
                <AvField id='city' name='city' onChange={ this.handleChange.bind(this) } value={ this.state.user.city }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='state'>{t('freeradius.user.state-label')}</Label>
                <AvField id='state' name='state' onChange={ this.handleChange.bind(this) } value={ this.state.user.state }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='country'>{t('freeradius.user.country-label')}</Label>
                <AvField id='country' name='country' onChange={ this.handleChange.bind(this) } value={ this.state.user.country }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='zip'>{t('freeradius.user.zip-label')}</Label>
                <AvField id='zip' name='zip' onChange={ this.handleChange.bind(this) } value={ this.state.user.zip }/>
              </AvGroup>
              <AvGroup>
                <Label htmlFor='notes'>{t('freeradius.user.notes-label')}</Label>
                <AvInput type="textarea" name="notes" id="notes" placeholder="Notes" onChange={ this.handleChange.bind(this) }/>
              </AvGroup>
            </Collapse>
          </ModalBody>
          <ModalFooter>
            {!this.state.collapseAdvanced && (
              <Button color='secondary' size='sm' onClick={this.toggleAdvanced} className='mr-auto'><i className='fa fa-plus-circle'></i>{' '}{t('freeradius.user.advancedconfiguration')}</Button>
            )}
            {this.state.collapseAdvanced && (
              <Button color='secondary' size='sm' onClick={this.toggleAdvanced} className='mr-auto'><i className='fa fa-plus-circle'></i>{' '}{t('freeradius.user.basicconfiguration')}</Button>
            )}{' '}
						<Button type='submit' color='primary' size='sm'><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.save')}</Button>{' '}
						<Button color='secondary' size='sm' onClick={ this.toggleModal }><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }
}

export default translate()(UserEdit);
