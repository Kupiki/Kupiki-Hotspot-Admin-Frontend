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

import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import UserAttributesByTab from './UserAttributesByTab';
import UserAttributesGeneric from './UserAttributesGeneric';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class UserAttributes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'generic',
      user: {},
      attributes: {
        updated: false,
        'radcheck': [],
        'radreply': []
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
    if (typeof nextProps.user !== 'undefined' && nextProps.user != this.state.user) {
      this.setState({user: nextProps.user}, () => {
        this.loadUserAllAttributes();
      });
      // this.setState({user: nextProps.user}, () => {
      //   let attributes = this.state.attributes;
      //   for (let attrType in this.state.attributes) {
      //     attributes[attrType].updated = false;
      //   }
      //   this.setState({ attributes }, () => {
      //     this.loadUserAllAttributes();
      //   });
      // });
    }
  }

	loadUserAllAttributes() {
    const { t } = this.props;

    let attributes = this.state.attributes;
    attributes.updated = false;

    const request = axios.get(`${ROOT_URL}/api/freeradius/radcheck/${this.state.user.username}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status === 'success') {
          attributes['radcheck'] = response.data.message;
          this.setState({ attributes }, () => {
            // console.log('** radcheck');
            // console.log(attributes);
          });
        } else {
          toastr.error(t('freeradius.user.attributes.all-error-load'));
        }
      })
      .catch(error => {
        toastr.error(t('freeradius.user.attributes.all-error-load')+' ' + name, error.message);
      });

    const request2 = axios.get(`${ROOT_URL}/api/freeradius/radreply/${this.state.user.username}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request2
      .then(response => {
        if (response.data && response.data.status === 'success') {
          attributes['radreply'] = response.data.message;
          this.setState({ attributes }, () => {
            // console.log('** radreply');
            // console.log(attributes);
          });
        } else {
          toastr.error(t('freeradius.user.attributes.all-error-load'));
        }
      })
      .catch(error => {
        toastr.error(t('freeradius.user.attributes.all-error-load')+' ' + name, error.message);
      });
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

    if (this.state.attributes.updated) {
      for(let attrType in newAttributes) {
        this.state.attributes[attrType].forEach(elt => {
          if (!Object.values(elt).every(x => (x === ''))) newAttributes[attrType].push(elt);
        });

        console.log(newAttributes)

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
    this.toggleModal();
  }

  // onAttributesChange(attributesType, newAttributes) {
  onAttributesChange(newAttributes) {
    console.log('*** Update in parent ***')
    // console.log(newAttributes)
    const attributes = this.state.attributes;
    // attributes[attributesType] = newAttributes;
    attributes.updated = true;
    this.setState({ attributes }, () => {
      // console.log(this.state.attributes)
    });
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
                  radcheck ({this.state.attributes['radcheck'].length})
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === 'radreply' })}
                  onClick={() => { this.toggleTab('radreply'); }}>
                  radreply ({this.state.attributes['radreply'].length})
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId='generic'>
                <UserAttributesGeneric
                  user={this.state.user}
                  attributes={this.state.attributes}
                  onChange={this.onAttributesChange}/>
              </TabPane>
              <TabPane tabId='radcheck'>
                <UserAttributesByTab
                  user={this.state.user}
                  attributesType={'radcheck'}
                  attributes={this.state.attributes}
                  onChange={this.onAttributesChange}/>
              </TabPane>
              <TabPane tabId='radreply'>
                <UserAttributesByTab
                  user={this.state.user}
                  attributesType={'radreply'}
                  attributes={this.state.attributes}
                  onChange={this.onAttributesChange}/>
              </TabPane>
            </TabContent>
          </ModalBody>
          <ModalFooter>
						<Button type='submit' color='primary' size='sm' id='btnSave'><i className='fa fa-dot-circle-o'></i>{' '}{t('actions.save')}</Button>{' '}
						<Button color='secondary' size='sm' onClick={ this.toggleModal }><i className='fa fa-times'></i>{' '}{t('actions.cancel')}</Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }
}

export default translate()(UserAttributes);
