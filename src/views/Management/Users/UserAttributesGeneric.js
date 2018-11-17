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

import { getObjWhenPropertyEquals, shallowCompare } from '../../../utils/Utils.js';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class UserAttributesGeneric extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      attributes: [],
      genericAttributes: [
        {
          id          : 'simultaneousUse',
          name        : 'Simultaneous-Use',
          operator    : ':=',
          type        : 'radcheck',
          deleteValue : '0'
        }
      ]
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('Hello')
    // console.log(shallowCompare(this, nextProps, nextState))
    // return shallowCompare(this, nextProps, nextState);
    return true;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({user: nextProps.user, attributesType: nextProps.attributesType, attributes: nextProps.attributes}, () => {
      // console.log(this.state.attributes)
    });
  }

  getSimultaneousUse() {
    let currentSimultaneousUse = 0;
    if (this.state.attributes['radcheck']) {
      let attrSimUse = getObjWhenPropertyEquals(this.state.attributes['radcheck'], 'attribute', 'Simultaneous-Use');
      currentSimultaneousUse = attrSimUse.value || 0;
    }
    return currentSimultaneousUse;
  }

	handleChange(e) {
    // console.log(e.target.id)
    // console.log(e.target.value)
    let genAttr = getObjWhenPropertyEquals(this.state.genericAttributes, 'id', e.target.id);
    // console.log(genAttr)
    let indexAttr = this.state.attributes[genAttr.type].map(function(e) { return e.attribute; }).indexOf(genAttr.name);
    // console.log(indexAttr)

    let updated = true;
    if (indexAttr > -1) {
      let attr = getObjWhenPropertyEquals(this.state.attributes[genAttr.type], 'attribute', genAttr.name);
      // console.log(attr)
      if (e.target.value !== genAttr.deleteValue) {
        // console.log('Update')
        attr.value = e.target.value;
      } else {
        // console.log('Delete')
        this.state.attributes[genAttr.type].splice(indexAttr, 1);
      }
    } else if (e.target.value !== genAttr.deleteValue) {
      // console.log('Insert')
      let attr = {
        attribute: genAttr.name,
        op: genAttr.name.operator,
        value: e.target.value
      };
      this.state.attributes[genAttr.type].push(attr);
    } else updated = false;
    if (updated) this.props.onChange(this.state.attributes);
  }

  render() {
    const { t } = this.props;
    return (
			<Row>
				<Col sm='12'>
					<AvGroup>
						<Label htmlFor='simultaneousUse'>{t('freeradius.user.attributes.generic.simultaneous-use')}</Label>
            <AvField
              type='number'
              id='simultaneousUse'
              name='simultaneousUse'
              min='0'
              max='10'
              onChange={ this.handleChange.bind(this) }
              value={ this.getSimultaneousUse.bind(this)() }/>
					</AvGroup>
				</Col>
				{/*
				<Col>
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
