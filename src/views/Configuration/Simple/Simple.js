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

class SimpleAdministration extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      hostapd: {},
      portal: {}
    };
  
    this.handleSubmitSSID = this.handleSubmitSSID.bind(this);
    this.handleSubmitTerms = this.handleSubmitTerms.bind(this);
  }
  
  componentDidMount() {
    this.loadHostapdConfiguration();
    this.loadPortalConfiguration();
  }
  
  handleChange(e) {
    let hostapd = this.state.hostapd;
    hostapd[this.state.ssidIndex].value = e.target.value;
    this.setState({ hostapd: hostapd });
  }
  
  handleTermsChange(e) {
    let portal = this.state.portal;
    // console.log(portal)
    // console.log(e.target)
    // console.log(e.target.type)
    // console.log(e.target.checked)
    // console.log(e.target.value)
    portal.options.terms[e.target.name] = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
    this.setState({ portal: portal });
    console.log(this.state.portal)
  }
  
  loadPortalConfiguration () {
    const { t } = this.props;
  
    const request = axios.get(`${ROOT_URL}/api/portal/configuration`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status && response.data.status === 'success') {
          toastr.info(t('management.basic.portalOptions.success-load'));
          this.setState({ portal: response.data.result.message });
          console.log(response.data.result.message)
        } else {
          toastr.error(t('management.basic.portalOptions.error-load'));
        }
      })
      .catch(error => {
        toastr.error(t('management.basic.portalOptions.error-load')+' ' + name, error.message);
      });
  }
  
  loadHostapdConfiguration () {
    const { t } = this.props;
  
    const request = axios.get(`${ROOT_URL}/api/hotspot/configuration`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status && response.data.status === 'success') {
          toastr.info(t('management.basic.success-load'));
          this.setState({ hostapd: response.data.result.message });
          let index = this.state.hostapd.findIndex(elt => {
            return elt.field === 'ssid'
          });
          this.setState({ ssidIndex: index });
        } else {
          toastr.error(t('management.basic.error-load'));
        }
      })
      .catch(error => {
        toastr.error(t('management.basic.error-load')+' ' + name, error.message);
      });
  }
  
  handleSubmitSSID () {
    const { t } = this.props;
  
    const request = axios.post(`${ROOT_URL}/api/hotspot/configuration`, {
      configuration: this.state.hostapd
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        console.log( response )
        if (response.data && response.data.status) {
          switch (response.data.status) {
            case 'success' :
              toastr.success(t('management.basic.hotspotSSID.success-hotspotName'));
              break;
            case 'failed' :
              toastr.error(t('management.basic.hotspotSSID.hotspotNameSave'), response.data.result.code+'<br/>'+response.data.result.message);
              break;
          }
        } else {
          toastr.error(t('management.basic.hotspotSSID.hotspotNameSave'), '');
        }
      })
      .catch(error => {
        console.log(error);
        if (error.response) {
          toastr.error(t('management.basic.hotspotSSID.hotspotNameSave'), '');
        }
      });
  }
  
  handleSubmitTerms () {
    const { t } = this.props;
  
    const request = axios.post(`${ROOT_URL}/api/portal/configuration`, {
      configuration: this.state.portal
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status) {
          switch (response.data.status) {
            case 'success' :
              toastr.success(t('management.basic.portalOptions.success-save'));
              break;
            case 'failed' :
              toastr.error(t('management.basic.portalOptions.error-save'), response.data.result.code+'<br/>'+response.data.result.message);
              break;
          }
        } else {
          toastr.error(t('management.basic.portalOptions.error-save'), '');
        }
      })
      .catch(error => {
        console.log(error);
        if (error.response) {
          toastr.error(t('management.basic.portalOptions.error-save'), '');
        }
      });
  }
  
  render() {
    const { t } = this.props;
    return (
      <div className='animated fadeIn'>
        <br/>
        <Row>
          <Col xs='12' sm='12' lg='12'>
            <Card>
              <AvForm onValidSubmit={this.handleSubmitSSID}>
                <CardHeader>
                  {t('management.basic.hotspotSSID.title')}
                </CardHeader>
                <CardBody>
                  {!this.state.ssidIndex && (
                    <Spinner id='spinner' name='ball-grid-pulse' color='#4875b4'/>
                  )}
                  {this.state.ssidIndex && (
                    <AvGroup>
                      <Label htmlFor='ssid'>{t('management.basic.hotspotSSID.hotspotName')}</Label>
                      <AvField id='ssid' name='ssid' value={this.state.hostapd[this.state.ssidIndex].value} onChange={ this.handleChange.bind(this) }
                       validate={{
                         minLength: {value: 3, errorMessage: t('management.basic.hotspotSSID.error-hotspotNameLength')},
                         required: {errorMessage: t('management.basic.hotspotSSID.error-hotspotNameMissing')}
                      }}/>
                    </AvGroup>
                  )}
                </CardBody>
                <CardFooter>
                  {this.state.ssidIndex && (
                    <Button type='submit' size='sm' color='primary'><i className='fa fa-dot-circle-o'></i> {t('actions.submit')}</Button>
                  )}
                </CardFooter>
              </AvForm>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs='12' sm='12' lg='12'>
            <Card>
              <AvForm onValidSubmit={this.handleSubmitTerms}>
                <CardHeader>
                  {t('management.basic.portalOptions.title')}
                </CardHeader>
                <CardBody>
                  {!this.state.portal.options && (
                    <Spinner id='spinner' name='ball-grid-pulse' color='#4875b4'/>
                  )}
                  {this.state.portal.options && (
                    <div>
                      <AvGroup>
                        <Label htmlFor='active'>{t('management.basic.portalOptions.termsDisplay')}</Label>
                        <AvInput type='checkbox' name='active' value={ this.state.portal.options.terms.active } onChange={ this.handleTermsChange.bind(this) }/>
                      </AvGroup>
                      {this.state.portal.options.terms.active && (
                        <AvGroup>
                          <Label htmlFor='message'>{t('management.basic.portalOptions.termsMessage')}</Label>
                          <AvField id='message' name='message' value={ this.state.portal.options.terms.message } onChange={ this.handleTermsChange.bind(this) }/>
                          <Label htmlFor='link'>{t('management.basic.portalOptions.termsLink')}</Label>
                          <AvField id='link' name='link' value={ this.state.portal.options.terms.link } onChange={ this.handleTermsChange.bind(this) }/>
                          <Label htmlFor='error'>{t('management.basic.portalOptions.termsError')}</Label>
                          <AvField id='error' name='error' value={ this.state.portal.options.terms.error } onChange={ this.handleTermsChange.bind(this) }/>
                          <Label htmlFor='terms'>{t('management.basic.portalOptions.termsFull')}</Label>
                          <AvField type="textarea" rows="5" id='terms' name='terms' value={ this.state.portal.options.terms.terms } onChange={ this.handleTermsChange.bind(this) }/>
                          <Label>{t('management.basic.portalOptions.termsResult')}</Label>
                          <div style={{ fontWeight: 700, marginLeft: '50px' }}>
                            <input type="checkbox"/> { this.state.portal.options.terms.message } ( <a href="#"> { this.state.portal.options.terms.link } </a> )
                              <p className="help-block text-danger">
                                { this.state.portal.options.terms.error }
                              </p>
                          </div>
                        </AvGroup>
                      )}
                    </div>
                  )}
                </CardBody>
                <CardFooter>
                  {this.state.portal.options && (
                    <Button type='submit' size='sm' color='primary'><i className='fa fa-dot-circle-o'></i> {t('actions.submit')}</Button>
                  )}
                </CardFooter>
              </AvForm>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default translate()(SimpleAdministration);
