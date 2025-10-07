import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Col, Row, Form, FormGroup, Input, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReactPaginate from 'react-paginate';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { confirmAlert } from 'react-confirm-alert';
import $ from 'jquery';
import logo_pbms_non from '../assets/img/logo/logo_pbms_non.png';

// SweetAlert2 with React
const MySwal = withReactContent(Swal);

// reCAPTCHA keys
const SITE_KEY = '6LejoT4lAAAAAGPj8BlcgqTKaRj_cpvGhwZ7hWJb';
const SECRET_KEY = '6LejoT4lAAAAAEDlBJGCkYyvahSAm5UXrkTWvu7W';

// Load script function
const loadScriptByURL = (id, url, callback) => {
  const isScriptExist = document.getElementById(id);
  if (!isScriptExist) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.id = id;
    script.onload = () => callback && callback();
    document.body.appendChild(script);
  }
  if (isScriptExist && callback) callback();
};

// Load reCAPTCHA script
loadScriptByURL('recaptcha-key', `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`, () => {});

// Authentication Form Component
class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameInputProps: '',
      passwordInputProps: '',
      accessToken: '',
      email: '',
      url: process.env.REACT_APP_SOURCE_URL + '/users/login',
      modal: false,
    };
  }

  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isForgot() {
    return this.props.authState === STATE_FORGOT;
  }

  // Toggle Modal
  toggle = modalType => () => {
    if (!modalType) {
      this.setState({ modal: !this.state.modal });
    } else {
      this.setState({ [`modal_${modalType}`]: !this.state[`modal_${modalType}`] });
    }
  };

  // Input Change Handler
  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Validate Form Inputs
  validate = () => {
    const emailRegex = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
    let isError = false;

    if (this.state.usernameInputProps.trim().length === 0) {
      isError = true;
      MySwal.fire({
        title: <strong>เข้าสู่ระบบไม่สำเร็จ</strong>,
        html: <i>ไม่มี Email นี้ในระบบ! กรุณากรอกข้อมูลให้ครบถ้วน</i>,
        icon: 'error',
        timer: 2500,
        showConfirmButton: false,
      });
    } else if (!this.state.usernameInputProps.trim().match(emailRegex)) {
      isError = true;
      MySwal.fire({
        title: <strong>เข้าสู่ระบบไม่สำเร็จ</strong>,
        html: <i>รูปแบบ Email ไม่ถูกต้อง!</i>,
        icon: 'error',
        timer: 2500,
        showConfirmButton: false,
      });
    } else if (this.state.passwordInputProps.trim().length === 0) {
      isError = true;
      MySwal.fire({
        title: <strong>เข้าสู่ระบบไม่สำเร็จ</strong>,
        html: <i>กรุณากรอกรหัสผ่าน</i>,
        icon: 'error',
        timer: 2500,
        showConfirmButton: false,
      });
    }
    return isError;
  };

  // Handle Submit Function
  handleSubmit = e => {
    e.preventDefault();
    const isError = this.validate();
    if (!isError) {
      axios
        .post(this.state.url, {
          email: this.state.usernameInputProps.trim(),
          password: this.state.passwordInputProps.trim(),
        })
        .then(res => {
          const { accessToken, users } = res.data;
          const { name, department_id, department_name, email, position, _id, user_permission, tel, user_type } = users;

          // Store user info in localStorage
          localStorage.setItem('token', accessToken);
          localStorage.setItem('userID', _id);
          localStorage.setItem('userName', name);
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userPosition', position);
          localStorage.setItem('userDepartmentID', department_id);
          localStorage.setItem('userDepartmentName', department_name);
          localStorage.setItem('userTel', tel);
          localStorage.setItem('userType', user_type);
          localStorage.setItem('password', this.state.passwordInputProps.trim());
          localStorage.setItem('userPermission', JSON.stringify(user_permission));
          window.location = '/';
        })
        .catch(() => {
          MySwal.fire({
            title: <strong>เข้าสู่ระบบไม่สำเร็จ</strong>,
            html: <i>Email หรือ รหัสผ่านไม่ถูกต้อง!</i>,
            icon: 'error',
            timer: 2500,
            showConfirmButton: false,
          });
        });
    }
  };

  renderButtonText() {
    const { buttonText } = this.props;
    if (!buttonText && this.isLogin) return 'Login';
    if (!buttonText && this.isForgot) return 'Forgot';
    return buttonText;
  }

  render() {
    return (
      <Row>
        <Col>
          <Form id="demo-form" onSubmit={this.isLogin ? this.handleSubmit : this.handleSubmit1}>
            <Input type="email" style={{ display: 'none' }} />
            <Input type="password" style={{ display: 'none' }} />
            <FormGroup>
              <Label>Email</Label>
              <Input name="usernameInputProps" placeholder="your@email.com" onChange={this.handleInputChange} value={this.state.usernameInputProps} autoComplete="off" />
            </FormGroup>
            {this.isLogin && (
              <FormGroup>
                <Label for="Password">Password</Label>
                <Input name="passwordInputProps" type="password" placeholder="รหัสผ่านผู้ใช้" onChange={this.handleInputChange} value={this.state.passwordInputProps} autoComplete="new-password" />
              </FormGroup>
            )}
            <hr />
            <button type="submit" className="bg-btn-login" ผ>
              {this.renderButtonText()}
            </button>
          </Form>
        </Col>
      </Row>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_FORGOT = 'FORGOT';

AuthForm.propTypes = {
  authState: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
};

export default AuthForm;
