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
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import { fontStyle } from '@material-ui/system';
const token_id = localStorage.getItem('token');
export default class BudgetSourceList extends React.Component {
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
      BudgetSourceId: '',
      BudgetSourceName: '',
      validationError: '',
      validationError1: '',
      modal: false,
      ID: '',
      isForm: '',
      data: [],
      selected: id1,
      offset: 0,
      perPage: 10,
      keyword: '',
      url: process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources/list',
      currenpage: id1 - 1,
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources/' + id)
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
      .get(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources/' + id)
      .then(res => {
        const { _id, budget_source_id, budget_source_name } = res.data;

        this.setState({
          // BudgetSourceId: budget_source_id,
          BudgetSourceName: budget_source_name,
          modal: true,
          ID: _id,
          isForm: 'edit',
          validationError: '',
          validationError1: '',
          header: 'แก้ไขข้อมูลแหล่งงบประมาณ(ผลผลิต)',
        });
      });
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      validationError1: '',
    });
  };
  onAdd() {
    this.setState({
      BudgetSourceId: '',
      BudgetSourceName: '',
      modal: true,
      isForm: '',
      ID: '',
      validationError: '',
      validationError1: '',
      header: 'เพิ่มข้อมูลแหล่งงบประมาณ(ผลผลิต)',
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
    if (
      // this.state.BudgetSourceId.trim() &&
      this.state.BudgetSourceName.trim()
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources',
          {
            // budget_source_id: this.state.BudgetSourceId.trim(),
            budget_source_name: this.state.BudgetSourceName.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            // BudgetSourceId: '',
            BudgetSourceName: '',
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
            message: 'บันทึกข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(() => (window.location.href = '/budgetsource1/'), 1000);
        })
        .catch(err => {
          if (err.response.data == 'Please Check your budget source name!') {
            const validationError1 =
              'ชื่อแหล่งงบประมาณ(ผลผลิต)ซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError1: validationError1,
            });
          }
        });
    } else {
      // const validationError = this.state.BudgetSourceId.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.BudgetSourceName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      this.setState({
        // validationError: validationError,
        validationError1: validationError1,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.ID;
    if (
      // this.state.BudgetSourceId.trim() &&
      this.state.BudgetSourceName.trim()
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources/' + ID,
          {
            // budget_source_id: this.state.BudgetSourceId.trim(),
            budget_source_name: this.state.BudgetSourceName.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            BudgetSourceId: '',
            BudgetSourceName: '',
          });
          confirmAlert({
            message: 'แก้ไขข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(
            () =>
              (window.location.href = '/budgetsource1/' + this.state.selected),
            1000,
          );
        })
        .catch(err => {
          if (err.response.data == 'Please Check your budget source name!') {
            const validationError1 =
              'ชื่อแหล่งงบประมาณ(ผลผลิต)ซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError1: validationError1,
            });
          }
        });
    } else {
      // const validationError = this.state.BudgetSourceId.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.BudgetSourceName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      this.setState({
        // validationError: validationError,
        validationError1: validationError1,
      });
    }
  };
  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
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
              {/* <Button
              onClick={this.toggle()}
              className="btn btn-sm"
              color="primary"
            >
              Add
            </Button> */}
              <Table responsive bordered striped hover id="table1">
                <thead>
                  <tr>
                    <th>รหัสแหล่งงบประมาณ(ผลผลิต)</th>
                    <th>ชื่อแหล่งงบประมาณ(ผลผลิต)</th>
                    <th style={{ width: 100 }} />
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.length == 0 ? (
                    <tr>
                      <td colSpan="4" align="center">
                        ไม่มีข้อมูลแหล่งงบประมาณ(ผลผลิต)
                      </td>
                    </tr>
                  ) : (
                    this.state.data.map(id => (
                      <tr>
                        <td>{id.budget_source_id}</td>
                        <td>{id.budget_source_name}</td>
                        <td style={{ textAlign: 'right' }}>
                          {/* <Button className="btn btn-warning btn-sm">Edit</Button>

                      <Button
                        className="btn btn-danger btn-sm"
                        id={id._id}
                        onClick={() => this.testAxiosDELETE(id._id)}
                      >
                        Delete
                      </Button> */}
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
                          {/* <Tooltip title="ลบ">
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
                id="pagi"
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
              {/* <button className="btn btn-primary btn-sm" onClick={this.testAxiosPost}>Add</button> */}
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
                      <Label sm={12}>
                        รหัสข้อมูลแหล่งงบประมาณ(ผลผลิต) <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="text"
                          name="BudgetSourceId"
                          placeholder="รหัสข้อมูลแหล่งงบประมาณ(ผลผลิต)"
                          onChange={this.handleInputChange}
                          value={this.state.BudgetSourceId}
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError}
                      </Col>
                    </FormGroup> */}
                    <FormGroup>
                      <Label sm={12}>
                        ชื่อข้อมูลแหล่งงบประมาณ(ผลผลิต){' '}
                        <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="textarea"
                          name="BudgetSourceName"
                          placeholder="ชื่อข้อมูลแหล่งงบประมาณ(ผลผลิต)"
                          onChange={this.handleInputChange}
                          value={this.state.BudgetSourceName}
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
    );
  }
}
