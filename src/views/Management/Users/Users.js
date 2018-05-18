import React, { Component } from 'react';
import {
  Row,
  Button,
  Col,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
	ModalFooter,
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
			modalUserDeleteOpen: false,
			goToUserStatistics: false
    };
  
    this.toggleUserModal = this.toggleUserModal.bind(this);
    this.toggleUserDeleteModal = this.toggleUserDeleteModal.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
  }
  
  componentDidMount() {
    this.loadUsers();
  }
  
  dropdownToggle(e) {
    if (typeof e.currentTarget.id === 'undefined') {
      this.setState({
        dropdownOpen: []
      });
    } else {
      let drop = this.state.dropdownOpen
      drop[e.currentTarget.id] = !drop[e.currentTarget.id]
      this.setState({
        dropdownOpen: drop
      });
    }
  }
  
  tooltipToggle(rowId) {
    let tooltip = this.state.tooltipOpen;
    tooltip[rowId] = !tooltip[rowId]
    this.setState({
      tooltipOpen: tooltip
    });
  }
  
  toggleUserDeleteModal(username) {
    this.setState({
      modalUserDeleteOpen: !this.state.modalUserDeleteOpen,
      deleteUser: username
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
  
  deleteUser( username ) {
    const { t } = this.props;
  
    const request = axios.delete(`${ROOT_URL}/api/freeradius/${username}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status && response.data.status === 'success') {
          this.toggleUserDeleteModal();
          this.loadUsers();
          toastr.info(t('freeradius.user.success-delete'));
        } else {
          toastr.error(t('freeradius.user.error-delete'));
        }
			})
      .catch(error => {
        toastr.error(t('freeradius.user.error-delete')+' ' + name, error.message);
      });
  
  }
  
  render() {
    const { t } = this.props;
		
		if (this.state.goToUserStatistics) {
			return <Redirect to={{
				pathname: '/management/statistics/'+this.state.goToUserStatistics
			}}/>
		}

    return (
      <div className='animated fadeIn'>
        <br/>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className='fa fa-users'/>{' '}{t('freeradius.users.list-header')}
                <Button color='primary' className={'float-right'} size='sm' onClick={ () => this.toggleUserModal('create') }><i className='fa fa-user-plus'></i></Button>
                <UserEdit action={ this.state.modalUserAction } user={ this.state.modalUser } existingUsers={ this.state.users } modalUserOpen={ this.state.modalUserOpen } callback={ this.toggleUserModal }/>
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
										style: { textAlign: 'center' },
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
										Header: '',
										maxWidth: 50,
										accessor: 'username',
										style: { textAlign: 'center', overflow: 'visible' },
										Cell: row => (
											<span id={ row.value }>
                        <i className='fa fa-ellipsis-v' style={{padding: '0px 20px'}}/>
                        <Tooltip innerClassName={'kupiki-table-tooltip'} hideArrow={ true } placement="left" isOpen={ this.state.tooltipOpen[row.value] } autohide={ false } target={ row.value } toggle={ () => this.tooltipToggle(row.value) }>
                          <i title="Edit" className='fa fa-edit kupiki-table-icon-primary' onClick={ () => this.toggleUserModal('edit', row.value) }/>{' '}
                          <i title="Statistics" className='fa fa-bar-chart-o kupiki-table-icon-primary' onClick={ () => this.setState({ goToUserStatistics: row.value }) }/>{' '}
                          <i title="Check connectivity" className='fa fa-check-square-o kupiki-table-icon-primary' onClick={ () => this.setState({ goToUserStatistics: row.value }) }/>{' '}
                          <i title="Disconnect" className='fa fa-sign-out kupiki-table-icon-primary' onClick={ () => this.setState({ goToUserStatistics: row.value }) }/>{' '}
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
        <Modal size='lg' isOpen={ this.state.modalUserDeleteOpen } toggle={ this.toggleUserDeleteModal } className={'modal-danger'}>
          <ModalHeader toggle={ this.toggleUserDeleteModal }>
            {t('freeradius.user.delete', { username: this.state.deleteUser })}
          </ModalHeader>
          <ModalBody>
            {t('freeradius.user.delete-confirm', { username: this.state.deleteUser })}
          </ModalBody>
          <ModalFooter>
            <Button color='danger' size='sm' onClick={ () => this.deleteUser(this.state.deleteUser) }><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.confirm')}</Button>{' '}
            <Button color='secondary' size='sm' onClick={ this.toggleUserDeleteModal }><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default translate()(UsersMgmt);