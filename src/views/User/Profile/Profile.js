import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle
} from 'reactstrap';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';

i18next
  .use(XHR)
  .init({
    initImmediate: true,
    fallbackLng: 'en',
    backend: {
      loadPath: '/lang/locale-{{lng}}.json'
    }
  });

const ROOT_URL = 'http://192.168.10.160:4000';

class Profile extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      lng: localStorage.getItem('language'),
    };
    
    this.onLanguageChanged = this.onLanguageChanged.bind(this);
    
    i18next.changeLanguage(this.state.lng);
  }
  
  componentDidMount() {
    i18next.on('languageChanged', this.onLanguageChanged)
  }
  
  componentWillUnmount() {
    i18next.off('languageChanged', this.onLanguageChanged)
  }
  
  onLanguageChanged(lng) {
    this.setState({
      lng: lng
    })
  }
  
  render() {
    return (
      <div className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                {i18next.t('user.password.title')}
              </CardHeader>
              <CardBody>
              
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Profile;


