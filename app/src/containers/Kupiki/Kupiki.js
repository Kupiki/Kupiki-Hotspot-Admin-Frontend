import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
import { PrivateRoute } from '../../components/Auth/PrivateRoute';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Dashboard from '../../views/System/Dashboard/';
import Administration from '../../views/System/Administration/';
import SimpleAdministration from '../../views/Configuration/Simple';
import AdvancedAdministration from '../../views/Configuration/Advanced';
import UsersManagement from '../../views/Management/Users/';
import StatisticsManagement from '../../views/Management/Statistics/';
import UserProfile from '../../views/User/Profile/';

class Kupiki extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            {/*<Breadcrumb />*/}
            <Container fluid>
              <Switch>
                <PrivateRoute path="/system/dashboard" name="Dashboard" component={Dashboard}/>
                <PrivateRoute path="/system/administration" name="Administration" component={Administration}/>
                <PrivateRoute path="/configuration/simple" name="Simple" component={SimpleAdministration}/>
                <PrivateRoute path="/configuration/advanced" name="Advanced" component={AdvancedAdministration}/>
                <PrivateRoute path="/management/users" name="Users Management" component={UsersManagement}/>
                <PrivateRoute path="/management/statistics/:user?" name="Hotspot statistics" component={StatisticsManagement}/>
                <PrivateRoute path="/user/profile" name="User Profile" component={UserProfile}/>
                <Redirect from="/" to="/system/dashboard"/>
              </Switch>
            </Container>
          </main>
          {/*<Aside />*/}
        </div>
        {/*<Footer />*/}
      </div>
    );
  }
}

export default Kupiki;
