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
export default class PlanList extends React.Component {
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
    };
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };
  fetchData = () => {
    const userID = localStorage.getItem('userID');
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/users/' + userID)
      .then(res => {
        const {
          _id,
          name,
          position,
          email,
          department_id,
          department_name,
          password,
          user_type_id,
          user_type_name,
          user_roles,
        } = res.data;

        this.setState({
          name: name,
          position: position,
          email: email,
          department: department_id + ',' + department_name,
          department_id: department_id,
          department_name: department_name,
          password: password,
          UserType: user_type_id + ',' + user_type_name,
          user_type_id: user_type_id,
          user_type_name: user_type_name,
          user_roles: user_roles,
          modal: true,
          ID: _id,
          isForm: 'edit',
        });
      });
  };
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
  fetch1 = () => {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL + '/DataUserTypes/list?page=0&size=0',
      )
      .then(ress => {
        const ButgetSource = ress.data.result.map(id => {
          return {
            value: id._id,
            display: id.user_type_name,
          };
        });
        this.setState({
          ButgetSources1: [
            { value: '', display: '(เลือกประเภทผู้ใช้)' },
          ].concat(ButgetSource),
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.state.validationEmail1 = this.state.email.match(
      /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i,
    );

    const ID = this.state.ID;

    const validationEmail1 = this.state.validationEmail1
      ? ''
      : ' กรุณากรอก Email ให้ถูกต้อง';
    const validationname = this.state.name.trim() ? '' : 'กรุณากรอกข้อมูลชื่อ';
    const validationposition = this.state.position.trim()
      ? ''
      : 'กรุณากรอกข้อมูลตำแหน่ง';
    const validationdepartment = this.state.department.trim()
      ? ''
      : 'กรุณาเลือกข้อมูลหน่วยงาน';
    const validationUserType = this.state.UserType.trim()
      ? ''
      : 'กรุณาเลือกประเภทผู้ใช้งาน';
    if (
      validationEmail1 == '' &&
      validationname == '' &&
      validationposition == '' &&
      validationdepartment == '' &&
      validationUserType == ''
    ) {
      const department_id = this.state.department.trim().split(',');
      const user_type_id = this.state.UserType.trim().split(',');
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
          this.fetchData();
          this.setState({
            modal: false,
            ID: ID,
          });
          // alert('บันทึกข้อมูลสำเร็จ');
          confirmAlert({
            message: 'แก้ไขข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(() => (window.location.href = '/User1_1/'), 1000);
        })
        .catch(err => {
          if (err.response.data == 'Please Check your email!') {
            const validationError2 = 'Email ซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationEmail: validationError2,
            });
          }
        });
    } else {
      // alert('กรุณากรอกข้อมูลให้ครบ');
      this.setState({
        validationname: validationname,
        validationEmail: validationEmail1,
        validationposition: validationposition,
        validationdepartment: validationdepartment,
        validationUserType: validationUserType,
      });
    }
  };

  componentDidMount() {
    this.fetchData();
    this.fetch();
    this.fetch1();
  }
  render() {
    return (
      <Row>
        <Col>
          <Card className="mb-12">
            <CardBody>
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
                {/* <FormGroup>
                  <Label for="password" sm={12}>
                    รหัสผ่าน
                  </Label>
                  <Col sm={12}>
                    <Input
                      type="text"
                      name="password"
                      placeholder="รหัสผ่าน"
                      onChange={this.handleInputChange}
                      value={this.state.password}
                      
                    />
                  </Col>
                </FormGroup> */}
                {/* <FormGroup>
                  <Label for="PlanID" sm={12}>
                    ประเภทของผู้ใช้งาน
                  </Label>
                  <Col sm={12}>
                    <Input
                      type="select"
                      name="UserType"
                      onChange={this.handleInputChange}
                      value={this.state.UserType}
                    >
                      {this.state.ButgetSources1.map(id => (
                        <option value={id.value + ',' + id.display}>
                          {id.display}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup> */}
                <FormGroup style={{ textAlign: 'right' }}>
                  <Button color="primary">บันทึก</Button>&nbsp;
                  {/* <Button color="secondary" onClick={this.toggle()}>
                    Cancel
                  </Button> */}
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}
