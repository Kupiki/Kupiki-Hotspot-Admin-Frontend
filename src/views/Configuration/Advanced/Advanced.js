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
  
    this.saveHostapdConfiguration = this.saveHostapdConfiguration.bind(this);
  }
  
  componentDidMount() {
    this.loadHostapdConfiguration();
  }
  
  saveHostapdConfiguration () {
    const { t } = this.props;
  
    const request = axios.post(`${ROOT_URL}/api/hotspot/configuration`, {
      configuration: this.state.configuration,
      restart: false
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        toastr.success(t('management.basic.save-success'));
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('management.basic.save-error')+' ' + name, error.message);
      });
  }
  
  loadHostapdConfiguration () {
    const request = axios.get(`${ROOT_URL}/api/hotspot/configuration`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status && response.data.status === "success") {
          this.setState({ configuration: response.data.result.message });
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
    const { t } = this.props;
  
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
        toastr.info(t('management.basic.load-success'));
      });
  }
  
  buildDisplayConfiguration() {
    let contentDisplay = [];
    for (let i = 0; i < this.state.configuration.length; i++ ) {
      contentDisplay.push(
        <AvGroup key={i}>
          <Label htmlFor="{this.state.configuration[i]['field']}">{this.state.configuration[i]['display']}</Label>
          { this.renderField(i) }
        </AvGroup>
      )
    }
    return (
      <div>
        { contentDisplay }
      </div>
    );
  }
  
  handleChange(e, fieldId) {
    const index = this.state.configuration.findIndex(item => item.field === e.target.id);
    let configuration = this.state.configuration;
    configuration[index].value = e.target.value;
    this.setState({ configuration: configuration });
  }
  
  renderField(fieldId) {
    var displayedField = this.state.configuration[fieldId];
    if (displayedField.type == "select") {
      let options = [];
      for (var i in displayedField.data) {
        options.push(
          <option key={i} value={displayedField.data[i]['value']}>{displayedField.data[i]['text']}</option>
        )
      }
      return (
        <AvField
          type="select"
          id={displayedField.field}
          name={displayedField.field}
          value={displayedField.value}
          onChange={ this.handleChange.bind(this) }>
          { options }
        </AvField>
      )
    }
    if (displayedField.type == "number") {
      return (
        <AvField
          id={displayedField.field}
          type="number"
          max={displayedField.data.max}
          min={displayedField.data.min}
          name={displayedField.field}
          value={displayedField.value}
          helpMessage={displayedField.help}
          onChange={ this.handleChange.bind(this) }>
      
        </AvField>
      )
    }
    if (displayedField.type == "text") {
      return (
        <AvField
          id={displayedField.field}
          type="text"
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
  
  render() {
    const { t } = this.props;
    return (
      <div className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <AvForm onValidSubmit={this.saveHostapdConfiguration}>
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
                </CardBody>
                <CardFooter>
                  {this.state.content && (
                    <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> {t('actions.submit')}</Button>
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

export default translate()(AdvancedAdministration);
