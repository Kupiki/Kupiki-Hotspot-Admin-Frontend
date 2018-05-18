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
  Label
} from 'reactstrap';
import Spinner from 'react-spinkit';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr'
import axios from 'axios';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class Hostapd extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      configuration: {},
  
      restartHostapdService : false,
      modalHostapdSave: false,
      modalHostapdReset: false,
      modalHostapdReload: false
    };
  
    this.saveHostapdConfiguration = this.saveHostapdConfiguration.bind(this);
    this.loadHostapdConfiguration = this.loadHostapdConfiguration.bind(this);
    this.loadDefaultHostapdConfiguration = this.loadDefaultHostapdConfiguration.bind(this);
  
    this.toggleHostapdSave = this.toggleHostapdSave.bind(this);
    this.toggleHostapdReset = this.toggleHostapdReset.bind(this);
    this.toggleHostapdReload = this.toggleHostapdReload.bind(this);
    this.toggleHostapdAll = this.toggleHostapdAll.bind(this);
  }
  
  componentDidMount() {
    this.loadHostapdConfiguration();
  }
  
  toggleHostapdAll(status) {
    this.setState({
      modalHostapdSave: status,
      modalHostapdReset: status,
      modalHostapdReload: status
    });
  }
  
  toggleHostapdSave() {
    this.setState({
      modalHostapdSave: !this.state.modalHostapdSave
    });
  }
  
  toggleHostapdReset() {
    this.setState({
      modalHostapdReset: !this.state.modalHostapdReset
    });
  }
  
  toggleHostapdReload() {
    this.setState({
      modalHostapdReload: !this.state.modalHostapdReload
    });
  }
  
  
  saveHostapdConfiguration () {
    const { t } = this.props;
    
    this.toggleHostapdAll(false);
    const request = axios.put(`${ROOT_URL}/api/hotspot/configuration`, {
      configuration: this.state.configuration,
      restart: this.state.restartHostapdService
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status) {
          if (response.data.status === 'success') {
            toastr.success(t('management.advanced.hostapd.save.success-save'));
          } else {
            toastr.error(t('management.advanced.hostapd.save.error-save'), response.data.message);
          }
        } else {
          toastr.success(t('management.advanced.hostapd.save.error-save'));
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('management.advanced.hostapd.save.error-save'), error.message);
      });
  }
  
  loadDefaultHostapdConfiguration (e) {
    this.loadHostapdConfiguration(e, true);
  }
  
  loadHostapdConfiguration (e, reset) {
    const { t } = this.props;
    
    if (e) {
      this.toggleHostapdAll(false);
      this.setState({ content: undefined });
    }
    
    let apiURL = ROOT_URL + '/api/hotspot';
    if (reset) {
      apiURL = ROOT_URL + '/api/hotspot/default';
    }
    
    const request = axios.get(`${apiURL}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status === 'success') {
          this.setState({ configuration: response.data.message });
          this.extendHostapdConfiguration();
        } else {
          toastr.error(t('management.advanced.hostapd.load.load-error'));
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('management.advanced.hostapd.load.load-error'), error.message);
      });
  }
  
  extendHostapdConfiguration () {
    const { t } = this.props;
    
    const request = axios.get(`${ROOT_URL}/api/hotspot/configurationFields`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        this.setState({ hotspotConfFields: response.data.message });
        parent.hotspotConfFields = response.data.message;
        this.state.configuration.forEach((elt, i) => {
          if (this.state.hotspotConfFields[elt.field]) {
            this.state.configuration[i] = Object.assign({},elt, this.state.hotspotConfFields[elt.field]);
            if (this.state.configuration[i].type === 'number') {
              this.state.configuration[i].value = parseInt(this.state.configuration[i].value);
            }
          }
        });
        this.setState({ content: this.buildDisplayConfiguration() });
        // toastr.info(t('management.advanced.hostapd.load.success-load'));
      });
  }
  
  buildDisplayConfiguration() {
    let contentDisplay = [];
    this.state.configuration.forEach((elt, i) => {
      contentDisplay.push(
        <AvGroup key={i}>
          <Label htmlFor='{elt["field"]}'>{elt['display']}</Label>
          { this.renderHostapdField(i) }
        </AvGroup>
      )
    });
    return (
      <div>
        { contentDisplay }
      </div>
    );
  }
  
  renderHostapdField(fieldId) {
    let displayedField = this.state.configuration[fieldId];
    if (displayedField.type === 'select') {
      let options = [];
      displayedField.data.forEach((elt, i) => {
        options.push(
          <option key={i} value={elt['value']}>{elt['text']}</option>
        )
      });
      return (
        <AvField
          type='select'
          id={displayedField.field}
          name={displayedField.field}
          value={displayedField.value}
          onChange={ this.handleHostapdChange.bind(this) }>
          { options }
        </AvField>
      )
    }
    if (displayedField.type === 'number') {
      return (
        <AvField
          id={displayedField.field}
          type='number'
          max={displayedField.data.max}
          min={displayedField.data.min}
          name={displayedField.field}
          value={displayedField.value}
          helpMessage={displayedField.help}
          onChange={ this.handleHostapdChange.bind(this) }>
        
        </AvField>
      )
    }
    if (displayedField.type === 'text') {
      return (
        <AvField
          id={displayedField.field}
          type='text'
          name={displayedField.field}
          value={displayedField.value}
          helpMessage={displayedField.help}
          validate={displayedField.data}
          onChange={ this.handleHostapdChange.bind(this) }>
        
        </AvField>
      )
    }
    return (
      <AvField
        id={displayedField.field}
        name={displayedField.field}
        value={displayedField.value}
        helpMessage={displayedField.help}
        onChange={ this.handleHostapdChange.bind(this) }>
      
      </AvField>
    )
  }
  
  handleHostapdChangeRestart(e) {
    this.setState({ restartHostapdService: !this.state.restartHostapdService });
  }
  
  handleHostapdChange(e) {
    const index = this.state.configuration.findIndex(item => item.field === e.target.id);
    let configurationTmp = this.state.configuration;
    configurationTmp[index].value = e.target.value;
    this.setState({ configuration: configurationTmp });
  }
  
  render() {
    const {t} = this.props;
    return (
      <Card>
        <AvForm color='warning' onValidSubmit={this.toggleHostapdSave}>
          <CardHeader>
            {t('management.advanced.hostapd.title')}
          </CardHeader>
          <CardBody>
            <Modal isOpen={ this.state.modalHostapdSave } toggle={ this.toggleHostapdSave } className={'modal-danger'}>
              <ModalHeader toggle={ this.toggleHostapdSave }>{t('management.advanced.hostapd.save.title')}</ModalHeader>
              <ModalBody>
                <p>{t('management.advanced.hostapd.save.confirm')}</p>
                <p style={{marginLeft:20+'px'}}>
                  <Input type='checkbox' id='restart' name='restart' defaultChecked={this.state.restartHostapdService} onChange={ this.handleHostapdChangeRestart.bind(this) }/>{' '}{t('management.advanced.hostapd.save.confirmService')}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color='primary' size='sm' onClick={ this.saveHostapdConfiguration }><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.confirm')}</Button>{' '}
                <Button color='secondary' size='sm' onClick={ this.toggleHostapdSave }><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
              </ModalFooter>
            </Modal>
            { !this.state.content && (
              <Spinner id='spinner' name='ball-grid-pulse' color='#4875b4'/>
            )}
            { this.state.content && (
              <div>
                { this.state.content }
              </div>
            )}
          </CardBody>
          { this.state.content && (
            <CardFooter>
              <Button type='submit' size='sm' color='primary'><i className='fa fa-dot-circle-o'></i> {t('actions.submit')}</Button>
          
              <Button size='sm' color='secondary' onClick={this.toggleHostapdReload}><i className='fa fa-ban'></i> {t('actions.reload')}</Button>
              <Modal isOpen={ this.state.modalHostapdReload } toggle={this.toggleHostapdReload}
                     className={'modal-secondary ' + this.props.className}>
                <ModalHeader toggle={this.toggleHostapdReload}>{t('management.advanced.hostapd.reload.title')}</ModalHeader>
                <ModalBody>
                  {t('management.advanced.hostapd.reload.confirm')}
                </ModalBody>
                <ModalFooter>
                  <Button color='primary' size='sm' onClick={this.loadHostapdConfiguration}><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.confirm')}</Button>{' '}
                  <Button color='secondary' size='sm' onClick={this.toggleHostapdReload}><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
                </ModalFooter>
              </Modal>
          
              <Button size='sm' color='danger' onClick={this.toggleHostapdReset}><i className='fa fa-download'></i> {t('actions.reset')}</Button>
              <Modal isOpen={ this.state.modalHostapdReset } toggle={this.toggleHostapdReset}
                     className={'modal-danger ' + this.props.className}>
                <ModalHeader toggle={this.toggleHostapdReset}>{t('management.advanced.hostapd.default.title')}</ModalHeader>
                <ModalBody>
                  {t('management.advanced.hostapd.default.confirm')}
                </ModalBody>
                <ModalFooter>
                  <Button color='danger' size='sm' onClick={this.loadDefaultHostapdConfiguration}><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.confirm')}</Button>{' '}
                  <Button color='secondary' size='sm' onClick={this.toggleHostapdReset}><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
                </ModalFooter>
              </Modal>
            </CardFooter>
          )}
        </AvForm>
      </Card>
    )
  }
}

export default translate()(Hostapd);


  
