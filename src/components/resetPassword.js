import logo200Image from '../assets/img/logo/logo_2.jpg';
import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import {
  Col,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Card,
} from 'reactstrap';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { confirmAlert } from 'react-confirm-alert';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
class resetPassword extends React.Component {
  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }
  constructor(props) {
    super(props);
    this.state = {
      usernameInputProps: '',
      passwordInputProps: '',
      accessToken: '',
      userName: '',
      userEmail: '',
      userDepartmentID: '',
      userDepartmentName: '',
      userPosition: '',
      userID: '',
      namecheck: '',
      url: process.env.REACT_APP_SOURCE_URL + '/users/login',
      modal: false,

      confirmPassword: '',
    };
  }
  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
  Forgot() {
    this.setState({
      modal: true,
      email: '',
    });
  }
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  fetchData() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/users/' +
          this.props.match.params.id,
      )
      .then(res => {
        const {
          _id,
          name,
          position,
          email,
          department_id,
          department_name,
          password,
          user_roles,
          // user_type_id,
          // user_type_name,
        } = res.data;
        this.setState({
          usernameInputProps: email,
        });
        // let result = [];
        // for (let i = 0; i < user_roles.length; i++) {
        //   result = this.state.typeUser.filter(member => {
        //     return member.label == user_roles[i].user_role_name;
        //   });
        //   // this.setState({ selectedmonthOptions: [] });
        //   this.setState(prevState => ({
        //     user_rolex: prevState.user_rolex.concat(result),
        //   }));
        // }
      });
  }
  componentDidMount() {
    this.toggle();
    this.fetchData();
  }
  validate = () => {
    let isError = false;
    let email = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
    const errors = {
      validationpassword: '',
      validationpassword1: '',
    };
    if (this.state.passwordInputProps.trim().length <= 0) {
      isError = true;
      errors.validationpassword = 'กรุณากรอก Password ';
    } else if (this.state.passwordInputProps.trim().length < 4) {
      isError = true;
      errors.validationpassword = 'กรุณากรอก Password ไม่น้อยกว่า 4 ตัวอักษร ';
    }
    if (this.state.confirmPassword.trim().length <= 0) {
      isError = true;
      errors.validationpassword1 = 'กรุณากรอก Confirm Password';
    } else if (this.state.confirmPassword.trim().length < 4) {
      isError = true;
      errors.validationpassword1 =
        'กรุณากรอก Confirm Password ไม่น้อยกว่า 4 ตัวอักษร ';
    }
    if (this.state.passwordInputProps !== this.state.confirmPassword) {
      isError = true;
      errors.validationpassword1 = 'รหัส Confirm Password ไม่เหมือนกัน';
    }
    this.setState({
      ...this.state,
      ...errors,
    });

    return isError;
  };
  handleSubmit = e => {
    e.preventDefault();
    const err = this.validate();
    if (!err) {
      // console.log($.browser.webkit);
      // if(this.state.namecheck.trim()="1"){
      //  this.state.usernameInputProps.trim()
      // if (
      //   this.state.usernameInputProps.trim() &&
      //   this.state.passwordInputProps.trim()
      // ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL +
            '/users/password/' +
            this.props.match.params.id,
          {
            password: this.state.passwordInputProps.trim(),
          },
        )
        .then(res => {
          axios
            .post(this.state.url, {
              email: this.state.usernameInputProps,
              password: this.state.passwordInputProps.trim(),
            })
            .then(res => {
              const accessToken = res.data.accessToken;

              const {
                name,
                department_id,
                department_name,
                email,
                position,
                _id,
                user_roles,
                // user_type_id,
                // user_type_name,
              } = res.data.users;
              const { user_role_id, user_role_name } =
                res.data.users.user_roles;
              this.setState({
                isLoggedIn: true,
                accessToken,
                userName: name,
                userEmail: email,
                userDepartmentID: department_id,
                userDepartmentName: department_name,
                userPosition: position,
                userID: _id,
                userTypeID: user_role_id,
                userTypeName: user_role_name,
              });
              localStorage.setItem('token', accessToken);
              localStorage.setItem('userID', _id);
              localStorage.setItem('userName', name);
              localStorage.setItem('userEmail', email);
              localStorage.setItem('userPosition', position);
              localStorage.setItem('userDepartmentID', department_id);
              localStorage.setItem('userDepartmentName', department_name);
              localStorage.setItem('userTypeID', user_role_id);
              localStorage.setItem('userTypeName', user_role_name);
              // localStorage.setItem('userRoles', user_roles);
              localStorage.setItem('userRoles', JSON.stringify(user_roles));
              confirmAlert({
                message: 'ระบบได้เปลี่ยนรหัสผ่านเรียบร้อยแล้ว',
                buttons: [],
              });
              setTimeout(() => (window.location.href = '/'), 3000);
              // const UserType1 = localStorage.getItem('userRoles');
              // const user_role_namex= localStorage.getItem('userTypeName');
              // const user_role_idx= localStorage.getItem('userTypeID');
            });
        })
        .catch(error => {
          // alert('Email หรือ รหัสผ่านผิดพลาด');
          //   if(error.response.data=="Not Found"){
          //     this.setState({
          //       validationEmail:"ไม่มี Email นี้ในระบบ"
          //     })
          //   }
          //   if(error.response.data=="Unauthorized"){
          //     this.setState({
          //       validationpassword:"รหัสผ่านผิดพลาด"
          //     })
          //   }
        });
      // }else{

      // }
      // } else {
      //   alert('กรุณากรอกข้อมูลให้ครบ');
      // }
    }
  };

  render() {
    const {
      showLogo,
      usernameLabel,
      usernameInputProps,
      passwordLabel,
      passwordInputProps,
      onLogoClick,
    } = this.props;
    return (
      <Row
        style={{
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Col md={6} lg={4}>
          <Card body>
            <Form onSubmit={this.handleSubmit}>
              <div className="text-center pb-4">
                <img
                  src={logo200Image}
                  className="rounded"
                  style={{
                    width: '100%',
                    height: 70,
                    // cursor: 'pointer'
                  }}
                  alt="logo"
                  //onClick={onLogoClick}
                />
              </div>
              <Input type="email" style={{ display: 'none' }} />
              <Input type="password" style={{ display: 'none' }} />
              <FormGroup>
                <Label>Email</Label>
                <Label for={usernameLabel} style={{ display: 'none' }}>
                  Username
                </Label>

                <Input
                  name="usernameInputProps"
                  placeholder="your@email.com"
                  onChange={this.handleInputChange}
                  value={this.state.usernameInputProps}
                  autoComplete="off"
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <Label for={passwordLabel}>Password</Label>
                <Input
                  name="passwordInputProps"
                  id="txtPassword"
                  type="text"
                  placeholder="รหัสผ่านผู้ใช้"
                  onChange={this.handleInputChange}
                  value={this.state.passwordInputProps}
                  // autoComplete="new-password"
                />
                <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                  {this.state.validationpassword}
                </Col>
              </FormGroup>
              <FormGroup>
                <Label for={passwordLabel}>Confirm Password</Label>
                <Input
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  placeholder="ยืนยันรหัสผ่านผู้ใช้"
                  onChange={this.handleInputChange}
                  value={this.state.confirmPassword}
                  autoComplete="new-password"
                />
                <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                  {this.state.validationpassword1}
                </Col>
              </FormGroup>
              {/* <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              name="namecheck"
              onChange={this.handleInputChange}
              value="1"
            />
            Remember me
          </Label>
        </FormGroup> */}
              {/* <a href="#"  onClick={() => this.Forgot()}>Forgot Password?</a>   */}
              <hr />
              <Button
                size="lg"
                className="bg-gradient-theme-left border-0"
                block
                // onClick={this.handleSubmit}
                // onPress={this.props.onLoginPress}
              >
                ยืนยัน
                {/* {this.renderButtonText()} */}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';

export default resetPassword;
