import React from 'react';
import axios from 'axios';
import Page from 'components/Page';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  FormFeedback,
  FormText,
  Input,
  Label,
  Button,
  FormGroup,
  InputGroup,
} from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import { Fab, Grid } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default class UserForgetPassword extends React.Component {
  static propTypes = {
    //url: process.env.REACT_APP_SOURCE_URL + '/dataPlans/list',
    // author: PropTypes.string.is,
    perPage: 10,
  };
  constructor(props) {
    super(props);
    this.state = {
      Budget: [],
      ButgetSources: [],
      ButgetSources1: [],
      refreshing: false,
      modal: false,
      validationname: '',
      validationEmail: '',
      validationEmail1: '',
      validationposition: '',
      validationdepartment: '',
      validationUserType: '',
      name: '',
      position: '',
      email: '',
      department: '',
      department_id: '',
      department_name: '',
      password: '',
      UserType: '',
      user_type_id: '',
      user_type_name: '',
      ID: '',
      user_roles: [],
      tel: '',
      show_password: false,
      modal_user: false,
      modal_pass: false,
      confirm_password: '',
      new_password: '',
      old_password: '',
      user_permission: '',
      validationOld: '',
      validationNew: '',
      validationConfirm: '',
      validatePasswordFormat: '',
      validatePasswordFormat2: '',
      validatePasswordFormat3: '',
      validatePasswordFormat4: '',
      validatePasswordFormat5: '',
      validatePasswordFormat6: '',
    };
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleInputChangePass = e => {
    let passwordFormat = /^(?=.*[a-z])/;
    let passwordFormat2 = /^(?=.*[A-Z])/;
    let passwordFormat3 = /^(?=.*[0-9])/;
    let passwordFormat4 = /\s/;
    // let passwordFormat5 =
    //   /[กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์]/;
    let passwordFormat5 = /[ก-๙]/;
    const validatePasswordFormat =
      !e.target.value.trim().match(passwordFormat) === true
        ? 'กรุณากรอกตัวพิมพ์เล็กอย่างน้อยหนึ่งตัว'
        : '';
    const validatePasswordFormat2 =
      !e.target.value.trim().match(passwordFormat2) === true
        ? 'กรุณากรอกตัวพิมพ์ใหญ่อย่างน้อยหนึ่งตัว'
        : '';
    const validatePasswordFormat3 =
      !e.target.value.trim().match(passwordFormat3) === true
        ? 'กรุณากรอกตัวเลขอย่างน้อยหนึ่งตัว'
        : '';
    const validatePasswordFormat4 =
      !e.target.value.match(passwordFormat4) === false
        ? 'ห้ามกรอกเว้นวรรค'
        : '';
    const validatePasswordFormat5 =
      !e.target.value.match(passwordFormat5) === false ? 'ห้ามกรอกภาษาไทย' : '';
    const validatePasswordFormat6 =
      e.target.value.length < 8 ? 'กรุณากรอกอย่างน้อยแปดตัว' : '';
    this.setState({
      validatePasswordFormat: validatePasswordFormat,
      validatePasswordFormat2: validatePasswordFormat2,
      validatePasswordFormat3: validatePasswordFormat3,
      validatePasswordFormat4: validatePasswordFormat4,
      validatePasswordFormat5: validatePasswordFormat5,
      validatePasswordFormat6: validatePasswordFormat6,
    });

    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // handleSubmit = e => {
  //   e.preventDefault();
  //   this.state.validationEmail1 = this.state.email.match(
  //     /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i,
  //   );

  //   const ID = this.state.ID;

  //   const validationEmail1 = this.state.validationEmail1
  //     ? ''
  //     : ' กรุณากรอก Email ให้ถูกต้อง';
  //   const validationname = this.state.name.trim() ? '' : 'กรุณากรอกข้อมูลชื่อ';
  //   const validationposition = this.state.position.trim()
  //     ? ''
  //     : 'กรุณากรอกข้อมูลตำแหน่ง';

  //   if (
  //     validationEmail1 === '' &&
  //     validationname === '' &&
  //     validationposition === ''
  //   ) {
  //     const department_id = this.state.department.trim().split(',');
  //     const user_type_id = this.state.UserType.trim().split(',');
  //     axios
  //       .patch(
  //         process.env.REACT_APP_SOURCE_URL + '/users/' + ID,
  //         {
  //           name: this.state.name.trim(),
  //           position: this.state.position.trim(),
  //           email: this.state.email.trim(),
  //           department_id: department_id[0],
  //           department_name: department_id[1],
  //           tel: this.state.tel,
  //           user_type: 1,
  //           user_permission: this.state.user_permission,
  //         },
  //         { headers: { Authorization: `Bearer ${token_id}` } },
  //       )
  //       .then(res => {
  //         axios
  //           .post(process.env.REACT_APP_SOURCE_URL + '/users/login', {
  //             email: this.state.email.trim(),
  //             password: password,
  //           })
  //           .then(res => {
  //             const accessToken = res.data.accessToken;

  //             const {
  //               name,
  //               department_id,
  //               department_name,
  //               email,
  //               position,
  //               _id,
  //               user_permission,
  //               tel,
  //               // user_type_id,
  //               // user_type_name,
  //             } = res.data.users;

  //             localStorage.setItem('token', accessToken);
  //             localStorage.setItem('userID', _id);
  //             localStorage.setItem('userName', name);
  //             localStorage.setItem('userEmail', email);
  //             localStorage.setItem('userPosition', position);
  //             localStorage.setItem('userDepartmentID', department_id);
  //             localStorage.setItem('userDepartmentName', department_name);
  //             localStorage.setItem('userTel', tel);
  //             localStorage.setItem(
  //               'userPermission',
  //               JSON.stringify(user_permission),
  //             );
  //           });
  //         //this.fetchData();
  //         this.setState({
  //           modal_user: false,
  //           ID: ID,
  //         });

  //         MySwal.fire({
  //           title: <strong>แก้ไขข้อมูลสำเร็จ</strong>,
  //           // html: <i>You clicked the button!</i>,
  //           icon: 'success',
  //           timer: 1000,
  //           showConfirmButton: false,
  //         });
  //         this.fetchData();
  //       })
  //       .catch(err => {
  //         console.log(err.response.data);
  //         if (err.response.data == 'Please Check your email!') {
  //           const validationError2 = 'Email ซ้ำ กรุณากรอกใหม่';

  //           this.setState({
  //             validationEmail: validationError2,
  //           });
  //         }
  //       });
  //   } else {
  //     // alert('กรุณากรอกข้อมูลให้ครบ');
  //     this.setState({
  //       validationname: validationname,
  //       validationEmail: validationEmail1,
  //       validationposition: validationposition,
  //     });
  //   }
  // };

  handleSubmitUpdatePass = e => {
    e.preventDefault();
    this.state.validationEmail1 = this.state.email.match(
      /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i,
    );

    const ID = this.props.match.params.id;
    const token = this.props.match.params.token;

    // const validationOld = this.state.old_password.trim()
    //   ? ''
    //   : 'กรุณากรอกรหัสผ่าน';
    const validationNew = this.state.new_password.trim()
      ? ''
      : 'กรุณากรอกรหัสผ่าน';
    const validationConfirm = this.state.confirm_password.trim()
      ? ''
      : 'กรุณากรอกรหัสผ่าน';

    if (
      //validationOld === '' &&
      validationNew === '' &&
      validationConfirm === '' &&
      this.state.validatePasswordFormat === '' &&
      this.state.validatePasswordFormat2 === '' &&
      this.state.validatePasswordFormat3 === '' &&
      this.state.validatePasswordFormat4 === '' &&
      this.state.validatePasswordFormat5 === '' &&
      this.state.validatePasswordFormat6 === ''
    ) {
      if (
        this.state.new_password === this.state.confirm_password
        //this.state.old_password.trim() === this.state.password.trim()
      ) {
        axios
          .patch(
            process.env.REACT_APP_SOURCE_URL + '/users/password/' + ID,
            {
              // name: this.state.name.trim(),
              // position: this.state.position.trim(),
              // email: this.state.email.trim(),
              // department_id: this.state.department_id,
              // department_name: this.state.department_name,
              // tel: this.state.tel,
              // user_type: 1,
              // user_permission: this.state.user_permission,
              //password_old: this.state.old_password,
              password_new: this.state.new_password,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          )
          .then(res => {
            if (res.data.message === 'Updated!') {
              localStorage.setItem('password', this.state.new_password.trim());
            }

            this.setState({
              modal_pass: false,
              ID: ID,
            });

            MySwal.fire({
              title: <strong>แก้ไขข้อมูลรหัสผ่านสำเร็จ</strong>,
              // html: <i>You clicked the button!</i>,
              icon: 'success',
              timer: 1000,
              showConfirmButton: false,
            });
            this.fetchData();
          })
          .catch(err => {
            if (err.response.data == 'Current Password Invalid!') {
              MySwal.fire({
                title: <strong>แก้ไขข้อมูลรหัสผ่านไม่สำเร็จ</strong>,
                html: <i>รหัสผ่านปัจจุบันไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง</i>,
                icon: 'error',
                timer: 2500,
                showConfirmButton: false,
              });
            }
          });
      } else {
        MySwal.fire({
          title: <strong>แก้ไขข้อมูลรหัสผ่านไม่สำเร็จ</strong>,
          html: <i>ยืนยันรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง</i>,
          icon: 'error',
          timer: 2500,
          showConfirmButton: false,
        });
      }
    } else {
      // alert('กรุณากรอกข้อมูลให้ครบ');
      this.setState({
        //validationOld: validationOld,
        validationNew: validationNew,
        validationConfirm: validationConfirm,
      });
    }
  };

  componentDidMount() {
    // this.fetch1();
    // this.toggle();
    const ID = this.props.match.params.id;
    const token = this.props.match.params.token;
  }

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal_pass: !this.state.modal_pass,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  toggle1 = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal_user: !this.state.modal_user,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  onEditUser() {
    this.setState({
      modal_user: true,
      header: 'แก้ไขข้อมูลผู้ใช้',
    });
  }
  onEditPass() {
    this.setState({
      modal_pass: true,
      old_password: '',
      new_password: '',
      confirm_password: '',
      validationConfirm: '',
      validationNew: '',
      validationOld: '',
      header: 'แก้ไขรหัสผ่าน',
      validatePasswordFormat: '',
      validatePasswordFormat2: '',
      validatePasswordFormat3: '',
      validatePasswordFormat4: '',
      validatePasswordFormat5: '',
      validatePasswordFormat6: '',
    });
  }

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
                          <div style={{ textAlign: 'center' }}>
                            <div className="text-main-1">ลืมรหัสผ่าน</div>
                            <div className="text-main-2">กรุณากรอกรหัสผ่าน</div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </Col>
              </Row>
              <CardBody>
                <Form onSubmit={this.handleSubmitUpdatePass}>
                  <FormGroup>
                    {/* <Label for="PlanName" sm={12}>
                      รหัสผ่านปัจจุบัน <font color="red">*</font>
                    </Label>
                    <Col sm={12}>
                      <InputGroup>
                        <Input
                          type="password"
                          name="old_password"
                          onChange={this.handleInputChange}
                          value={this.state.old_password}
                          style={{ width: '100%' }}
                        ></Input>
                      </InputGroup>
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationOld}
                    </Col> */}
                    <Label for="PlanName" sm={12}>
                      รหัสผ่านใหม่ <font color="red">*</font>
                    </Label>
                    <Col sm={12}>
                      <InputGroup>
                        <Input
                          type="password"
                          name="new_password"
                          onChange={this.handleInputChangePass}
                          value={this.state.new_password}
                          style={{ width: '100%' }}
                        ></Input>
                      </InputGroup>
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      <div> {this.state.validationNew} </div>
                      <div>{this.state.validatePasswordFormat}</div>
                      <div>{this.state.validatePasswordFormat2}</div>
                      <div>{this.state.validatePasswordFormat3}</div>
                      <div>{this.state.validatePasswordFormat4}</div>
                      <div>{this.state.validatePasswordFormat5}</div>
                      <div>{this.state.validatePasswordFormat6}</div>
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ยืนยันรหัสผ่าน <font color="red">*</font>
                    </Label>
                    <Col sm={12}>
                      <InputGroup>
                        <Input
                          type="password"
                          name="confirm_password"
                          onChange={this.handleInputChange}
                          value={this.state.confirm_password}
                          style={{ width: '100%' }}
                        ></Input>
                      </InputGroup>
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationConfirm}
                    </Col>
                  </FormGroup>
                  <FormGroup style={{ textAlign: 'center' }}>
                    <Button color="success">บันทึก</Button>&nbsp;
                    {/* <Button color="danger" onClick={this.toggle()}>
                      ยกเลิก
                    </Button> */}
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* <Grid item xs={5}>
             <InputGroup>
                <Input
                  type={this.state.show_password === false ? 'password' : 'text'}
                  name="password"
                  // placeholder={'ค้นหา' + title}
                  onChange={this.handleInputChange}
                  value={this.state.password}
                  style={{ width: '100%' }}
                  disabled
                />
                <div
                  style={{
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '98%',
                    alignItems: 'center',
                    marginTop: '3px',
                  }}
                >
                  <IconButton size="small" onClick={this.clickShow}>
                    {this.state.show_password === false ? (
                      <Icon>visibility</Icon>
                    ) : (
                      <Icon>visibility_off</Icon>
                    )}
                  </IconButton>
                </div>
              </InputGroup>
          </Grid> */}

        {this.state.modal_user == true ? (
          <Modal
            isOpen={this.state.modal_user}
            toggle={this.toggle1()}
            className={this.props.className}
          >
            <ModalHeader
              toggle={this.toggle1()}
              style={{
                backgroundColor: '#e0ecfa',
                borderTopLeftRadius: '1.5rem',
                borderTopRightRadius: '1.5rem',
              }}
            >
              {this.state.header}
            </ModalHeader>
            <ModalBody
              style={{
                borderRadius: '1.5rem',
              }}
            >
              <Form onSubmit={this.handleSubmit}>
                <Grid container spacing={1} className="flex">
                  <Grid item xs={12}>
                    ชื่อ-สกุล :
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      type="text"
                      name="name"
                      onChange={this.handleInputChange}
                      value={this.state.name}
                      style={{ width: '100%' }}
                    ></Input>
                  </Grid>
                  <Grid item xs={12}>
                    ตำแหน่ง :
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      type="text"
                      name="position"
                      onChange={this.handleInputChange}
                      value={this.state.position}
                      style={{ width: '100%' }}
                    ></Input>
                  </Grid>
                  <Grid item xs={12}>
                    เบอร์โทรติดต่อ :
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      type="text"
                      name="tel"
                      onChange={this.handleInputChange}
                      value={this.state.tel}
                      style={{ width: '100%' }}
                    ></Input>
                  </Grid>
                </Grid>
                <br />
                <FormGroup style={{ textAlign: 'center' }}>
                  <Button color="success">บันทึก</Button>&nbsp;
                  <Button color="danger" onClick={this.toggle1()}>
                    ยกเลิก
                  </Button>
                </FormGroup>
              </Form>
            </ModalBody>
            {/* <ModalFooter /> */}
          </Modal>
        ) : (
          ''
        )}

        {this.state.modal_pass == true ? (
          <Modal
            isOpen={this.state.modal_pass}
            toggle={this.toggle()}
            className={this.props.className}
          >
            <ModalHeader
              toggle={this.toggle()}
              style={{
                backgroundColor: '#e0ecfa',
                borderTopLeftRadius: '1.5rem',
                borderTopRightRadius: '1.5rem',
              }}
            >
              {this.state.header}
            </ModalHeader>
            <ModalBody
              style={{
                borderRadius: '1.5rem',
              }}
            ></ModalBody>
            {/* <ModalFooter /> */}
          </Modal>
        ) : (
          ''
        )}
      </>
    );
  }
}
