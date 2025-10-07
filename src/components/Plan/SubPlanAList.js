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
export default class SubPlanAList extends React.Component {
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
      refreshing: false,
      modal: false,
      selectedTeam: '',
      validationError: '',
      validationError1: '',
      validationError2: '',
      MainPlanID: '',
      SubPlanAID: '',
      SubPlanA: '',
      ID: '',
      isForm: '',
      data: [],
      selected: id1,
      offset: 0,
      perPage: 10,
      keyword: '',
      currenpage: id1 - 1,
      url: process.env.REACT_APP_SOURCE_URL + '/dataSubPlanAs/list',
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

  fetch = () => {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL + '/dataMainPlans/list?page=0&size=0',
      )
      .then(ress => {
        const ButgetSource = ress.data.result.map(id => {
          return { value: id.main_plan_id, display: id.main_plan_name };
        });
        this.setState({
          ButgetSources: [
            { value: '', display: '(เลือกข้อมูลกิจกรรมหลัก)' },
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanAs/' + id)
      .then(res => {
        this.loadCommentsFromServer();
        confirmAlert({
          message: 'ลบข้อมูลสำเร็จ',
          buttons: [],
        });
        setTimeout(() => (window.location.href = '/SubPlanA/'), 1000);
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    // this.setState({ modal: true });
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanAs/' + id)
      .then(res => {
        const { _id, main_plan_id, sub_plan_A_id, sub_plan_A_name } = res.data;
        this.setState({
          MainPlanID: main_plan_id,
          SubPlanAID: sub_plan_A_id,
          SubPlanA: sub_plan_A_name,
          modal: true,
          ID: _id,
          isForm: 'edit',
          validationError: '',
          validationError1: '',
          validationError2: '',
          header: 'แก้ไขข้อมูลกิจกรรมรอง A',
        });
      });
  };
  handleInputChange = e => {
    if (e.target.name == 'MainPlanID') {
      this.setState({
        validationError: '',
      });
    }
    if (e.target.name == 'SubPlanA') {
      this.setState({
        validationError2: '',
      });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onAdd() {
    this.setState({
      MainPlanID: '',
      SubPlanAID: '',
      SubPlanA: '',
      modal: true,
      isForm: '',
      validationError: '',
      validationError1: '',
      validationError2: '',
      header: 'เพิ่มข้อมูลกิจกรรมรอง A',
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
      this.state.MainPlanID.trim() &&
      // this.state.SubPlanAID.trim() &&
      this.state.SubPlanA.trim()
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/dataSubPlanAs',
          {
            main_plan_id: this.state.MainPlanID.trim(),
            // sub_plan_A_id: this.state.SubPlanAID.trim(),
            sub_plan_A_name: this.state.SubPlanA.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            MainPlanID: '',
            // SubPlanAID: '',
            SubPlanA: '',
          });
          confirmAlert({
            message: 'บันทึกข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(() => (window.location.href = '/SubPlanA/'), 1000);
        })
        .catch(err => {
          if (
            err.response.data ==
            'Please Check your mian plan and sub plan A name!'
          ) {
            const validationError1 = 'ชื่อกิจกรรมรอง A ซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError2: validationError1,
            });
          }
        });
    } else {
      const validationError = this.state.MainPlanID.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      // const validationError1 = this.state.SubPlanAID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.SubPlanA.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      this.setState({
        validationError: validationError,
        // validationError1: validationError1,
        validationError2: validationError2,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.ID;
    if (
      this.state.MainPlanID.trim() &&
      // this.state.SubPlanAID.trim() &&
      this.state.SubPlanA.trim()
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/dataSubPlanAs/' + ID,
          {
            main_plan_id: this.state.MainPlanID.trim(),
            // sub_plan_A_id: this.state.SubPlanAID.trim(),
            sub_plan_A_name: this.state.SubPlanA.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            MainPlanID: '',
            SubPlanAID: '',
            SubPlanA: '',
            isForm: '',
            ID: '',
          });
          confirmAlert({
            message: 'แก้ไขข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(
            () => (window.location.href = '/SubPlanA/' + this.state.selected),
            1000,
          );
        })
        .catch(err => {
          if (
            err.response.data ==
            'Please Check your mian plan and sub plan A name!'
          ) {
            const validationError1 = 'ชื่อกิจกรรมรอง A ซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError2: validationError1,
            });
          }
        });
    } else {
      // alert('กรุณากรอกข้อมูลให้ครบ');
      const validationError = this.state.MainPlanID.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      // const validationError1 = this.state.SubPlanAID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.SubPlanA.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      this.setState({
        validationError: validationError,
        // validationError1: validationError1,
        validationError2: validationError2,
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
                    <th>รหัสกิจกรรมหลัก</th>
                    <th>รหัสกิจกรรมรอง A</th>
                    <th>ชื่อกิจกรรมรอง A</th>
                    <th style={{ width: 100 }} />
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.length == 0 ? (
                    <tr>
                      <td colSpan="4" align="center">
                        ไม่มีข้อมูลกิจกรรมรอง A
                      </td>
                    </tr>
                  ) : (
                    this.state.data.map(id => (
                      <tr>
                        <td>{id.main_plan_id}</td>
                        <td>{id.sub_plan_A_id}</td>
                        <td>{id.sub_plan_A_name}</td>
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
                    <FormGroup>
                      <Label for="MainPlanID" sm={12}>
                        ข้อมูลกิจกรรมหลัก <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="select"
                          name="MainPlanID"
                          onChange={this.handleInputChange}
                          value={this.state.MainPlanID}
                        >
                          {this.state.ButgetSources.map(id => (
                            <option key={id.value} value={id.value}>
                              {id.display}
                            </option>
                          ))}
                        </Input>
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError}
                      </Col>
                    </FormGroup>
                    {/* <FormGroup>
                      <Label for="SubPlanAID" sm={12}>
                        รหัสกิจกรรมรอง A <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="text"
                          name="SubPlanAID"
                          placeholder="รหัสกิจกรรมรอง A"
                          onChange={this.handleInputChange}
                          value={this.state.SubPlanAID}
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError1}
                      </Col>
                    </FormGroup> */}
                    <FormGroup>
                      <Label for="SubPlanA" sm={12}>
                        ชื่อกิจกรรมรอง A <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="textarea"
                          name="SubPlanA"
                          placeholder="ชื่อกิจกรรมรอง A"
                          onChange={this.handleInputChange}
                          value={this.state.SubPlanA}
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError2}
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
