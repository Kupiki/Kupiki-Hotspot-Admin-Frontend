import React, { Component } from 'react';
import {
  Row,
  Button,
  Col,
  Card,
  CardHeader,
  CardBody,
  Tooltip
} from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { translate, i18next } from 'react-i18next';
import UserEdit from './UserEdit';
import UserDelete from './UserDelete';
import UserCheck from './UserCheck';
import UserDisconnect from './UserDisconnect';
import UserAttributes from './UserAttributes';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class UsersMgmt extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
			users: [],
      dropdownOpen: [],
      tooltipOpen: [],
      modalUserOpen: false,
      modalUserCheckOpen: false,
			modalUserDeleteOpen: false,
      modalUserDisconnectOpen: false,
      modalUserAttributesOpen: false,
			goToUserStatistics: false
    };
  
    this.toggleUserModal = this.toggleUserModal.bind(this);
    this.toggleUserCheckModal = this.toggleUserCheckModal.bind(this);
    this.toggleUserDeleteModal = this.toggleUserDeleteModal.bind(this);
    this.toggleUserDisconnectModal = this.toggleUserDisconnectModal.bind(this);
    this.toggleUserAttributesModal = this.toggleUserAttributesModal.bind(this);
  }
  
  componentDidMount() {
    this.loadUsers();
  }
  
  tooltipToggle(rowId) {
    let tooltip = this.state.tooltipOpen;
    tooltip[rowId] = !tooltip[rowId];
    this.setState({
      tooltipOpen: tooltip
    });
  }
  
  toggleUserDisconnectModal(username) {
    let user = this.state.users.find(function(element) {
      return element.username === username;
    });
    this.setState({
      modalUserDisconnect: user,
      modalUserDisconnectOpen: !this.state.modalUserDisconnectOpen
    });
  }
  
  toggleUserCheckModal(username) {
    let user = this.state.users.find(function(element) {
      return element.username === username;
    });
    this.setState({
      modalUserCheck: user,
      modalUserCheckOpen: !this.state.modalUserCheckOpen
    });
  }
  
  toggleUserDeleteModal(username) {
    let user = this.state.users.find(function(element) {
      return element.username === username;
    });
    this.setState({
      modalUserDeleteOpen: !this.state.modalUserDeleteOpen,
      modalUserDelete: user
    });
    if (!this.state.modalUserDeleteOpen) {
      this.loadUsers();
    }
  }
  
  toggleUserAttributesModal(username) {
    let user = this.state.users.find(function(element) {
      return element.username === username;
    });
    this.setState({
      modalUserAttributesOpen: !this.state.modalUserAttributesOpen,
      modalUserAttributes: user
    });
  }
  
  toggleUserModal(action, username) {
    let user = this.state.users.find(function(element) {
      return element.username === username;
    });
    this.setState({
      modalUserAction: action,
      modalUser: user,
      modalUserOpen: !this.state.modalUserOpen
    });
    if (!this.state.modalUserOpen) {
      this.loadUsers();
    }
	}
	
  loadUsers () {
    const { t } = this.props;
    
    const request = axios.get(`${ROOT_URL}/api/freeradius/users`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status === 'success') {
          this.setState({ users: response.data.message });
        } else {
          toastr.error(t('freeradius.users.error-load'));
        }
      })
      .catch(error => {
        toastr.error(t('freeradius.users.error-load')+' ' + name, error.message);
      });
  }
  
  render() {
    const { t } = this.props;
		
		if (this.state.goToUserStatistics) {
			return <Redirect to={{
				pathname: '/management/statistics/'+this.state.goToUserStatistics
			}}/>
		}
		
    // let options = [];
    // options.push(
    //   { value : 'value1', label: 'label1'}
    // );
    // options.push(
    //   { value : 'value2', label: 'label2'}
    // );
    
    return (
      <div className='animated fadeIn'>
        <br/>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className='fa fa-users'/>{' '}{t('freeradius.users.list-header')}
                <Button color='primary' className={'float-right'} size='sm' onClick={ () => this.toggleUserModal('create') }><i className='fa fa-user-plus'></i></Button>
                <UserEdit
                  action={ this.state.modalUserAction }
                  user={ this.state.modalUser }
                  existingUsers={ this.state.users }
                  modalUserOpen={ this.state.modalUserOpen }
                  callback={ this.toggleUserModal }/>
                <UserDelete
                  user={ this.state.modalUserDelete }
                  modalUserDeleteOpen={ this.state.modalUserDeleteOpen }
                  callback={ this.toggleUserDeleteModal }/>
                <UserCheck
                  user={ this.state.modalUserCheck }
                  modalUserCheckOpen={ this.state.modalUserCheckOpen }
                  callback={ this.toggleUserCheckModal }/>
                <UserDisconnect
                  user={ this.state.modalUserDisconnect }
                  modalUserDisconnectOpen={ this.state.modalUserDisconnectOpen }
                  callback={ this.toggleUserDisconnectModal }/>
                <UserAttributes
                  user={ this.state.modalUserAttributes }
                  modalUserAttributesOpen={ this.state.modalUserAttributesOpen }
                  callback={ this.toggleUserAttributesModal }/>
              </CardHeader>
							<CardBody>
                <ReactTable
								data={this.state.users}
								columns={[
									{
										Header: t('freeradius.users.list-username'),
										accessor: 'username'
									},{
										Header: t('freeradius.users.list-status'),
										accessor: 'status',
										style: { textAlign: 'center', overflow: 'visible' },
										maxWidth: 200,
										Cell: row => (
                      <span>
												<span style={{
                          color: row.value === 0 ? '#ff2e00' : '#57d500',
                          transition: 'all .3s ease'
                        }}>
													<i className='fa fa-circle'></i>
												</span> { row.value === 0 ? 'Offline' : 'Online' }
											</span>
										)
									},{
										Header: t('freeradius.users.list-firstname'),
										accessor: 'firstname'
                  },{
                    Header: t('freeradius.users.list-lastname'),
                    accessor: 'lastname'
                  },{
                    Header: t('freeradius.users.count-radcheck'),
                    accessor: 'countRadcheck',
                    style: { textAlign: 'center' },
                  },{
                    Header: t('freeradius.users.count-radreply'),
                    accessor: 'countRadreply',
                    style: { textAlign: 'center' },
                  },{
										Header: '',
										maxWidth: 50,
										accessor: 'username',
										style: { textAlign: 'center', overflow: 'visible' },
										Cell: row => (
											<span id={ row.value }>
                        <i className='fa fa-ellipsis-v' style={{padding: '0px 20px'}}/>
                        <Tooltip innerClassName={'kupiki-table-tooltip'} hideArrow={ true } placement="left" isOpen={ this.state.tooltipOpen[row.value] } autohide={ false } target={ row.value } toggle={ () => this.tooltipToggle(row.value) }>
                          <i title="Edit" className='fa fa-edit kupiki-table-icon-primary' onClick={ () => this.toggleUserModal('edit', row.value) }/>{' '}
                          <i title="Attributes" className='fa fa-id-card kupiki-table-icon-primary' onClick={ () => this.toggleUserAttributesModal(row.value) }/>{' '}
                          <i title="Statistics" className='fa fa-bar-chart-o kupiki-table-icon-primary' onClick={ () => this.setState({ goToUserStatistics: row.value }) }/>{' '}
                          <i title="Check connectivity" className='fa fa-check-square-o kupiki-table-icon-primary' onClick={ () => this.toggleUserCheckModal(row.value) }/>{' '}
                          {this.state.users.find(x => x.username === row.value).status===1 && (
                            <i title="Disconnect" className='fa fa-sign-out kupiki-table-icon-primary' onClick={ () => this.toggleUserDisconnectModal(row.value) }>{' '}</i>
                          )}
                          <i title="Delete" className='fa fa-trash-o kupiki-table-icon-danger' onClick={ () => this.toggleUserDeleteModal(row.value) }/>
                        </Tooltip>
											</span>
										)
									}
								]}
								defaultPageSize={10}
								className='-striped -highlight' style={{'overflow': 'visible !important'}}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default translate()(UsersMgmt);