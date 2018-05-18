import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
	CardTitle,
  Button,
	Progress
} from 'reactstrap';
import {Line} from 'react-chartjs-2';
import 'react-table/react-table.css';
import axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { translate, i18next } from 'react-i18next';
import moment from 'moment';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

const brandSuccess = '#4dbd74';
const brandInfo = '#63c2de';

function convertHex(hex, opacity) {
  hex = hex.replace('#', '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
}

class StatisticsMgmt extends Component {
  constructor(props) {
		super(props);

		this.state = {
			users: [],
			currentUser: this.props.match.params.user,
			statistics: {},
			octetsChart: {
				labels: [],
				datasets: [{
					label: "Input",
					backgroundColor: convertHex(brandInfo, 10),
					borderColor: brandInfo,
					pointHoverBackgroundColor: '#fff',
					borderWidth: 2,
					data: []
				}, {
					label: "Output",
					backgroundColor: 'transparent',
					borderColor: brandSuccess,
					pointHoverBackgroundColor: '#fff',
					borderWidth: 2,
					data: []
				}]
			},
			octetsChartOptions: {
				maintainAspectRatio: false,
				legend: {
					display: false
				},
				scales: {
					xAxes: [{
						type: 'time',
						time: {
							unit: 'day',
							unitStepSize: 1,
							displayFormats: {
								'day': 'MMM DD'
							}
						},
						display: true,
						scaleLabel: {
								display: true,
						},
						gridLines: {
							drawOnChartArea: false,
						}
					}],
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				},
				elements: {
					point: {
						radius: 1,
						hitRadius: 10,
						hoverRadius: 4,
						hoverBorderWidth: 3,
					}
				}
			},
			sessionsChart: {
				labels: [],
				datasets: [{
					label: "Sessions per day",
					backgroundColor: convertHex(brandInfo, 10),
					borderColor: brandInfo,
					pointHoverBackgroundColor: '#fff',
					borderWidth: 2,
					lineTension: 0,
					data: []
				}]
			},
			sessionsChartOptions: {
				maintainAspectRatio: false,
				legend: {
					display: false
				},
				scales: {
					xAxes: [{
						type: 'time',
						time: {
							unit: 'day',
							unitStepSize: 1,
							displayFormats: {
								'day': 'MMM DD'
							}
						},
						display: true,
						scaleLabel: {
								display: true,
						},
						gridLines: {
							drawOnChartArea: false,
							offsetGridLines: true
						}
					}],
					yAxes: [{
						ticks: {
							beginAtZero: true,
							stepSize: 1
						}
					}]
				}
			}
		};
	}

	componentDidMount() {
		this.loadStatistics();
  }
	
	formatBytes(a,b) {if(0===a)return{value:0,unit:'Bytes'};let c=1024,d=b||2,e=['Bytes','KB','MB','GB','TB','PB','EB','ZB','YB'],f=Math.floor(Math.log(a)/Math.log(c));return {value:parseFloat((a/Math.pow(c,f)).toFixed(d)),unit:e[f]}}

  loadStatistics () {
		const { t } = this.props;
		
    const requestUsers = axios.get(`${ROOT_URL}/api/freeradius/users`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
		});
		let urlRequest = `${ROOT_URL}/api/freeradius/statistics/`;
		if (this.state.currentUser) urlRequest += this.state.currentUser;

    const requestStatistics = axios.get(urlRequest, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
		});
		requestUsers.then(response => {
			if (response.data && response.data.status === 'success') {
				this.setState({ users: response.data.message });
				requestStatistics
					.then(response => {
						if (response.data && response.data.status === 'success') {
							this.setState({ statistics: response.data.message }, () => this.buildStatisticsSets());
						} else {
							toastr.error(t('freeradius.statistics.error-load'));
						}
					})
					.catch(error => {
						toastr.error(t('freeradius.statistics.error-load')+' ' + name, error.message);
					});
			} else {
				toastr.error(t('freeradius.users.error-load'));
			}
		})
	  .catch(error => {
	    toastr.error(t('freeradius.users.error-load')+' ' + name, error.message);
	  });
  }
	
	buildStatisticsSets() {
		let totalInputOctets = 0;
		let totalOutputOctets = 0;
		// octetsChart
			let octetsChart = this.state.octetsChart; octetsChart.labels = [];
			let inputOctetsData = [], outputOctetsData = [], statistics = {};
			this.state.statistics.octets.forEach( elt => {
				octetsChart.labels.push(elt.startDay);
				inputOctetsData.push(parseInt(elt.totalInputOctets));
				totalInputOctets += parseInt(elt.totalInputOctets);
				outputOctetsData.push(parseInt(elt.totalOutputOctets));
				totalOutputOctets += parseInt(elt.totalOutputOctets)	
			});
			octetsChart.datasets[0].data = inputOctetsData;
			octetsChart.datasets[1].data = outputOctetsData;
			statistics.totalInputOctets = totalInputOctets;
			statistics.totalOutputOctets = totalOutputOctets;
			let volume = this.formatBytes(totalInputOctets,0);
			statistics.totalInputOctetsFormatted = volume.value + ' ' + volume.unit;
			volume = this.formatBytes(totalOutputOctets,0);
			statistics.totalOutputOctetsFormatted = volume.value + ' ' + volume.unit;
		// sessionsChart
			let sessionsChart = this.state.sessionsChart; sessionsChart.labels = [];
			let inputSessionsData = [];
			this.state.statistics.sessionsPerDay.forEach( elt => {
				sessionsChart.labels.push(elt.startDay);
				inputSessionsData.push(parseInt(elt.countSessions));
			});
			sessionsChart.datasets[0].data = inputSessionsData;

		// Update state
		this.setState({ 
			octetsChart: octetsChart,
			sessionsChart: sessionsChart,
			statistics: statistics
		});
		console.log(this.state.statistics);
	}

	render() {
    const { t } = this.props;
    
    return (
      <div className='animated fadeIn'>
        <br/>
				{this.state.currentUser && (
					<Row>
						<Col>
							<Card>
								<CardBody>
									<Row>
										<Col sm="5">
											<CardTitle className="mb-0">{t('freeradius.statistics.card-statistics-user-header', { user: this.state.currentUser })}</CardTitle>
										</Col>
										<Col sm="7" className="d-none d-sm-inline-block">
											<Button color="secondary" className="float-right" onClick={ () => { this.setState({ currentUser: undefined }, () => this.loadStatistics() ) } }><i className="fa fa-close"></i></Button>
										</Col>
									</Row>
								</CardBody>
							</Card>
						</Col>
					</Row>
				)}
				<Row>
					<Col>
						<Card>
							<CardBody>
								<Row>
									<Col sm="5">
										<CardTitle className="mb-0">{t('freeradius.statistics.card-octets-header')}</CardTitle>
										<div className="small text-muted">From { moment(this.state.octetsChart.labels[0]).format('MMM Do YYYY') } to {moment(this.state.octetsChart.labels[this.state.octetsChart.labels.length-1]).format('MMM Do YYYY')}</div>
									</Col>
								</Row>
								<div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
									<Line data={this.state.octetsChart} options={this.state.octetsChartOptions} height={300}/>
								</div>
							</CardBody>
              <CardFooter>
                <ul>
                  <li>
                    <div className="text-muted">Total input Bytes</div>
                    <strong>{this.state.statistics.totalInputOctetsFormatted}</strong>
                    <Progress className="progress-xs mt-2" color="success" value="100"/>
                  </li>
                  <li className="d-none d-md-table-cell">
                    <div className="text-muted">Total output Bytes</div>
                    <strong>{ this.state.statistics.totalOutputOctetsFormatted }</strong>
                    <Progress className="progress-xs mt-2" color="info" value="100"/>
									</li>
								</ul>
							</CardFooter>
						</Card>
						<Card>
							<CardBody>
								<Row>
									<Col sm="5">
										<CardTitle className="mb-0">{t('freeradius.statistics.card-sessions-header')}</CardTitle>
										<div className="small text-muted">From { moment(this.state.sessionsChart.labels[0]).format('MMM Do YYYY') } to {moment(this.state.sessionsChart.labels[this.state.sessionsChart.labels.length-1]).format('MMM Do YYYY')}</div>
									</Col>
								</Row>
								<div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
									<Line data={this.state.sessionsChart} options={this.state.sessionsChartOptions} height={300}/>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</div>
		)
	}
}

export default translate()(StatisticsMgmt);