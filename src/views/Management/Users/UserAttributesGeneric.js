import React, { Component } from 'react';
import {
  Row,
  Button,
  Col,
  Label
} from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr'
import axios from 'axios';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class UserAttributesGeneric extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      user: {},
			attributes: [],
			genericAttributes: {
				'simultaneousUse': 10
			}
    };
  
  }
  
  componentWillReceiveProps(nextProps) {
    if ( nextProps.user.username !== this.state.user.username) {
      this.setState({user: nextProps.user, attributesType: nextProps.attributesType}, () => {
        // this.loadUserAttributes();
      });
    }
  }
	
	loadUserAttributes() {
    const { t } = this.props;
    
    const request = axios.get(`${ROOT_URL}/api/freeradius/${this.state.attributesType}/${this.state.user.username}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    
    request
      .then(response => {
        if (response.data && response.data.status === 'success') {
          this.setState({ attributes: response.data.message });
        } else {
          toastr.error(t('freeradius.user.attributes.'+this.state.user.username+'.error-load'));
        }
      })
      .catch(error => {
        toastr.error(t('freeradius.user.attributes.'+this.state.user.username+'.error-load')+' ' + name, error.message);
      });
	}
	
	handleChange(e) {
    // let configuration = this.state.configuration;
    // configuration[this.state.ssidIndex].value = e.target.value;
    // this.setState({ configuration: configuration });
  }

  render() {
    const { t } = this.props;

    return (
			<Row>
				{/*
				<Col sm='12'>
					<AvGroup>
						<Label htmlFor='simultaneousUse'>{t('freeradius.user.attributes.simultaneous-use')}</Label>
						<AvField id='simultaneousUse' name='simultaneousUse' onChange={ this.handleChange.bind(this) } value={ this.state.user.firstname }/>
					</AvGroup>
				</Col>
				<Col>
					<div>Simultaneous-use := 1</div>
					<div>Limite download - Session/Total</div>
				</Col>
				<Col>
					<div>Limite upload - Session/Total</div>
				</Col>
				<Col>
					<div>Limite horaire - debut/fin</div>
				</Col>
				*/}
		</Row>
    );
  }
}

export default translate()(UserAttributesGeneric);
