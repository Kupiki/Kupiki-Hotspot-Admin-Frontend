import React, { Component } from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import { translate } from 'react-i18next';
import CoovaMacAuth from './CoovaMacAuth';
import Hostapd from './Hostapd';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class AdvancedAdministration extends Component {
  constructor(props) {
    super(props);
    
    this.state = {};
  }
  
  render() {
    const { t } = this.props;
    return (
      <div className='animated fadeIn'>
        <br/>
        <Row>
          <Col xs='12' sm='12' lg='12'>
            <CoovaMacAuth/>
					</Col>
				</Row>
        <Row>
          <Col xs='12' sm='12' lg='12'>
            <Hostapd/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default translate()(AdvancedAdministration);
