import React, { Component } from 'react';
import { Line} from 'react-chartjs-2';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Label,
  Input,
} from 'reactstrap';
import Spinner from 'react-spinkit';
import axios from 'axios';
import moment from 'moment';
import 'moment-duration-format';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { toastr } from 'react-redux-toastr';
import { translate } from 'react-i18next';
// import { connect } from 'react-redux';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

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
      servicesFiltered: false,
      cpuData: JSON.parse(JSON.stringify(dataSetTemplate)),
      diskData: JSON.parse(JSON.stringify(dataSetTemplate)),
      memoryData: JSON.parse(JSON.stringify(dataSetTemplate)),
      uptimeData: JSON.parse(JSON.stringify(dataSetTemplate)),
      servicesData: {},
      informationData: {},
      temperatureData: {},
      netflowData: {}
    };

    this.getData('cpu', 'cpuData');
    this.getData('disk', 'diskData');
    this.getData('memory', 'memoryData');
    this.getData('uptime', 'uptimeData');
    this.getData('services', 'servicesData');
    this.getData('information', 'informationData');
    this.getData('temperature', 'temperatureData');
    this.getData('netflow', 'netflowData');

    this.toggleServicesFilter = this.toggleServicesFilter.bind(this);

  }

  getData(apiRequest, stateValue) {
    const { t } = this.props;
    let component = this;
    const request = axios.get(`${ROOT_URL}/api/${apiRequest}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data.status === 'success') {
          let apiData = component.state[stateValue];

          apiData = Object.assign({}, apiData, response.data.message);

          if (response.data.message.chartData) {
            let objData = JSON.parse(response.data.message.chartData);
            apiData.graph.datasets[0].data = [];
            apiData.graph.labels = [];
            for (let i = 0; i < objData.length; i++) {
              apiData.graph.labels.push(objData[i][0]);
              apiData.graph.datasets[0].data.push(objData[i][1]);
            }
          }
          if (apiRequest === 'information') {
            apiData = response.data.message;
          }
          if (apiRequest === 'uptime') {
            let duration = moment.duration(parseInt(response.data.message.uptime), 'seconds');
            apiData.uptimeLabel = duration.format('D[d] h[h] m[m]');
          }
          if (apiRequest === 'services') {
            apiData.fullData = response.data.message;
            let filterByName = function (service) {
              return Config.servicesFilters.includes(service.name);
            };
            apiData.filteredData = apiData.fullData.filter(filterByName);
            apiData.currentData = apiData.fullData;
          }
          if (apiRequest === 'temperature') {
            apiData.value = response.data.message;
          }
          if (apiRequest === 'netflow') {
            apiData.fullData = response.data.message;
          }
          let newState = {};
          newState[stateValue] = apiData;

          component.setState(newState);
        } else {
          toastr.error(t('dashboard.service')+' ' + apiRequest, response.data.message);
        }
      })
      .catch((error) => {
        const errorMessage = (error && error.response && error.response.data && error.response.data.message) ? error.response.data.message : error.message
        toastr.error(t('dashboard.service')+' ' + apiRequest, errorMessage);
      })

  }

  toggleServicesFilter() {
    this.setState({
      servicesFiltered: !this.state.servicesFiltered
    });
    this.state.servicesData.currentData = (this.state.servicesFiltered ? this.state.servicesData.fullData : this.state.servicesData.filteredData);
  }

  render() {
    const { t } = this.props;

    return (
      <div className='animated fadeIn'>
        <br/>
        <Row>
          <Col xs='6' sm='6' lg='3'>
            <div className='social-box linkedin'>
              <i className='fa fa-heartbeat'/>
              <div className='chart-wrapper'>
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

          <Col xs='6' sm='6' lg='3'>
            <div className='social-box linkedin'>
              <i className='fa fa-hdd-o'/>
              <div className='chart-wrapper'>
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

          <Col xs='6' sm='6' lg='3'>
            <div className='social-box linkedin'>
              <i className='fa fa-microchip'/>
              <div className='chart-wrapper'>
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

          <Col xs='6' sm='6' lg={ this.state.temperatureData['value'] !== '' ? '2' : '3' }>
            <div className='social-box social-box-single linkedin'>
              <i className='fa fa-clock-o'/>
              <div className='chart-wrapper'>
              </div>
              <ul>
                <li>
                  <strong>{this.state.uptimeData['uptimeLabel']}</strong>
                  <span>uptime</span>
                </li>
              </ul>
            </div>
          </Col>

					{this.state.temperatureData['value'] !== '' && (
						<Col xs='6' sm='6' lg='1'>
							<div className='social-box social-box-single linkedin'>
								<i className='fa fa-thermometer-empty'/>
								<div className='chart-wrapper'>
								</div>
								<ul>
									<li>
										<strong>{this.state.temperatureData['value']}</strong>
										<span>°C</span>
									</li>
								</ul>
							</div>
						</Col>
					)}
        </Row>

        <Row>
          <Col xs='12' sm='12' lg='8'>
            <Card>
              <CardHeader>
                {t('dashboard.services')}
                <Label className='switch switch-sm switch-text switch-info float-right mb-0'>
                  <Input type='checkbox' className='switch-input' onChange={this.toggleServicesFilter.bind(this)}/>
                  <span className='switch-label' data-on='On' data-off='Off'/>
                  <span className='switch-handle'/>
                </Label>
              </CardHeader>
              <CardBody>
                {!this.state.servicesData.fullData && (
                  <Spinner id='spinner' name='ball-grid-pulse' color='#4875b4'/>
                )}
                {this.state.servicesData.fullData && (
                  <ReactTable
                    data={this.state.servicesData.currentData}
                    columns={[
                      {
                        Header: t('dashboard.service'),
                        accessor: 'name'
                      },{
                        Header: t('dashboard.status'),
                        accessor: 'status',
                        style: { align: 'center' },
                        Cell: row => (
                          <div style={{ width: '100%' , textAlign: 'center' }}>
                            <Label className='switch switch-text switch-pill switch-primary-outline-alt switch-xs'>
                              {row.value && (<Input type='checkbox' disabled className='switch-input' defaultChecked/>)}
                              {!row.value && (<Input type='checkbox' disabled className='switch-input'/>)}
                              <span className='switch-label' data-on='On' data-off='Off'/>
                              <span className='switch-handle'/>
                            </Label>
                          </div>
                        )
                      }
                    ]}
                  defaultPageSize={10}
                  className='-striped -highlight'/>
                )}
              </CardBody>
            </Card>
          </Col>
          <Col xs='12' sm='12' lg='4'>
            <Card>
              <CardHeader>
                {t('dashboard.summary')}
              </CardHeader>
              <CardBody>
                {!this.state.informationData && (
                  <Spinner id='spinner' name='ball-grid-pulse' color='#4875b4'/>
                )}
                {this.state.informationData.length > 0 && (
                  <ReactTable
                    data={this.state.informationData}
                    columns={[
                      {
                        accessor: 'name'
                      },{
                        accessor: 'value',
                        style: { align: 'center' }
                      }
                    ]}
                    showPagination={false}
                    defaultPageSize={this.state.informationData.length}
                    className='-striped -highlight'/>
                )}
              </CardBody>
            </Card>
            {this.state.netflowData.fullData && (
              <Card>
                <CardHeader>
                  {t('dashboard.netflow-title')}
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={this.state.netflowData.fullData}
                    columns={[
                      {
                        accessor: 'name'
                      },{
                        accessor: 'value',
                        style: { align: 'center' }
                      }
                    ]}
                    showPagination={false}
                    defaultPageSize={this.state.netflowData.fullData.length}
                    className='-striped -highlight'/>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    )
  }
}

export default translate()(Dashboard);
