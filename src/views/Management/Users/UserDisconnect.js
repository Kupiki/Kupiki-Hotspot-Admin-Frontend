import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';
import { translate } from 'react-i18next';
import axios from 'axios';
import { toastr } from 'react-redux-toastr'

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class UserDisconnect extends Component {
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
  
  disconnectUser() {
    const { t } = this.props;

    const request = axios.post(`${ROOT_URL}/api/freeradius/disconnect`, {
      user: this.state.user.username
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        this.toggleModal();
        if (response.data && response.data.status && response.data.status === 'success') {
          toastr.success(t('freeradius.user.disconnect.success-disconnect', {username : this.state.user.username}));
        } else {
          toastr.error(t('freeradius.user.disconnect.error-disconnect', {username : this.state.user.username})+' ' + name, response.data.message);
        }
      })
      .catch(error => {
        this.toggleModal();
        toastr.error(t('freeradius.user.disconnect.error-disconnect', {username : this.state.user.username})+' ' + name, error.message);
      });
  }
  
  render() {
    const { t, modalUserDisconnectOpen } = this.props;
    
    return (
      <Modal size='lg' isOpen={ modalUserDisconnectOpen } toggle={ this.toggleModal } className={'modal-danger'}>
        <ModalHeader>
          {t('freeradius.user.disconnect.title', { username: this.state.user.username })}
        </ModalHeader>
        <ModalBody>
          {t('freeradius.user.disconnect.confirm', { username: this.state.user.username })}
        </ModalBody>
        <ModalFooter>
          <Button color='danger' size='sm' onClick={ () => this.disconnectUser() }><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.confirm')}</Button>{' '}
          <Button color='secondary' size='sm' onClick={ this.toggleModal }><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default translate()(UserDisconnect);
