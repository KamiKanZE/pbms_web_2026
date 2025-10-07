import React from 'react';
import axios from 'axios';
import Page from 'components/Page';
import { Typeahead } from 'react-bootstrap-typeahead';
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
} from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
const token_id = localStorage.getItem('token');
const password = localStorage.getItem('password');
const userID = localStorage.getItem('userID');
export default class PlanList extends React.Component {
  // static propTypes = {
  //   //url: process.env.REACT_APP_SOURCE_URL + '/dataPlans/list',
  //   // author: PropTypes.string.is,
  //   perPage: 10,
  // };
  constructor(props) {
    super(props);
    let id;
    {
      this.props.page == ':id' ||
      this.props.page == '' ||
      this.props.page == undefined
        ? (id = 1)
        : (id = this.props.page);
    }
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
      validationpassword: '',
      name: '',
      position: '',
      email: '',
      department: '',
      department_id: '',
      department_name: '',
      password: '',
      UserType: [],
      user_type_id: '',
      user_type_name: '',
      user_role_id: '',
      user_role_name: '',
      ID: '',
      isForm: '',
      data: [],
      // user_rolex:[],
      // fetchUserType:[],
      selected: id,
      offset: 0,
      perPage: 10,
      url: process.env.REACT_APP_SOURCE_URL + '/users/list',
      // typeUser: [
      //   {
      //     id: 1,
      //     label: 'ผู้จัดการข้อมูลพื้นฐาน',
      //   },
      //   {
      //     id: 2,
      //     label: 'ผู้จัดการข้อมูลโครงการ',
      //   },
      //   {
      //     id: 3,
      //     label: 'ผู้รายงานผลโครงการ',
      //   },
      //   {
      //     id: 4,
      //     label: 'ผู้จัดการข้อมูลตัวชี้วัด',
      //   },
      //   {
      //     id: 5,
      //     label: 'ผู้รายงานผลตัวชี้วัด',
      //   },
      //   {
      //     id: 6,
      //     label: 'ผู้บริหาร',
      //   },
      // ],
      currenpage: id - 1,
      user_roles: [],
      userTypeOptions: [],
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

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadCommentsFromServer().then(() => {
      this.setState({ refreshing: false });
    });
  };
  //   loadCommentsFromServer = () => {
  //     axios.get(process.env.REACT_APP_SOURCE_URL + '/users/list').then(res => {
  //       const Budget = res.data;
  //       this.setState({ Budget });
  //       //
  //     });
  //   };
  fetch = () => {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataDepartments/list?page=0&size=0',
      )
      .then(ress => {
        const ButgetSource = ress.data.result.map(id => {
          return {
            value: id.department_id,
            display: id.department_name,
          };
        });
        this.setState({
          ButgetSources: [
            { value: '', display: '(เลือกข้อมูลหน่วยงาน)' },
          ].concat(ButgetSource),
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  // fetch1 = () => {
  //   axios
  //     .get(
  //       process.env.REACT_APP_SOURCE_URL + '/DataUserTypes/list?page=0&size=0',
  //     )
  //     .then(ress => {
  //       const ButgetSource = ress.data.result.map(id => {
  //         return {
  //           value: id._id,
  //           display: id.user_type_name,
  //         };
  //       });
  //       this.setState({
  //         ButgetSources1: [
  //           { value: '', display: '(เลือกประเภทผู้ใช้)' },
  //         ].concat(ButgetSource),
  //       });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };
  testAxiosDELETE = id => {
    confirmAlert({
      //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
      message: 'คุณต้องการจะลบข้อมูลนี้',
      buttons: [
        {
          label: 'ยืนยัน',
          onClick: () => this.DELETE(id),
        },
        {
          label: 'ยกเลิก',
        },
      ],
    });
  };
  render() {
    return (
      <div className="container">
        <button onClick={this.submit}>Confirm dialog</button>
      </div>
    );
  }
  DELETE = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/users/' + id)
      .then(res => {
        confirmAlert({
          message: 'ลบข้อมูลเรียบร้อย',
          buttons: [],
        });
        setTimeout(
          () => (window.location.href = '/User/' + this.state.selected),
          1000,
        );
        // this.loadCommentsFromServer();
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    // const idUser = id.split('&')
    axios.get(process.env.REACT_APP_SOURCE_URL + '/users/' + id).then(res => {
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
      // this.fetchUserType();
      this.setState({
        name: name,
        position: position,
        email: email,
        department: department_id + ',' + department_name,
        department_id: department_id,
        department_name: department_name,
        password: password,
        user_roles: user_roles,
        // UserType: user_role_id + ',' + user_role_name,
        // user_type_id: user_type_id,
        // user_type_name: user_type_name,
        modal: true,
        ID: _id,
        isForm: 'edit',
        validationname: '',
        validationEmail: '',
        validationposition: '',
        validationdepartment: '',
        validationUserType: '',
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
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onAdd() {
    this.setState({
      name: '',
      position: '',
      email: '',
      department: '',
      department_id: '',
      department_name: '',
      password: '',
      UserType: [],
      user_type_id: '',
      user_type_name: '',
      user_role_id: '',
      user_role_name: '',
      user_roles: [],
      userTypeOptions: [],
      modal: true,
      isForm: '',
      validationname: '',
      validationEmail: '',
      validationposition: '',
      validationdepartment: '',
      validationUserType: '',
      validationpassword: '',
    });
    this.fetchUserType();
  }
  handleMultiSelectChange(e) {
    const selected = e.map(data => {
      return data.id;
    });
    this.setState({ month_report: [] });
    this.setState(prevState => ({
      month_report: prevState.month_report.concat(selected),
    }));
  }
  validate = () => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let emptyText = 'กรุณากรอกข้อมูลให้ครบถ้วน';
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    let email = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
    const errors = {
      validationname: '',
      validationEmail: '',
      validationposition: '',
      validationdepartment: '',
      validationUserType: '',
      validationpassword: '',
    };

    if (this.state.name.trim().length <= 0) {
      isError = true;
      errors.validationname = 'กรุณากรอกข้อมูลชื่อ';
    }
    if (this.state.position.trim().length <= 0) {
      isError = true;
      errors.validationposition = 'กรุณากรอกข้อมูลตำแหน่ง';
    }
    if (this.state.email.trim().length <= 0) {
      isError = true;
      errors.validationEmail = 'กรุณากรอก Email';
    } else if (!this.state.email.trim().match(email)) {
      isError = true;
      errors.validationEmail = 'กรอก Email ผิดรูปแบบ';
    }
    if (this.state.department.trim().length <= 0) {
      isError = true;
      errors.validationdepartment = 'กรุณาเลือกข้อมูลหน่วยงาน';
    }
    if (this.state.user_roles.length <= 0) {
      isError = true;
      errors.validationUserType = 'กรุณาเลือกประเภทผู้ใช้งาน';
    }
    if (this.state.isForm == '') {
      if (this.state.password.length <= 0) {
        isError = true;
        errors.validationpassword = 'กรุณากรอกรหัสผ่าน';
      }
    }
    this.setState({
      ...this.state,
      ...errors,
    });

    return isError;
  };
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.isForm == 'edit') {
      this.handleUpdate(e);
    } else {
      this.handleSubmit1(e);
    }
  };

  handleSubmit1 = e => {
    const err = this.validate();
    if (!err) {
      e.preventDefault();
      const department_id = this.state.department.trim().split(',');
      // const user_type_id = this.state.UserType.trim().split(',');

      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/users',
          {
            name: this.state.name.trim(),
            position: this.state.position.trim(),
            email: this.state.email.trim(),
            department_id: department_id[0],
            department_name: department_id[1],
            password: this.state.password.trim(),
            user_roles: this.state.user_roles,
            status: 1,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            validationname: '',
            validationEmail: '',
            validationposition: '',
            validationdepartment: '',
            validationUserType: '',
            validationpassword: '',
            modal: false,
          });
          confirmAlert({
            message: 'บันทึกข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(
            () => (window.location.href = '/User/' + this.state.selected),
            1000,
          );
        })
        .catch(err => {
          if (err.response.data == 'Your email already exists!') {
            const validationError2 = 'Email ซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationEmail: validationError2,
            });
          }
        });
    }
  };
  fetchUserType() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL + '/dataUserTypes/list?page=0&size=0',
      )
      .then(ress => {
        const userTypeOptions = ress.data.result.map(id => {
          return { user_role_id: id._id, user_role_name: id.user_type_name };
        });
        this.setState(prevState => ({
          userTypeOptions: prevState.userTypeOptions.concat(userTypeOptions),
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }
  handlePersonSelectChange(e) {
    const selected = e.map(data => {
      return {
        user_role_id: data.user_role_id,
        user_role_name: data.user_role_name,
      };
    });
    this.setState({ user_roles: [] });
    this.setState(prevState => ({
      user_roles: prevState.user_roles.concat(selected),
    }));
  }
  handleUpdate = e => {
    const err = this.validate();
    if (!err) {
      e.preventDefault();
      const ID = this.state.ID;
      const department_id = this.state.department.trim().split(',');
      // const user_type_id = this.state.UserType.trim().split(',');
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/users/' + ID,
          {
            name: this.state.name.trim(),
            position: this.state.position.trim(),
            email: this.state.email.trim(),
            department_id: department_id[0],
            department_name: department_id[1],
            // user_type_id: user_type_id[0],
            // user_type_name: user_type_id[1],
            user_roles: this.state.user_roles,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          if (userID === ID) {
            axios
              .post(process.env.REACT_APP_SOURCE_URL + '/users/login', {
                email: this.state.email.trim(),
                password: password,
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
                // this.setState({
                //   isLoggedIn: true,
                //   accessToken,
                //   userName: name,
                //   userEmail: email,
                //   userDepartmentID: department_id,
                //   userDepartmentName: department_name,
                //   userPosition: position,
                //   userID: _id,
                //   userTypeID: user_role_id,
                //   userTypeName: user_role_name,
                // });
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
                // confirmAlert({
                //   message: 'ระบบได้เปลี่ยนรหัสผ่านเรียบร้อยแล้ว',
                //   buttons: [],
                // });
                // setTimeout(() => (window.location.href = '/'), 3000);
                // const UserType1 = localStorage.getItem('userRoles');
                // const user_role_namex= localStorage.getItem('userTypeName');
                // const user_role_idx= localStorage.getItem('userTypeID');
              });
          }
          this.setState({
            modal: false,
            isForm: '',
            ID: ID,
          });
          confirmAlert({
            message: 'แก้ไขข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(
            () => (window.location.href = '/User/' + this.state.selected),
            1000,
          );
        })
        .catch(err => {
          console.log(err);
          if (err.response.data == 'Your email already exists!') {
            const validationError2 = 'Email ซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationEmail: validationError2,
            });
          }
        });
    }
  };
  componentDidMount() {
    this.loadCommentsFromServer();
    this.fetch();
    // this.fetch1();
    this.toggle();
    this.fetchUserType();
  }
  loadCommentsFromServer() {
    $.ajax({
      url:
        this.state.url +
        '?page=' +
        this.state.selected +
        '&size=' +
        this.state.perPage,
      data: { totalPage: this.state.perPage, offset: this.state.offset },
      dataType: 'json',
      type: 'GET',
      success: data => {
        this.setState({
          data: data.result,
          pageCount: Math.ceil(data.pagination.itemTotal / this.state.perPage),
        });
      },

      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString()); // eslint-disable-line
      },
    });
  }
  handlePageClick = data => {
    let selected = data.selected + 1;

    let offset = Math.ceil(selected * this.state.perPage);
    this.setState({ offset: offset, selected: selected }, () => {
      this.loadCommentsFromServer();
    });
  };
  render() {
    return (
      <Row>
        <Col md={12} style={{ textAlign: 'right' }}>
          <Tooltip title="Add">
            <Fab
              className="btn_not_focus"
              onClick={() => this.onAdd()}
              color="primary"
            >
              <Icon>add</Icon>
            </Fab>
          </Tooltip>
        </Col>
        <Col>
          <Card className="mb-12">
            <CardBody>
              <Table responsive bordered striped hover id="table1">
                <thead>
                  <tr>
                    <th>ชื่อ-นามสกุล</th>
                    <th>ตำแหน่ง</th>
                    <th>อีเมล</th>
                    {/* <th>รหัสหน่อยงาน</th> */}
                    <th>ชื่อหน่วยงาน</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.length == 0 ? (
                    <tr>
                      <td colSpan="4" align="center">
                        ไม่มีข้อมูลผู้ใช้งาน
                      </td>
                    </tr>
                  ) : (
                    this.state.data.map(id => (
                      <tr>
                        <td>{id.name}</td>
                        <td>{id.position}</td>
                        <td>{id.email}</td>
                        {/* <td>{id.department_id}</td> */}
                        <td>{id.department_name}</td>
                        <td>
                          <Tooltip title="แก้ไข">
                            <IconButton
                              className="btn_not_focus"
                              size="small"
                              color="default"
                              aria-label="แก้ไข"
                              onClick={() => this.onEdit(id._id)}
                            >
                              <Icon>edit_icon</Icon>
                            </IconButton>
                          </Tooltip>
                          &nbsp;
                          <Tooltip title="ลบ">
                            <IconButton
                              className="btn_not_focus"
                              size="small"
                              color="secondary"
                              aria-label="ลบ"
                              onClick={() => this.testAxiosDELETE(id._id)}
                            >
                              <Icon>delete</Icon>
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
              {this.state.data.length != 0 ? (
                <ReactPaginate
                  previousLabel={'ย้อนกลับ'}
                  nextLabel={'ถัดไป'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.state.pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                  forcePage={this.state.currenpage}
                />
              ) : (
                ''
              )}
              <Modal
                isOpen={this.state.modal}
                toggle={this.toggle()}
                className={this.props.className}
              >
                <ModalHeader toggle={this.toggle()}>
                  {this.state.isForm
                    ? 'แก้ไขข้อมูลผู้ใช้'
                    : 'เพิ่มข้อมูลผู้ใช้'}
                </ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                      <Label for="name" sm={12}>
                        ชื่อ-นามสกุล <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          name="name"
                          onChange={this.handleInputChange}
                          value={this.state.name}
                          placeholder="ชื่อ-นามสกุล"
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationname}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label for="position" sm={12}>
                        ตำแหน่ง <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          name="position"
                          onChange={this.handleInputChange}
                          value={this.state.position}
                          placeholder="ตำแหน่ง"
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationposition}
                      </Col>
                    </FormGroup>

                    <FormGroup>
                      <Label for="PlanID" sm={12}>
                        หน่วยงาน <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="select"
                          name="department"
                          onChange={this.handleInputChange}
                          value={this.state.department}
                        >
                          {this.state.ButgetSources.map(id => (
                            <option value={id.value + ',' + id.display}>
                              {id.display}
                            </option>
                          ))}
                        </Input>
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationdepartment}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label for="email" sm={12}>
                        อีเมล <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          name="email"
                          placeholder="อีเมล"
                          onChange={this.handleInputChange}
                          value={this.state.email}
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationEmail}
                      </Col>
                    </FormGroup>
                    {this.state.isForm == '' ? (
                      <FormGroup>
                        <Label for="password" sm={12}>
                          รหัสผ่าน <font color="red">*</font>
                        </Label>
                        <Col sm={12}>
                          <Input
                            type="password"
                            name="password"
                            placeholder="รหัสผ่าน"
                            onChange={this.handleInputChange}
                            value={this.state.password}
                          />
                        </Col>
                        <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                          {this.state.validationpassword}
                        </Col>
                      </FormGroup>
                    ) : (
                      <FormGroup />
                    )}
                    <FormGroup>
                      <Label for="PlanID" sm={12}>
                        ประเภทของผู้ใช้งาน <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Typeahead
                          clearButton
                          labelKey="user_role_name"
                          id="user_roles"
                          name="user_roles"
                          options={this.state.userTypeOptions}
                          placeholder="สถานะของผู้ใช้งาน"
                          onChange={e => this.handlePersonSelectChange(e)}
                          defaultSelected={this.state.user_roles}
                          // value={this.state.UserType}
                          multiple
                        />
                        {/* {this.state.ButgetSources1.map(id => (
                            <option value={id.value + ',' + id.display}>
                              {id.display}
                            </option>
                          ))} */}
                        {/* <option value="1,ผู้จัดการข้อมูลพื้นฐาน">
                            ผู้จัดการข้อมูลพื้นฐาน
                          </option>
                          <option value="2,ผู้จัดการข้อมูลโครงการ">
                            ผู้จัดการข้อมูลโครงการ
                          </option>
                          <option value="3,ผู้รายงานผลโครงการ">
                            ผู้รายงานผลโครงการ
                          </option>
                          <option value="4,ผู้จัดการข้อมูลตัวชี้วัด">
                            ผู้จัดการข้อมูลพื้นฐาน
                          </option>
                          <option value="5,ผู้รายงานผลตัวชี้วัด">
                            ผู้รายงานผลตัวชี้วัด
                          </option>
                          <option value="6,ผู้บริหาร">ผู้บริหาร</option> */}
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationUserType}
                      </Col>
                    </FormGroup>
                    <FormGroup style={{ textAlign: 'right' }}>
                      <Button color="primary">บันทึก</Button>&nbsp;
                      <Button color="secondary" onClick={this.toggle()}>
                        ยกเลิก
                      </Button>
                    </FormGroup>
                  </Form>
                </ModalBody>
                <ModalFooter />
              </Modal>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}
