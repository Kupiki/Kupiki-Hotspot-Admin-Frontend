import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row
} from 'reactstrap';
import classnames from 'classnames';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr'
import axios from 'axios';

import "react-select/dist/react-select.css";
import "react-virtualized-select/styles.css";
import UserAttributesByTab from './UserAttributesByTab';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class UserAttributes extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      activeTab: 'radcheck',
      user: {},
      attributes: {
        'radcheck': {
          values: [],
          updated: false
        },
        'radreply': {
          values: [],
          updated: false
        }
      },
      dictionaries: {
        'radcheck': {
          original: [],
          unique: []
        },
        'radreply': {
          original: [],
          unique: []
        }
      }
    };
  
    this.toggleTab = this.toggleTab.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.onAttributesChange = this.onAttributesChange.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.user !== 'undefined') {
      this.setState({user: nextProps.user});
  
      let attributes = this.state.attributes;
      for (let attrType in this.state.attributes) {
        attributes[attrType].updated = false;
      }
      this.setState({ attributes });
    }
  }
  
  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  
  toggleModal() {
    this.props.callback();
  }
  
  handleSubmit () {
    const { t } = this.props;
  
    let newAttributes = {
      'radcheck': [],
      'radreply': []
    };
  
    for(let attrType in this.state.attributes) {
      // console.log(attrType)
      // console.log(this.state.attributes[attrType].updated)
      if (this.state.attributes[attrType].updated) {
      // if (newAttributes[attrType].length > 0) {
        this.state.attributes[attrType].values.forEach(elt => {
          if (elt['attribute'] !== '' && elt['op'] !== '' && elt['value'] !== '') {
            newAttributes[attrType].push(elt)
          }
        });
        
        // console.log(newAttributes[attrType])
        // console.log(newAttributes[attrType].length)

        let request = axios.post(`${ROOT_URL}/api/freeradius/${attrType}`, {
          username: this.state.user.username,
          attributes: newAttributes[attrType]
        }, {
          headers: {'Authorization': `Bearer ${localStorage.token}`}
        });
        request
          .then(response => {
            if (response.data && response.data.status) {
              if (response.data.status === 'success') {
                toastr.success(t(`freeradius.user.attributes.${attrType}-success-save`));
              } else {
                toastr.error(t(`freeradius.user.attributes.${attrType}-error-save`), response.data.message);
              }
            } else {
              toastr.error(t(`freeradius.user.attributes.${attrType}-error-save`), response.data.message);
            }
          });
      }
    }
  }
  
  onAttributesChange(attributesType, newAttributes) {
    let attributes = this.state.attributes;
    attributes[attributesType].values = newAttributes;
    attributes[attributesType].updated = true;
    this.setState({ attributes });
  }
  
  render() {
    const { t, modalUserAttributesOpen } = this.props;

    return (
      <Modal size='xl' isOpen={ modalUserAttributesOpen } toggle={ this.toggleModal } className={'modal-primary'}>
        <AvForm onValidSubmit={ this.handleSubmit }>
          <ModalHeader toggle={ this.toggleModal }>{t('freeradius.user.attributes.title', { username: this.state.user.username })}</ModalHeader>
          <ModalBody>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === 'generic' })}
                  onClick={() => { this.toggleTab('generic'); }}>
                  Generic
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === 'radcheck' })}
                  onClick={() => { this.toggleTab('radcheck'); }}>
                  radcheck ({this.state.user.countRadcheck})
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === 'radreply' })}
                  onClick={() => { this.toggleTab('radreply'); }}>
                  radreply ({this.state.user.countRadreply})
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId='generic'>
                <Row>
                  <div>Simultaneous-use := 1</div>
                  <div></div>
                  <div>Limite download - Session/Total</div>
                  <div>Limite upload - Session/Total</div>
                  <div>Limite horaire - debut/fin</div>
                </Row>
              </TabPane>
              <TabPane tabId='radcheck'>
                <UserAttributesByTab user={this.state.user} attributesType={'radcheck'} onChange={this.onAttributesChange}/>
              </TabPane>
              <TabPane tabId='radreply'>
                <UserAttributesByTab user={this.state.user} attributesType={'radreply'} onChange={this.onAttributesChange}/>
              </TabPane>
            </TabContent>
          </ModalBody>
          <ModalFooter>
						<Button type='submit' color='primary' size='sm'><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.save')}</Button>{' '}
						<Button color='secondary' size='sm' onClick={ this.toggleModal }><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }
}

export default translate()(UserAttributes);
