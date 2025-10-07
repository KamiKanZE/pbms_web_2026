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
export default class SubPlanBList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Budget: [],
      ButgetSources: [],
      refreshing: false,
      modal: false,
      selectedTeam: '',
      validationError: '',
      validationError1: '',
      validationError2: '',
      SubPlanA: '',
      SubPlanBID: '',
      SubPlanB: '',
      ID: '',
      isForm: '',
      data: [],
      selected: 1,
      offset: 0,
      perPage: 10,
      keyword: '',
      url: process.env.REACT_APP_SOURCE_URL + '/dataSubPlanBs/list',
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
        process.env.REACT_APP_SOURCE_URL + '/dataSubPlanAs/list?page=0&size=0',
      )
      .then(ress => {
        const ButgetSource = ress.data.result.map(id => {
          return { value: id.sub_plan_A_id, display: id.sub_plan_A_name };
        });
        this.setState({
          ButgetSources: [{ value: '', display: '(เลือกกิจกรรมรอง A)' }].concat(
            ButgetSource,
          ),
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanBs/' + id)
      .then(res => {
        // this.loadCommentsFromServer();
        confirmAlert({
          message: 'ลบข้อมูลสำเร็จ',
          buttons: [],
        });
        setTimeout(() => (window.location.href = '/SubPlanB/'), 1000);
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    // this.setState({ modal: true });
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanBs/' + id)
      .then(res => {
        const { _id, sub_plan_A_id, sub_plan_B_id, sub_plan_B_name } = res.data;
        this.setState({
          SubPlanA: sub_plan_A_id,
          // SubPlanBID: sub_plan_B_id,
          SubPlanB: sub_plan_B_name,
          modal: true,
          ID: _id,
          isForm: 'edit',
          validationError: '',
          validationError1: '',
          validationError2: '',
          header: 'แก้ไขข้อมูลกิจกรรมรอง B',
        });
      });
  };
  handleInputChange = e => {
    if (e.target.name == 'SubPlanB') {
      this.setState({
        validationError2: '',
      });
    }
    if (e.target.name == 'SubPlanA') {
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
      SubPlanB: '',
      SubPlanBID: '',
      SubPlanA: '',
      modal: true,
      isForm: '',
      validationError: '',
      validationError1: '',
      validationError2: '',
      header: 'เพิ่มข้อมูลกิจกรรมรอง B',
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
      this.state.SubPlanB.trim() &&
      // this.state.SubPlanBID.trim() &&
      this.state.SubPlanA.trim()
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/dataSubPlanBs',
          {
            sub_plan_A_id: this.state.SubPlanA.trim(),
            // sub_plan_B_id: this.state.SubPlanBID.trim(),
            sub_plan_B_name: this.state.SubPlanB.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            SubPlanB: '',
            SubPlanBID: '',
            SubPlanA: '',
          });
          confirmAlert({
            message: 'บันทึกข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(() => (window.location.href = '/SubPlanB/'), 1000);
        })
        .catch(err => {
          if (
            err.response.data ==
            'Please Check your sub plan A and sub plan B name!'
          ) {
            const validationError1 = 'ชื่อกิจกรรมรอง B ซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError2: validationError1,
            });
          }
        });
    } else {
      const validationError = this.state.SubPlanA.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      // const validationError1 = this.state.SubPlanBID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.SubPlanB.trim()
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
      this.state.SubPlanB.trim() &&
      // this.state.SubPlanBID.trim() &&
      this.state.SubPlanA.trim()
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/dataSubPlanBs/' + ID,
          {
            sub_plan_A_id: this.state.SubPlanA.trim(),
            // sub_plan_B_id: this.state.SubPlanBID.trim(),
            sub_plan_B_name: this.state.SubPlanB.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            SubPlanB: '',
            SubPlanBID: '',
            SubPlanA: '',
            isForm: '',
            ID: '',
          });
          confirmAlert({
            message: 'แก้ไขข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(
            () => (window.location.href = '/SubPlanB/' + this.state.selected),
            1000,
          );
        })
        .catch(err => {
          if (
            err.response.data ==
            'Please Check your sub plan A and sub plan B name!'
          ) {
            const validationError1 = 'ชื่อกิจกรรมรอง B ซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError2: validationError1,
            });
          }
        });
    } else {
      const validationError = this.state.SubPlanA.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      // const validationError1 = this.state.SubPlanBID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.SubPlanB.trim()
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
                    <th>รหัสกิจกรรมรอง A</th>
                    <th>รหัสกิจกรรมรอง B</th>
                    <th>ชื่อกิจกรรมรอง B</th>
                    <th style={{ width: 100 }} />
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.length == 0 ? (
                    <tr>
                      <td colSpan="4" align="center">
                        ไม่มีข้อมูลกิจกรรมรอง B
                      </td>
                    </tr>
                  ) : (
                    this.state.data.map(id => (
                      <tr>
                        <td>{id.sub_plan_A_id}</td>
                        <td>{id.sub_plan_B_id}</td>
                        <td>{id.sub_plan_B_name}</td>
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
                      <Label for="SubPlanA" sm={12}>
                        ชื่อกิจกรรมรอง A <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="select"
                          name="SubPlanA"
                          onChange={this.handleInputChange}
                          value={this.state.SubPlanA}
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
                      <Label for="SubPlanBID" sm={12}>
                        รหัสกิจกรรมรอง B <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="text"
                          name="SubPlanBID"
                          placeholder="รหัสกิจกรรมรอง B"
                          onChange={this.handleInputChange}
                          value={this.state.SubPlanBID}
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError1}
                      </Col>
                    </FormGroup> */}
                    <FormGroup>
                      <Label for="SubPlanB" sm={12}>
                        ชื่อกิจกรรมรอง B <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="textarea"
                          name="SubPlanB"
                          placeholder="ชื่อกิจกรรมรอง B"
                          onChange={this.handleInputChange}
                          value={this.state.SubPlanB}
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
