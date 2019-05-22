import React, {Component} from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap';
import { connect } from 'react-redux';
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

class HeaderDropdown extends Component {

  constructor(props) {
    super(props);
  
    this.toggle = this.toggle.bind(this);
    this.state = {
      lng: localStorage.getItem("language"),
      dropdownOpen: false,
      username: props.username
    };
  
    i18next.changeLanguage(this.state.lng);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  dropAccnt() {
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <i className="fa fa-user-circle-o"></i> {this.state.username}
        </DropdownToggle>
        <DropdownMenu right>
          {/*<DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>*/}
          {/*<DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>*/}
          {/*<DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>*/}
          {/*<DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>*/}
          {/*<DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>*/}
          <DropdownItem header tag="div" className="text-center"><strong>{i18next.t('user.account')}</strong></DropdownItem>
          <DropdownItem href={'/#/user/profile'}><i className="fa fa-user"></i> {i18next.t('user.profile')}</DropdownItem>
          {/*<DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>*/}
          {/*<DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>*/}
          {/*<DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>*/}
          {/*<DropdownItem divider/>*/}
          {/*<DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>*/}
          <DropdownItem href={'/#/logout'}><i className="fa fa-lock"></i> {i18next.t('user.logout')}</DropdownItem>
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

export default connect(mapStateToProps)(HeaderDropdown)

// export default HeaderDropdown;
