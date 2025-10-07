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
  keyword,
  InputGroup,
} from 'reactstrap';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import { Checkbox, Fab, Grid, styled } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import { Typeahead } from 'react-bootstrap-typeahead';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const CustomCheckbox = styled(Checkbox)(({ colors, theme }) => ({
  color: '#4456bb',
  '&.Mui-checked': {
    color: '#4456bb',
  },
}));

const MySwal = withReactContent(Swal);
const token_id = localStorage.getItem('token');
const password = localStorage.getItem('password');
const userID = localStorage.getItem('userID');
export default class PermissionList extends React.Component {
  constructor(props) {
    super(props);
    let id;
    {
      this.props.page == ':id' || this.props.page == '' || this.props.page == undefined ? (id = 1) : (id = this.props.page);
    }
    this.state = {
      keyword: '',
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
      validationTel: '',
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
      modal_permission: false,
      show_password: false,
      user_password: '',
      user_email: '',
      tel: '',
      selectedRole: 1,
      user_permission: [],
      manageUsersData: true,
      manageBasicData: true,
      manageBudgetData: true,
      manageProjectData: true,
      manageReportProjectData: true,
      manageKPIData: true,
      manageReportKPIData: true,
      showProjectData: true,
      showReportProjectData: true,
      showKPIData: true,
      showReportKPIData: true,
      isEditingPassword: false,
      validatePasswordFormat: '',
      validatePasswordFormat2: '',
      validatePasswordFormat3: '',
      validatePasswordFormat4: '',
      validatePasswordFormat5: '',
      validatePasswordFormat6: '',
    };
  }
  clickShow = () => {
    if (this.state.show_password === false) {
      this.setState({
        show_password: true,
      });
    } else {
      this.setState({
        show_password: false,
      });
    }
  };
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

  toggle1 = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal_permission: !this.state.modal_permission,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  onOpenPermission = id => {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/users/' + id).then(res => {
      const { _id, name, position, email, department_id, department_name, password, tel, user_permission, user_type } = res.data;

      // let role = 3;
      // if (user_permission[0].manageKPIData) {
      //   role = 2;
      // }
      // if (user_permission[0].manageUsersData) {
      //   role = 1;
      // }

      this.setState({
        name,
        position,
        email,
        department: `${department_id},${department_name}`,
        department_id,
        department_name,
        password,
        tel,
        user_permission,
        modal_permission: true,
        ID: _id,

        // Update permissions based on API response
        manageUsersData: user_permission[0].manageUsersData || false,
        manageBasicData: user_permission[0].manageBasicData || false,
        manageBudgetData: user_permission[0].manageBudgetData || false,
        manageProjectData: user_permission[0].manageProjectData || false,
        manageReportProjectData: user_permission[0].manageReportProjectData || false,
        manageKPIData: user_permission[0].manageKPIData || false,
        manageReportKPIData: user_permission[0].manageReportKPIData || false,
        showProjectData: user_permission[0].showProjectData || false,
        showReportProjectData: user_permission[0].showReportProjectData || false,
        showKPIData: user_permission[0].showKPIData || false,
        showReportKPIData: user_permission[0].showReportKPIData || false,

        selectedRole: user_type, // Set the role based on permissions
      });
    });
  };
  handleSelectChange = role => {
    let newPermissions = {
      manageUsersData: false,
      manageBasicData: false,
      manageBudgetData: false,
      manageProjectData: false,
      manageReportProjectData: false,
      manageKPIData: false,
      manageReportKPIData: false,
      showProjectData: false,
      showReportProjectData: false,
      showKPIData: false,
      showReportKPIData: false,
      selectedRole: role, // Already a number from onChange
    };

    switch (role) {
      case 3:
        newPermissions = {
          ...newPermissions,
          manageProjectData: true,
          manageReportProjectData: true,
          showProjectData: true,
          showReportProjectData: true,
        };
        break;
      case 2:
        newPermissions = {
          ...newPermissions,
          manageProjectData: true,
          manageReportProjectData: true,
          manageKPIData: true,
          manageReportKPIData: true,
          showProjectData: true,
          showReportProjectData: true,
          showKPIData: true,
          showReportKPIData: true,
        };
        break;
      case 1:
        newPermissions = {
          ...newPermissions,
          manageUsersData: true,
          manageBasicData: true,
          manageBudgetData: true,
          manageProjectData: true,
          manageReportProjectData: true,
          manageKPIData: true,
          manageReportKPIData: true,
          showProjectData: true,
          showReportProjectData: true,
          showKPIData: true,
          showReportKPIData: true,
        };
        break;
      default:
        console.warn(`Unhandled role: ${role}`);
        break;
    }

    this.setState(newPermissions);
  };
  // _onRefresh = () => {
  //   this.setState({ refreshing: true });
  //   this.loadCommentsFromServer().then(() => {
  //     this.setState({ refreshing: false });
  //   });
  // };
  //   loadCommentsFromServer = () => {
  //     axios.get(process.env.REACT_APP_SOURCE_URL + '/users/list').then(res => {
  //       const Budget = res.data;
  //       this.setState({ Budget });
  //       //
  //     });
  //   };
  fetch = () => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataDepartments/list?page=0&size=0')
      .then(ress => {
        const ButgetSource = ress.data.result.map(id => {
          return {
            value: id.department_id,
            display: id.department_name,
          };
        });
        this.setState({
          ButgetSources: [{ value: '', display: '(เลือกข้อมูลหน่วยงาน)' }].concat(ButgetSource),
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

  testAxiosDELETE = (id, name) => {
    MySwal.fire({
      title: (
        <strong>
          คุณต้องการจะลบผู้ใช้ <br /> <div style={{ color: '#ff962d', marginTop: '15px' }}>'{name}'</div>
        </strong>
      ),
      // html: <i>You clicked the button!</i>,
      icon: 'warning',
      confirmButtonColor: '#66BB66',
      confirmButtonText: 'ยืนยัน',
      showCancelButton: true,
      cancelButtonColor: '#EE4444',
      cancelButtonText: 'ยกเลิก',
    }).then(result => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // MySwal.fire({ title: <strong>ok</strong> });
        this.DELETE(id);
      }
    });
  };
  DELETE = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/users/' + id)
      .then(res => {
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        this.loadCommentsFromServer();
        this.loadCommentsFromServer2();
        //setTimeout(() => (window.location.href = '/AllProject/'), 1000);
        // this.loadCommentsFromServer();this.loadCommentsFromServer2();
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    this.setState({ isEditingPassword: false });
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
        tel,
        user_permission,
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
        tel: tel === '-' ? '' : tel,
        user_permission: user_permission,
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
        validatePasswordFormat: '',
        validatePasswordFormat2: '',
        validatePasswordFormat3: '',
        validatePasswordFormat4: '',
        validatePasswordFormat5: '',
        validatePasswordFormat6: '',
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
      tel: '',
      modal: true,
      isForm: '',
      validationname: '',
      validationEmail: '',
      validationposition: '',
      validationdepartment: '',
      validationUserType: '',
      validationpassword: '',

      manageUsersData: true,
      manageBasicData: true,
      manageBudgetData: true,
      manageProjectData: true,
      manageReportProjectData: true,
      manageKPIData: true,
      manageReportKPIData: true,
      showProjectData: true,
      showReportProjectData: true,
      showKPIData: true,
      showReportKPIData: true,

      validatePasswordFormat: '',
      validatePasswordFormat2: '',
      validatePasswordFormat3: '',
      validatePasswordFormat4: '',
      validatePasswordFormat5: '',
      validatePasswordFormat6: '',
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
      errors.validationEmail = 'กรุณาตรวจสอบอีเมล์ให้ถูกต้องตามรูปแบบ';
    }
    if (this.state.department.trim().length <= 0) {
      isError = true;
      errors.validationdepartment = 'กรุณาเลือกข้อมูลหน่วยงาน';
    }
    // if (this.state.user_roles.length <= 0) {
    //   isError = true;
    //   errors.validationUserType = 'กรุณาเลือกประเภทผู้ใช้งาน';
    // }
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
            tel: this.state.tel.toString() === '' ? '-' : this.state.tel,
            user_type: 1,
            //status: 1,
            user_permission: [
              {
                manageUsersData: true,
                manageBasicData: true,
                manageBudgetData: true,
                manageProjectData: true,
                manageReportProjectData: true,
                manageKPIData: true,
                manageReportKPIData: true,
                showProjectData: true,
                showReportProjectData: true,
                showKPIData: true,
                showReportKPIData: true,
              },
            ],
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
          //   confirmAlert({
          //     message: 'บันทึกข้อมูลสำเร็จ',
          //     buttons: [],
          //   });
          //   setTimeout(
          //     () => (window.location.href = '/User/' + this.state.selected),
          //     1000,
          //   );
          MySwal.fire({
            title: <strong>บันทึกข้อมูลสำเร็จ</strong>,
            // html: <i>You clicked the button!</i>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
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
      .get(process.env.REACT_APP_SOURCE_URL + '/dataUserTypes/list?page=0&size=0')
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
    if (
      !err &&
      this.state.validatePasswordFormat === '' &&
      this.state.validatePasswordFormat2 === '' &&
      this.state.validatePasswordFormat3 === '' &&
      this.state.validatePasswordFormat4 === '' &&
      this.state.validatePasswordFormat5 === '' &&
      this.state.validatePasswordFormat6 === ''
    ) {
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
            password: this.state.password,
            department_id: department_id[0],
            department_name: department_id[1],
            tel: this.state.tel.toString() === '' ? '-' : this.state.tel,
            user_type: 1,
            user_permission: this.state.user_permission,
            //password: this.state.password,
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
                  tel,
                  // user_type_id,
                  // user_type_name,
                } = res.data.users;

                localStorage.setItem('token', accessToken);
                localStorage.setItem('userID', _id);
                localStorage.setItem('userName', name);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userPosition', position);
                localStorage.setItem('userDepartmentID', department_id);
                localStorage.setItem('userDepartmentName', department_name);
                localStorage.setItem('userTel', tel);
              });
          }
          this.setState({
            modal: false,
            isForm: '',
            ID: ID,
          });
          // confirmAlert({
          //   message: 'แก้ไขข้อมูลสำเร็จ',
          //   buttons: [],
          // });
          // setTimeout(
          //   () => (window.location.href = '/User/' + this.state.selected),
          //   1000,
          // );
          MySwal.fire({
            title: <strong>แก้ไขข้อมูลสำเร็จ</strong>,
            // html: <i>You clicked the button!</i>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          this.loadCommentsFromServer();
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

  handleUpdatePermission = e => {
    let user_permission1 = [
      {
        manageUsersData: this.state.manageUsersData,
        manageBasicData: this.state.manageBasicData,
        manageBudgetData: this.state.manageBudgetData,
        manageProjectData: this.state.manageProjectData,
        manageReportProjectData: this.state.manageReportProjectData,
        manageKPIData: this.state.manageKPIData,
        manageReportKPIData: this.state.manageReportKPIData,
        showProjectData: this.state.showProjectData,
        showReportProjectData: this.state.showReportProjectData,
        showKPIData: this.state.showKPIData,
        showReportKPIData: this.state.showReportKPIData,
      },
    ];
    //const err = this.validate();
    // if (!err) {
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
          tel: this.state.tel,
          user_type: this.state.selectedRole,
          user_permission: [
            {
              manageUsersData: this.state.manageUsersData,
              manageBasicData: this.state.manageBasicData,
              manageBudgetData: this.state.manageBudgetData,
              manageProjectData: this.state.manageProjectData,
              manageReportProjectData: this.state.manageReportProjectData,
              manageKPIData: this.state.manageKPIData,
              manageReportKPIData: this.state.manageReportKPIData,
              showProjectData: this.state.showProjectData,
              showReportProjectData: this.state.showReportProjectData,
              showKPIData: this.state.showKPIData,
              showReportKPIData: this.state.showReportKPIData,
            },
          ],
          //password: this.state.password,
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        // this.loadCommentsFromServer();
        if (userID === ID) {
          axios
            .post(process.env.REACT_APP_SOURCE_URL + '/users/login', {
              email: this.state.email.trim(),
              password: password,
            })
            .then(res => {
              const { user_permission } = res.data.users;

              localStorage.setItem('userPermission', JSON.stringify(user_permission));
              MySwal.fire({
                title: <strong>แก้ไขข้อมูลสิทธิ์สำเร็จ</strong>,
                // html: <i>You clicked the button!</i>,
                icon: 'success',
                timer: 1000,
                showConfirmButton: false,
              }).then(result => {
                if (result.isDismissed === true) {
                  window.location.href = '/UserPermission/';
                }
              });
            });
        }
        {
          MySwal.fire({
            title: <strong>แก้ไขข้อมูลสิทธิ์สำเร็จ</strong>,
            // html: <i>You clicked the button!</i>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
        }
        this.setState({
          modal_permission: false,
          isForm: '',
          ID: ID,
        });

        this.loadCommentsFromServer();
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
    //}
  };
  componentDidMount() {
    this.loadCommentsFromServer();
    this.fetch();
    // this.fetch1();
    this.toggle();
    this.fetchUserType();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyword !== this.state.keyword) {
      setTimeout(() => {
        this.loadCommentsFromServer();
      }, 100);
    }
  }
  loadCommentsFromServer() {
    $.ajax({
      url: this.state.url + '?page=' + this.state.selected + '&size=' + this.state.perPage + '&search=' + this.state.keyword,
      data: { totalPage: this.state.perPage, offset: this.state.offset },
      dataType: 'json',
      type: 'GET',
      success: data => {
        if (data.result.length === 0 && this.state.selected !== 0) {
          this.handlePageClick({ selected: this.state.selected - 2 });
        } else {
          if (this.state.selected === 0) {
            this.setState({
              selected: 1,
            });
          }
          this.setState({
            data: data.result,
            pageCount: Math.ceil(data.pagination.itemTotal / this.state.perPage),
          });
        }
      },

      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString()); // eslint-disable-line
      },
    });
  }
  handlePageClick = data => {
    let selected = data.selected + 1;

    let offset = Math.ceil(selected * this.state.perPage);
    this.setState({ offset: offset, selected: selected, currenpage: selected - 1 }, () => {
      this.loadCommentsFromServer();
    });
  };

  handleInputChangeNumber = e => {
    var value = NaN;
    var validationTel = '';
    if (parseInt(e.target.value) >= 0 && parseInt(e.target.value).toString() !== 'NaN') {
      if (e.target.value.length <= 10) {
        value = e.target.value;
      } else {
        validationTel = 'กรอกเกินสิบหลัก';
      }
    }

    this.setState({
      [e.target.name]: value.toString(),
      validationTel: validationTel,
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
    const validatePasswordFormat = !e.target.value.trim().match(passwordFormat) === true ? 'กรุณากรอกตัวพิมพ์เล็กอย่างน้อยหนึ่งตัว' : '';
    const validatePasswordFormat2 = !e.target.value.trim().match(passwordFormat2) === true ? 'กรุณากรอกตัวพิมพ์ใหญ่อย่างน้อยหนึ่งตัว' : '';
    const validatePasswordFormat3 = !e.target.value.trim().match(passwordFormat3) === true ? 'กรุณากรอกตัวเลขอย่างน้อยหนึ่งตัว' : '';
    const validatePasswordFormat4 = !e.target.value.match(passwordFormat4) === false ? 'ห้ามกรอกเว้นวรรค' : '';
    const validatePasswordFormat5 = !e.target.value.match(passwordFormat5) === false ? 'ห้ามกรอกภาษาไทย' : '';
    const validatePasswordFormat6 = e.target.value.length < 8 ? 'กรุณากรอกอย่างน้อยแปดตัว' : '';

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

  handleInputChangeCheck = e => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };
  handleClickEditPassword = () => {
    this.setState({ isEditingPassword: true });
  };
  handleCancelEditPassword = () => {
    this.setState({ isEditingPassword: false });
  };
  render() {
    return (
      <>
        <Row>
          <Col sm={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}></Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <div style={{ textAlign: 'right' }}>
                      <Input type="text" name="keyword" placeholder={'ค้นหา'} onChange={this.handleInputChange} value={this.state.keyword} style={{ width: '100%' }}></Input>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Col>
          <Col>
            {/* <Card className="mb-12">
            <CardBody> */}
            <Table responsive borderless id="table1">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  {/* <th>BudgetSouceID</th> */}
                  <th>ชื่อ-นามสกุล</th>
                  <th>ตำแหน่ง</th>
                  <th>หน่วยงาน</th>
                  <th>อีเมล</th>
                  {/* <th>รหัสหน่อยงาน</th> */}
                  <th style={{ textAlign: 'center' }}>สิทธิ์ผู้ใช้</th>
                  <th style={{ textAlign: 'center' }}>จัดการข้อมูล</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.length == 0 ? (
                  <tr>
                    <td colSpan="7" align="center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  this.state.data.map((id, i) => (
                    <tr key={'table' + i}>
                      <td style={{ textAlign: 'center' }}>{(parseInt(this.state.selected) - 1) * 10 + (i + 1)}</td>
                      {/* <td>{id.budget_source_id}</td> */}
                      <td>{id.name}</td>
                      <td>{id.position}</td>
                      <td>{id.department_name}</td>
                      <td>{id.email}</td>
                      {/* <td>{id.department_id}</td> */}
                      <td style={{ textAlign: 'center' }}>
                        {' '}
                        <Tooltip title="แก้ไขสิทธิ์">
                          <span className="view-button" onClick={() => this.onOpenPermission(id._id)}>
                            <Icon style={{ fontSize: '14px' }}>person_outline</Icon>
                          </span>
                        </Tooltip>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Tooltip title="แก้ไข">
                          <span className="edit-button" onClick={() => this.onEdit(id._id)}>
                            <Icon style={{ fontSize: '14px' }}>edit</Icon>
                          </span>
                        </Tooltip>
                        &nbsp;
                        <Tooltip title="ลบ">
                          <span className="delete-button" onClick={() => this.testAxiosDELETE(id._id, id.name)}>
                            <Icon style={{ fontSize: '14px' }}>delete_outline</Icon>
                          </span>
                        </Tooltip>
                        {/* </div> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {this.state.data.length != 0 ? (
              <div style={{ display: 'flex', justifyContent: 'right' }}>
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
              </div>
            ) : (
              ''
            )}
            <Modal isOpen={this.state.modal} toggle={this.toggle()} className={this.props.className}>
              <ModalHeader toggle={this.toggle()}>{this.state.isForm ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มข้อมูลผู้ใช้'}</ModalHeader>
              <ModalBody>
                <Form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Label for="name" sm={12}>
                      ชื่อ-นามสกุล <font color="red">*</font>
                    </Label>
                    <Col sm={12}>
                      <Input name="name" onChange={this.handleInputChange} value={this.state.name} placeholder="ชื่อ-นามสกุล" />
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
                      <Input name="position" onChange={this.handleInputChange} value={this.state.position} placeholder="ตำแหน่ง" />
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
                      <Input type="select" name="department" onChange={this.handleInputChange} value={this.state.department}>
                        {this.state.ButgetSources.map(id => (
                          <option key={'ButgetSources' + id.value} value={id.value + ',' + id.display}>
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
                    <Label for="position" sm={12}>
                      เบอร์โทรติดต่อ
                    </Label>
                    <Col sm={12}>
                      <Input type="number" name="tel" onChange={this.handleInputChangeNumber} value={this.state.tel} placeholder="เบอร์โทรติดต่อ" />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationTel}
                    </Col>
                  </FormGroup>

                  <hr />
                  <FormGroup>
                    <Label for="email" sm={12}>
                      อีเมล
                      {this.state.isForm !== 'edit' ? <font color="red"> *</font> : ''}
                    </Label>
                    <Col sm={12}>
                      <Input name="email" placeholder="อีเมล" onChange={this.handleInputChange} value={this.state.email} disabled={this.state.isForm === 'edit' ? true : false} />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationEmail}
                    </Col>
                  </FormGroup>
                  {this.state.isEditingPassword ? (
                    <FormGroup>
                      <Label for="password" sm={12}>
                        รหัสผ่าน <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <InputGroup>
                          <Input
                            type={this.state.show_password === false ? 'password' : 'text'}
                            name="password"
                            placeholder="รหัสผ่าน"
                            onChange={this.handleInputChangePass}
                            value={this.state.password}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              marginTop: '3px',
                              right: '3px',
                              zIndex: 3,
                            }}
                          >
                            <IconButton size="small" onClick={this.clickShow}>
                              {this.state.show_password === false ? <Icon>visibility</Icon> : <Icon>visibility_off</Icon>}
                            </IconButton>
                          </div>
                        </InputGroup>
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        <div>{this.state.validationpassword}</div>
                        <div>{this.state.validatePasswordFormat}</div>
                        <div>{this.state.validatePasswordFormat2}</div>
                        <div>{this.state.validatePasswordFormat3}</div>
                        <div>{this.state.validatePasswordFormat4}</div>
                        <div>{this.state.validatePasswordFormat5}</div>
                        <div>{this.state.validatePasswordFormat6}</div>
                      </Col>
                    </FormGroup>
                  ) : (
                    ''
                  )}

                  <FormGroup style={{ textAlign: 'center' }}>
                    {!this.state.isEditingPassword ? (
                      <Button type="button" onClick={this.handleClickEditPassword} color="warning">
                        แก้ไขรหัสผ่าน
                      </Button>
                    ) : (
                      ''
                    )}
                    &nbsp;
                    <Button color="success">บันทึก</Button>&nbsp;
                    <Button color="danger" onClick={!this.state.isEditingPassword ? this.toggle() : this.handleCancelEditPassword}>
                      ยกเลิก
                    </Button>
                  </FormGroup>
                </Form>
              </ModalBody>
              {/* <ModalFooter /> */}
            </Modal>

            <Modal isOpen={this.state.modal_permission} toggle={this.toggle1()} className={this.props.className}>
              <ModalHeader toggle={this.toggle1()}>จัดการข้อมูลสิทธิ์</ModalHeader>
              <ModalBody>
                <Form onSubmit={this.handleUpdatePermission}>
                  <Col className="p-0 mb-2">
                    {' '}
                    <select
                      className="form-control"
                      name="selectedRole"
                      value={this.state.selectedRole}
                      onChange={e => this.handleSelectChange(Number(e.target.value))} // Convert value to number
                    >
                      <option value="1">Super Admin</option>
                      <option value="2">Admin</option>
                      <option value="3">ผู้ใช้ทั่วไป</option>
                    </select>
                  </Col>
                  <Table responsive id="table1">
                    <thead>
                      <tr style={{ backgroundColor: '#4455bb', color: '#ffffff' }}>
                        <th>สิทธิ์ผู้ใช้งาน</th>
                        <th style={{ textAlign: 'center', width: '70px' }}>ข้อมูล</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="2">
                          {' '}
                          <span style={{ fontWeight: '700' }}>จัดการข้อมูล</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="flex">การจัดการข้อมูลผู้ใช้งาน</td>
                        <td className="p-0" style={{ textAlign: 'center', width: '70px' }}>
                          <CustomCheckbox colors="#000000" name="manageUsersData" checked={this.state.manageUsersData} onChange={this.handleInputChangeCheck} />
                        </td>
                      </tr>
                      <tr>
                        <td className="flex">การจัดการข้อมูลพื้นฐาน</td>
                        <td className="p-0" style={{ textAlign: 'center', width: '70px' }}>
                          <CustomCheckbox colors="#000000" name="manageBasicData" checked={this.state.manageBasicData} onChange={this.handleInputChangeCheck} />
                        </td>
                      </tr>
                      <tr>
                        <td className="flex">การจัดการข้อมูลงบประมาณ</td>
                        <td className="p-0" style={{ textAlign: 'center', width: '70px' }}>
                          <CustomCheckbox colors="#000000" name="manageBudgetData" checked={this.state.manageBudgetData} onChange={this.handleInputChangeCheck} />
                        </td>
                      </tr>
                      <tr>
                        <td className="flex">การจัดการข้อมูลโครงการ</td>
                        <td className="p-0" style={{ textAlign: 'center', width: '70px' }}>
                          <CustomCheckbox colors="#000000" name="manageProjectData" checked={this.state.manageProjectData} onChange={this.handleInputChangeCheck} />
                        </td>
                      </tr>
                      <tr>
                        <td className="flex">การจัดการรายงานผลโครงการ</td>
                        <td className="p-0" style={{ textAlign: 'center', width: '70px' }}>
                          <CustomCheckbox colors="#000000" name="manageReportProjectData" checked={this.state.manageReportProjectData} onChange={this.handleInputChangeCheck} />
                        </td>
                      </tr>
                      <tr>
                        <td className="flex">การจัดการข้อมูลตัวชี้วัด KPI</td>
                        <td className="p-0" style={{ textAlign: 'center', width: '70px' }}>
                          <CustomCheckbox colors="#000000" name="manageKPIData" checked={this.state.manageKPIData} onChange={this.handleInputChangeCheck} />
                        </td>
                      </tr>
                      <tr>
                        <td className="flex">การจัดการรายงานผลข้อมูลตัวชี้วัด KPI</td>
                        <td className="p-0" style={{ textAlign: 'center', width: '70px' }}>
                          <CustomCheckbox colors="#000000" name="manageReportKPIData" checked={this.state.manageReportKPIData} onChange={this.handleInputChangeCheck} />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table className="mt-2">
                    <tbody>
                      <tr>
                        <td colSpan="2">
                          <span style={{ fontWeight: '700' }}> ดูข้อมูล </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="flex">การดูข้อมูลโครงการ</td>
                        <td className="p-0" style={{ textAlign: 'center', width: '70px' }}>
                          <CustomCheckbox colors="#000000" name="showProjectData" checked={this.state.showProjectData} onChange={this.handleInputChangeCheck} />
                        </td>
                      </tr>
                      <tr>
                        <td className="flex">การดูข้อมูลรายงานผลโครงการ</td>
                        <td className="p-0" style={{ textAlign: 'center', width: '70px' }}>
                          <CustomCheckbox colors="#000000" name="showReportProjectData" checked={this.state.showReportProjectData} onChange={this.handleInputChangeCheck} />
                        </td>
                      </tr>
                      <tr>
                        <td className="flex">การดูข้อมูลตัวชี้วัด KPI</td>
                        <td className="p-0" style={{ textAlign: 'center', width: '70px' }}>
                          <CustomCheckbox colors="#000000" name="showKPIData" checked={this.state.showKPIData} onChange={this.handleInputChangeCheck} />
                        </td>
                      </tr>
                      <tr>
                        <td className="flex">การดูรายงานผลข้อมูลตัวชี้วัด KPI</td>
                        <td className="p-0" style={{ textAlign: 'center', width: '70px' }}>
                          <CustomCheckbox colors="#000000" name="showReportKPIData" checked={this.state.showReportKPIData} onChange={this.handleInputChangeCheck} />
                        </td>
                      </tr>
                    </tbody>
                  </Table>

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
            {/* </CardBody>
          </Card> */}
          </Col>
        </Row>

        <div className="floating-button">
          <Tooltip title="Add">
            <Fab
              className="btn_not_focus"
              style={{
                border: '10px solid #3f51b5',
                backgroundColor: '#ffffff',
                width: '70px',
                height: '70px',
              }}
              onClick={() => this.onAdd()}
              // color="primary"
            >
              <Icon color="primary">add</Icon>
            </Fab>
          </Tooltip>
        </div>
      </>
    );
  }
}
