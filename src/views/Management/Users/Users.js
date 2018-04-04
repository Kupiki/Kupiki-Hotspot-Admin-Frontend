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
  Table,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { translate, i18next } from 'react-i18next';
import UserEdit from './UserEdit';

var Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class UsersMgmt extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      users: [],
      modalUserOpen: false,
      modalDeleteUserOpen: false
    };
  
    this.toggleUserModal = this.toggleUserModal.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
  }
  
  componentDidMount() {
    this.loadUsers();
  }
  
  toggleDeleteModal(username) {
    this.setState({
      modalDeleteUserOpen: !this.state.modalDeleteUserOpen,
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
        if (response.data && response.data.status && response.data.status === 'success') {
          this.setState({ users: response.data.message });
          this.setState({ content: this.buildDisplayUsersList() });
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
          this.toggleDeleteModal();
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
  
  buildDisplayUsersList () {
    let contentDisplay = [];
    this.state.users.forEach((user, userId) => {
      contentDisplay.push(
        <tr key={userId}>
          <td>
            { user.username }
          </td>
          <td>{ user.firstname }</td>
          <td>{ user.lastname }</td>
          <td>
            <Button color='danger' className={'float-right'} size='sm'onClick={ () => this.toggleDeleteModal(user.username) }><i className='fa fa-trash-o'/></Button>
            <Button color='primary' className={'float-right'} size='sm' onClick={ () => this.toggleUserModal('edit', user.username) }><i className='fa fa-edit'/></Button>
            <Badge color="success" className={'float-right'} pill>online</Badge>
          </td>
        </tr>
      )
    });
    return contentDisplay;
  }
  
  render() {
    const { t } = this.props;
    
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
                <Table hover striped responsive size='sm'>
                  <thead>
                  <tr>
                    <th>{t('freeradius.users.list-username')}</th>
                    <th>{t('freeradius.users.list-firstname')}</th>
                    <th>{t('freeradius.users.list-lastname')}</th>
                    <th>{t('freeradius.users.list-actions')}</th>
                  </tr>
                  </thead>
                  <tbody>
                    { this.state.content }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal size='lg' isOpen={ this.state.modalDeleteUserOpen } toggle={ this.toggleDeleteModal } className={'modal-danger'}>
          <ModalHeader toggle={ this.toggleDeleteModal }>
            {t('freeradius.user.delete', { username: this.state.deleteUser })}
          </ModalHeader>
          <ModalBody>
            {t('freeradius.user.delete-confirm', { username: this.state.deleteUser })}
          </ModalBody>
          <ModalFooter>
            <Button color='danger' size='sm' onClick={ () => this.deleteUser(this.state.deleteUser) }><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.confirm')}</Button>{' '}
            <Button color='secondary' size='sm' onClick={ this.toggleDeleteModal }><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default translate()(UsersMgmt);