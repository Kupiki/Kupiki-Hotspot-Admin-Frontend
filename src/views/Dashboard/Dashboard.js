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
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';

i18next
  .use(XHR)
  .init({
    initImmediate: true,
    fallbackLng: 'en',
    backend: {
      loadPath: '/lang/locale-{{lng}}.json'
    }
  });

const ROOT_URL = 'http://192.168.10.160:4000'

const brandPrimary = '#20a8d8';
const brandSuccess = '#4dbd74';
const brandInfo = '#63c2de';
const brandWarning = '#f8cb00';
const brandDanger = '#f86c6b';

// Card Chart 1
const cardChartData1 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandPrimary,
      borderColor: 'rgba(255,255,255,.55)',
      data: [65, 59, 84, 84, 51, 55, 40]
    }
  ],
};

const cardChartOpts1 = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      gridLines: {
        color: 'transparent',
        zeroLineColor: 'transparent'
      },
      ticks: {
        fontSize: 2,
        fontColor: 'transparent',
      }

    }],
    yAxes: [{
      display: false,
      ticks: {
        display: false,
        min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
        max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
      }
    }],
  },
  elements: {
    line: {
      borderWidth: 1
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  }
}

// Card Chart 2
const cardChartData2 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandInfo,
      borderColor: 'rgba(255,255,255,.55)',
      data: [1, 18, 9, 17, 34, 22, 11]
    }
  ],
};

const cardChartOpts2 = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      gridLines: {
        color: 'transparent',
        zeroLineColor: 'transparent'
      },
      ticks: {
        fontSize: 2,
        fontColor: 'transparent',
      }

    }],
    yAxes: [{
      display: false,
      ticks: {
        display: false,
        min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
        max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
      }
    }],
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  }
}

// Card Chart 3
const cardChartData3 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: [78, 81, 80, 45, 34, 12, 40]
    }
  ],
};

const cardChartOpts3 = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      display: false
    }],
    yAxes: [{
      display: false
    }],
  },
  elements: {
    line: {
      borderWidth: 2
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
    },
  }
}

// Card Chart 4
const cardChartData4 = {
  labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.3)',
      borderColor: 'transparent',
      data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98]
    }
  ],
};

const cardChartOpts4 = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      display: false,
      barPercentage: 0.6,
    }],
    yAxes: [{
      display: false,
    }]
  }
}

// Social Box Chart
const socialBoxData = [
  {data: [65, 59, 84, 84, 51, 55, 40], label: 'facebook'},
  {data: [1, 13, 9, 17, 34, 41, 38], label: 'twitter'},
  {data: [78, 81, 80, 45, 34, 12, 40], label: 'linkedin'},
  {data: [35, 23, 56, 22, 97, 23, 64], label: 'google'}
];

const makeSocialBoxData = (dataSetNo) => {
  const dataset = socialBoxData[dataSetNo];
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        backgroundColor: 'rgba(255,255,255,.1)',
        borderColor: 'rgba(255,255,255,.55)',
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: dataset.data,
        label: dataset.label,
      }
    ]
  };
  return () => data;
};

const socialChartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
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
      hoverRadius: 4,
      hoverBorderWidth: 3
    }
  }
};

// sparkline charts
const sparkLineChartData = [
  {
    data: [35, 23, 56, 22, 97, 23, 64],
    label: 'New Clients'
  },
  {
    data: [65, 59, 84, 84, 51, 55, 40],
    label: 'Recurring Clients'
  },
  {
    data: [35, 23, 56, 22, 97, 23, 64],
    label: 'Pageviews'
  },
  {
    data: [65, 59, 84, 84, 51, 55, 40],
    label: 'Organic'
  },
  {
    data: [78, 81, 80, 45, 34, 12, 40],
    label: 'CTR'
  },
  {
    data: [1, 13, 9, 17, 34, 41, 38],
    label: 'Bounce Rate'
  }
];

const makeSparkLineData = (dataSetNo, variant) => {
  const dataset = sparkLineChartData[dataSetNo];
  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        backgroundColor: 'transparent',
        borderColor: variant ? variant : '#c2cfd6',
        data: dataset.data,
        label: dataset.label
      }
    ],
  };
  return () => data;
};

const sparklineChartOpts = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    xAxes: [{
      display: false,
    }],
    yAxes: [{
      display: false,
    }]
  },
  elements: {
    line: {
      borderWidth: 2
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    }
  },
  legend: {
    display: false
  }
};

// Main Chart

// convert Hex to RGBA
function convertHex(hex, opacity) {
  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
  return result;
}

//Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var elements = 27;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) {
  data1.push(random(50, 200));
  data2.push(random(80, 100));
  data3.push(65);
}

const mainChart = {
  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: convertHex(brandInfo, 10),
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data1
    },
    {
      label: 'My Second dataset',
      backgroundColor: 'transparent',
      borderColor: brandSuccess,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data2
    },
    {
      label: 'My Third dataset',
      backgroundColor: 'transparent',
      borderColor: brandDanger,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5],
      data: data3
    }
  ]
}

const mainChartOpts = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      gridLines: {
        drawOnChartArea: false,
      }
    }],
    yAxes: [{
      ticks: {
        beginAtZero: true,
        maxTicksLimit: 5,
        stepSize: Math.ceil(250 / 5),
        max: 250
      }
    }]
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    }
  }
}

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
  
    console.log(this.state.language)
    console.log(localStorage.getItem('language'))
    
    this.getGraphData('cpu');
    this.getGraphData('disk');
    this.getGraphData('memory');
    this.getGraphData('uptime');
    this.getGraphData('services');
    this.getGraphData('information');
  
    this.onLanguageChanged = this.onLanguageChanged.bind(this)
  }
  
  componentDidMount() {
    i18next.on('languageChanged', this.onLanguageChanged)
  }
  
  componentWillUnmount() {
    i18next.off('languageChanged', this.onLanguageChanged)
  }
  
  onLanguageChanged(lng) {
    this.setState({
      lng: lng
    })
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
        if (apiRequest === "services" && response.data.status === "success") {
          // apiData.services = apiData.result.message;
/*
          apiData.servicesRender = apiData.result.message.map(function(service, index) {
            return (
              <tr key={index}>
                <td>
                  {service.name}
                </td>
                <td className="text-center">
                  <Label className="switch switch-text switch-pill switch-primary-outline-alt">
                    {service.status && (<Input type="checkbox" disabled className="switch-input" defaultChecked/>)}
                    {!service.status && (<Input type="checkbox" disabled className="switch-input"/>)}
                    <span className="switch-label" data-on="On" data-off="Off"></span>
                    <span className="switch-handle"></span>
                  </Label>
                </td>
              </tr>
            );
          });
*/
        }
        let newState = {};
        newState[eltName] = apiData;
        
        console.log(apiData);

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
    return (
      <div className="animated fadeIn">
        <br/>

{/*        <Row>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-primary">
              <CardBody className="pb-0">
                <ButtonGroup className="float-right">
                  <ButtonDropdown id='card1' isOpen={this.state.card1}
                                  toggle={() => { this.setState({ card1: !this.state.card1 }); }}>
                    <DropdownToggle caret className="p-0" color="transparent">
                      <i className="icon-settings"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem disabled>Disabled action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </ButtonGroup>
                <h4 className="mb-0">9.823</h4>
                <p>Members online</p>
              </CardBody>
              <div className="chart-wrapper px-3" style={{height:'70px'}}>
                <Line data={cardChartData1} options={cardChartOpts1} height={70}/>
              </div>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-info">
              <CardBody className="pb-0">
                <ButtonGroup className="float-right">
                  <Dropdown id='card2' isOpen={this.state.card2}
                            toggle={() => { this.setState({ card2: !this.state.card2 }); }}>
                    <DropdownToggle className="p-0" color="transparent">
                      <i className="icon-location-pin"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </ButtonGroup>
                <h4 className="mb-0">9.823</h4>
                <p>Members online</p>
              </CardBody>
              <div className="chart-wrapper px-3" style={{height:'70px'}}>
                <Line data={cardChartData2} options={cardChartOpts2} height={70}/>
              </div>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-warning">
              <CardBody className="pb-0">
                <ButtonGroup className="float-right">
                  <Dropdown id='card3' isOpen={this.state.card3}
                            toggle={() => { this.setState({ card3: !this.state.card3 }); }}>
                    <DropdownToggle caret className="p-0" color="transparent">
                      <i className="icon-settings"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </ButtonGroup>
                <h4 className="mb-0">9.823</h4>
                <p>Members online</p>
              </CardBody>
              <div className="chart-wrapper px-0" style={{height:'70px'}}>
                <Line data={cardChartData3} options={cardChartOpts3} height={70}/>
              </div>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-danger">
              <CardBody className="pb-0">
                <ButtonGroup className="float-right">
                  <ButtonDropdown id='card4' isOpen={this.state.card4}
                                  toggle={() => { this.setState({ card4: !this.state.card4 }); }}>
                    <DropdownToggle caret className="p-0" color="transparent">
                      <i className="icon-settings"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </ButtonGroup>
                <h4 className="mb-0">9.823</h4>
                <p>Members online</p>
              </CardBody>
              <div className="chart-wrapper px-3" style={{height:'70px'}}>
                <Bar data={cardChartData4} options={cardChartOpts4} height={70}/>
              </div>
            </Card>
          </Col>
        </Row>*/}
{/*        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Traffic</CardTitle>
                    <div className="small text-muted">November 2015</div>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <Button color="primary" className="float-right"><i className="icon-cloud-download"></i></Button>
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <ButtonGroup className="mr-3" data-toggle="buttons" aria-label="First group">
                        <Label htmlFor="option1" className="btn btn-outline-secondary">
                          <Input type="radio" name="options" id="option1"/> Day
                        </Label>
                        <Label htmlFor="option2" className="btn btn-outline-secondary active">
                          <Input type="radio" name="options" id="option2" defaultChecked/> Month
                        </Label>
                        <Label htmlFor="option3" className="btn btn-outline-secondary">
                          <Input type="radio" name="options" id="option3"/> Year
                        </Label>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
                  <Line data={mainChart} options={mainChartOpts} height={300}/>
                </div>
              </CardBody>
              <CardFooter>
                <ul>
                  <li>
                    <div className="text-muted">Visits</div>
                    <strong>29.703 Users (40%)</strong>
                    <Progress className="progress-xs mt-2" color="success" value="40"/>
                  </li>
                  <li className="d-none d-md-table-cell">
                    <div className="text-muted">Unique</div>
                    <strong>24.093 Users (20%)</strong>
                    <Progress className="progress-xs mt-2" color="info" value="20"/>
                  </li>
                  <li>
                    <div className="text-muted">Pageviews</div>
                    <strong>78.706 Views (60%)</strong>
                    <Progress className="progress-xs mt-2" color="warning" value="60"/>
                  </li>
                  <li className="d-none d-md-table-cell">
                    <div className="text-muted">New Users</div>
                    <strong>22.123 Users (80%)</strong>
                    <Progress className="progress-xs mt-2" color="danger" value="80"/>
                  </li>
                  <li className="d-none d-md-table-cell">
                    <div className="text-muted">Bounce Rate</div>
                    <strong>Average 40.15%</strong>
                    <Progress className="progress-xs mt-2" color="primary" value="40"/>
                  </li>
                </ul>
              </CardFooter>
            </Card>
          </Col>
        </Row>*/}

        <Row>
          <Col xs="6" sm="6" lg="3">
            <div className="social-box linkedin">
              <i className="fa fa-heartbeat"></i>
              <div className="chart-wrapper">
                <Line data={this.state.cpuData.graph} options={socialChartOpts} height={90}/>
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
                <Line data={this.state.diskData.graph} options={socialChartOpts} height={90}/>
              </div>
              <ul>
                <li>
                  <strong>{this.state.diskData['free']} {this.state.diskData['freeUnit']}</strong>
                  <span>{i18next.t('dashboard.free')}</span>
                </li>
                <li>
                  <strong>{this.state.diskData['total']} {this.state.diskData['totalUnit']}</strong>
                  <span>{i18next.t('dashboard.total')}</span>
                </li>
              </ul>
            </div>
          </Col>

          <Col xs="6" sm="6" lg="3">
            <div className="social-box linkedin">
              <i className="fa fa-microchip"></i>
              <div className="chart-wrapper">
                <Line data={this.state.memoryData.graph} options={socialChartOpts} height={90}/>
              </div>
              <ul>
                <li>
                  <strong>{this.state.memoryData['free']} {this.state.memoryData['freeUnit']}</strong>
                  <span>{i18next.t('dashboard.free')}</span>
                </li>
                <li>
                  <strong>{this.state.memoryData['total']} {this.state.memoryData['totalUnit']}</strong>
                  <span>{i18next.t('dashboard.total')}</span>
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
                System Services
              </CardHeader>
              <CardBody>
{/*
                <Row>
                  <Col xs="12" md="6" xl="4">
                    <Row>
                      <Col sm="6">
                        <div className="callout callout-info">
                          <small className="text-muted">New Clients</small>
                          <br/>
                          <strong className="h4">9,123</strong>
                          <div className="chart-wrapper">
                            <Line data={makeSparkLineData(0, brandPrimary)} options={sparklineChartOpts} width={100} height={30}/>
                          </div>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="callout callout-danger">
                          <small className="text-muted">Recurring Clients</small>
                          <br/>
                          <strong className="h4">22,643</strong>
                          <div className="chart-wrapper">
                            <Line data={makeSparkLineData(1, brandDanger)} options={sparklineChartOpts} width={100} height={30}/>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <hr className="mt-0"/>
                    <ul className="horizontal-bars">
                      <li>
                        <div className="title">
                          Monday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="34"/>
                          <Progress className="progress-xs" color="danger" value="78"/>
                        </div>
                      </li>
                      <li>
                        <div className="title">
                          Tuesday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="56"/>
                          <Progress className="progress-xs" color="danger" value="94"/>
                        </div>
                      </li>
                      <li>
                        <div className="title">
                          Wednesday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="12"/>
                          <Progress className="progress-xs" color="danger" value="67"/>
                        </div>
                      </li>
                      <li>
                        <div className="title">
                          Thursday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="43"/>
                          <Progress className="progress-xs" color="danger" value="91"/>
                        </div>
                      </li>
                      <li>
                        <div className="title">
                          Friday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="22"/>
                          <Progress className="progress-xs" color="danger" value="73"/>
                        </div>
                      </li>
                      <li>
                        <div className="title">
                          Saturday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="53"/>
                          <Progress className="progress-xs" color="danger" value="82"/>
                        </div>
                      </li>
                      <li>
                        <div className="title">
                          Sunday
                        </div>
                        <div className="bars">
                          <Progress className="progress-xs" color="info" value="9"/>
                          <Progress className="progress-xs" color="danger" value="69"/>
                        </div>
                      </li>
                      <li className="legend">
                        <Badge pill color="info"></Badge>
                        <small>New clients</small>
                        &nbsp; <Badge pill color="danger"></Badge>
                        <small>Recurring clients</small>
                      </li>
                    </ul>
                  </Col>
                  <Col xs="12" md="6" xl="4">
                    <Row>
                      <Col sm="6">
                        <div className="callout callout-warning">
                          <small className="text-muted">Pageviews</small>
                          <br/>
                          <strong className="h4">78,623</strong>
                          <div className="chart-wrapper">
                            <Line data={makeSparkLineData(2, brandWarning)} options={sparklineChartOpts} width={100} height={30}/>
                          </div>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="callout callout-success">
                          <small className="text-muted">Organic</small>
                          <br/>
                          <strong className="h4">49,123</strong>
                          <div className="chart-wrapper">
                            <Line data={makeSparkLineData(3, brandSuccess)} options={sparklineChartOpts} width={100} height={30}/>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <hr className="mt-0"/>
                    <ul className="horizontal-bars type-2">
                      <li>
                        <i className="icon-user"></i>
                        <span className="title">Male</span>
                        <span className="value">43%</span>
                        <div className="bars">
                          <Progress className="progress-xs" color="warning" value="43"/>
                        </div>
                      </li>
                      <li>
                        <i className="icon-user-female"></i>
                        <span className="title">Female</span>
                        <span className="value">37%</span>
                        <div className="bars">
                          <Progress className="progress-xs" color="warning" value="37"/>
                        </div>
                      </li>
                      <li className="divider"></li>
                      <li>
                        <i className="icon-globe"></i>
                        <span className="title">Organic Search</span>
                        <span className="value">191,235 <span className="text-muted small">(56%)</span></span>
                        <div className="bars">
                          <Progress className="progress-xs" color="success" value="56"/>
                        </div>
                      </li>
                      <li>
                        <i className="icon-social-facebook"></i>
                        <span className="title">Facebook</span>
                        <span className="value">51,223 <span className="text-muted small">(15%)</span></span>
                        <div className="bars">
                          <Progress className="progress-xs" color="success" value="15"/>
                        </div>
                      </li>
                      <li>
                        <i className="icon-social-twitter"></i>
                        <span className="title">Twitter</span>
                        <span className="value">37,564 <span className="text-muted small">(11%)</span></span>
                        <div className="bars">
                          <Progress className="progress-xs" color="success" value="11"/>
                        </div>
                      </li>
                      <li>
                        <i className="icon-social-linkedin"></i>
                        <span className="title">LinkedIn</span>
                        <span className="value">27,319 <span className="text-muted small">(8%)</span></span>
                        <div className="bars">
                          <Progress className="progress-xs" color="success" value="8"/>
                        </div>
                      </li>
                      <li className="divider text-center">
                        <Button color="link" size="sm" className="text-muted" data-toggle="tooltip" data-placement="top"
                                title="" data-original-title="show more"><i className="icon-options"></i></Button>
                      </li>
                    </ul>
                  </Col>
                  <Col xs="12" xl="4">
                    <Row>
                      <Col sm="6">
                        <div className="callout">
                          <small className="text-muted">CTR</small>
                          <br/>
                          <strong className="h4">23%</strong>
                          <div className="chart-wrapper">
                            <Line data={makeSparkLineData(4)} options={sparklineChartOpts} width={100} height={30}/>
                          </div>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="callout callout-primary">
                          <small className="text-muted">Bounce Rate</small>
                          <br/>
                          <strong className="h4">5%</strong>
                          <div className="chart-wrapper">
                            <Line data={makeSparkLineData(5, brandPrimary)} options={sparklineChartOpts} width={100} height={30}/>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <hr className="mt-0"/>
                    <ul className="icons-list">
                      <li>
                        <i className="icon-screen-desktop bg-primary"></i>
                        <div className="desc">
                          <div className="title">iMac 4k</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Sold this week</div>
                          <strong>1.924</strong>
                        </div>
                        <div className="actions">
                          <Button color="link" className="text-muted"><i className="icon-settings"></i></Button>
                        </div>
                      </li>
                      <li>
                        <i className="icon-screen-smartphone bg-info"></i>
                        <div className="desc">
                          <div className="title">Samsung Galaxy Edge</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Sold this week</div>
                          <strong>1.224</strong>
                        </div>
                        <div className="actions">
                          <Button color="link" className="text-muted"><i className="icon-settings"></i></Button>
                        </div>
                      </li>
                      <li>
                        <i className="icon-screen-smartphone bg-warning"></i>
                        <div className="desc">
                          <div className="title">iPhone 6S</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Sold this week</div>
                          <strong>1.163</strong>
                        </div>
                        <div className="actions">
                          <Button color="link" className="text-muted"><i className="icon-settings"></i></Button>
                        </div>
                      </li>
                      <li>
                        <i className="icon-user bg-danger"></i>
                        <div className="desc">
                          <div className="title">Premium accounts</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Sold this week</div>
                          <strong>928</strong>
                        </div>
                        <div className="actions">
                          <Button color="link" className="text-muted"><i className="icon-settings"></i></Button>
                        </div>
                      </li>
                      <li>
                        <i className="icon-social-spotify bg-success"></i>
                        <div className="desc">
                          <div className="title">Spotify Subscriptions</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Sold this week</div>
                          <strong>893</strong>
                        </div>
                        <div className="actions">
                          <Button color="link" className="text-muted"><i className="icon-settings"></i></Button>
                        </div>
                      </li>
                      <li>
                        <i className="icon-cloud-download bg-danger"></i>
                        <div className="desc">
                          <div className="title">Ebook</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Downloads</div>
                          <strong>121.924</strong>
                        </div>
                        <div className="actions">
                          <Button color="link" className="text-muted"><i className="icon-settings"></i></Button>
                        </div>
                      </li>
                      <li>
                        <i className="icon-camera bg-warning"></i>
                        <div className="desc">
                          <div className="title">Photos</div>
                          <small>Lorem ipsum dolor sit amet</small>
                        </div>
                        <div className="value">
                          <div className="small text-muted">Uploaded</div>
                          <strong>12.125</strong>
                        </div>
                        <div className="actions">
                          <Button color="link" className="text-muted"><i className="icon-settings"></i></Button>
                        </div>
                      </li>
                      <li className="divider text-center">
                        <Button color="link" size="sm" className="text-muted" data-toggle="tooltip" data-placement="top"
                                title="show more"><i className="icon-options"></i></Button>
                      </li>
                    </ul>
                  </Col>
                </Row>
                <br/>
*/}
                {!this.state.servicesData.status && (
                  <Spinner id="spinner" name="ball-grid-pulse" color="#4875b4"/>
                )}
                {this.state.servicesData.status === "failed" && (
                  <span>Error</span>
                )}
                {this.state.servicesData.status === "success" && (
                  <ReactTable data={this.state.servicesData.result.message} columns={[
                    {
                      Header: "Service",
                      accessor: "name"
                    },{
                      Header: "Status",
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
                System summary
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
                        //Header: "Service",
                        accessor: "name"
                      },{
                        //Header: "Status",
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

export default Dashboard;
