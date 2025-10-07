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
} from 'reactstrap';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { confirmAlert } from 'react-confirm-alert';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
const token_id = localStorage.getItem('token');
export default class DepartmentList extends React.Component {
  constructor(props) {
    super(props);
    let id1;
    {
      this.props.page == ':id' ||
      this.props.page == '' ||
      this.props.page == undefined
        ? (id1 = 1)
        : (id1 = this.props.page);
    }
    this.state = {
      Budget: [],
      refreshing: false,
      DepartmentID: '',
      DepartmentName: '',
      validationError: '',
      validationError1: '',
      isForm: '',
      ID: '',
      data: [],
      selected: id1,
      offset: 0,
      perPage: 10,
      keyword: '',
      currenpage: id1 - 1,
      url: process.env.REACT_APP_SOURCE_URL + '/dataDepartments/list',
    };
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadCommentsFromServer().then(() => {
      this.setState({ refreshing: false });
    });
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
  fetch = () => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources/list')
      .then(ress => {
        const ButgetSource = ress.data.result.map(id => {
          return { value: id.budget_source_id, display: id.budget_source_name };
        });
        this.setState({
          ButgetSources: [
            { value: '', display: '(เลือกข้อมูลแหล่งงบประมาณ(ผลผลิต))' },
          ].concat(ButgetSource),
        });
      })
      .catch(error => {
        console.log(error);
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataDepartments/' + id)
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
      .get(process.env.REACT_APP_SOURCE_URL + '/dataDepartments/' + id)
      .then(res => {
        const { _id, department_id, department_name } = res.data;
        this.setState({
          DepartmentID: department_id,
          DepartmentName: department_name,
          modal: true,
          ID: _id,
          isForm: 'edit',
          validationError: '',
          validationError1: '',
        });
      });
  };
  handleInputChange = e => {
    if (e.target.name == 'DepartmentID') {
      this.setState({
        validationError: '',
      });
    }
    if (e.target.name == 'DepartmentName') {
      this.setState({
        validationError1: '',
      });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onAdd() {
    this.setState({
      DepartmentName: '',
      DepartmentID: '',
      modal: true,
      isForm: '',
      ID: '',
      validationError: '',
      validationError1: '',
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
    if (this.state.DepartmentName.trim() && this.state.DepartmentID.trim()) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/dataDepartments',
          {
            department_id: this.state.DepartmentID.trim(),
            department_name: this.state.DepartmentName.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.setState({
            modal: false,
            DepartmentName: '',
            DepartmentID: '',
          });
          confirmAlert({ message: 'บันทึกข้อมูลสำเร็จ', buttons: [] });
          setTimeout(() => (window.location.href = '/Department/'), 1000);
        })
        .catch(err => {
          if (
            err.response.data == 'Please Check your department id and name!'
          ) {
            const validationError = 'รหัสหน่วยงานซ้ำ กรุณากรอกใหม่';
            const validationError1 = 'ชื่อหน่วยงานซ้ำ กรุณากรอกใหม่';
            this.setState({
              validationError: validationError,
              validationError1: validationError1,
            });
          } else if (err.response.data == 'Please Check your department id!') {
            const validationError = 'รหัสหน่วยงานซ้ำ กรุณากรอกใหม่';
            // const validationError1 = 'ชื่อหน่วยงานซ้ำ กรุณากรอกใหม่';
            this.setState({
              validationError: validationError,
              validationError1: '',
            });
          } else if (
            err.response.data == 'Please Check your department name!'
          ) {
            // const validationError = 'รหัสหน่วยงานซ้ำ กรุณากรอกใหม่';
            const validationError1 = 'ชื่อหน่วยงานซ้ำ กรุณากรอกใหม่';
            this.setState({
              validationError: '',
              validationError1: validationError1,
            });
          }
        });
    } else {
      // alert('กรุณากรอกข้อมูลให้ครบ');
      const validationError = this.state.DepartmentID.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.DepartmentName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      this.setState({
        validationError: validationError,
        validationError1: validationError1,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.ID;
    if (this.state.DepartmentName.trim() && this.state.DepartmentID.trim()) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/dataDepartments/' + ID,
          {
            department_id: this.state.DepartmentID.trim(),
            department_name: this.state.DepartmentName.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.setState({
            modal: false,
            DepartmentName: '',
            DepartmentID: '',
            isForm: '',
            ID: '',
          });
          confirmAlert({ message: 'แก้ไขข้อมูลสำเร็จ', buttons: [] });
          setTimeout(
            () => (window.location.href = '/Department/' + this.state.selected),
            1000,
          );
        })
        .catch(err => {
          if (
            err.response.data == 'Please Check your department id and name!'
          ) {
            const validationError = 'รหัสหน่วยงานซ้ำ กรุณากรอกใหม่';
            const validationError1 = 'ชื่อหน่วยงานซ้ำ กรุณากรอกใหม่';
            this.setState({
              validationError: validationError,
              validationError1: validationError1,
            });
          } else if (err.response.data == 'Please Check your department id!') {
            const validationError = 'รหัสหน่วยงานซ้ำ กรุณากรอกใหม่';
            // const validationError1 = 'ชื่อหน่วยงานซ้ำ กรุณากรอกใหม่';
            this.setState({
              validationError: validationError,
              // validationError1: validationError1,
            });
          } else if (
            err.response.data == 'Please Check your department name!'
          ) {
            // const validationError = 'รหัสหน่วยงานซ้ำ กรุณากรอกใหม่';
            const validationError1 = 'ชื่อหน่วยงานซ้ำ กรุณากรอกใหม่';
            this.setState({
              // validationError: validationError,
              validationError1: validationError1,
            });
          }
        });
    } else {
      // alert('กรุณากรอกข้อมูลให้ครบ');
      const validationError = this.state.DepartmentID.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.DepartmentName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      this.setState({
        validationError: validationError,
        validationError1: validationError1,
      });
    }
  };
  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
    this.fetch();
  }
  loadCommentsFromServer() {
    $.ajax({
      url:
        this.state.url +
        '?page=' +
        this.state.selected +
        '&size=' +
        this.state.perPage +
        '&search=' +
        this.state.keyword,
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
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    this.loadCommentsFromServer();
  };
  render() {
    return (
      <Page>
        <Row>
          <Col sm={12} className="form-inline" style={{ paddingLeft: '0px' }}>
            <Col
              md={6}
              style={{ paddingLeft: '0px', textAlign: 'left' }}
              className="form-inline"
            >
              <Label for="PlanName" sm={4} style={{ paddingLeft: '0px' }}>
                จำนวนที่แสดงต่อหน้า
              </Label>
              <Col sm={8} style={{ textAlign: 'left' }}>
                <select
                  type="text"
                  name="perPage"
                  onChange={this.handleInputChange}
                  value={this.state.perPage}
                >
                  <option>10</option>
                  <option>20</option>
                  <option>30</option>
                </select>
              </Col>
            </Col>

            <Col md={6} style={{ textAlign: 'right' }} className="form-inline">
              <Col md={10} style={{ textAlign: 'right' }}>
                <Input
                  type="text"
                  name="keyword"
                  placeholder="คำค้นหา"
                  onChange={this.handleInputChange}
                  value={this.state.keyword}
                  style={{ width: '100%' }}
                ></Input>
              </Col>

              <Col md={2} style={{ textAlign: 'right' }}>
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
            </Col>
          </Col>

          <Col sm={12}></Col>
          <Col>
            <Card className="mb-12">
              <CardBody>
                <Table responsive bordered striped hover>
                  <thead>
                    <tr>
                      <th>รหัสหน่วยงาน</th>
                      <th>ชื่อหน่วยงาน</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.data.length == 0 ? (
                      <tr>
                        <td colSpan="4" align="center">
                          ไม่มีข้อมูลหน่วยงาน
                        </td>
                      </tr>
                    ) : (
                      this.state.data.map(id => (
                        <tr>
                          <td>{id.department_id}</td>
                          <td>{id.department_name}</td>
                          <td style={{ textAlign: 'right' }}>
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
                  forcePage={this.state.currenpage}
                />
                <Modal
                  isOpen={this.state.modal}
                  toggle={this.toggle()}
                  className={this.props.className}
                >
                  <ModalHeader toggle={this.toggle()}>
                    {this.state.isForm
                      ? 'แก้ไขข้อมูลหน่วยงาน'
                      : 'เพิ่มข้อมูลหน่วยงาน'}
                  </ModalHeader>
                  <ModalBody>
                    <Form onSubmit={this.handleSubmit}>
                      <FormGroup>
                        <Label for="DepartmentID" sm={12}>
                          รหัสข้อมูลหน่วยงาน <font color="red">*</font>
                        </Label>
                        <Col sm={12}>
                          <Input
                            type="text"
                            name="DepartmentID"
                            placeholder="รหัสข้อมูลหน่วยงาน"
                            onChange={this.handleInputChange}
                            value={this.state.DepartmentID}
                          />
                        </Col>
                        <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                          {this.state.validationError}
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Label for="DepartmentName" sm={12}>
                          ชื่อข้อมูลหน่วยงาน <font color="red">*</font>
                        </Label>
                        <Col sm={12}>
                          <Input
                            type="textarea"
                            name="DepartmentName"
                            placeholder="ชื่อข้อมูลหน่วยงาน"
                            onChange={this.handleInputChange}
                            value={this.state.DepartmentName}
                          />
                        </Col>
                        <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                          {this.state.validationError1}
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
      </Page>
    );
  }
}
