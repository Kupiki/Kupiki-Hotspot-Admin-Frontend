import React, {Component} from 'react';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import {toastr} from 'react-redux-toastr'

import { translate } from 'react-i18next';

var Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class HeaderDropdownLanguage extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.setLanguage = this.setLanguage.bind(this);
  
    this.state = {
      lng: localStorage.getItem('language'),
      dropdownOpen: false,
      username: props.username,
    };
  }
  
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  
  setLanguage(language) {
    const request = axios.post(`${ROOT_URL}/api/users/language`, {
      _id: localStorage.getItem('_id'),
      language: language
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        localStorage.setItem('language', language)
        this.setState({
          lng: language
        });
        toastr.success(this.props.t('user.language.title'), this.props.t('user.language.success'));
      })
      .catch(error => {
        toastr.error(this.props.t('user.language.title'), error.response.status + ' ' + error.response.statusText);
      });
    this.props.i18n.changeLanguage(language);
  }
  
  dropAccnt() {
    const { t } = this.props;
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <i className="fa fa-globe"></i> {this.state.lng}
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header tag="div" className="text-center"><strong>{t('user.language.menu')}</strong></DropdownItem>
          <DropdownItem tag="a"><div onClick={() => this.setLanguage('en')}>English</div></DropdownItem>
          <DropdownItem tag="a"><div onClick={() => this.setLanguage('fr')}>Français</div></DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    const {...attributes} = this.props;
    return (
      this.dropAccnt()
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    username: state.auth.username
  }
}

export default translate()(connect(mapStateToProps)(HeaderDropdownLanguage))
