import React, { Component } from 'react';
import { translate } from 'react-i18next';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {
  Button,
  Row,
  Col
} from 'reactstrap';
import axios from 'axios';
import { toastr } from 'react-redux-toastr'
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import Select from 'react-virtualized-select';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';

const Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;
const attributesOperators = [
  { value: "=", label: "=" },
  { value: ":=", label: ":=" },
  { value: "==", label: "==" },
  { value: "+=", label: "+=" },
  { value: "!=", label: "!=" },
  { value: ">", label: ">" },
  { value: ">=", label: ">=" },
  { value: "<", label: "<" },
  { value: "<=", label: "<=" },
  { value: "=~", label: "=~" },
  { value: "!~", label: "!~" },
  { value: "=*", label: "=*" },
  { value: "!*", label: "!*" }];

class UserAttributesByTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      attributes: [],
      dictionaries: {
        original: [],
        unique: []
      }
    };

    this.renderAttributeEditable = this.renderAttributeEditable.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let attributes = nextProps.attributes[nextProps.attributesType];
    this.setState({user: nextProps.user, attributesType: nextProps.attributesType, attributes: attributes}, () => {
      this.loadDictionary();
    });
  }

  loadDictionary() {
    const { t } = this.props;

    const requestDictionary = axios.get(`${ROOT_URL}/api/freeradius/dictionary/${this.state.attributesType}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });

    requestDictionary
      .then(response => {
        if (response.data && response.data.status === 'success') {
          let dictionaries = this.state.dictionaries;
          dictionaries.original =  response.data.message;
          this.setState({ dictionaries }, () => this.prepareDictionnary() );
        } else {
          toastr.error(t('freeradius.dictionary.error-load'));
        }
      })
      .catch(error => {
        toastr.error(t('freeradius.dictionary.error-load')+' ' + name, error.message);
      });
  }

  prepareDictionnary() {
    let uniqueBy = (arr, fn) => {
      let unique = {};
      let distinct = [];
      arr.forEach( x => {
        let key = fn(x);
        if (!unique[key]) {
          distinct.push(
            { value: key, label: key }
          );
          unique[key] = true;
        }
      });
      return distinct;
    };

    let dictionaries = this.state.dictionaries;
    let originalDictionnary = dictionaries.original;
    dictionaries.unique = uniqueBy(originalDictionnary, function(x){return x['Attribute'];});
    this.setState({ dictionaries });
  }

  // loadUserAttributes() {
  //   const { t } = this.props;

  //   const request = axios.get(`${ROOT_URL}/api/freeradius/${this.state.attributesType}/${this.state.user.username}`, {
  //     headers: { 'Authorization': `Bearer ${localStorage.token}` }
  //   });

  //   request
  //     .then(response => {
  //       if (response.data && response.data.status === 'success') {
  //         this.setState({ attributes: response.data.message });
  //       } else {
  //         toastr.error(t('freeradius.user.attributes.'+this.state.user.username+'.error-load'));
  //       }
  //     })
  //     .catch(error => {
  //       toastr.error(t('freeradius.user.attributes.'+this.state.user.username+'.error-load')+' ' + name, error.message);
  //     });
  // }

  handleChange(e) {
    let attributes = this.state.attributes;
    attributes[e.target.id][e.target.name] = e.target.value;
    this.setState({attributes}, () => { this.props.onChange(this.state.attributesType, this.state.attributes)} );
  }

  handleSelectChange(value, element) {
    let attributes = this.state.attributes;
    attributes[element.index][element.column.id] = value.value;
    this.setState({attributes}, () => { this.props.onChange(this.state.attributesType, this.state.attributes)});
  }

  deleteAttribute(row) {
    let attributes = this.state.attributes;
    attributes.splice(row.index, 1);
    this.setState({ attributes }, () => { this.props.onChange(this.state.attributesType, this.state.attributes)});
  }

  addAttribute() {
    let attributes = this.state.attributes;
    attributes.push({'attribute': '', 'op': '', 'value': ''});
    this.setState({ attributes });
  }

  renderAttributeEditable(cellInfo) {
    if (cellInfo.column.id === 'attribute') {
      return (
        <Select
          options={this.state.dictionaries.unique}
          clearable={false}
          searchable={true}
          name={cellInfo.column.id}
          id={cellInfo.index.toString()}
          value={cellInfo.value}
          onChange={(value) => this.handleSelectChange(value, cellInfo)}/>
      )
    }

    if (cellInfo.column.id === 'op') {
      return (
        <Select
          options={attributesOperators}
          clearable={false}
          searchable={true}
          name={cellInfo.column.id}
          id={cellInfo.index.toString()}
          value={cellInfo.value}
          onChange={(value) => this.handleSelectChange(value, cellInfo)}/>
      )
    }

    if (cellInfo.column.id === 'value') {
      let attribute = this.state.dictionaries.original.find(obj => {
        return obj['Attribute'] === cellInfo.original.attribute;
      });
      if (attribute) {
        if (attribute['Type'] !== null) {
          return (
            <AvGroup>
              <AvInput
                type='text'
                name={cellInfo.column.id}
                id={cellInfo.index}
                value={cellInfo.value}
                onChange={this.handleChange.bind(this)}/>
            </AvGroup>
          )
        } else {
          let options = [];
          this.state.dictionaries.original.forEach(elt => {
            if (elt['Attribute'] === attribute['Attribute']) {
              options.push({value: elt['Value'], label: elt['Value']})
            }
          });
          return (
            <Select
              options={options}
              clearable={false}
              searchable={true}
              name={cellInfo.column.id}
              id={cellInfo.index.toString()}
              value={cellInfo.value}
              onChange={(value) => this.handleSelectChange(value, cellInfo)}/>
          )
        }
      }
    }

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: this.state.attributes[cellInfo.index][cellInfo.column.id]
        }}
      />
    )
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <Row>
          <Col sm='10'>
            <div style={{ marginBottom: '10px' }}>
              {t('freeradius.user.attributes.radcheck-description')}
            </div>
          </Col>
          <Col sm='2'>
            <Button color='primary' className={'float-right'} size='sm' onClick={ () => this.addAttribute() }>
              <i className='fa fa-plus-square'></i>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm='12'>
              <ReactTable
                data={ this.state.attributes }
                columns={[
                  {
                    Header: t('freeradius.user.attributes.attribute'),
                    accessor: 'attribute',
                    style: { overflow: 'visible' },
                    Cell: this.renderAttributeEditable
                  },{
                    Header: t('freeradius.user.attributes.op'),
                    accessor: 'op',
                    maxWidth: 100,
                    style: { overflow: 'visible' },
                    Cell: this.renderAttributeEditable
                  },{
                    Header: t('freeradius.user.attributes.value'),
                    accessor: 'value',
                    style: { overflow: 'visible' },
                    Cell: this.renderAttributeEditable
                  }, {
                    Header: '',
                    maxWidth: 50,
                    style: { textAlign: 'center' },
                    Cell: row => (
                      <span id={ row.value }>
                        <i title="Delete" className='fa fa-trash-o kupiki-table-icon-danger' onClick={ () => this.deleteAttribute(row) }/>
                      </span>
                    )
                  }
                ]}
                defaultPageSize={ 10 }
                className='-striped -highlight'/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default translate()(UserAttributesByTab);
