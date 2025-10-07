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
import { Chip, Fab, Grid } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const token_id = localStorage.getItem('token');
const userID = localStorage.getItem('userID');
const userName = localStorage.getItem('userName');
const userPermission =
  JSON.parse(localStorage.getItem('userPermission')) !== null
    ? JSON.parse(localStorage.getItem('userPermission'))
    : [
        {
          manageUsersData: false,
          manageBasicData: false,
          manageBudgetData: false,
          manageProjectData: false,
          manageReportProjectData: false,
          manageKPIData: false,
          manageReportKPIData: false,
          showProjectData: false,
          showReportProjectData: false,
          showKPIData: false,
          showReportKPIData: false,
        },
      ];

const monthList = [
  { no: 0, name: 'เดือนมกราคม', nameshort: 'ม.ค.' },
  { no: 1, name: 'เดือนกุมภาพันธ์', nameshort: 'ก.พ.' },
  { no: 2, name: 'เดือนมีนาคม', nameshort: 'มี.ค.' },
  { no: 3, name: 'เดือนเมษายน', nameshort: 'เม.ย.' },
  { no: 4, name: 'เดือนพฤษภาคม', nameshort: 'พ.ค.' },
  { no: 5, name: 'เดือนมิถุนายน', nameshort: 'มิ.ย.' },
  { no: 6, name: 'เดือนกรกฎาคม', nameshort: 'ก.ค.' },
  { no: 7, name: 'เดือนสิงหาคม', nameshort: 'ส.ค.' },
  { no: 8, name: 'เดือนกันยายน', nameshort: 'ก.ย.' },
  { no: 9, name: 'เดือนตุลาคม', nameshort: 'ต.ค.' },
  { no: 10, name: 'เดือนพฤศจิกายน', nameshort: 'พ.ย.' },
  { no: 11, name: 'เดือนธันวาคม', nameshort: 'ธ.ค.' },
];

function KpiScoreTarget({ data, keys }) {
  let color = '';
  let ftcolor = '';
  let label;
  if (data === undefined || data === null) {
    ftcolor = '#ffffff';
    color = '#BBBBBB';
    label = 'ยังไม่รายงาน';
  }
  if (parseFloat(data) === 0) {
    ftcolor = '#ffffff';
    color = '#BBBBBB';
    label = 'ต่ำกว่าเกณฑ์คะแนน';
  }
  if (parseFloat(data) === 1) {
    ftcolor = '#ffffff';
    color = '#FF0000';
    label = 'ไม่ผ่าน';
  }
  if (parseFloat(data) === 2) {
    ftcolor = '#ffffff';
    color = '#FF00FF';
    label = 'ปรับปรุง';
  }
  if (parseFloat(data) === 3) {
    ftcolor = '#000000';
    color = '#ffff00';
    label = 'พอใช้';
  }
  if (parseFloat(data) === 4) {
    ftcolor = '#000000';
    color = '#00FF00';
    label = 'ดี';
  }
  if (parseFloat(data) === 5) {
    ftcolor = '#ffffff';
    color = '#008000';
    label = 'ดีมาก';
  }

  return (
    <Chip
      key={keys}
      label={label}
      size="small"
      style={{
        color: ftcolor,
        backgroundColor: color,
        padding: '2px 20px',
        width: '200px',
      }}
    />
  );
}

export default class ReportKPIDetailList extends React.Component {
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
      modal1: false,
      modal2: false,
      validationError: '',
      validationError1: '',
      validationError2: '',
      PlanID: '',
      PlanName: '',
      ID: '',
      isForm: '',
      data: [],
      data1: [{}, {}, {}],
      selected: 1,
      //currenpage: selected - 1,
      offset: 0,
      perPage: 10,
      keyword: '',
      url: process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi',

      kpi_id: '',
      kpi_name: '',
      report_id: '',
      month: '',
      result: '',
      score_target: '',
      weight: '',
      score_total: '',
      note: '',
      criteria: [],

      kpi_report: [],

      kpi_code: '',
      kpi_name: '',
      kpi_unit_name: '',
      kpi_target: '',
      kpi_reported: [],
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

  toggle2 = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal2: !this.state.modal2,
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

  testAxiosDELETE2 = id => {
    if (id !== undefined) {
      MySwal.fire({
        title: <strong>คุณต้องการจะลบข้อมูลรายงานผลนี้</strong>,
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
          this.DeleteReport(id);
        }
      });
    } else {
      MySwal.fire({
        title: <strong>ไม่พบ Report ID</strong>,
        html: <i>กรุณาลองใหม่อีกครั้ง</i>,
        icon: 'error',
        confirmButtonColor: '#66BB66',
        // confirmButtonText: 'ยืนยัน',
        // showCancelButton: true,
        // cancelButtonColor: '#EE4444',
        // cancelButtonText: 'ยกเลิก',
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };
  DeleteReport = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/kpisReports/kpi/1/' + id)
      .then(res => {
        this.onViewReport(this.state.kpi_id);
        this.loadCommentsFromServer();
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        //setTimeout(() => (window.location.href = '/plan1/'), 1000);
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    // this.setState({ modal: true });
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataPlans/' + id)
      .then(res => {
        // const ButgetSource1 = res.data;
        // this.setState({ ButgetSource1 });
        const { _id, plan_id, plan_name } = res.data;
        // .map(id => ({'PlanID':
        //   id.main_plan_id, 'PlanName':id.main_plan_name
        // }));
        this.setState({
          // PlanID: plan_id,
          PlanName: plan_name,
          modal: true,
          ID: _id,
          isForm: 'edit',
          validationError: '',
          validationError1: '',
          header: 'แก้ไข',
        });
      });
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      validationError1: '',
    });
  };

  onReport = (id, name, report_month) => {
    this.getCriteria(id);
    this.setState({
      modal: true,
      isForm: '',
      header: '',
      kpi_id: id,
      kpi_name: name,
      report_id: '',
      month: report_month[0].no,
      result: '',
      score_target: '',
      weight: '',
      score_total: '',
      note: '',
      kpi_report: report_month,
    });
  };

  onEditReport = report_id => {
    this.getCriteria(this.state.kpi_id);
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/kpisReports/kpi/1/' + report_id)
      .then(res => {
        // if (res.data.result.length > 0) {
        const {
          _id,
          kpi_id,
          kpi_name,
          month,
          note,
          report_id,
          result,
          weight,
        } = res.data.result;

        this.setState({
          modal: true,
          isForm: 'edit',
          kpi_id: kpi_id,
          kpi_name: kpi_name,
          report_id: report_id,
          month: month,
          result: result,
          weight: weight,
          note: note,
          kpi_report: monthList.filter(a => a.no === parseInt(month)),
        });
      });
  };

  onViewReport = (id, name) => {
    //this.getCriteria(id);
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi/' + id)
      .then(res => {
        // if (res.data.result.length > 0) {
        const {
          kpi_id,
          kpi_code,
          kpi_name,
          kpi_unit_name,
          kpi_target,
          kpi_reported,
        } = res.data.result[0];

        this.setState({
          modal2: true,
          header: 'ข้อมูลการรายงานผลตัวชี้วัด',
          kpi_id: kpi_id,
          kpi_code: kpi_code,
          kpi_name: kpi_name,
          kpi_unit_name: kpi_unit_name,
          kpi_target: kpi_target,
          kpi_reported: kpi_reported,
          validationError1: '',
          validationError2: '',
        });
      });
  };

  getCriteria = id => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi/criteria/' + id)
      .then(res => {
        if (res.data.result !== null) {
          const { criteria } = res.data.result;

          this.setState({
            criteria: criteria,
          });
        } else {
          MySwal.fire({
            title: <strong>ยังไม่มีเกณฑ์คะแนน</strong>,
            html: <i>กรุณากรอกเกณฑ์คะแนน</i>,
            icon: 'error',
            timer: 1000,
            showConfirmButton: false,
          });
          this.setState({
            modal: false,
          });
        }
      });
  };

  calculateCriteria() {
    let score = 0;
    this.state.criteria.map(cri => {
      if (parseInt(this.state.result).toString() !== 'NaN') {
        if (parseInt(this.state.result) >= parseInt(cri.criteria_result)) {
          score = parseInt(cri.criteria_score);
        }
      } else {
        if (this.state.result === 'มี') {
          score = 5;
        } else {
          score = 0;
        }
      }
    });
    this.setState({
      score_target: score,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    e.persist();
    this.calculateCriteria();
    setTimeout(() => {
      if (this.state.isForm == 'edit') {
        this.handleUpdate(e);
      } else {
        this.handleSubmit1(e);
      }
    }, 500);
  };

  handleSubmit1 = e => {
    e.preventDefault();
    if (
      this.state.month &&
      this.state.result.trim() &&
      this.state.weight &&
      parseInt(this.state.weight).toString() !== 'NaN'
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL +
            '/kpisReports/kpi/1/' +
            this.state.kpi_id,
          {
            result: this.state.result,
            score_target: this.state.score_target,
            weight: this.state.weight,
            month: this.state.month,
            note: this.state.note,
            user_id: userID,
            user_name: userName,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            validationError1: '',
            validationError2: '',
          });
          MySwal.fire({
            title: <strong>บันทึกข้อมูลสำเร็จ</strong>,
            // html: <i>You clicked the button!</i>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          // confirmAlert({
          //   message: 'บันทึกข้อมูลสำเร็จ',
          //   buttons: [],
          // });
          // setTimeout(() => (window.location.href = '/plan1/'), 1000);
        })
        .catch(err => {
          if (err.response.data == 'This KPI reported!') {
            const validationError1 = 'เดือนนี้ได้ทำการรายงานไปแล้ว';

            this.setState({
              validationError1: validationError1,
            });
          }
        });
    } else {
      // const validationError = this.state.PlanID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.month
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.result.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 =
        this.state.weight && parseInt(this.state.weight).toString() !== 'NaN'
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
    let datatest = {
      result: this.state.result,
      score_target: this.state.score_target,
      weight: this.state.weight,
      month: this.state.month,
      note: this.state.note,
      user_id: userID,
    };
    if (
      this.state.month &&
      this.state.result.trim() &&
      this.state.weight &&
      parseInt(this.state.weight).toString() !== 'NaN'
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL +
            '/kpisReports/kpi/1/' +
            this.state.report_id,
          {
            result: this.state.result,
            score_target: this.state.score_target,
            weight: this.state.weight,
            month: this.state.month,
            note: this.state.note,
            user_id: userID,
            user_name: userName,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.onViewReport(this.state.kpi_id);
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            validationError1: '',
            validationError2: '',
          });
          MySwal.fire({
            title: <strong>แก้ไขข้อมูลสำเร็จ</strong>,
            // html: <i>You clicked the button!</i>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          // confirmAlert({
          //   message: 'บันทึกข้อมูลสำเร็จ',
          //   buttons: [],
          // });
          // setTimeout(() => (window.location.href = '/plan1/'), 1000);
        })
        .catch(err => {
          if (err.response.data == 'This KPI reported!') {
            const validationError1 = 'เดือนนี้ได้ทำการรายงานไปแล้ว';

            this.setState({
              validationError1: validationError1,
            });
          }
        });
    } else {
      // const validationError = this.state.PlanID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.month
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.result.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 =
        this.state.weight && parseInt(this.state.weight).toString() !== 'NaN'
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
    // this.toggle();
    // this.toggle2();
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
      url:
        this.state.url +
        '?page=' +
        this.state.selected +
        '&size=' +
        this.state.perPage +
        '&search=' +
        this.state.keyword,

      data: {
        totalPage: this.state.perPage,
        offset: this.state.offset,
      },
      dataType: 'json',
      type: 'GET',
      success: data => {
        this.setState({
          data: data.result,
          pageCount: Math.ceil(data.pagination.itemTotal / this.state.perPage),
        });
      },

      error: (xhr, status, err) => {
        console.error(this.state.url, status, err.toString()); // eslint-disable-line
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
  handleInputChangeNumber = e => {
    var value = NaN;
    if (
      parseInt(e.target.value) >= 0 &&
      parseInt(e.target.value).toString() !== 'NaN'
    ) {
      value = e.target.value;
    }

    this.setState({
      [e.target.name]: value.toString(),
    });
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
          <Col>
            {/* <Card className="mb-12">
            <CardBody> */}
            <Table responsive borderless id="table">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  <th style={{ textAlign: 'center' }}>ชื่อข้อมูล</th>
                  <th style={{ textAlign: 'center' }}>ระดับการประเมิน</th>
                  {userPermission[0].manageReportKPIData === true ? (
                    <th style={{ textAlign: 'center' }}>รายงานผลตัวชี้วัด</th>
                  ) : (
                    ''
                  )}
                  {userPermission[0].manageReportKPIData === true ||
                  userPermission[0].showReportKPIData === true ? (
                    <th style={{ textAlign: 'center' }}>ข้อมูล</th>
                  ) : (
                    ''
                  )}
                  {/* <th style={{ textAlign: 'center' }}>จัดการข้อมูล</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.data.length == 0 ? (
                  <tr>
                    <td colSpan="6" align="center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  this.state.data.map((id, i) => (
                    <tr key={'tabledetail' + i}>
                      <td style={{ textAlign: 'center' }}>
                        {(parseInt(this.state.selected) - 1) * 10 + (i + 1)}
                      </td>
                      <td style={{ textAlign: 'left' }}>{id.kpi_name}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Grid item sm={12} md={12}>
                          <KpiScoreTarget
                            data={id.kpi_score_target}
                            keys={'KpiScoreTarget' + i}
                          />
                        </Grid>
                      </td>
                      {userPermission[0].manageReportKPIData === true ? (
                        <td style={{ textAlign: 'center' }}>
                          <Tooltip title="รายงานตัวชี้วัด">
                            <span
                              className="calendar-button"
                              onClick={() =>
                                this.onReport(
                                  id.kpi_id,
                                  id.kpi_name,
                                  id.kpi_report,
                                )
                              }
                            >
                              <Icon style={{ fontSize: '14px' }}>
                                calendar_month
                              </Icon>
                            </span>
                          </Tooltip>
                          {/* &nbsp;
                        <Tooltip title="แก้ไขรายงาน">
                          <span
                            className="edit-button-2"
                            //onClick={() => this.onView_edit()}
                          >
                            <Icon style={{ fontSize: '14px' }}>edit</Icon>
                          </span>
                        </Tooltip> */}
                        </td>
                      ) : (
                        ''
                      )}
                      {userPermission[0].manageReportKPIData === true ||
                      userPermission[0].showReportKPIData === true ? (
                        <td style={{ textAlign: 'center' }}>
                          <Grid item sm={12} md={12}>
                            {/* <NavLink to="/ReportKPI/ReportKPIDetail"> */}
                            <Tooltip title="ดูข้อมูล">
                              <span
                                className="view-button"
                                onClick={() =>
                                  this.onViewReport(
                                    id.kpi_id,
                                    id.kpi_name,
                                    id.kpi_report,
                                  )
                                }
                              >
                                <Icon style={{ fontSize: '14px' }}>
                                  grid_view
                                </Icon>
                              </span>
                            </Tooltip>
                            {/* </NavLink> */}
                          </Grid>
                        </td>
                      ) : (
                        ''
                      )}
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
                  //forcePage={this.state.currenpage}
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
                {/* {this.state.header} */}
                {/* ข้อมูลเกณฑ์การให้คะแนนตัวชี้วัด */}
                {this.state.header}
                รายงานผลตัวชี้วัด
              </ModalHeader>
              <ModalBody
                style={{
                  borderRadius: '1.5rem',
                }}
              >
                <Form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Label for="PlanName" sm={12}>
                      {this.state.kpi_name}
                    </Label>

                    <Label for="PlanName" sm={12}>
                      เดือนที่รายงานผล <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="select"
                        name="month"
                        value={this.state.month}
                        onChange={this.handleInputChange}
                      >
                        {this.state.kpi_report.map(item => (
                          <option key={'selectmonth' + item.no} value={item.no}>
                            {item.name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>

                    <Label for="PlanName" sm={12}>
                      ผลการปฎิบัติงาน
                      <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="result"
                        value={this.state.result}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError2}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ค่าน้ําหนัก <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="number"
                        name="weight"
                        value={this.state.weight}
                        onChange={this.handleInputChangeNumber}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError3}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      อุปสรรคในการดำเนินงาน :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="textarea"
                        name="note"
                        value={this.state.note}
                        onChange={this.handleInputChange}
                      />
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
            </Modal>

            <Modal
              isOpen={this.state.modal2}
              toggle={this.toggle2()}
              className={this.props.className}
              size="xl"
            >
              <ModalHeader
                toggle={this.toggle2()}
                style={{
                  backgroundColor: '#e0ecfa',
                  borderTopLeftRadius: '1.5rem',
                  borderTopRightRadius: '1.5rem',
                }}
              >
                {this.state.header}
                {/* ข้อมูลกิจกรรม */}
              </ModalHeader>
              <ModalBody
                style={{
                  borderRadius: '1.5rem',
                }}
              >
                <Form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Label for="PlanName" sm={12}>
                      ประเภทตัวชี้วัด :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="textarea"
                        name="type"
                        placeholder=""
                        disabled
                        value={
                          this.state.kpi_code === ('KPI1' || 'KPI2' || 'KPI3')
                            ? 'ตัวชี้วัดภายใน'
                            : 'ตัวชี้วัดภายนอก'
                        }
                      />
                    </Col>
                    <Label for="PlanName" sm={12}>
                      รหัสตัวชี้วัด :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="textarea"
                        name="kpi_code"
                        disabled
                        value={this.state.kpi_code}
                      />
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ชื่อตัวชี้วัด :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="textarea"
                        name="kpi_name"
                        disabled
                        value={this.state.kpi_name}
                      />
                    </Col>

                    <Col sm={12}>
                      <Row>
                        <Label sm={6}>หน่วยนับ :</Label>
                        <Label sm={6}>ค่าเป้าหมาย :</Label>
                        <Col sm={6}>
                          <Input
                            type="text"
                            name="kpi_unit_name"
                            disabled
                            value={this.state.kpi_unit_name}
                          />
                        </Col>

                        <Col sm={6}>
                          <Input
                            type="text"
                            name="kpi_target"
                            disabled
                            value={this.state.kpi_target}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Label for="PlanName" sm={12}>
                      เดือนที่รายงานผล :
                    </Label>
                    <Col sm={12}>
                      {/* <Grid container spacing={1}>
                        <Grid item sm={6} md={3}>
                          <span className="box-11">มกราคม</span>
                        </Grid>
                        <Grid item sm={6} md={9}>
                          <span style={{ color: '#99CC66' }}>รายงานผลแล้ว</span>
                        </Grid>
                        <Grid item sm={6} md={3}>
                          <span className="box-11">เมษายน</span>
                        </Grid>
                        <Grid item sm={6} md={9}>
                          <span style={{ color: '#EE4444' }}>รอรายงานผล</span>
                        </Grid>
                      </Grid> */}
                      <div style={{ border: 'solid 1px #000000' }}>
                        <Table responsive borderless id="table1">
                          <thead>
                            <tr style={{ backgroundColor: '#e0ecfa' }}>
                              <th style={{ textAlign: 'center' }}>ลำดับ</th>
                              <th style={{ textAlign: 'left' }}>
                                เดือนที่รายงานผล
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                สถานะการรายงานผล
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                ผลการปฎิบัติงาน
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                ค่าเป้าหมาย
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                ค่าน้ําหนัก
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                ปัญหาและอุปสรรค
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                ผู้รายงานผลตัวชี้วัด
                              </th>
                              {userPermission[0].manageReportKPIData ===
                              true ? (
                                <th
                                  style={{
                                    textAlign: 'center',
                                    width: '100px',
                                  }}
                                >
                                  จัดการ
                                </th>
                              ) : (
                                ''
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.kpi_reported.length == 0 ? (
                              <tr>
                                <td colSpan="8" align="center">
                                  ยังไม่มีการรายงาน
                                </td>
                              </tr>
                            ) : (
                              this.state.kpi_reported.map((item, index) => (
                                <tr key={'teblereport' + index}>
                                  <td style={{ textAlign: 'center' }}>
                                    {index + 1}
                                  </td>
                                  <td style={{ textAlign: 'left' }}>
                                    {monthList
                                      .filter(
                                        a => a.no === parseInt(item.month),
                                      )
                                      .map(b => b.name)}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <span
                                      style={{
                                        color: '#99CC66',
                                        fontWeight: '600',
                                      }}
                                    >
                                      รายงานผลแล้ว
                                    </span>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {item.result}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {item.score_target}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {item.weight}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {item.note === '' ? '-' : item.note}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <span className="box-15">
                                      {item.create_user_name}
                                    </span>
                                  </td>
                                  {userPermission[0].manageReportKPIData ===
                                  true ? (
                                    <td style={{ textAlign: 'center' }}>
                                      <Tooltip title="แก้ไขรายงานผล">
                                        <span
                                          className="edit-button-2"
                                          onClick={() =>
                                            this.onEditReport(item.report_id)
                                          }
                                        >
                                          <Icon style={{ fontSize: '14px' }}>
                                            edit
                                          </Icon>
                                        </span>
                                      </Tooltip>
                                      &nbsp;
                                      <Tooltip title="ลบรายงานผล">
                                        <span
                                          className="delete-button"
                                          onClick={() =>
                                            this.testAxiosDELETE2(
                                              item.report_id,
                                            )
                                          }
                                        >
                                          <Icon style={{ fontSize: '14px' }}>
                                            delete_outline
                                          </Icon>
                                        </span>
                                      </Tooltip>
                                    </td>
                                  ) : (
                                    ''
                                  )}
                                </tr>
                              ))
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                    {/* <Label for="PlanName" sm={12}>
                      ผู้รายงานผลตัวชี้วัด :
                    </Label>
                    <Col sm={12}>
                      <span className="box-15 mr-2">สำนักการคลัง</span>
                      <span className="box-15 mr-2">หน่วยงานตัวสอบภายใน</span>
                    </Col> */}
                  </FormGroup>
                  <FormGroup style={{ textAlign: 'center' }}>
                    {/* <Button color="success">บันทึก</Button>&nbsp; */}
                    <Button color="danger" onClick={this.toggle2()}>
                      ปิด
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

        {/* <div className="floating-button">
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
        </div> */}
      </>
    );
  }
}
