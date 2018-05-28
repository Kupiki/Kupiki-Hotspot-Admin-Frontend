import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { translate } from 'react-i18next';
import axios from 'axios';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class UserDelete extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      user: {}
    };
  
    this.toggleModal = this.toggleModal.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.user !== 'undefined' && nextProps.user !== this.state.user) {
      this.setState({ user: nextProps.user });
    }
  }
  
  toggleModal() {
    this.props.callback();
  }
  
  deleteUser() {
    const { t } = this.props;
    
    const request = axios.delete(`${ROOT_URL}/api/freeradius/${this.state.user.username}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status && response.data.status === 'success') {
          this.toggleModal();
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
    const { t, modalUserDeleteOpen } = this.props;
  
    return (
      <Modal size='lg' isOpen={ modalUserDeleteOpen } toggle={ this.toggleModal } className={'modal-danger'}>
        <ModalHeader toggle={ this.toggleModal }>
          {t('freeradius.user.delete', { username: this.state.user.username })}
        </ModalHeader>
        <ModalBody>
          {t('freeradius.user.delete-confirm', { username: this.state.user.username })}
        </ModalBody>
        <ModalFooter>
          <Button color='danger' size='sm' onClick={ () => this.deleteUser() }><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.confirm')}</Button>{' '}
          <Button color='secondary' size='sm' onClick={ this.toggleModal }><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default translate()(UserDelete);
