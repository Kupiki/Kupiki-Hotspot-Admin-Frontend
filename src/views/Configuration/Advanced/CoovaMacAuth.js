import React, { Component } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
} from 'reactstrap';
import 'react-table/react-table.css';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr'
import axios from 'axios';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class CoovaMacAuth extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      configuration: {},
      modalCoovaMacAuthSave: false,
      restartCoovaService : false,
    };
  
    this.loadCoovaMacAuthConfiguration = this.loadCoovaMacAuthConfiguration.bind(this);
    this.saveCoovaMacAuthConfiguration = this.saveCoovaMacAuthConfiguration.bind(this);
    this.handleCoovaMacAuthFieldChange = this.handleCoovaMacAuthFieldChange.bind(this);
    this.toggleCoovaMacAuthModalSave = this.toggleCoovaMacAuthModalSave.bind(this);
  }
  
  componentDidMount() {
    this.loadCoovaMacAuthConfiguration();
  }
  
  loadCoovaMacAuthConfiguration () {
    const { t } = this.props;
    
    let apiURL = ROOT_URL + '/api/coova/macauth';
    
    const request = axios.get(`${apiURL}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status === 'success') {
          this.setState({ configuration : response.data.message });
        } else {
          toastr.error(t('management.advanced.hostapd.load.load-error'));
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('management.advanced.hostapd.load.load-error'), error.message);
      });
  }
  
  saveCoovaMacAuthConfiguration () {
    const {t} = this.props;
    
    this.toggleCoovaMacAuthModalSave();
    const request = axios.put(`${ROOT_URL}/api/coova/macauth`, {
      configuration: this.state.configuration,
      restart: this.state.restartCoovaService
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status) {
          if (response.data.status === 'success') {
            toastr.success(t('management.advanced.coova.macAuthentication.save.success-save'));
          } else {
            toastr.error(t('management.advanced.coova.macAuthentication.error-save'), response.data.message);
          }
        } else {
          toastr.success(t('management.advanced.coova.macAuthentication.save.error-save'));
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('management.advanced.coova.macAuthentication.save.error-save'), error.message);
      });
  }
  
  handleCoovaServiceRestartChange(e) {
    this.setState({ restartCoovaService: !this.state.restartCoovaService });
  }
  
  handleCoovaMacAuthFieldChange(e) {
    let coova = this.state.configuration;
    coova[e.target.name] = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
    this.setState({ coova: coova });
  }
  
  toggleCoovaMacAuthModalSave() {
    this.setState({
      modalCoovaMacAuthSave: !this.state.modalCoovaMacAuthSave
    });
  }
  
  render() {
    const { t } = this.props;
    
    return (
      <Card>
        <AvForm color='warning' onValidSubmit={this.toggleCoovaMacAuthModalSave}>
          <CardHeader>
            {t('management.advanced.coova.title')}
          </CardHeader>
          <CardBody>
            <AvGroup>
              <Label htmlFor='active'>{t('management.advanced.coova.macAuthentication.active')}</Label>
              <AvInput
                type='checkbox'
                name='active'
                onChange={ this.handleCoovaMacAuthFieldChange }
                checked={ this.state.configuration.active }
                className={ 'kupiki-right-checkbox' }/>
            </AvGroup>
            { this.state.configuration.active && (
              <div>
                <AvGroup>
                  <Label htmlFor='authMacPassword'>
                    {t('management.advanced.coova.macAuthentication.password')}
                  </Label>
                  <AvField
                    id='password'
                    name='password'
                    value={ this.state.configuration.password }
                    onChange={ this.handleCoovaMacAuthFieldChange }
                    validate={{
                      minLength: {value: 3, errorMessage: t('management.advanced.coova.macAuthentication.passwordLength')},
                      required: {errorMessage: t('management.advanced.coova.macAuthentication.passwordMissing')}
                    }}/>
                </AvGroup>
              </div>
            )}
          </CardBody>
          <CardFooter>
            <Button type='submit' size='sm' color='primary'><i className='fa fa-dot-circle-o'></i> {t('actions.submit')}</Button>
            <Modal isOpen={ this.state.modalCoovaMacAuthSave } toggle={this.toggleCoovaMacAuthModalSave}
                   className={'modal-danger ' + this.props.className}>
              <ModalHeader toggle={this.toggleCoovaMacAuthSave}>{t('management.advanced.coova.title')}</ModalHeader>
              <ModalBody>
                {t('management.advanced.coova.macAuthentication.save.confirm')}
                <p style={{marginLeft:20+'px'}}>
                  <Input type='checkbox' id='restart' name='restart' defaultChecked={this.state.restartCoovaService} onChange={ this.handleCoovaServiceRestartChange.bind(this) }/>{' '}{t('management.advanced.coova.macAuthentication.save.confirmService')}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' size='sm' onClick={this.saveCoovaMacAuthConfiguration}><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.confirm')}</Button>{' '}
                <Button color='secondary' size='sm' onClick={this.toggleCoovaMacAuthModalSave}><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
              </ModalFooter>
            </Modal>
          </CardFooter>
        </AvForm>
      </Card>
    )
  }
}

export default translate()(CoovaMacAuth);
