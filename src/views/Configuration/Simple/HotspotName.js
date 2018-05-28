import React, { Component } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Label,
} from 'reactstrap';
import 'react-table/react-table.css';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import axios from 'axios';
import Spinner from 'react-spinkit';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class HotspotName extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      configuration: {}
    };
  
    this.handleSubmitSSID = this.handleSubmitSSID.bind(this);
  }
  
  componentDidMount() {
    this.loadHostapdConfiguration();
  }
  
  handleChange(e) {
    let configuration = this.state.configuration;
    configuration[this.state.ssidIndex].value = e.target.value;
    this.setState({ configuration: configuration });
  }
  
  loadHostapdConfiguration () {
    const { t } = this.props;
    
    const request = axios.get(`${ROOT_URL}/api/hotspot`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status && response.data.status === 'success') {
          this.setState({ configuration: response.data.message });
          let index = this.state.configuration.findIndex(elt => {
            return elt.field === 'ssid'
          });
          this.setState({ ssidIndex: index });
        } else {
          toastr.error(t('management.basic.hotspotSSID.error-load'), response.data.message);
        }
      })
      .catch(error => {
        console.log(error)
        toastr.error(t('management.basic.hotspotSSID.error-load')+' ' + name, error.message);
      });
  }
  
  handleSubmitSSID () {
    const { t } = this.props;
    
    const request = axios.put(`${ROOT_URL}/api/hotspot/configuration`, {
      configuration: this.state.configuration
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status) {
          switch (response.data.status) {
            case 'success' :
              toastr.success(t('management.basic.hotspotSSID.success-save'));
              break;
            case 'failed' :
              toastr.error(t('management.basic.hotspotSSID.error-save'), response.data.code+'<br/>'+response.data.message);
              break;
          }
        } else {
          toastr.error(t('management.basic.hotspotSSID.error-save'), '');
        }
      })
      .catch(error => {
        if (error.response) {
          toastr.error(t('management.basic.hotspotSSID.error-save'), '');
        }
      });
  }
  
  render() {
    const { t } = this.props;
    
    return (
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
                <AvField id='ssid' name='ssid' value={this.state.configuration[this.state.ssidIndex].value} onChange={ this.handleChange.bind(this) }
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
    )
  }
}

export default translate()(HotspotName);

