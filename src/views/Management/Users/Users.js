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
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import axios from 'axios';
import { toastr } from 'react-redux-toastr'
import { translate, i18next } from 'react-i18next';
import UserEdit from './UserEdit';

var Config = require('Config');
const ROOT_URL = Config.server_url+':'+Config.server_port;

class UsersMgmt extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      users: [],
      modalUserOpen: false
    };
  
    this.toggleUserModal = this.toggleUserModal.bind(this);
    // this.toggleEditUser = this.toggleEditUser.bind(this);
  }
  
  componentDidMount() {
    this.loadUsers();
  }
  
  // toggleEditUser() {
  //   console.log(this.state.modalEditUser)
  //   this.setState({
  //     modalEditUser: !this.state.modalEditUser
  //   });
  // }
  
  toggleUserModal(action, userId) {
    this.setState({
      modalUserAction: action,
      modalUserId: userId,
      modalUserOpen: !this.state.modalUserOpen
    });
  }
  
  loadUsers () {
    const { t } = this.props;
    
    const request = axios.get(`${ROOT_URL}/api/freeradius/users`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` }
    });
    request
      .then(response => {
        if (response.data && response.data.status && response.data.status === 'success') {
          this.setState({ users: response.data.result.message });
          this.setState({ content: this.buildDisplayUsersList() });
          toastr.info(t('freeradius.users.success-load'));
        } else {
          toastr.error(t('freeradius.users.error-load'));
        }
      })
      .catch(error => {
        toastr.error(t('freeradius.users.error-load')+' ' + name, error.message);
      });
  }
  
  buildDisplayUsersList () {
    let contentDisplay = [];
    this.state.users.forEach((user, userId) => {
      contentDisplay.push(
        <tr key={userId}>
          <td>
            { user.username }
            {/*{'  '}<Badge color="success">Active</Badge>*/}
          </td>
          <td>{ user.firstname }</td>
          <td>{ user.lastname }</td>
          <td>
            <Button color='danger' className={'float-right'} size='sm'><i className='fa fa-trash-o'/></Button>
            <Button color='primary' className={'float-right'} size='sm' onClick={ () => this.toggleUserModal('edit', userId) }><i className='fa fa-edit'/></Button>
          </td>
        </tr>
      )
    });
/*
    for (let userId in this.state.users) {
      let user = this.state.users[userId];
      contentDisplay.push(
        <tr key={userId}>
          <td>
            { user.username }
            {/!*{'  '}<Badge color="success">Active</Badge>*!/}
          </td>
          <td>{ user.firstname }</td>
          <td>{ user.lastname }</td>
          <td>
            <Button color="danger" className={"float-right"} size="sm"><i className="fa fa-trash-o"/></Button>
            <Button color="primary" className={"float-right"} size="sm" onClick={ () => this.toggleUserModal("edit", userId) }><i className="fa fa-edit"/></Button>
          </td>
        </tr>
      )
    }
*/
    return contentDisplay;
  }
  
  render() {
    const { t } = this.props;
    
    return (
      <div className='animated fadeIn'>
        <br/>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className='fa fa-users'/>{' '}{t('freeradius.users.list-header')}
                <Button color='primary' className={'float-right'} size='sm' onClick={ () => this.toggleUserModal('create') }><i className='fa fa-user-plus'></i></Button>
                <UserEdit action={ this.state.modalUserAction } userId={ this.state.modalUserId } existingUsers={ this.state.users } modalUserOpen={ this.state.modalUserOpen } callback={ this.toggleUserModal }/>
              </CardHeader>
              <CardBody>
                <Table hover striped responsive size='sm'>
                  <thead>
                  <tr>
                    <th>{t('freeradius.users.list-username')}</th>
                    <th>{t('freeradius.users.list-firstname')}</th>
                    <th>{t('freeradius.users.list-lastname')}</th>
                    <th>{t('freeradius.users.list-actions')}</th>
                  </tr>
                  </thead>
                  <tbody>
                    { this.state.content }
                  </tbody>
                </Table>
                {/*<nav>*/}
                  {/*<Pagination>*/}
                    {/*<PaginationItem><PaginationLink previous href="#">Prev</PaginationLink></PaginationItem>*/}
                    {/*<PaginationItem active>*/}
                      {/*<PaginationLink href="#">1</PaginationLink>*/}
                    {/*</PaginationItem>*/}
                    {/*<PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>*/}
                    {/*<PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>*/}
                    {/*<PaginationItem><PaginationLink href="#">4</PaginationLink></PaginationItem>*/}
                    {/*<PaginationItem><PaginationLink next href="#">Next</PaginationLink></PaginationItem>*/}
                  {/*</Pagination>*/}
                {/*</nav>*/}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default translate()(UsersMgmt);


