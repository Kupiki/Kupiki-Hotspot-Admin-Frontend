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
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import Spinner from 'react-spinkit';

import axios from 'axios';
import ReactTable from 'react-table';
import "react-table/react-table.css";

import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr'

var Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class Administration extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { t } = this.props;
    
    return (
      <div className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="12" sm="12" lg="8">
          </Col>
        </Row>
      </div>
    )
  }
}

export default translate()(Administration);
