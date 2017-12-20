import React, { Component } from 'react';
import {Bar, Line} from 'react-chartjs-2';
import {
  Badge,
  Row,
  Col,
  Progress,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Button,
  ButtonToolbar,
  ButtonGroup,
  ButtonDropdown,
  Label,
  Input,
  Table
} from 'reactstrap';
import Spinner from 'react-spinkit';
import axios from 'axios';
import moment from 'moment';
import 'moment-duration-format';
import ReactTable from 'react-table';
import "react-table/react-table.css";

import { translate } from 'react-i18next';

var Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

// const brandPrimary = '#20a8d8';
// const brandSuccess = '#4dbd74';
// const brandInfo = '#63c2de';
// const brandWarning = '#f8cb00';
// const brandDanger = '#f86c6b';

const kupikiChartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  },
  scales: {
    xAxes: [{
      display: false
    }],
    yAxes: [{
      display: false
    }]
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 0,
      hoverBorderWidth: 3
    }
  }
};

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    const dataSetTemplate = {
      graph: {
        labels: [],
        datasets: [
          {
            backgroundColor: 'rgba(255,255,255,.1)',
            borderColor: 'rgba(255,255,255,.55)',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          }
        ]
      }
    };
    this.state = {
      lng: localStorage.getItem('language'),
      dropdownOpen: false,
      cpuData: JSON.parse(JSON.stringify(dataSetTemplate)),
      diskData: JSON.parse(JSON.stringify(dataSetTemplate)),
      memoryData: JSON.parse(JSON.stringify(dataSetTemplate)),
      uptimeData: JSON.parse(JSON.stringify(dataSetTemplate)),
      servicesData: {}
    };
  
    this.getGraphData('cpu');
    this.getGraphData('disk');
    this.getGraphData('memory');
    this.getGraphData('uptime');
    this.getGraphData('services');
    this.getGraphData('information');
  
    // this.onLanguageChanged = this.onLanguageChanged.bind(this);
    
    // i18next.changeLanguage(this.state.lng);
  }
  
  // componentDidMount() {
  //   i18next.on('languageChanged', this.onLanguageChanged)
  // }
  //
  // componentWillUnmount() {
  //   i18next.off('languageChanged', this.onLanguageChanged)
  // }
  //
  // onLanguageChanged(lng) {
  //   this.setState({
  //     lng: lng
  //   })
  // }
  
  getGraphData(apiRequest) {
    let component = this;
    const request = axios.get(`${ROOT_URL}/api/${apiRequest}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        let eltName = apiRequest+'Data';
        let apiData = component.state[eltName];
  
        apiData = Object.assign({}, apiData, response.data)
        
        if (response.data.chartData) {
          let objData = JSON.parse(response.data.chartData);
          apiData.graph.datasets[0].data = [];
          apiData.graph.labels = [];
          for (let i = 0; i < objData.length; i++) {
            apiData.graph.labels.push(objData[i][0]);
            apiData.graph.datasets[0].data.push(objData[i][1]);
          }
        }
        if (apiRequest === "uptime" && response.data.uptime) {
          let duration = moment.duration(parseInt(response.data.uptime), 'seconds');
          apiData.uptimeLabel = duration.format("D[d] h[h] m[m]");
        }
        let newState = {};
        newState[eltName] = apiData;
        
        component.setState(newState);
      })
      .catch(error => {
        console.log(error)
      })
  };
  
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  
  render() {
    const { t } = this.props;
  
    return (
      <div className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="6" sm="6" lg="3">
            <div className="social-box linkedin">
              <i className="fa fa-heartbeat"></i>
              <div className="chart-wrapper">
                <Line data={this.state.cpuData.graph} options={kupikiChartOpts} height={90}/>
              </div>
              <ul>
                <li>
                  <strong>{this.state.cpuData['1m']}</strong>
                  <span>1m</span>
                </li>
                <li>
                  <strong>{this.state.cpuData['5m']}</strong>
                  <span>5m</span>
                </li>
              </ul>
            </div>
          </Col>

          <Col xs="6" sm="6" lg="3">
            <div className="social-box linkedin">
              <i className="fa fa-hdd-o"></i>
              <div className="chart-wrapper">
                <Line data={this.state.diskData.graph} options={kupikiChartOpts} height={90}/>
              </div>
              <ul>
                <li>
                  <strong>{this.state.diskData['free']} {this.state.diskData['freeUnit']}</strong>
                  <span>{t('dashboard.free')}</span>
                </li>
                <li>
                  <strong>{this.state.diskData['total']} {this.state.diskData['totalUnit']}</strong>
                  <span>{t('dashboard.total')}</span>
                </li>
              </ul>
            </div>
          </Col>

          <Col xs="6" sm="6" lg="3">
            <div className="social-box linkedin">
              <i className="fa fa-microchip"></i>
              <div className="chart-wrapper">
                <Line data={this.state.memoryData.graph} options={kupikiChartOpts} height={90}/>
              </div>
              <ul>
                <li>
                  <strong>{this.state.memoryData['free']} {this.state.memoryData['freeUnit']}</strong>
                  <span>{t('dashboard.free')}</span>
                </li>
                <li>
                  <strong>{this.state.memoryData['total']} {this.state.memoryData['totalUnit']}</strong>
                  <span>{t('dashboard.total')}</span>
                </li>
              </ul>
            </div>
          </Col>

          <Col xs="6" sm="6" lg="3">
            <div className="social-box social-box-single linkedin">
              <i className="fa fa-clock-o"></i>
              <div className="chart-wrapper">
              </div>
              <ul>
                <li>
                  <strong>{this.state.uptimeData['uptimeLabel']}</strong>
                  <span>uptime</span>
                </li>
              </ul>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs="12" sm="12" lg="8">
            <Card>
              <CardHeader>
                {t('dashboard.services')}
                <Label className="switch switch-sm switch-text switch-info float-right mb-0">
                  <Input type="checkbox" className="switch-input"/>
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
                  <ReactTable data={this.state.servicesData.result.message} columns={[
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
                            {row.value && (<Input type="checkbox" disabled className="switch-input" defaultChecked/>)}
                            {!row.value && (<Input type="checkbox" disabled className="switch-input"/>)}
                            <span className="switch-label" data-on="On" data-off="Off"></span>
                            <span className="switch-handle"></span>
                          </Label>
                        </div>
                      )
                    }
                  ]}
                  defaultPageSize={10}
                  className="-striped -highlight"/>
                )}
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="12" lg="4">
            <Card>
              <CardHeader>
                {t('dashboard.summary')}
              </CardHeader>
              <CardBody>
                {!this.state.informationData && (
                  <Spinner id="spinner" name="ball-grid-pulse" color="#4875b4"/>
                )}
                {this.state.informationData && (
                  <ReactTable
                    data={this.state.informationData.information}
                    columns={[
                      {
                        accessor: "name"
                      },{
                        accessor: "value",
                        style: { align: 'center' }
                      }
                    ]}
                    showPagination={false}
                    defaultPageSize={this.state.informationData.information.length}
                    className="-striped -highlight"/>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default translate()(Dashboard);
