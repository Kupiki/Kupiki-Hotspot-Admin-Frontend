import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';
import 'react-table/react-table.css';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr'
import axios from 'axios';
import Spinner from 'react-spinkit';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class UserCheck extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      user: {}
    };
    this.toggleModal = this.toggleModal.bind(this);
  
  }
  
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.user !== 'undefined' && nextProps.user !== this.state.user) {
      this.setState({ user: nextProps.user }, () => {
        console.log(this.state.user);
        this.checkUser()
      });
    }
  }
  
  toggleModal() {
    this.props.callback();
  }
  
  checkUser() {
    const { t } = this.props;
  
    const request = axios.get(`${ROOT_URL}/api/freeradius/check/${this.state.user.username}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        this.toggleModal();
        if (response.data && response.data.status && response.data.status === 'success') {
          toastr.success(t('freeradius.user.check.success-check', {username : this.state.user.username}));
        } else {
          toastr.error(t('freeradius.user.check.error-check', {username : this.state.user.username})+' ' + name, response.data.message);
        }
      })
      .catch(error => {
        console.log(error)
        toastr.error(t('freeradius.user.check.error-check', {username : this.state.user.username})+' ' + name, error.message);
      });
  }
  
  render() {
    const { t, modalUserCheckOpen } = this.props;
  
    return (
      <Modal size='lg' isOpen={ modalUserCheckOpen } toggle={ this.toggleModal } className={'modal-primary'}>
        <ModalHeader>
          {t('freeradius.user.check.title', { username: this.state.user.username })}
        </ModalHeader>
        <ModalBody>
          <Spinner id='spinner' name='ball-grid-pulse' color='#4875b4'/>
        </ModalBody>
      </Modal>
    )
  }
}

export default translate()(UserCheck);
