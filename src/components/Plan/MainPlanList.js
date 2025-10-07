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
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { confirmAlert } from 'react-confirm-alert';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
const token_id = localStorage.getItem('token');
export default class MainPlanList extends React.Component {
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
      ButgetSources: [],
      BudgetSouceId: '',
      MainPlanID: '',
      MainPlanName: '',
      refreshing: false,
      validationError: '',
      validationError1: '',
      validationError2: '',
      validationError3: '',
      modal: false,
      ButgetSource1: [],
      ID: '',
      isForm: '',
      GFMIS: '',
      data: [],
      selected: id1,
      offset: 0,
      perPage: 10,
      keyword: '',
      url: process.env.REACT_APP_SOURCE_URL + '/dataMainPlans/list',
      currenpage: id1 - 1,
    };
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadCommentsFromServer().then(() => {
      this.setState({ refreshing: false });
    });
  };

  fetch = () => {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataBudgetSources/list?page=0&size=0',
      )
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
  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        validationError: '',
        validationError1: '',
        validationError2: '',
        validationError3: '',
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataMainPlans/' + id)
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
      .get(process.env.REACT_APP_SOURCE_URL + '/dataMainPlans/' + id)
      .then(res => {
        const {
          _id,
          budget_source_id,
          // main_plan_id,
          main_plan_name,
          gfmis,
        } = res.data;
        this.setState({
          BudgetSouceId: budget_source_id,
          // MainPlanID: main_plan_id,
          MainPlanName: main_plan_name,
          modal: true,
          GFMIS: gfmis,
          ID: _id,
          isForm: 'edit',
          validationError: '',
          validationError1: '',
          validationError2: '',
          validationError3: '',
          header: 'แก้ไขข้อมูลกิจกรรมหลัก',
        });
      });
  };
  handleInputChange = e => {
    if (e.target.name == 'BudgetSouceId') {
      this.setState({
        validationError: '',
      });
    }
    if (e.target.name == 'MainPlanName') {
      this.setState({
        validationError2: '',
      });
    }
    if (e.target.name == 'GFMIS') {
      this.setState({
        validationError3: '',
      });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onAdd() {
    this.setState({
      BudgetSouceId: '',
      // MainPlanID: main_plan_id,
      MainPlanName: '',
      GFMIS: '',
      modal: true,
      isForm: '',
      ID: '',
      validationError: '',
      validationError1: '',
      validationError2: '',
      validationError3: '',
      header: 'เพิ่มข้อมูลกิจกรรมหลัก',
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
      this.state.BudgetSouceId.trim() &&
      // this.state.MainPlanID.trim() &&
      this.state.MainPlanName.trim() &&
      this.state.GFMIS.trim()
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/dataMainPlans',
          {
            budget_source_id: this.state.BudgetSouceId.trim(),
            // main_plan_id: this.state.MainPlanID.trim(),
            main_plan_name: this.state.MainPlanName.trim(),
            gfmis: this.state.GFMIS.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            MainPlanID: '',
            MainPlanName: '',
            GFMIS: '',
          });
          confirmAlert({
            message: 'บันทึกข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(() => (window.location.href = '/mainplan/'), 1000);
        })
        .catch(err => {
          if (
            err.response.data ==
            'Please Check your budget source and mian plan name!'
          ) {
            const validationError2 = 'ชื่อกิจกรรมหลักซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError2: validationError2,
            });
          }
        });
    } else {
      // alert('กรุณากรอกข้อมูลให้ครบ');
      const validationError = this.state.BudgetSouceId.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      // const validationError1 = this.state.MainPlanID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.MainPlanName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.GFMIS.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      this.setState({
        validationError: validationError,
        // validationError1: validationError1,
        validationError2: validationError2,
        validationError3: validationError3,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.ID;
    if (
      this.state.BudgetSouceId.trim() &&
      // this.state.MainPlanID.trim() &&
      this.state.MainPlanName.trim() &&
      this.state.GFMIS.trim()
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/dataMainPlans/' + ID,
          {
            budget_source_id: this.state.BudgetSouceId.trim(),
            // main_plan_id: this.state.MainPlanID.trim(),
            main_plan_name: this.state.MainPlanName.trim(),
            gfmis: this.state.GFMIS.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            MainPlanID: '',
            MainPlanName: '',
            ID: '',
            isForm: '',
            GFMIS: '',
          });
          confirmAlert({
            message: 'แก้ไขข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(
            () => (window.location.href = '/mainplan/' + this.state.selected),
            1000,
          );
          //
        })
        .catch(err => {
          if (
            err.response.data ==
            'Please Check your budget source and mian plan name!'
          ) {
            const validationError2 = 'ชื่อกิจกรรมหลักซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError2: validationError2,
            });
          }
        });
    } else {
      // alert('กรุณากรอกข้อมูลให้ครบ');
      const validationError = this.state.BudgetSouceId.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      // const validationError1 = this.state.MainPlanID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.MainPlanName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.GFMIS.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      this.setState({
        validationError: validationError,
        // validationError1: validationError1,
        validationError2: validationError2,
        validationError3: validationError3,
      });
    }
  };
  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
    this.fetch();
  }
  loadCommentsFromServer() {
    //
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
                    <th>รหัสแหล่งงบประมาณ(ผลผลิต)</th>
                    <th>รหัสกิจกรรมหลัก</th>
                    <th>ชื่อกิจกรรมหลัก</th>
                    <th>GFMIS</th>
                    <th style={{ width: 100 }} />
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.length == 0 ? (
                    <tr>
                      <td colSpan="4" align="center">
                        ไม่มีข้อมูลกิจกรรมหลัก
                      </td>
                    </tr>
                  ) : (
                    this.state.data.map(id => (
                      <tr>
                        <td>{id.budget_source_id}</td>
                        <td>{id.main_plan_id}</td>
                        <td>{id.main_plan_name}</td>
                        <td>{id.gfmis}</td>
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
                    <FormGroup>
                      <Label for="BudgetSouceId" sm={12}>
                        ข้อมูลแหล่งงบประมาณ(ผลผลิต) <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="select"
                          name="BudgetSouceId"
                          onChange={this.handleInputChange}
                          value={this.state.BudgetSouceId}
                        >
                          {this.state.ButgetSources.map(id => (
                            <option value={id.value}>{id.display}</option>
                          ))}
                        </Input>
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError}
                      </Col>
                      {/* <Label for="MainPlanID" sm={12}>
                        รหัสกิจกรรมหลัก <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="text"
                          name="MainPlanID"
                          placeholder="รหัสกิจกรรมหลัก"
                          onChange={this.handleInputChange}
                          value={this.state.MainPlanID}
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError1}
                      </Col> */}
                      <Label for="MainPlanName" sm={12}>
                        ชื่อกิจกรรมหลัก <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="textarea"
                          name="MainPlanName"
                          placeholder="ชื่อกิจกรรมหลัก"
                          onChange={this.handleInputChange}
                          value={this.state.MainPlanName}
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError2}
                      </Col>
                      <Label for="MainPlanName" sm={12}>
                        GFMIS <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="text"
                          name="GFMIS"
                          placeholder="รหัส GFMIS"
                          onChange={this.handleInputChange}
                          value={this.state.GFMIS}
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError3}
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
