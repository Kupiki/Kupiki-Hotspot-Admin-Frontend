import React, { Component } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Label
} from 'reactstrap';
import 'react-table/react-table.css';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import axios from 'axios';
import Spinner from 'react-spinkit';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class Terms extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      portal: {}
    };
  
    this.handleSubmitTerms = this.handleSubmitTerms.bind(this);
  }
  
  componentDidMount() {
    this.loadPortalConfiguration();
  }
  
  handleTermsChange(e) {
    let portal = this.state.portal;
    portal.options.terms[e.target.name] = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
    this.setState({ portal: portal });
  }
  
  loadPortalConfiguration () {
    const { t } = this.props;
    
    const request = axios.get(`${ROOT_URL}/api/portal`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status && response.data.status === 'success') {
          this.setState({ portal: response.data.message });
        } else {
          toastr.error(t('management.basic.portalTermsOptions.error-load'));
        }
      })
      .catch(error => {
        toastr.error(t('management.basic.portalTermsOptions.error-load')+' ' + name, error.message);
      });
  }
  
  handleSubmitTerms () {
    const { t } = this.props;
    
    const request = axios.put(`${ROOT_URL}/api/portal/configuration`, {
      configuration: this.state.portal
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status) {
          switch (response.data.status) {
            case 'success' :
              toastr.success(t('management.basic.portalTermsOptions.success-save'));
              break;
            case 'failed' :
              toastr.error(t('management.basic.portalTermsOptions.error-save'), response.data.code+'<br/>'+response.data.message);
              break;
          }
        } else {
          toastr.error(t('management.basic.portalTermsOptions.error-save'), '');
        }
      })
      .catch(error => {
        console.log(error);
        if (error.response) {
          toastr.error(t('management.basic.portalTermsOptions.error-save'), '');
        }
      });
  }
  
  render() {
    const { t } = this.props;
  
    return (
      <Card>
        <AvForm onValidSubmit={this.handleSubmitTerms}>
          <CardHeader>
            {t('management.basic.portalTermsOptions.title')}
          </CardHeader>
          <CardBody>
            {!this.state.portal.options && (
              <Spinner id='spinner' name='ball-grid-pulse' color='#4875b4'/>
            )}
            {this.state.portal.options && (
              <div>
                <AvGroup>
                  <Label htmlFor='active'>{t('management.basic.portalTermsOptions.termsDisplay')}</Label>
                  <AvInput type='checkbox' name='active' value={ this.state.portal.options.terms.active } onChange={ this.handleTermsChange.bind(this) } className={ 'kupiki-right-checkbox' }/>
                </AvGroup>
                {this.state.portal.options.terms.active && (
                  <AvGroup>
                    <Label htmlFor='message'>{t('management.basic.portalTermsOptions.termsMessage')}</Label>
                    <AvField id='message' name='message' value={ this.state.portal.options.terms.message } onChange={ this.handleTermsChange.bind(this) }/>
                    <Label htmlFor='link'>{t('management.basic.portalTermsOptions.termsLink')}</Label>
                    <AvField id='link' name='link' value={ this.state.portal.options.terms.link } onChange={ this.handleTermsChange.bind(this) }/>
                    <Label htmlFor='error'>{t('management.basic.portalTermsOptions.termsError')}</Label>
                    <AvField id='error' name='error' value={ this.state.portal.options.terms.error } onChange={ this.handleTermsChange.bind(this) }/>
                    <Label htmlFor='terms'>{t('management.basic.portalTermsOptions.termsFull')}</Label>
                    <AvField type="textarea" rows="5" id='terms' name='terms' value={ this.state.portal.options.terms.terms } onChange={ this.handleTermsChange.bind(this) }/>
                    <Label>{t('management.basic.portalTermsOptions.termsResult')}</Label>
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
    )
  }
}

export default translate()(Terms);

