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
import Spinner from 'react-spinkit';

import axios from 'axios';
import ReactTable from 'react-table';
import "react-table/react-table.css";

import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr'

var Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class Administration extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      lng: localStorage.getItem('language'),
      _id: localStorage.getItem('_id'),
      servicesData: {},
      updateModal: false,
      rebootModal: false,
      shutdownModal: false,
      availableUpgrades: 0,
      filterByName: function(service) {
        return Config.servicesFilters.includes(service.name);
      },
      servicesFiltered: false
    };
    
    this.getGraphData('services');
    this.getAvailableUpgrades();
    this.toggleUpdate = this.toggleUpdate.bind(this);
    this.toggleReboot = this.toggleReboot.bind(this);
    this.toggleShutdown = this.toggleShutdown.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.toggleService = this.toggleService.bind(this);
    this.executeUpgrade = this.executeUpgrade.bind(this);
    this.executeReboot = this.executeReboot.bind(this);
    this.executeShutdown = this.executeShutdown.bind(this);
    
  }
  
  getAvailableUpgrades() {
    const { t } = this.props;
    const request = axios.get(`${ROOT_URL}/api/system/upgrade`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        switch (response.data.status) {
          case 'success' :
            if (parseInt(response.data.result.message) !== 0) {
              this.setState({
                availableUpgrades: parseInt(response.data.result.message)
              });
              toastr.info(t('dashboard.systemupdate.title'), t('dashboard.systemupdate.available', { availableUpgrades: this.state.availableUpgrades }));
            } else {
              toastr.info(t('dashboard.systemupdate.title'), t('dashboard.systemupdate.confirm'));
            }
            break;
          case 'failed' :
            toastr.error(t('dashboard.systemupdate.error-information')+'<br/>'+t('generic.Error')+' '+response.data.result.code+'<br/>'+response.data.result.message, t('dashboard.systemupdate.title'));
            break;
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('dashboard.service')+' ' + name, error.message);
      });
  }
  
  executeReboot() {
    this.toggleReboot();
    const { t } = this.props;
    const request = axios.get(`${ROOT_URL}/api/system/reboot`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        switch (response.data.status) {
          case 'success':
            toastr.success(t('dashboard.systemreboot.title'), t('dashboard.systemreboot.confirm'));
            break;
          case 'failed':
            toastr.error(t('dashboard.systemreboot.title'), t('dashboard.systemreboot.error-start')+'<br/>'+t('generic.Error')+' '+response.data.result.code+'<br/>'+response.data.result.message, {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            break;
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('dashboard.systemreboot.title'), t('dashboard.systemreboot.error-execution'));
      });
  }
  
  executeShutdown() {
    this.toggleShutdown();
    const { t } = this.props;
    const request = axios.get(`${ROOT_URL}/api/system/shutdown`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        switch (response.data.status) {
          case 'success':
            toastr.success(t('dashboard.systemshutdown.title'), t('dashboard.systemshutdown.confirm'));
            break;
          case 'failed':
            toastr.error(t('dashboard.systemshutdown.title'), t('dashboard.systemshutdown.error-start')+'<br/>'+t('generic.Error')+' '+response.data.result.code+'<br/>'+response.data.result.message, {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            break;
        }
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('dashboard.systemshutdown.title'), t('dashboard.systemshutdown.error-execution'));
      });
  }
  
  executeUpgrade() {
    this.toggleUpdate();
    const { t } = this.props;
    const request = axios.get(`${ROOT_URL}/api/system/update`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
      })
      .catch(error => {
        console.log(error);
        toastr.error(t('dashboard.systemupdate.title'), t('dashboard.systemupdate.error-start'));
      });
  }
  
  toggleUpdate() {
    this.setState({
      updateModal: !this.state.updateModal
    });
  }
  
  toggleReboot() {
    this.setState({
      rebootModal: !this.state.rebootModal
    });
  }
  
  toggleShutdown() {
    this.setState({
      shutdownModal: !this.state.shutdownModal
    });
  }
  
  toggleService(service) {
    return (event) => {
      const { t } = this.props;
  
      let {name, status} = service.original;
      
      const request = axios.post(`${ROOT_URL}/api/services`, {
        service: name,
        status: !status
      }, {
        headers: {'Authorization': `Bearer ${localStorage.token}`}
      });
      request
        .then(response => {
          let message = '';
          switch (response.data.status) {
            case 'success' :
              let index = this.state.servicesData.fullData.indexOf(service.original)
              let servicesDataTmp = this.state.servicesData;
              servicesDataTmp.fullData[index].status = !servicesDataTmp.fullData[index].status;
              this.setState({
                servicesData: servicesDataTmp
              });
              this.refreshServices();
              (status) ? message = t('dashboard.systemservices.success-stop', { service: name }) : message = t('dashboard.systemservices.success-start', { service: name });
/*
              message = t('dashboard.systemservices.success-start', { service: name });
              if (status) {
                message = t('dashboard.systemservices.success-stop', { service: name });
              }
*/
              toastr.success(t('dashboard.service')+' ' + name, message);
              break;
            case 'failed' :
              (status) ? message = t('dashboard.systemservices.error-stop', { service: name }) : message = t('dashboard.systemservices.error-start', { service: name });
/*
              message = t('dashboard.systemservices.error-start', { service: name });
              if (status) {
                message = t('dashboard.systemservices.error-stop', { service: name });
              }
*/
              message += '<br/>'+t('generic.Error')+' '+response.data.result.code+'<br/>'+response.data.result.message;
              toastr.error(t('dashboard.service')+' ' + name, message);
              break;
          }
          this.refreshServices();
        })
        .catch(error => {
          console.log(error);
          let message = t('dashboard.systemservices.error-start', { service: name });
          if (status) {
            message = t('dashboard.systemservices.error-stop', { service: name });
          }
          toastr.error(t('dashboard.service')+' ' + name, message);
        });
    }
  }
  
  toggleFilter(e) {
    this.setState({
      servicesFiltered: !this.state.servicesFiltered
    });
    this.refreshServices()
  }
  
  refreshServices() {
    (!this.state.servicesFiltered) ? this.state.servicesData.currentData = this.state.servicesData.fullData.filter(this.state.filterByName) : this.state.servicesData.currentData = this.state.servicesData.fullData;
  }
  
  getGraphData(apiRequest) {
    let component = this;
    const request = axios.get(`${ROOT_URL}/api/${apiRequest}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        let eltName = apiRequest+'Data';
        let apiData = component.state[eltName];
        
        apiData.status = response.data.status;
        
        // apiData = Object.assign({}, apiData, response.data)
        
        // if (response.data.chartData) {
        //   let objData = JSON.parse(response.data.chartData);
        //   apiData.graph.datasets[0].data = [];
        //   apiData.graph.labels = [];
        //   for (let i = 0; i < objData.length; i++) {
        //     apiData.graph.labels.push(objData[i][0]);
        //     apiData.graph.datasets[0].data.push(objData[i][1]);
        //   }
        // }
        // if (apiRequest === "uptime" && response.data.uptime) {
        //   let duration = moment.duration(parseInt(response.data.uptime), 'seconds');
        //   apiData.uptimeLabel = duration.format("D[d] h[h] m[m]");
        // }
        if (apiRequest === "services") {
          apiData.fullData = response.data.result.message;
          apiData.currentData = apiData.fullData;
        }
        let newState = {};
        newState[eltName] = apiData;
        
        component.setState(newState);
      })
      .catch(error => {
        console.log(error)
      })
  };
  
  render() {
    const { t } = this.props;
  
    return (
      <div className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="12" sm="12" lg="8">
            <Card>
              <CardHeader>
                {t('dashboard.services')}
                <Label className="switch switch-sm switch-text switch-info float-right mb-0">
                  <Input type="checkbox" className="switch-input" onChange={this.toggleFilter}/>
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </Label>
              </CardHeader>
              <CardBody>
                {!this.state.servicesData.status && (
                  <Spinner id="spinner" name="ball-grid-pulse" color="#4875b4"/>
                )}
                {this.state.servicesData.status === "failed" && (
                  <span>Error</span>
                )}
                {this.state.servicesData.status === "success" && (
                  <ReactTable
                    defaultPageSize={10}
                    className="-striped -highlight"
                    data={this.state.servicesData.currentData}
                    columns={[
                      {
                        Header: t('dashboard.service'),
                        accessor: "name"
                      },{
                        Header: t('dashboard.status'),
                        accessor: "status",
                        style: { align: 'center' },
                        Cell: row => (
                          <div style={{ width: '100%' , textAlign: 'center' }}>
                            <Label className="switch switch-text switch-pill switch-primary-outline-alt switch-xs">
                              <Input type="checkbox" checked={row.value} className="switch-input" onChange={this.toggleService(row)}/>
                              <span className="switch-label" data-on="On" data-off="Off"></span>
                              <span className="switch-handle"></span>
                            </Label>
                          </div>
                        )
                      }
                    ]}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="12" lg="4">
            <Card>
              <CardHeader>
                {t('sidebar.system')}
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="12" sm="12" lg="4">
                    <Button onClick={this.toggleUpdate} color="primary" className={"btn-block"}><i className="fa fa-chevron-circle-up"></i> {t('dashboard.systemupdate.buttonTitle')}</Button>
                    <Modal isOpen={this.state.updateModal} toggle={this.toggleUpdate} className={'modal-primary ' + this.props.className}>
                      <ModalHeader toggle={this.toggleUpdate}>{t('dashboard.systemupdate.title')}</ModalHeader>
                      <ModalBody>
                        {t('dashboard.systemupdate.ask')}
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={this.executeUpgrade}>{t('actions.submit')}</Button>{' '}
                        <Button color="secondary" onClick={this.toggleUpdate}>{t('actions.cancel')}</Button>
                      </ModalFooter>
                    </Modal>
                  </Col>
                  <Col xs="12" sm="12" lg="4">
                    <Button onClick={this.toggleReboot} color="danger" className={"btn-block"}><i className="fa fa-refresh"></i> {t('dashboard.systemreboot.buttonTitle')}</Button>
                    <Modal isOpen={this.state.rebootModal} toggle={this.toggleReboot} className={'modal-danger ' + this.props.className}>
                      <ModalHeader toggle={this.toggleReboot}>{t('dashboard.systemreboot.title')}</ModalHeader>
                      <ModalBody>
                        {t('dashboard.systemreboot.ask')}
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" onClick={this.executeReboot}>{t('actions.submit')}</Button>{' '}
                        <Button color="secondary" onClick={this.toggleReboot}>{t('actions.cancel')}</Button>
                      </ModalFooter>
                    </Modal>
                  </Col>
                  <Col xs="12" sm="12" lg="4">
                    <Button onClick={this.toggleShutdown} color="danger" className={"btn-block"}><i className="fa fa-power-off"></i> {t('dashboard.systemshutdown.buttonTitle')}</Button>
                    <Modal isOpen={this.state.shutdownModal} toggle={this.toggleReboot} className={'modal-danger ' + this.props.className}>
                      <ModalHeader toggle={this.toggleShutdown}>{t('dashboard.systemshutdown.title')}</ModalHeader>
                      <ModalBody>
                        {t('dashboard.systemshutdown.ask')}
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" onClick={this.executeShutdown}>{t('actions.submit')}</Button>{' '}
                        <Button color="secondary" onClick={this.toggleShutdown}>{t('actions.cancel')}</Button>
                      </ModalFooter>
                    </Modal>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default translate()(Administration);


