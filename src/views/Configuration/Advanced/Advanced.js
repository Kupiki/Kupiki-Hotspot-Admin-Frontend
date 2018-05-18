import React, { Component } from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import { translate } from 'react-i18next';
import CoovaMacAuth from './CoovaMacAuth';
import Hostapd from './Hostapd';

class AdvancedAdministration extends Component {
  constructor(props) {
    super(props);
    
    this.state = {};
  }
  
  render() {
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
