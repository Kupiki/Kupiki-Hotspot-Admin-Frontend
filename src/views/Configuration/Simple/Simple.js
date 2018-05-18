import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { translate } from 'react-i18next';
import Terms from './Terms';
import HotspotName from './HotspotName';

class SimpleAdministration extends Component {
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
            <HotspotName/>
          </Col>
        </Row>
        <Row>
          <Col xs='12' sm='12' lg='12'>
            <Terms/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default translate()(SimpleAdministration);
