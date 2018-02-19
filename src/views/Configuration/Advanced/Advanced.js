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
import "react-table/react-table.css";
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
    };
  
    this.handleSubmit = this.handleSubmit.bind(this);
  
  }
  
  componentDidMount() {
    this.loadHostapdConfiguration();
  }
  
  loadHostapdConfiguration () {
    const { t } = this.props;
    
    const request = axios.get(`${ROOT_URL}/api/hotspot/configuration`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status && response.data.status === "success") {
          toastr.info(t('management.basic.load-success'));
          this.setState({ configuration: response.data.result.message });
          // this.setState({ ssid: this.state.configuration[2].value });
          this.extendConfiguration();
        } else {
          toastr.error(t('management.basic.load-error'));
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('management.basic.load-error')+' ' + name, error.message);
      });
  }
  
  extendConfiguration () {
    const request = axios.get(`${ROOT_URL}/api/hotspot/configurationFields`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        this.setState({ hotspotConfFields: response.data.result.message });
        parent.hotspotConfFields = response.data.result.message;
        for (let i = 0; i < this.state.configuration.length; i++) {
          let elt = this.state.configuration[i];
          if (this.state.hotspotConfFields[elt.field]) {
            this.state.configuration[i] = Object.assign({},elt, this.state.hotspotConfFields[elt.field]);
            if (this.state.configuration[i].type === 'number') this.state.configuration[i].value = parseInt(this.state.configuration[i].value);
          }
        }
        this.setState({ content: this.buildDisplayConfiguration() });
      });
  }
  
  buildDisplayConfiguration() {
    let contentDisplay = [];
    for (let i = 0; i < this.state.configuration.length; i++ ) {
      // console.log(this.state.configuration[i]);
      // console.log(this.state.configuration[i]["field"])
      contentDisplay.push(
        <AvGroup key={i}>
          <Label htmlFor="{this.state.configuration[i]['field']}">{this.state.configuration[i]['display']}</Label>
          {this.renderField(i)}
        </AvGroup>
      )
    }
    return (
      <div>
        { contentDisplay }
      </div>
    );
  }
  
  renderField(fieldId) {
    var displayedField = this.state.configuration[fieldId];
    console.log(displayedField);
    if (displayedField.type == "select") {
      let options = [];
      for (var i in displayedField.data) {
        options.push(
          <option key={i} value={displayedField.data[i]['value']}>{displayedField.data[i]['text']}</option>
        )
      }
      return (
        <AvField type="select" id={displayedField.field} name={displayedField.field} value={displayedField.value}>
          { options }
        </AvField>
      )
    }
    if (displayedField.type == "number") {
      return (
        <AvField id={displayedField.field} type="number" max={displayedField.data.max} min={displayedField.data.min} name={displayedField.field} value={displayedField.value} helpMessage={displayedField.help}>
      
        </AvField>
      )
    }
    if (displayedField.type == "text") {
      return (
        <AvField id={displayedField.field} type="text" name={displayedField.field} value={displayedField.value} helpMessage={displayedField.help} validate={displayedField.data}>
      
        </AvField>
      )
    }
    return (
      <AvField id={displayedField.field} name={displayedField.field} value={displayedField.value} helpMessage={displayedField.help}>
      
      </AvField>
    )
  }
  
  handleChange(e) {
  }
  
  handleSubmit () {
    const { t } = this.props;
  }
  
  render() {
    const { t } = this.props;
    return (
      <div className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <AvForm>
                <CardHeader>
                  {t('management.basic.basic.title')}
                </CardHeader>
                <CardBody>
                  {!this.state.content && (
                    <Spinner id="spinner" name="ball-grid-pulse" color="#4875b4"/>
                  )}
                  {this.state.content && (
                    <div>
                      { this.state.content }
                    </div>
                  )}
{/*
                  <AvGroup>
                    <Label htmlFor="ssid">{t('management.basic.hotspotSSID.hotspotName')}</Label>
                    <AvField id="ssid" name="ssid" value={this.state.ssid} onChange={ this.handleChange.bind(this) }
                             validate={{
                               minLength: {value: 3, errorMessage: t('management.basic.hotspotSSID.error-hotspotNameLength')},
                               required: {errorMessage: t('management.basic.hotspotSSID.error-hotspotNameMissing')}
                             }}/>
                    <AvFeedback>This is an error!</AvFeedback>
                  </AvGroup>
*/}
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

export default translate()(AdvancedAdministration);
