import AuthForm, { STATE_LOGIN } from '../components/AuthForm';
import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import logo_pbms_non from '../assets/img/logo/logo_pbms_non.png';
import { Grid } from '@material-ui/core';
import { Border } from 'victory';
import { Link } from 'react-router-dom';

class AuthPage extends React.Component {
  handleAuthState = authState => {
    if (authState === STATE_LOGIN) {
      this.props.history.push('/login');
    } else {
      this.props.history.push('/forget');
    }
  };

  handleLogoClick = () => {
    this.props.history.push('/');
  };

  render() {
    return (
      <>
        <div
          className="bg-login"
          style={{
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        ></div>
        <Row
          style={{
            position: 'absolute',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col md={6} lg={4}>
            <Card style={{ border: '0', borderRadius: '36px' }}>
              <Row>
                <Col sm={12}>
                  <div
                    className="bg-header-logo p-3"
                    style={{
                      borderTopRightRadius: '36px',
                      borderTopLeftRadius: '36px',
                    }}
                  >
                    <Grid container>
                      <Grid
                        item
                        sm={12}
                        className={'flex'}
                        style={{ justifyContent: 'center' }}
                      >
                        <div>
                          <Link to="/DashboardPage">
                            <img
                              src={logo_pbms_non}
                              style={{ width: '50px', height: 'auto' }}
                            />
                          </Link>
                        </div>

                        <div className="mr-2">
                          <div className="ml-2" style={{ textAlign: 'center' }}>
                            <div className="text-main-1">เทศบาลนครนนทบุรี</div>
                            <div className="text-main-2">
                              ระบบติดตามโครงการและงบประมาณ
                            </div>
                            <div className="text-main-2">ตามโครงการระบบฐานข้อมูลสารสนเทศด้านบริการและเผยแพร่ข้อมูล ของเทศบาลนครนนทบุรี</div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </Col>
              </Row>
              <CardBody>
                {/* <AuthForm
             authState={this.props.authState}
             onChangeAuthState={this.handleAuthState}
             onLogoClick={this.handleLogoClick}
             onLoginPress={() => this.setState({ isLoggedIn: true })}
           /> */}
                <AuthForm
                  authState={this.props.authState}
                  onChangeAuthState={this.handleAuthState}
                  onLogoClick={this.handleLogoClick}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default AuthPage;
