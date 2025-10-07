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
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import { Fab, Grid } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const token_id = localStorage.getItem('token');
export default class SubStrategyList extends React.Component {
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
      refreshing: false,
      modal: false,
      validationError: '',
      validationError1: '',
      validationError2: '',
      validationError3: '',
      ID: '',
      isForm: '',
      data: [],
      selected: 1,
      currenpage: 0,
      offset: 0,
      perPage: 10,
      keyword: '',
      subStrategyName: '',
      subStrategyDetail: '',
      startYear: moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543,
      endYear: moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543 + 19,
      status: 1,
      url: process.env.REACT_APP_SOURCE_URL + '/dataMunicipalityPlans/subStrategy/list/'+this.props.page,
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
    MySwal.fire({
      title: <strong>คุณต้องการจะลบข้อมูลนี้</strong>,
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
        axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataMunicipalityPlans/subStrategy/' + id)
      .then(res => {
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        this.loadCommentsFromServer();
      })
      .catch(err => {
        console.log(err);
      });
      }
    });

  };
  onEdit = id => {
    // this.setState({ modal: true });
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataMunicipalityPlans/subStrategy/' + id)
      .then(res => {
        // const ButgetSource1 = res.data;
        // this.setState({ ButgetSource1 });
        const {
          sub_strategy_id,
          sub_strategy_name,
          sub_strategy_detail,
          sub_strategy_start,
          sub_strategy_finish,
          sub_strategy_status,
        } = res.data;
        this.setState({
          modal: true,
          ID: sub_strategy_id,
          isForm: 'edit',
          subStrategyName: sub_strategy_name,
          subStrategyDetail: sub_strategy_detail,
          startYear: sub_strategy_start,
          endYear: sub_strategy_finish,
          status: sub_strategy_status,
          validationError: '',
          validationError1: '',
          validationError2: '',
          validationError3: '',
          header: 'แก้ไข' + this.props.title,
        });
      });
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      validationError1: '',
      validationError2: '',
      validationError3: '',
    });
  };
  handleInputChangeYear = e => {
    if (e.target.name === 'startYear') {
      if (parseInt(e.target.value) > 0) {
        this.setState({
          startYear: e.target.value,
          validationError2: '',
        });
      } else {
        this.setState({
          validationError2: 'ห้ามใส่จำนวนติดลบ',
        });
      }
    } else {
      if (parseInt(e.target.value) > 0) {
        this.setState({
          endYear: e.target.value,
          validationError3: '',
        });
      } else {
        this.setState({
          validationError3: 'ห้ามใส่จำนวนติดลบ',
        });
      }
    }
  };
  onAdd() {
    this.setState({
      subStrategyName: '',
      subStrategyDetail: '',
      startYear: moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543,
      endYear: moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543 + 19,
      status: 1,
      modal: true,
      isForm: '',
      validationError: '',
      validationError1: '',
      validationError2: '',
      validationError3: '',
      header: 'เพิ่มข้อมูล' + this.props.title,
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
      this.state.subStrategyName.trim() &&
      this.state.startYear &&
      this.state.endYear
    ) {
      if (parseInt(this.state.startYear) < parseInt(this.state.endYear)) {
        axios
          .post(
            process.env.REACT_APP_SOURCE_URL + '/dataMunicipalityPlans/subStrategy',
            {
              sub_strategy_name: this.state.subStrategyName.trim(),
              municipality_strategy_id:this.props.page,
              sub_strategy_detail: this.state.subStrategyDetail,
              sub_strategy_start: this.state.startYear,
              sub_strategy_finish: this.state.endYear,
              sub_strategy_status:1,
            },
            { headers: { Authorization: `Bearer ${token_id}` } },
          )
          .then(res => {
            this.setState({
              modal: false,
              subStrategyName: '',
              subStrategyDetail: '',
              startYear: '',
              endYear: '',
            });
            MySwal.fire({
              title: <strong>บันทึกข้อมูลสำเร็จ</strong>,
              // html: <i>You clicked the button!</i>,
              icon: 'success',
              timer: 1000,
              showConfirmButton: false,
            });
            this.loadCommentsFromServer();
          })
          .catch(err => {
            console.log(err.response.data);
            if (
              err.response.data ===
              'This sub_strategy_name already exists!'
            ) {
              const validationError1 = 'ชื่อข้อมูลซ้ำ กรุณากรอกใหม่';

              this.setState({
                validationError1: validationError1,
              });
            }
          });
      } else {
        const validationError1 = this.state.subStrategyName.trim()
          ? ''
          : 'กรุณากรอกข้อมูลให้ครบถ้วน';

        this.setState({
          validationError1: validationError1,
          validationError2: 'ปีเริ่มต้นต้องน้อยกว่าปีสิ้นสุด',
          validationError3: 'ปีสิ้นสุดต้องมากกว่าปีเริ่มต้น',
        });
      }
    } else {
      const validationError1 = this.state.subStrategyName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.startYear
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.endYear
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        // validationError: validationError,
        validationError1: validationError1,
        validationError2: validationError2,
        validationError3: validationError3,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.ID;
    if (
      this.state.subStrategyName.trim() &&
      this.state.startYear &&
      this.state.endYear
    ) {
      if (parseInt(this.state.startYear) < parseInt(this.state.endYear)) {
        axios
          .patch(
            process.env.REACT_APP_SOURCE_URL + '/dataMunicipalityPlans/subStrategy/' + ID,
            {
              sub_strategy_name: this.state.subStrategyName.trim(),
              municipality_strategy_id:this.props.page,
              sub_strategy_detail: this.state.subStrategyDetail,
              sub_strategy_start: this.state.startYear,
              sub_strategy_finish: this.state.endYear,
              sub_strategy_status: this.state.status,
            },
            { headers: { Authorization: `Bearer ${token_id}` } },
          )
          .then(res => {
            // if (res.data.message === 'Updated!') {
              MySwal.fire({
                title: <strong>แก้ไขข้อมูลสำเร็จ</strong>,
                // html: <i>You clicked the button!</i>,
                icon: 'success',
                timer: 1000,
                showConfirmButton: false,
              });
              this.loadCommentsFromServer();
              this.setState({
                modal: false,
                isForm: '',
                ID: '',
                subStrategyName: '',
                subStrategyDetail: '',
                startYear: '',
                endYear: '',
                status: 1,
              });
          })
          .catch(err => {
            console.log(err.response.data);
            if (
              err.response.data ===
              'This sub_strategy_name already exists!'
            ) {
              const validationError1 = 'ชื่อข้อมูลซ้ำ กรุณากรอกใหม่';

              this.setState({
                validationError1: validationError1,
              });
            }
          });
      } else {
        const validationError1 = this.state.subStrategyName.trim()
          ? ''
          : 'กรุณากรอกข้อมูลให้ครบถ้วน';

        this.setState({
          validationError1: validationError1,
          validationError2: 'ปีเริ่มต้นต้องน้อยกว่าปีสิ้นสุด',
          validationError3: 'ปีสิ้นสุดต้องมากกว่าปีเริ่มต้น',
        });
      }
    } else {
      const validationError1 = this.state.subStrategyName.trim()
          ? ''
          : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.startYear
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.endYear
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        // validationError: validationError,
        validationError1: validationError1,
        validationError2: validationError2,
        validationError3: validationError3,
      });
    }
  };
  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
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
      url: process.env.REACT_APP_SOURCE_URL +"/dataMunicipalityPlans/subStrategy/subname?municipality_strategy_id="+this.props.page+"&sub_strategy_name="+this.state.keyword ,
      dataType: 'json',
      type: 'GET',
      success: data => {
        if (data.length > 0) {
            const start = (this.state.selected - 1) * this.state.perPage;
            const end = start + +this.state.perPage;
            const result = data.slice(start, end);
            this.setState({
              data: result,
              pageCount: Math.ceil(data.length / this.state.perPage),
            });
          } else {
            this.setState({
              data: data,
              pageCount: Math.ceil(data.length / this.state.perPage),
            });
          }
        },
      error: (xhr, status, err) => {
        console.error(this.state.url, status, err.toString()); // eslint-disable-line
      },
    });
  }
  handlePageClick = data => {
    let selected = data.selected + 1;

    let offset = Math.ceil(selected * this.state.perPage);
    this.setState(
      { offset: offset, selected: selected, currenpage: selected - 1 },
      () => {
        this.loadCommentsFromServer();
      },
    );
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    this.loadCommentsFromServer();
  };
  render() {
    return (
      <>
          <Col sm={12}>
            <Grid container spacing={2}>
            <Col sm={6} className="my-2">
              <Grid container spacing={1} className="flex">
                <Grid item sm={2} md={1}>
                  <div>แสดง</div>
                </Grid>
                <Grid item sm={4} md={2}>
                  <Input
                    type="select"
                    name="perPage"
                    onChange={this.handleSelectPage}
                    // onClick={() => this.handleSelectPage()}
                    value={this.state.perPage}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Input>
                </Grid>
                <Grid item sm={4} md={2}>
                  <div>รายการ</div>
                </Grid>
              </Grid>
            </Col>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <div style={{ textAlign: 'right' }}>
                      <Input
                        type="text"
                        name="keyword"
                        placeholder={'ค้นหา'}
                        onChange={this.handleInputChange}
                        value={this.state.keyword}
                        style={{ width: '100%' }}
                      ></Input>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Col>
          <Col className="mt-2"> 
            {/* <Card className="mb-12">
            <CardBody> */}
            <Table responsive borderless id="table1">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  {/* <th>BudgetSouceID</th> */}
                  <th style={{ textAlign: 'center' }}>ชื่อข้อมูล</th>
                  <th style={{ textAlign: 'center' }}>ปีเริ่มต้น</th>
                  <th style={{ textAlign: 'center' }}>ปีสิ้นสุด</th>
                  <th style={{ textAlign: 'center' }}>จัดการข้อมูล</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.length == 0 ? (
                  <tr>
                    <td colSpan="5" align="center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  this.state.data.map((id, i) => (
                    <tr key={'table' + i}>
                      <td style={{ textAlign: 'center' }}>
                        {(parseInt(this.state.selected) - 1) *
                          this.state.perPage +
                          (i + 1)}
                      </td>
                      {/* <td>{id.budget_source_id}</td> */}
                      <td>{id.sub_strategy_name}</td>
                      <td style={{ textAlign: 'center' }}>
                        {id.sub_strategy_start}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {id.sub_strategy_finish}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Tooltip title="แก้ไข">
                          <span
                            className="edit-button"
                            onClick={() =>
                              this.onEdit(id.sub_strategy_id)
                            }
                          >
                            <Icon style={{ fontSize: '14px' }}>edit</Icon>
                          </span>
                        </Tooltip>
                        &nbsp;
                        <Tooltip title="ลบ">
                          <span
                            className="delete-button"
                            onClick={() =>
                              this.testAxiosDELETE(id.sub_strategy_id)
                            }
                          >
                            <Icon style={{ fontSize: '14px' }}>
                              delete_outline
                            </Icon>
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
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle()}
              className={this.props.className}
            >
              <ModalHeader
                toggle={this.toggle()}
                style={{
                  backgroundColor: '#e0ecfa',
                  borderTopLeftRadius: '1.5rem',
                  borderTopRightRadius: '1.5rem',
                }}
              >
                {this.state.header}
              </ModalHeader>
              <ModalBody
                style={{
                  borderRadius: '1.5rem',
                }}
              >
                <Form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Label for="PlanName" sm={12}>
                      ชื่อข้อมูล <font color="red">*</font>
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="subStrategyName"
                        placeholder="ชื่อข้อมูล"
                        value={this.state.subStrategyName}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Label for="PlanName" sm={12}>
                      รายละเอียด
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="textarea"
                        name="subStrategyDetail"
                        placeholder="รายละเอียดข้อมูล"
                        value={this.state.subStrategyDetail}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                    {/* <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col> */}
                  </FormGroup>
                  {/* <Col sm={12}> */}
                  <Row>
                    <Col sm={6}>
                      <FormGroup>
                        <Label for="start" sm={12}>
                          ปีเริ่มต้น <font color="red">*</font>
                        </Label>
                        <Col sm={12}>
                          <Input
                            type="number"
                            name="startYear"
                            placeholder="ปีเริ่มต้น"
                            value={this.state.startYear}
                            onChange={this.handleInputChangeYear}
                          />
                        </Col>
                        <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                          {this.state.validationError2}
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col sm={6}>
                      <FormGroup>
                        <Label for="PlanName" sm={12}>
                          ปีสิ้นสุด <font color="red">*</font>
                        </Label>
                        <Col sm={12}>
                          <Input
                            type="number"
                            name="endYear"
                            placeholder="ปีเริ่มต้น"
                            value={this.state.endYear}
                            onChange={this.handleInputChangeYear}
                          />
                        </Col>
                        <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                          {this.state.validationError3}
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* </Col> */}

                  {this.state.isForm === 'edit' ? (
                    <Row>
                      <Col sm={6}>
                        <FormGroup>
                          <Label for="PlanName" sm={12}>
                            สถานะ <font color="red">*</font>
                          </Label>
                          <Col sm={12}>
                            <Input
                              type="select"
                              name="status"
                              value={this.state.status}
                              onChange={this.handleInputChange}
                            >
                              <option value={1}>เปิด</option>
                              <option value={2}>ปิด</option>
                            </Input>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}

                  <FormGroup style={{ textAlign: 'center' }}>
                    <Button color="success">บันทึก</Button>
                    &nbsp;
                    <Button color="danger" onClick={this.toggle()}>
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
        <div className="floating-button">
          <Tooltip title="Add">
            <Fab
              className="btn_not_focus"
              style={{
                border: '10px solid #3f51b5',
                backgroundColor: '#fff',
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
