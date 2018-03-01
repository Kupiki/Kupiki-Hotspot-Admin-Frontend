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
  ModalFooter
} from 'reactstrap';
import 'react-table/react-table.css';
import Spinner from 'react-spinkit';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr'
import axios from 'axios';

var Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class AdvancedAdministration extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      configuration: {},
      restartService : false,
      modalSave: false,
      modalReset: false,
      modalReload: false
    };
  
    this.saveHostapdConfiguration = this.saveHostapdConfiguration.bind(this);
    this.loadHostapdConfiguration = this.loadHostapdConfiguration.bind(this);
    this.loadDefaultHostapdConfiguration = this.loadDefaultHostapdConfiguration.bind(this);
    
    this.toggleSave = this.toggleSave.bind(this);
    this.toggleReset = this.toggleReset.bind(this);
    this.toggleReload = this.toggleReload.bind(this);

    this.toggleAll = this.toggleAll.bind(this);
  
  }
  
  componentDidMount() {
    this.loadHostapdConfiguration();
  }
  
  toggleAll(status) {
    this.setState({
      modalSave: status,
      modalReset: status,
      modalReload: status
    });
  }
  
  toggleSave() {
    this.setState({
      modalSave: !this.state.modalSave
    });
  }
  
  toggleReset() {
    this.setState({
      modalReset: !this.state.modalReset
    });
  }
  
  toggleReload() {
    this.setState({
      modalReload: !this.state.modalReload
    });
  }
  
  saveHostapdConfiguration () {
    const { t } = this.props;
  
    this.toggleAll(false);
    const request = axios.post(`${ROOT_URL}/api/hotspot/configuration`, {
      configuration: this.state.configuration,
      restart: this.state.restartService
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status) {
          if (response.data.status === 'success') {
            toastr.success(t('management.advanced.save.success-save'));
          } else {
            toastr.error(t('management.advanced.save.error-save'), response.data.result.message);
          }
        } else {
          toastr.success(t('management.advanced.save.success-save'));
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('management.advanced.save.error-save'), error.message);
      });
  }
  
  loadDefaultHostapdConfiguration (e) {
    this.loadHostapdConfiguration(e, true);
  }
  
  loadHostapdConfiguration (e, reset) {
    const { t } = this.props;
  
    if (e) {
      this.toggleAll(false);
      this.setState({ content: undefined });
    }
    
    let apiURL = ROOT_URL + '/api/hotspot/configuration';
    if (reset) {
      apiURL = ROOT_URL + '/api/hotspot/default';
    }
    
    const request = axios.get(`${apiURL}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status === 'success') {
          this.setState({ configuration: response.data.result.message });
          this.extendConfiguration();
        } else {
          toastr.error(t('management.advanced.load.load-error'));
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('management.advanced.load.load-error'), error.message);
      });
  }
  
  extendConfiguration () {
    const { t } = this.props;
  
    const request = axios.get(`${ROOT_URL}/api/hotspot/configurationFields`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        this.setState({ hotspotConfFields: response.data.result.message });
        parent.hotspotConfFields = response.data.result.message;
        this.state.configuration.forEach((elt, i) => {
          if (this.state.hotspotConfFields[elt.field]) {
            this.state.configuration[i] = Object.assign({},elt, this.state.hotspotConfFields[elt.field]);
            if (this.state.configuration[i].type === 'number') {
              this.state.configuration[i].value = parseInt(this.state.configuration[i].value);
            }
          }
        });
/*
        for (let i in this.state.configuration) {
          let elt = this.state.configuration[i];
          if (this.state.hotspotConfFields[elt.field]) {
            this.state.configuration[i] = Object.assign({},elt, this.state.hotspotConfFields[elt.field]);
            if (this.state.configuration[i].type === 'number') {
              this.state.configuration[i].value = parseInt(this.state.configuration[i].value);
            }
          }
        }
*/
        this.setState({ content: this.buildDisplayConfiguration() });
        toastr.info(t('management.advanced.load.success-load'));
      });
  }
  
  buildDisplayConfiguration() {
    let contentDisplay = [];
    this.state.configuration.forEach((elt, i) => {
      contentDisplay.push(
        <AvGroup key={i}>
          <Label htmlFor='{elt["field"]}'>{elt['display']}</Label>
          { this.renderField(i) }
        </AvGroup>
      )
    });
/*
    for (let i in this.state.configuration) {
      contentDisplay.push(
        <AvGroup key={i}>
          <Label htmlFor="{this.state.configuration[i]['field']}">{this.state.configuration[i]['display']}</Label>
          { this.renderField(i) }
        </AvGroup>
      )
    }
*/
    return (
      <div>
        { contentDisplay }
      </div>
    );
  }
  
  renderField(fieldId) {
    let displayedField = this.state.configuration[fieldId];
    if (displayedField.type === 'select') {
      let options = [];
      displayedField.data.forEach((elt, i) => {
        options.push(
          <option key={i} value={elt['value']}>{elt['text']}</option>
        )
      });
/*
      for (let i in displayedField.data) {
        options.push(
          <option key={i} value={displayedField.data[i]['value']}>{displayedField.data[i]['text']}</option>
        )
      }
*/
      return (
        <AvField
          type='select'
          id={displayedField.field}
          name={displayedField.field}
          value={displayedField.value}
          onChange={ this.handleChange.bind(this) }>
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
          onChange={ this.handleChange.bind(this) }>
      
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
          onChange={ this.handleChange.bind(this) }>
      
        </AvField>
      )
    }
    return (
      <AvField
          id={displayedField.field}
          name={displayedField.field}
          value={displayedField.value}
          helpMessage={displayedField.help}
          onChange={ this.handleChange.bind(this) }>
      
      </AvField>
    )
  }
  
  handleChangeRestart(e) {
    this.setState({ restartService: !this.state.restartService });
  }
  
  handleChange(e) {
    const index = this.state.configuration.findIndex(item => item.field === e.target.id);
    let configurationTmp = this.state.configuration;
    configurationTmp[index].value = e.target.value;
    this.setState({ configuration: configurationTmp });
  }
  
  render() {
    const { t } = this.props;
    return (
      <div className='animated fadeIn'>
        <br/>
        <Row>
          <Col xs='12' sm='12' lg='12'>
            <Card>
              <AvForm color='warning' onValidSubmit={this.toggleSave}>
                <CardHeader>
                  {t('management.advanced.title')}
                </CardHeader>
                <CardBody>
                  <Modal isOpen={ this.state.modalSave } toggle={ this.toggleSave } className={'modal-danger'}>
                    <ModalHeader toggle={ this.toggleSave }>{t('management.advanced.save.title')}</ModalHeader>
                    <ModalBody>
                      <p>{t('management.advanced.save.confirm')}</p>
                      <p style={{marginLeft:20+'px'}}>
                        <Input type='checkbox' id='restart' name='restart' defaultChecked={this.state.restartService} onChange={ this.handleChangeRestart.bind(this) }/>{' '}{t('management.advanced.save.confirmService')}
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color='primary' size='sm' onClick={ this.saveHostapdConfiguration }><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.confirm')}</Button>{' '}
                      <Button color='secondary' size='sm' onClick={ this.toggleSave }><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
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
                    
                    <Button size='sm' color='secondary' onClick={this.toggleReload}><i className='fa fa-ban'></i> {t('actions.reload')}</Button>
                    <Modal isOpen={ this.state.modalReload } toggle={this.toggleReload}
                           className={'modal-secondary ' + this.props.className}>
                      <ModalHeader toggle={this.toggleReload}>{t('management.advanced.reload.title')}</ModalHeader>
                      <ModalBody>
                        {t('management.advanced.reload.confirm')}
                      </ModalBody>
                      <ModalFooter>
                        <Button color='primary' size='sm' onClick={this.loadHostapdConfiguration}><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.confirm')}</Button>{' '}
                        <Button color='secondary' size='sm' onClick={this.toggleReload}><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
                      </ModalFooter>
                    </Modal>
                    
                    <Button size='sm' color='danger' onClick={this.toggleReset}><i className='fa fa-download'></i> {t('actions.reset')}</Button>
                    <Modal isOpen={ this.state.modalReset } toggle={this.toggleReset}
                           className={'modal-danger ' + this.props.className}>
                      <ModalHeader toggle={this.toggleReset}>{t('management.advanced.default.title')}</ModalHeader>
                      <ModalBody>
                        {t('management.advanced.default.confirm')}
                      </ModalBody>
                      <ModalFooter>
                        <Button color='danger' size='sm' onClick={this.loadDefaultHostapdConfiguration}><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.confirm')}</Button>{' '}
                        <Button color='secondary' size='sm' onClick={this.toggleReset}><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
                      </ModalFooter>
                    </Modal>
                  </CardFooter>
                )}
              </AvForm>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default translate()(AdvancedAdministration);
