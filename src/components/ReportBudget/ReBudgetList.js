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
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';

export default class ReBudgetList extends React.Component {
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
      inputYear:'',
      typeList: [],
      typeId: '',
      typeName: '',
      estimate: '',
      Q1: '',
      Q2: '',
      Q3: '',
      Q4: '',
      status: 1,
      url: process.env.REACT_APP_SOURCE_URL + '/revenueBudgets/reports',
      yearList: [],
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/revenueBudgets/' + id)
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
      .get(process.env.REACT_APP_SOURCE_URL + '/revenueBudgets/' + id)
      .then(res => {

        const {
          revenue_budget_id,
          revenue_budget_type,
          revenue_budget_type_name,
          revenue_budget_estimate,
          revenue_budget_year,
          revenue_budget_q1,
          revenue_budget_q2,
          revenue_budget_q3,
          revenue_budget_q4,
        } = res.data.result;
        const formattedUseCost = new Intl.NumberFormat('en-US').format(revenue_budget_estimate);
        const Q1 = new Intl.NumberFormat('en-US').format(revenue_budget_q1);
        const Q2 = new Intl.NumberFormat('en-US').format(revenue_budget_q2);
        const Q3 = new Intl.NumberFormat('en-US').format(revenue_budget_q3);
        const Q4 = new Intl.NumberFormat('en-US').format(revenue_budget_q4);

        this.setState({
          modal: true,
          isForm: 'edit',
          ID: revenue_budget_id,
          year1: revenue_budget_year,
          typeId: revenue_budget_type,
          typeName: revenue_budget_type_name,
          estimate: formattedUseCost,
          Q1: Q1,
          Q2: Q2,
          Q3: Q3,
          Q4: Q4,
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
      .get(process.env.REACT_APP_SOURCE_URL + '/dataRevenueTypes/list?size=100')
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
    // this.loadCommentsFromServer() 
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
      Q1: '',
      Q2: '',
      Q3: '',
      Q4: '',
      validationError: '',
      validationError1: '',
      validationError2: '',
      validationError3: '',
      header: 'เพิ่ม' + this.props.title,
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
      this.state.year1.toString() !== 'NaN' &&
      this.state.typeId !== '' &&
      this.state.estimate.toString() !== 'NaN'
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/revenueBudgets',
          {
            revenue_budget_type: this.state.typeId,
            revenue_budget_type_name: this.state.typeList.filter(
              type => type.revenue_type_id === this.state.typeId,
            )[0].revenue_type_name,
            revenue_budget_estimate: parseFloat(this.state.estimate.replace(/,/g, '')),
            revenue_budget_year: parseInt(this.state.year1),
            revenue_budget_q1: parseFloat(this.state.Q1.replace(/,/g, '')),
            revenue_budget_q2: parseFloat(this.state.Q2.replace(/,/g, '')),
            revenue_budget_q3: parseFloat(this.state.Q3.replace(/,/g, '')),
            revenue_budget_q4: parseFloat(this.state.Q4.replace(/,/g, '')),
            // revenue_budget_status :this.state.status,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.setState({
            modal: false,
            year1: this.state.year1,
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
            'This revenue_budget_type and revenue_budget_year already exists!'
          ) {
            // const validationError1 = 'มีข้อมูลแล้ว กรุณาเลือกใหม่';
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
        this.state.year1.toString() !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.typeId.trim()
        ? ''
        : 'กรุณาเลือกข้อมูล';
      const validationError3 =
        this.state.estimate.toString() !== 'NaN'
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
      this.state.year1.toString() !== 'NaN' &&
      this.state.typeId !== '' &&
      this.state.estimate.toString() !== 'NaN'
    ) {
      const selectedType = this.state.typeList
      ? this.state.typeList.find(type => type.revenue_type_id === this.state.typeId)
      : null;
  
    if (!selectedType) {
      this.setState({
        validationError2: 'กรุณาเลือกประเภทข้อมูลรายรับที่ถูกต้อง',
      });
      return;
    }
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/revenueBudgets/' + ID,
          {
            revenue_budget_type: this.state.typeId,
            revenue_budget_type_name: this.state.typeList.filter(
              type => type.revenue_type_id === this.state.typeId,
            )[0].revenue_type_name,
            revenue_budget_estimate: parseFloat(this.state.estimate.replace(/,/g, '')),
            revenue_budget_year: parseInt(this.state.year1),
            revenue_budget_q1: parseFloat(this.state.Q1.replace(/,/g, '')),
            revenue_budget_q2: parseFloat(this.state.Q2.replace(/,/g, '')),
            revenue_budget_q3: parseFloat(this.state.Q3.replace(/,/g, '')),
            revenue_budget_q4: parseFloat(this.state.Q4.replace(/,/g, '')),
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
            'This revenue_budget_type and revenue_budget_year already exists!'
          ) {
            // const validationError1 = 'มีข้อมูลแล้ว กรุณาเลือกใหม่';
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
        this.state.year1.toString() !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.typeId.trim()
        ? ''
        : 'กรุณาเลือกข้อมูล';
      const validationError3 =
        this.state.estimate.toString() !== 'NaN'
          ? ''
          : 'กรุณากรอกข้อมูลให้ครบถ้วน';

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
    if (prevState.keyword !== this.state.keyword ||prevState.inputYear !== this.state.inputYear) {
      
      setTimeout(() => {
        this.loadCommentsFromServer();
      }, 100);
    }
  }
  loadCommentsFromServer() {
    $.ajax({
      url:
        this.state.url +
        // process.env.REACT_APP_SOURCE_URL +
        // '/revenueBudgets/list' +
        '?page=' +
        this.state.selected +
        '&size=' +
        this.state.perPage +'&revenue_budget_year='+this.state.inputYear+
        '&revenue_budget_type_name=' +
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
              <Grid item xs={12} md={4}></Grid>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <div className=" flex" style={{ textAlign: 'right' }}>
                      <div
                        className="mb-0"
                        style={{ whiteSpace: 'nowrap', width: '150px' }}
                      >
                        เลือกปีงบประมาณ
                      </div>
                      <div className="mb-0 ml-1" style={{ textAlign: 'right' }}>
                        <select
                          name="inputYear"
                          id="inputYear"
                          value={this.state.inputYear}
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
                  <Grid item xs={12} md={8}>
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
                  <th style={{ textAlign: 'left' }}>ชื่อประเภทข้อมูลรายรับ</th>
                  <th style={{ textAlign: 'center' }}>งบประมาณการ</th>
                  <th style={{ textAlign: 'center' }}>งบประมาณจริง</th>
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
                          {id.revenue_budget_year}
                        </td>
                        {/* <td>{id.budget_source_id}</td> */}
                        <td>{id.revenue_budget_type_name}</td>
                        <td style={{ textAlign: 'center' }}>
                          {new Intl.NumberFormat().format(
                            id.revenue_budget_estimate,
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {/* {id.revenue_budget_q1} */}
                          {this.sumary(
                            id.revenue_budget_q1,
                            id.revenue_budget_q2,
                            id.revenue_budget_q3,
                            id.revenue_budget_q4,
                          )}
                          {/* {(parseInt(id.revenue_budget_q1) ?? 0) +
                          (parseInt(id.revenue_budget_q2) ?? 0) +
                          (parseInt(id.revenue_budget_q3) ?? 0) +
                          (parseInt(id.revenue_budget_q4) ?? 0)} */}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Tooltip title="แก้ไข">
                            <span
                              className="edit-button"
                              onClick={() => this.onEdit(id.revenue_budget_id)}
                            >
                              <Icon style={{ fontSize: '14px' }}>edit</Icon>
                            </span>
                          </Tooltip>
                          &nbsp;
                          <Tooltip title="ลบ">
                            <span
                              className="delete-button"
                              onClick={() =>
                                this.testAxiosDELETE(id.revenue_budget_id)
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
                        placeholder="ประเภทข้อมูลรายรับ"
                        value={this.state.typeId}
                        onChange={this.handleInputChange}
                      >
                        <option value={''}>กรุณาเลือก</option>
                        {this.state.typeList &&
                          this.state.typeList
                            .filter(
                              type => parseInt(type.revenue_type_status) === 1,
                            )
                            .map((type, no) => (
                              <option
                                value={type.revenue_type_id}
                                key={'option' + no}
                              >
                                {type.revenue_type_name}
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

                  <Label for="PlanName" sm={12}>
                    งบประมาณจริง
                  </Label>
                  <FormGroup>
                    <Col sm={12}>
                      <Row>
                        <Col sm={2}>Q1 :</Col>
                        <Col sm={6}>
                          <Input
                            type="text"
                            name="Q1"
                            placeholder=""
                            value={this.state.Q1}
                            onChange={this.handleInputChangeNumber}
                          />
                        </Col>
                        <Col sm={3}>บาท</Col>
                      </Row>
                    </Col>
                  </FormGroup>
                  <div className="mb-2"></div>
                  <FormGroup>
                    <Col sm={12}>
                      <Row>
                        <Col sm={2}>Q2 :</Col>
                        <Col sm={6}>
                          <Input
                            type="text"
                            name="Q2"
                            placeholder=""
                            value={this.state.Q2}
                            onChange={this.handleInputChangeNumber}
                          />
                        </Col>
                        <Col sm={3}>บาท</Col>
                      </Row>
                    </Col>
                  </FormGroup>
                  <div className="mb-2"></div>
                  <FormGroup>
                    <Col sm={12}>
                      <Row>
                        <Col sm={2}>Q3 :</Col>
                        <Col sm={6}>
                          <Input
                            type="text"
                            name="Q3"
                            placeholder=""
                            value={this.state.Q3}
                            onChange={this.handleInputChangeNumber}
                          />
                        </Col>
                        <Col sm={3}>บาท</Col>
                      </Row>
                    </Col>
                  </FormGroup>
                  <div className="mb-2"></div>
                  <FormGroup>
                    <Col sm={12}>
                      <Row>
                        <Col sm={2}>Q4 :</Col>
                        <Col sm={6}>
                          <Input
                            type="text"
                            name="Q4"
                            placeholder=""
                            value={this.state.Q4}
                            onChange={this.handleInputChangeNumber}
                          />
                        </Col>
                        <Col sm={3}>บาท</Col>
                      </Row>
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
