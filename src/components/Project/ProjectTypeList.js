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
export default class ProjectTypeList extends React.Component {
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
      ProjectTypeID: '',
      ProjectTypeName: '',
      validationError: '',
      ID: '',
      isForm: '',
      data: [],
      selected: id1,
      offset: 0,
      perPage: 10,
      keyword: '',
      currenpage: id1 - 1,
      url: process.env.REACT_APP_SOURCE_URL + '/dataProjectTypes/list',
    };
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadCommentsFromServer().then(() => {
      this.setState({ refreshing: false });
    });
  };
  // loadCommentsFromServer = () => {
  //   axios
  //     .get(process.env.REACT_APP_SOURCE_URL + '/dataProjectTypes/list')
  //     .then(res => {
  //       const Budget = res.data;
  //       this.setState({ Budget });
  //     });
  // };
  fetch = () => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanAs/list')
      .then(ress => {
        const ButgetSource = ress.data.result.map(id => {
          return { value: id.budget_source_id, display: id.budget_source_name };
        });
        this.setState({
          ButgetSources: [
            { value: '', display: '(Select ButgetSource)' },
          ].concat(ButgetSource),
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.loadCommentsFromServer();
    this.fetch();
    this.toggle();
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataProjectTypes/' + id)
      .then(res => {
        // this.loadCommentsFromServer();
        confirmAlert({
          message: 'ลบข้อมูลสำเร็จ',
          buttons: [],
        });
        setTimeout(() => (window.location.href = '/ProjectType/'), 1000);
      })
      .catch(err => {
        console.log(err);
      });
  };

  onEdit = id => {
    // this.setState({ modal: true });
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataProjectTypes/' + id)
      .then(res => {
        const { _id, project_type_id, project_type_name } = res.data;
        this.setState({
          // ProjectTypeID: project_type_id,
          ProjectTypeName: project_type_name,

          modal: true,
          ID: _id,
          isForm: 'edit',
          validationError: '',
          header: 'แก้ไขข้อมูลประเภทโครงการ',
        });
      });
  };
  handleInputChange = e => {
    if (e.target.name == 'ProjectTypeName') {
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
      ProjectTypeName: '',
      ProjectTypeID: '',
      modal: true,
      isForm: '',
      ID: '',
      validationError: '',
      header: 'เพิ่มข้อมูลประเภทโครงการ',
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
    if (this.state.ProjectTypeName.trim()) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/dataProjectTypes',
          {
            // project_type_id: this.state.ProjectTypeID.trim(),
            project_type_name: this.state.ProjectTypeName.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            ProjectTypeName: '',
            ProjectTypeID: '',
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
          setTimeout(() => (window.location.href = '/ProjectType/'), 1000);
        })
        .catch(err => {
          if (err.response.data == 'Please Check your project type name!') {
            const validationError1 = 'ชื่อประเภทโครงการ ซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError: validationError1,
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
    if (this.state.ProjectTypeName.trim()) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/dataProjectTypes/' + ID,
          {
            // project_type_id: this.state.ProjectTypeID.trim(),
            project_type_name: this.state.ProjectTypeName.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            ProjectTypeID: '',
            ProjectTypeName: '',
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
          setTimeout(
            () =>
              (window.location.href = '/ProjectType/' + this.state.selected),
            1000,
          );
        })
        .catch(err => {
          if (err.response.data == 'Please Check your project type name!') {
            const validationError1 = 'ชื่อประเภทโครงการ ซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError2: validationError1,
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
              <Table responsive bordered striped hover id="table1">
                <thead>
                  <tr>
                    {/* <th>ProjectTypeID</th> */}
                    <th>ชื่อประเภทโครงการ</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.length == 0 ? (
                    <tr>
                      <td colSpan="4" align="center">
                        ไม่มีข้อมูลประเภทโครงการ
                      </td>
                    </tr>
                  ) : (
                    this.state.data.map(id => (
                      <tr>
                        {/* <td>{id.project_type_id}</td> */}
                        <td>{id.project_type_name}</td>
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
                  {this.state.header}
                </ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.handleSubmit}>
                    {/* <FormGroup>
                      <Label for="ProjectTypeID" sm={12}>
                        รหัสประเภทโครงการ
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="text"
                          name="ProjectTypeID"
                          placeholder="รหัสประเภทโครงการ"
                          onChange={this.handleInputChange}
                          value={this.state.ProjectTypeID}
                          
                        />
                      </Col>
                    </FormGroup> */}
                    <FormGroup>
                      <Label for="ProjectTypeName" sm={12}>
                        ชื่อประเภทโครงการ <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="textarea"
                          name="ProjectTypeName"
                          placeholder="ชื่อประเภทโครงการ"
                          onChange={this.handleInputChange}
                          value={this.state.ProjectTypeName}
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
