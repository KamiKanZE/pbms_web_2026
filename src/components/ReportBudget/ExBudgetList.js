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
export default class ExBudgetList extends React.Component {
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
      PlanID: '',
      PlanName: '',
      ID: '',
      isForm: '',
      data: [],
      selected: id,
      currenpage: id - 1,
      offset: 0,
      perPage: 10,
      keyword: '',
      year: '',
      typeList: [],
      typeId: '',
      typeName: '',
      estimate: '',
      yearList:[],
      status: 1,
      url: process.env.REACT_APP_SOURCE_URL + '/expenditureBudgets/reports',
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
        this.DELETE(id);
      }
    });
  };
  DELETE = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/expenditureBudgets/' + id)
      .then(res => {
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        this.loadCommentsFromServer();
        // confirmAlert({
        //   message: 'ลบข้อมูลสำเร็จ',
        //   buttons: [],
        // });
        //setTimeout(() => (window.location.href = '/plan1/'), 1000);
        // this.loadCommentsFromServer();
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    // this.setState({ modal: true });
    this.getType();
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/expenditureBudgets/' + id)
      .then(res => {
        const {
          expenditure_budget_id,
          expenditure_budget_type,
          expenditure_budget_type_name,
          expenditure_budget_estimate,
          expenditure_budget_year,
        } = res.data.result;
        const formattedUseCost = new Intl.NumberFormat('en-US').format(expenditure_budget_estimate);
        this.setState({
          modal: true,
          isForm: 'edit',
          ID: expenditure_budget_id,
          year1: expenditure_budget_year,
          typeId: expenditure_budget_type,
          typeName: expenditure_budget_type_name,
          estimate: formattedUseCost,
          validationError1: '',
          validationError2: '',
          validationError3: '',
          header: 'แก้ไข' + this.props.title,
        });
      });
  };
  getType() {
    // this.setState({ modal: true });
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataExpenditureTypes/list?size=100',
      )
      .then(res => {
        this.setState({
          typeList: res.data.result,
        });
      });
  }
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      validationError1: '',
      validationError2: '',
      validationError3: '',
    });
  };
  handleInputChangeNumber = e => {
    const { name, value } = e.target;

    // Allow empty value or a single decimal point
    if (value === '' || value === '.' || value === ',') {
      this.setState({ [name]: value });
      return;
    }

    // Remove commas for parsing and validate the number
    const numericValue = value.replace(/,/g, '');

    // Check if the value is a valid number with up to 2 decimal places
    if (!isNaN(numericValue) && /^[0-9]*\.?[0-9]{0,2}$/.test(numericValue)) {
      const [integerPart, decimalPart] = numericValue.split('.');
      // Format integer part with commas
      const formattedIntegerPart = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(integerPart || 0));

      // Combine formatted integer and decimal parts with max 2 decimal places
      const formattedValue =
        decimalPart !== undefined
          ? `${formattedIntegerPart}.${decimalPart.slice(0, 2)}` // Limit to 2 decimal places
          : formattedIntegerPart;

      // Set the value back to state
      this.setState({ [name]: formattedValue });
    }
  };
  onAdd() {
    let year = this.state.year?this.state.year: moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543
    this.getType();
    this.setState({
      modal: true,
      isForm: '',
      year1: year,
      typeId: '',
      typeName: '',
      estimate: '',
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
      this.state.year1 !== 'NaN' &&
      this.state.typeId !== '' &&
      this.state.estimate !== 'NaN'
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/expenditureBudgets',
          {
            expenditure_budget_type: this.state.typeId,
            expenditure_budget_type_name: this.state.typeList.filter(
              type => type.expenditure_type_id === this.state.typeId,
            )[0].expenditure_type_name,
            expenditure_budget_estimate: parseFloat(this.state.estimate.replace(/,/g, '')),
            expenditure_budget_year: parseInt(this.state.year1),

            // expenditure_budget_status :this.state.status,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            year: this.state.year1,
            typeId: '',
            typeName: '',
            estimate: '',
            Q1: '',
            Q2: '',
            Q3: '',
            Q4: '',
            status: 1,
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
          if (
            err.response.data ===
            'This expenditure_budget_type and expenditure_budget_year already exists!'
          ) {
            const validationError2 =
              'ปีงบประมาณ และประเภทงบประมาณนี้มีข้อมูลแล้ว กรุณาลองใหม่อีกครั้ง';

            this.setState({
              validationError2: validationError2,
              validationError3: '',
            });
          }
        });
    } else {
      // const validationError = this.state.PlanID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 =
        this.state.year1 !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.typeId.trim()
        ? ''
        : 'กรุณาเลือกข้อมูล';
      const validationError3 =
        this.state.estimate !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';

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
      this.state.year1 !== 'NaN' &&
      this.state.typeId !== '' &&
      this.state.estimate !== 'NaN'
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/expenditureBudgets/' + ID,
          {
            expenditure_budget_type: this.state.typeId,
            expenditure_budget_type_name: this.state.typeList.filter(
              type => type.expenditure_type_id === this.state.typeId,
            )[0].expenditure_type_name,
            expenditure_budget_estimate: parseFloat(this.state.estimate.replace(/,/g, '')),
            expenditure_budget_year: parseInt(this.state.year1),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.setState({
            modal: false,
            year1: '',
            typeId: '',
            typeName: '',
            estimate: '',
            Q1: '',
            Q2: '',
            Q3: '',
            Q4: '',
            status: 1,
          });
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
          if (
            err.response.data ===
            'This expenditure_budget_type and expenditure_budget_year already exists!'
          ) {
            const validationError2 =
              'ปีงบประมาณ และประเภทงบประมาณนี้มีข้อมูลแล้ว กรุณาลองใหม่อีกครั้ง';

            this.setState({
              validationError2: validationError2,
              validationError3: '',
            });
          }
        });
    } else {
      const validationError = this.state.ID.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 =
        this.state.year !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.typeId.trim()
        ? ''
        : 'กรุณาเลือกข้อมูล';
      const validationError3 =
        this.state.estimate !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        validationError: validationError,
        validationError1: validationError1,
        validationError2: validationError2,
        validationError3: validationError3,
      });
    }
  };
  componentDidMount() {
    this.yearLoop();
    this.toggle();
    this.loadCommentsFromServer();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyword !== this.state.keyword ||prevState.year !== this.state.year) {
      // console.log('keyword state has changed.');
      setTimeout(() => {
        this.loadCommentsFromServer();
      }, 100);
    }
  }
  loadCommentsFromServer() {
    $.ajax({
      url:
        this.state.url +
        '?page=' +
        this.state.selected +
        '&size=' +
        this.state.perPage +'&expenditure_budget_year='+this.state.year+
        // '&search=' +
        '&expenditure_budget_type_name='+
        this.state.keyword,
      data: {
        totalPage: this.state.perPage,
        offset: this.state.offset,
      },
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
            pageCount: Math.ceil(
              data.pagination.itemTotal / this.state.perPage,
            ),
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
  // handleInputChange = e => {
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   });
  //   this.loadCommentsFromServer();
  // };
  yearLoop() {
    let yl = [];
    // for (let index = y; index < (parseInt(maxYearEnd) + 543 + 5); index++) {
    //   yl = yl.concat([{ value: index, label: index }]);
    // }

    const year = new Date().getFullYear();
    for (let index = 2560; index < year + 543 + 5; index++) {
      yl = yl.concat([{ value: index, label: index }]);
    }
    this.setState({
      yearList: yl,
    });
  }
  sumary = (q1, q2, q3, q4) => {
    let a1 = parseFloat(q1).toString() === 'NaN' ? 0 : q1;
    let a2 = parseFloat(q2).toString() === 'NaN' ? 0 : q2;
    let a3 = parseFloat(q3).toString() === 'NaN' ? 0 : q3;
    let a4 = parseFloat(q4).toString() === 'NaN' ? 0 : q4;
    let sum = 0;
    sum = parseFloat(a1) + parseFloat(a2) + parseFloat(a3) + parseFloat(a4);
    if (sum.toString() === 'NaN') {
      return 0;
    } else {
      return new Intl.NumberFormat().format(sum);
    }
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
                <Grid item xs={12} md={6}>
                    <div className=" flex" style={{ textAlign: 'right' }}>
                      <div
                        className="mb-0"
                        style={{ whiteSpace: 'nowrap', width: '150px' }}
                      >
                        เลือกปีงบประมาณ
                      </div>
                      <div className="mb-0 ml-1" style={{ textAlign: 'right' }}>
                        <select
                          name="year"
                          id="year"
                          value={this.state.year}
                          onChange={this.handleInputChange}
                          className="form-control"
                          style={{ width: '100%' }}
                        >
                          <option value=''>ทั้งหมด</option>
                          {this.state.yearList.map(item => (
                            <option value={item.value}>ปี {item.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
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
          <Col>
            {/* <Card className="mb-12">
            <CardBody> */}
            <Table responsive borderless id="table1">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  <th style={{ textAlign: 'center' }}>ปีงบประมาณ</th>
                  {/* <th>BudgetSouceID</th> */}
                  <th style={{ textAlign: 'left' }}>ชื่อประเภทข้อมูลรายจ่าย</th>
                  <th style={{ textAlign: 'center' }}>งบประมาณการ</th>

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
                  this.state.data
                    //.sort((a, b) => (a.create_date > b.create_date ? -1 : 1))
                    .map((id, i) => (
                      <tr key={'table' + i}>
                        <td style={{ textAlign: 'center' }}>
                          {(parseInt(this.state.selected) - 1) * 10 + (i + 1)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {id.expenditure_budget_year}
                        </td>
                        {/* <td>{id.budget_source_id}</td> */}
                        <td>{id.expenditure_budget_type_name}</td>
                        <td style={{ textAlign: 'center' }}>
                          {new Intl.NumberFormat().format(
                            id.expenditure_budget_estimate,
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Tooltip title="แก้ไข">
                            <span
                              className="edit-button"
                              onClick={() =>
                                this.onEdit(id.expenditure_budget_id)
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
                                this.testAxiosDELETE(id.expenditure_budget_id)
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
                      ปีงบประมาณ <font color="red">*</font>
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="number"
                        name="year1"
                        value={this.state.year1}
                        placeholder="ปีงบประมาณ"
                        onChange={this.handleInputChange}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ประเภทข้อมูลรายจ่าย <font color="red">*</font>
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="select"
                        name="typeId"
                        placeholder="ประเภทข้อมูลรายจ่าย"
                        value={this.state.typeId}
                        onChange={this.handleInputChange}
                      >
                        <option value={''}>กรุณาเลือก</option>
                        {this.state.typeList &&
                          this.state.typeList
                            .filter(
                              type =>
                                parseInt(type.expenditure_type_status) === 1,
                            )
                            .map((type, no) => (
                              <option
                                value={type.expenditure_type_id}
                                key={'option' + no}
                              >
                                {type.expenditure_type_name}
                              </option>
                            ))}
                      </Input>
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError2}
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Label for="PlanName" sm={12}>
                      งบประมาณการ <font color="red">*</font>
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="estimate"
                        placeholder="งบประมาณการ"
                        value={this.state.estimate}
                        onChange={this.handleInputChangeNumber}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError3}
                    </Col>
                  </FormGroup>

                  <FormGroup style={{ textAlign: 'center' }}>
                    <Button color="success">บันทึก</Button>&nbsp;
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
        </Row>

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
