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
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr'
import axios from 'axios';

var Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class Administration extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      configuration: {},
      ssid: ''
    }
  
    this.handleSubmitSSID = this.handleSubmitSSID.bind(this);

  }
  
  componentDidMount() {
    this.loadHostapdConfiguration();
  }
  
  handleChange(e) {
    let configuration = this.state.configuration;
    configuration[2].value = e.target.value;
    this.setState({ ssid: e.target.value });
    this.setState({ configuration: configuration });
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
          this.setState({ ssid: this.state.configuration[2].value });
        } else {
          toastr.error(t('management.basic.load-error'));
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('management.basic.load-error')+' ' + name, error.message);
      });
  }
  
  handleSubmitSSID () {
    const { t } = this.props;
  
    const request = axios.post(`${ROOT_URL}/api/hotspot/configuration`, {
      configuration: this.state.configuration
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        console.log(response)
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
  
  render() {
    const { t } = this.props;
    return (
      <div className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <AvForm onValidSubmit={this.handleSubmitSSID}>
                <CardHeader>
                  {t('management.basic.basic.title')}
                </CardHeader>
                <CardBody>
                  <AvGroup>
                    <Label htmlFor="ssid">{t('management.basic.hotspotSSID.hotspotName')}</Label>
                    <AvField id="ssid" name="ssid" value={this.state.ssid} onChange={ this.handleChange.bind(this) }
                     validate={{
                       minLength: {value: 3, errorMessage: t('management.basic.hotspotSSID.error-hotspotNameLength')},
                       required: {errorMessage: t('management.basic.hotspotSSID.error-hotspotNameMissing')}
                    }}/>
                    <AvFeedback>This is an error!</AvFeedback>
                  </AvGroup>
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

export default translate()(Administration);
