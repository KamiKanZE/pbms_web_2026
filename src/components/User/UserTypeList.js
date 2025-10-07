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
export default class UserTypeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Budget: [],
      ButgetSources: [],
      ButgetSources1: [],
      refreshing: false,
      modal: false,
      validationError: '',
      name: '',
      ID: '',
      isForm: '',
      data: [],
      selected: 1,
      offset: 0,
      perPage: 10,
      url: process.env.REACT_APP_SOURCE_URL + '/dataUserTypes/list',
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataUserTypes/' + id)
      .then(res => {
        this.loadCommentsFromServer();
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    // this.setState({ modal: true });
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataUserTypes/' + id)
      .then(res => {
        // const ButgetSource1 = res.data;
        // this.setState({ ButgetSource1 });
        const { _id, user_type_name } = res.data;
        // .map(id => ({'PlanID':
        //   id.main_plan_id, 'PlanName':id.main_plan_name
        // }));
        this.setState({
          name: user_type_name,
          modal: true,
          ID: _id,
          isForm: 'edit',
          validationError: '',
        });
      });
  };
  handleInputChange = e => {
    if (e.target.name == 'name') {
      this.setState({
        validationError: '',
      });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onAdd() {
    this.setState({
      name: '',
      modal: true,
      isForm: '',
      validationError: '',
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.isForm == 'edit') {
      this.handleUpdate(e);
    } else {
      this.handleSubmit1(e);
    }
  };

  handleSubmit1 = e => {
    e.preventDefault();
    if (this.state.name.trim()) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/dataUserTypes',
          {
            user_type_name: this.state.name.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
          });
          //confirmAlert({
          //   //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
          //   message: 'บันทึกข้อมูลเรียบร้อย',
          //   buttons: [
          //     {
          //       label: 'ตกลง',
          //     },
          //   ],
          // });
          confirmAlert({
            message: 'บันทึกข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(() => (window.location.href = '/UserType/'), 1000);
        })
        .catch(err => {
          if (err.response.data == 'Please Check your usertypename!') {
            const validationError = 'ชื่อประเภทผู้ใช้งานซ้ำ กรุณากรอกใหม่';
            this.setState({
              validationError: validationError,
            });
          }
        });
    } else {
      // alert('กรุณากรอกข้อมูลให้ครบ');
      this.setState({
        validationError: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.ID;
    if (this.state.name.trim()) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/dataUserTypes/' + ID,
          {
            user_type_name: this.state.name.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            isForm: '',
            ID: '',
          });
          //confirmAlert({
          //   //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
          //   message: 'บันทึกข้อมูลเรียบร้อย',
          //   buttons: [
          //     {
          //       label: 'ตกลง',
          //     },
          //   ],
          // });
          confirmAlert({
            message: 'แก้ไขข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(() => (window.location.href = '/UserType/'), 1000);
        })
        .catch(err => {
          if (err.response.data == 'Please Check your usertypename!') {
            const validationError = 'ชื่อประเภทผู้ใช้งานซ้ำ กรุณากรอกใหม่';
            this.setState({
              validationError: validationError,
            });
          }
        });
    } else {
      // alert('กรุณากรอกข้อมูลให้ครบ');
      this.setState({
        validationError: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      });
    }
  };
  componentDidMount() {
    this.loadCommentsFromServer();
    this.toggle();
    // this.loadCommentsFromServer();
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
  showtype(data) {
    switch (data) {
      case 'ผู้จัดการข้อมูลพื้นฐาน':
        return 'เพื่อจัดการข้อมูลพื้นฐาน';
        break;
      case 'ผู้จัดการข้อมูลโครงการ':
        return 'เพื่อจัดการข้อมูลโครงการ';
        break;
      case 'ผู้รายงานผลโครงการ':
        return 'เพื่อรายงานผลโครงการ';
        break;
      case 'ผู้จัดการข้อมูลตัวชี้วัด':
        return 'เพื่อจัดการข้อมูลตัวชี้วัด';
        break;
      case 'ผู้รายงานผลตัวชี้วัด':
        return 'เพื่อรายงานผลข้อมูลตัวชี้วัด';
        break;
      case 'ผู้บริหาร':
        return 'เพื่อดูรายงานข้อมูลโครงการ';
        break;
    }
  }
  render() {
    return (
      <Row>
        {/* <Col md={12} style={{ textAlign: 'right' }}>
          <Tooltip title="Add">
            <Fab
              className="btn_not_focus"
              onClick={() => this.onAdd()}
              color="primary"
            >
              <Icon>add</Icon>
            </Fab>
          </Tooltip>
        </Col> */}
        <Col>
          <Card className="mb-12">
            <CardBody>
              <Table responsive bordered striped hover id="table1">
                <thead>
                  <tr>
                    <th>ชื่อประเภทผู้ใช้งาน</th>
                    <th>รายละเอียด</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.length == 0 ? (
                    <tr>
                      <td colSpan="4" align="center">
                        ไม่มีข้อมูลประเภทผู้ใช้งาน
                      </td>
                    </tr>
                  ) : (
                    this.state.data.map(id => (
                      <tr>
                        <td>{id.user_type_name}</td>
                        <td>
                          {this.showtype(id.user_type_name)}
                          {/* <Tooltip title="แก้ไข">
                          <IconButton
                            className="btn_not_focus"
                            size="small"
                            color="default"
                            aria-label="แก้ไข"
                            onClick={() => this.onEdit(id._id)}
                          >
                            <Icon>edit_icon</Icon>
                          </IconButton>
                        </Tooltip> */}
                          {/* &nbsp;
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
                        </Tooltip> */}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
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
              />
              <Modal
                isOpen={this.state.modal}
                toggle={this.toggle()}
                className={this.props.className}
              >
                <ModalHeader toggle={this.toggle()}>
                  เพิ่มชื่อประเภทผู้ใช้งาน
                </ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                      <Label for="name" sm={12}>
                        ชื่อประเภทผู้ใช้งาน <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          name="name"
                          onChange={this.handleInputChange}
                          value={this.state.name}
                          placeholder="ชื่อประเภทผู้ใช้งาน"
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError}
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
