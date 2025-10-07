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
  InputGroup,
  InputGroupText,
} from 'reactstrap';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import { Chip, Fab, Grid, LinearProgress, styled } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import { NavLink } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from 'material-ui-thai-datepickers';

import 'moment/locale/th';

const MySwal = withReactContent(Swal);
const token_id = localStorage.getItem('token');

const BorderLinearProgress = styled(LinearProgress)(({ colors, theme }) => ({
  height: 7,
  borderRadius: 5,
  backgroundColor: colors + '50',
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    backgroundColor: colors,
  },
}));

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

function ProgressBar({ dataprogress, datapic }) {
  let color;
  if (dataprogress === 0) {
    color = '#BBBBBB';
  } else if (dataprogress < 20) {
    color = '#ee4444';
  } else if (dataprogress < 60) {
    color = '#ffaa22';
  } else if (dataprogress <= 99) {
    color = '#99CC66';
  } else {
    color = '#22AA99';
  }

  return (
    <Grid container spacing={1} className="flex">
      <Grid item sm={12} md={9}>
        <BorderLinearProgress
          variant="determinate"
          value={dataprogress}
          colors={color}
        />
      </Grid>
      <Grid item sm={12} md={3}>
        <Chip
          label={dataprogress + '%'}
          color="primary"
          size="small"
          style={{ backgroundColor: color }}
        />
      </Grid>
    </Grid>
  );
}
export default class AddProjectActivityData extends React.Component {
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

      PlanID: '',
      PlanName: '',
      ID: id,
      isForm: '',
      data: [],
      data1: [], //หลอกตา
      selected: id,
      currenpage: id - 1,
      offset: 0,
      perPage: 10,
      keyword: '',
      url: process.env.REACT_APP_SOURCE_URL + '/projects/activities/' + id,

      projectId: id,
      ActivityId: '',
      ActivityDetail: '',
      ActivityWeight: '',
      ActivityWeight2: '',
      ActivityStart: new Date(),
      ActivityFinish: new Date(),
      ActivityCost: '',
      ActivityReport: [],
      ActivityStatus: '',

      validationError: '',
      validationError1: '',
      validationError2: '',
      validationError2_1: '',
      validationError3: '',
      validationError3_1: '',
      validationError4: '',
      validationError4_1: '',
      validationError5: '',
      validationError6: '',

      sumWeight: '',
      sumWeight2: '',
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
    if (id !== undefined) {
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
    } else {
      MySwal.fire({
        title: <strong>ไม่พบ Activity ID</strong>,
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
  DELETE = id => {
    axios
      .delete(
        process.env.REACT_APP_SOURCE_URL +
          '/projects/activities/activity/' +
          id,{ headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        this.loadCommentsFromServer();
        //setTimeout(() => (window.location.href = '/plan1/'), 1000);
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    // this.setState({ modal: true });
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/projects/activities/activity/' +
          id,
      )
      .then(res => {
        const {
          project_id,
          activity_id,
          activity_detail,
          activity_weight,
          activity_start,
          activity_finish,
          activity_cost,
          activity_report,
        } = res.data.result;
        const activity_report_map = activity_report.map(
          b => monthList.filter(a => a.no === b - 1)[0],
        );
        this.setState({
          modal: true,
          isForm: 'edit',
          ID: project_id,
          header: 'แก้ไขข้อมูลกิจกรรม',
          projectId: project_id,
          ActivityId: activity_id,
          ActivityDetail: activity_detail,
          ActivityWeight: activity_weight,
          ActivityWeight2: activity_weight,
          ActivityStart: new Date(moment(activity_start)),
          ActivityFinish: new Date(moment(activity_finish)),
          ActivityCost: activity_cost,
          ActivityReport: activity_report_map,

          validationError: '',
          validationError1: '',
          validationError2: '',
          validationError2_1: '',
          validationError3: '',
          validationError3_1: '',
          validationError4: '',
          validationError4_1: '',
          validationError5: '',
          validationError6: '',
        });
      });
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onAdd() {
    this.setState({
      modal: true,
      isForm: '',
      ActivityId: '',
      ActivityDetail: '',
      ActivityWeight: '',
      ActivityStart: new Date(),
      ActivityFinish: new Date(),
      ActivityCost: '',
      ActivityReport: [],
      ActivityStatus: '',

      validationError: '',
      validationError1: '',
      validationError2: '',
      validationError2_1: '',
      validationError3: '',
      validationError3_1: '',
      validationError4: '',
      validationError4_1: '',
      validationError5: '',
      validationError6: '',
      header: 'เพิ่มข้อมูลกิจกรรม',
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.isForm === 'edit') {
      this.handleUpdate(e);
    } else {
      this.handleSubmit1(e);
    }
  };
  handleSubmit2 = e => {
    let data = {
      activity_detail: this.state.ActivityDetail,
      activity_weight: this.state.ActivityWeight,
      activity_start: this.state.ActivityStart,
      activity_finish: this.state.ActivityFinish,
      activity_cost: this.state.ActivityCost,
      activity_report: this.state.ActivityReport,
    };
  };

  handleSubmit1 = e => {
    e.preventDefault();
    let moreThanTime = this.checkTime();
    if (
      this.state.ActivityDetail.trim() &&
      moreThanTime !== false &&
      this.state.ActivityWeight &&
      this.state.ActivityWeight.toString() !== 'NaN' &&
      this.state.ActivityStart &&
      this.state.ActivityFinish &&
      this.state.ActivityCost &&
      this.state.ActivityCost.toString() !== 'NaN' &&
      this.state.ActivityReport.length > 0 &&
      this.state.sumWeight <= 100
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL +
            '/projects/activities/' +
            this.state.projectId,
          {
            //project_id: this.state.projectId,
            //activity_detail:this.state.ActivityId,
            activity_detail: this.state.ActivityDetail,
            activity_weight: parseInt(this.state.ActivityWeight),
            activity_start: moment(this.state.ActivityStart).format(
              'yyyy-MM-DD',
            ),
            activity_finish: moment(this.state.ActivityFinish).format(
              'yyyy-MM-DD',
            ),
            activity_cost: parseInt(this.state.ActivityCost),
            activity_report: this.state.ActivityReport.map(data => {
              return data.no + 1;
            }),
            //activity_detail:this.state.ActivityStatus,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          MySwal.fire({
            title: <strong>บันทึกข้อมูลสำเร็จ</strong>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          this.setState({
            modal: false,
          });
          this.loadCommentsFromServer();
          //setTimeout(() => (window.location.href = '/plan1/'), 1000);
        })
        .catch(err => {
          if (
            err.response.data.message.toLowerCase() ===
            'project_total_budget over'
          ) {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณโครงการ </br> ยอดงบประมาณ ${new Intl.NumberFormat().format(
                err.response.data.project_total_budget,
              )} บาท`,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            });
          }
          if (err.response.data.message.toLowerCase() === 'out of budget') {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณโครงการ </br> ยอดงบประมาณ ${new Intl.NumberFormat().format(
                err.response.data.project_total_budget,
              )} บาท`,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            });
          }

          if (
            err.response.data.message.toLowerCase() ===
            'total_weight over 100'.toLowerCase()
          ) {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลไม่สำเร็จ</strong>,
              html: `ค่าน้ำหนัักเกิน 100 </br> ค่าน้ำหนักรวม ${err.response.data.total_weight}`,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            });
          }
        });
    } else {
      // const validationError = this.state.PlanID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.ActivityDetail.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.ActivityStart
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.ActivityFinish
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2_1 =
        moreThanTime !== false ? '' : 'วันเริ่มต้นห้ามมากกว่ามันสิ้นสุด';
      const validationError3_1 =
        moreThanTime !== false ? '' : 'วันสิ้นสุดห้ามน้อยกว่าวันเริ่มต้น';
      const validationError4 =
        this.state.ActivityWeight &&
        this.state.ActivityWeight.toString() !== 'NaN'
          ? ''
          : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError4_1 =
        this.state.sumWeight <= 100
          ? ''
          : 'ค่าน้ำหนักรวมทุกกิจกรรมต้องไม่เกิน 100';
      const validationError5 =
        this.state.ActivityCost && this.state.ActivityCost.toString() !== 'NaN'
          ? ''
          : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError6 =
        this.state.ActivityReport.length > 0 ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        validationError1: validationError1,
        validationError2: validationError2,
        validationError2_1: validationError2_1,
        validationError3: validationError3,
        validationError3_1: validationError3_1,
        validationError4: validationError4,
        validationError4_1: validationError4_1,
        validationError5: validationError5,
        validationError6: validationError6,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.ActivityId;
    let moreThanTime = this.checkTime();
    if (
      this.state.projectId &&
      this.state.ActivityId &&
      this.state.ActivityDetail.trim() &&
      moreThanTime !== false &&
      this.state.ActivityWeight &&
      this.state.ActivityWeight.toString() !== 'NaN' &&
      this.state.ActivityStart &&
      this.state.ActivityFinish &&
      this.state.ActivityCost &&
      this.state.ActivityCost.toString() !== 'NaN' &&
      this.state.ActivityReport.length > 0 &&
      this.state.sumWeight <= 100
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/projects/activities/' + ID,
          {
            //project_id: this.state.projectId,
            //activity_detail:this.state.ActivityId,
            activity_detail: this.state.ActivityDetail,
            activity_weight: parseInt(this.state.ActivityWeight),
            activity_start: moment(this.state.ActivityStart).format(
              'yyyy-MM-DD',
            ),
            activity_finish: moment(this.state.ActivityFinish).format(
              'yyyy-MM-DD',
            ),
            activity_cost: parseInt(this.state.ActivityCost),
            activity_report: this.state.ActivityReport.map(data => {
              return data.no + 1;
            }),
            //activity_detail:this.state.ActivityStatus,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          //this.loadCommentsFromServer();
          MySwal.fire({
            title: <strong>แก้ไขข้อมูลสำเร็จ</strong>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          this.setState({
            modal: false,
          });
          this.loadCommentsFromServer();
        })
        .catch(err => {
          if (
            err.response.data.message.toLowerCase() ===
            'project_total_budget over'
          ) {
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณโครงการ </br> ยอดงบประมาณ ${new Intl.NumberFormat().format(
                err.response.data.project_total_budget,
              )} บาท`,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            });
          }
          if (err.response.data.message.toLowerCase() === 'out of budget') {
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณโครงการ </br> ยอดงบประมาณ ${new Intl.NumberFormat().format(
                err.response.data.project_total_budget,
              )} บาท`,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            });
          }

          if (
            err.response.data.message.toLowerCase() ===
            'total_weight over 100'.toLowerCase()
          ) {
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลไม่สำเร็จ</strong>,
              html: `ค่าน้ำหนัักเกิน 100 </br> ค่าน้ำหนักรวม ${err.response.data.total_weight}`,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            });
          }
        });
    } else {
      const validationError1 = this.state.ActivityDetail.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.ActivityStart
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.ActivityFinish
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2_1 =
        moreThanTime !== false ? '' : 'วันเริ่มต้นห้ามมากกว่ามันสิ้นสุด';
      const validationError3_1 =
        moreThanTime !== false ? '' : 'วันสิ้นสุดห้ามน้อยกว่าวันเริ่มต้น';
      const validationError4 =
        this.state.ActivityWeight &&
        this.state.ActivityWeight.toString() !== 'NaN'
          ? ''
          : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError4_1 =
        this.state.sumWeight <= 100
          ? ''
          : 'ค่าน้ำหนักรวมทุกกิจกรรมต้องไม่เกิน 100';
      const validationError5 =
        this.state.ActivityCost && this.state.ActivityCost.toString() !== 'NaN'
          ? ''
          : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError6 =
        this.state.ActivityReport.length > 0 ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        validationError1: validationError1,
        validationError2: validationError2,
        validationError2_1: validationError2_1,
        validationError3: validationError3,
        validationError3_1: validationError3_1,
        validationError4: validationError4,
        validationError4_1: validationError4_1,
        validationError5: validationError5,
        validationError6: validationError6,
      });
    }
  };
  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
  }
  loadCommentsFromServer() {
    $.ajax({
      url: this.state.url,
      dataType: 'json',
      type: 'GET',
      success: data => {
        this.setState({
          // data: data,
          data: data.result,
        });
        this.checkWeight(data.result);
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
    // this.loadCommentsFromServer();
  };
  handleInputChangeNumber = e => {
    var value = NaN;
    if (
      parseInt(e.target.value) >= 0 &&
      parseInt(e.target.value).toString() !== 'NaN'
    ) {
      if (
        e.target.name === 'ActivityWeight' &&
        parseInt(e.target.value) > 100
      ) {
        value = this.state.ActivityWeight;
        this.setState({
          validationError4: 'ห้ามกรอกค่าเกิน 100',
          //sumWeight: this.state.sumWeight2 + parseInt(e.target.value),
        });
      } else {
        value = e.target.value;
        this.setState({
          validationError4: '',
        });
      }

      if (e.target.name === 'ActivityWeight') {
        if (this.state.isForm === 'edit') {
          let sum =
            parseInt(this.state.sumWeight2) -
            parseInt(this.state.ActivityWeight2) +
            parseInt(e.target.value);
          this.setState({
            sumWeight: sum,
          });
        } else {
          let sum = parseInt(this.state.sumWeight2) + parseInt(e.target.value);
          this.setState({
            sumWeight: sum,
          });
        }
      }
    }

    this.setState({
      [e.target.name]: value.toString(),
    });
  };
  handleInputChangeWeight = e => {
    var value = NaN;
    if (
      parseInt(e.target.value) >= 0 &&
      parseInt(e.target.value).toString() !== 'NaN'
    ) {
      if (
        e.target.name === 'ActivityWeight' &&
        parseInt(e.target.value) > 100
      ) {
        value = this.state.ActivityWeight;
        this.setState({
          validationError4: 'ห้ามกรอกค่าเกิน 100',
          //sumWeight: this.state.sumWeight2 + parseInt(e.target.value),
        });
      } else {
        value = e.target.value;
        this.setState({
          validationError4: '',
        });
      }

      if (e.target.name === 'ActivityWeight') {
        if (this.state.isForm === 'edit') {
          let sum =
            parseInt(this.state.sumWeight2) -
            parseInt(this.state.ActivityWeight2) +
            parseInt(e.target.value);
          this.setState({
            sumWeight: sum,
          });
        } else {
          let sum = parseInt(this.state.sumWeight2) + parseInt(e.target.value);
          this.setState({
            sumWeight: sum,
          });
        }
      }
    }

    this.setState({
      [e.target.name]: value.toString(),
    });
  };
  // handleInputChangeDate = e => {
  //   //projectPeriod
  //   if (e.target.name === 'ActivityStart') {
  //     var a = moment(e.target.value);
  //     var b = moment(this.state.ActivityFinish);
  //     var diff = b.diff(a, 'days');
  //     this.setState({
  //       ActivityStart: e.target.value,
  //       // projectPeriod: diff > 0 ? diff : 0,
  //     });
  //   }
  //   if (e.target.name === 'ActivityFinish') {
  //     var a = moment(this.state.ActivityStart);
  //     var b = moment(e.target.value);
  //     var diff = b.diff(a, 'days');
  //     this.setState({
  //       ActivityFinish: e.target.value,
  //       // projectPeriod: diff > 0 ? diff : 0,
  //     });
  //   }
  // };
  handleInputChangeDateStart = e => {    
    var a = moment(e);
    var b = moment(this.state.ActivityFinish);
    var diff = b.diff(a, 'days');
    this.setState({
      ActivityStart: e,
      // projectPeriod: diff > 0 ? diff : 0,
    });
  };
  handleInputChangeDateFinish = e => {    
    var a = moment(this.state.ActivityStart);
    var b = moment(e);
    var diff = b.diff(a, 'days');
    this.setState({
      ActivityFinish: e,
      // projectPeriod: diff > 0 ? diff : 0,
    });
  };

  handleMultiSelectChange(e) {
    this.setState({ ActivityReport: e });
  }
  checkTime = e => {
    var a = moment(this.state.ActivityStart);
    var b = moment(this.state.ActivityFinish);
    var sum = a.diff(b);
    if (sum <= 0) {
      return true;
    } else {
      return false;
    }
  };
  checkWeight = data => {
    let sum = 0;
    data && data.map(a => (sum = sum + parseInt(a.activity_weight)));
    this.setState({
      sumWeight: sum,
      sumWeight2: sum,
    });
  };
  thaiDate = e => {
    var date = moment(e).get('date');
    var month = moment(e).get('month');
    var year = moment(e).get('year') + 543;

    let monthThai = monthList.filter(list => list.no === month)[0].nameshort;
    return e != undefined ? date + ' ' + monthThai + ' ' + year : '';
  };
  render() {
    return (
      <>
        <Row>
          <Col sm={12}>
            <div className="box-9">ข้อมูลกิจกรรม</div>
          </Col>
          <Col>
            {/* <Card className="mb-12">
            <CardBody> */}

            <Table responsive borderless id="table1">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  <th style={{ textAlign: 'left' }}>ขั้นตอน/กิจกรรม</th>
                  <th style={{ textAlign: 'center' }}>ความก้าวหน้าโครงการ</th>
                  <th style={{ textAlign: 'center' }}>วันเริ่มต้นโครงการ</th>
                  <th style={{ textAlign: 'center' }}>วันสิ้นสุดโครงการ</th>
                  <th style={{ textAlign: 'center' }}>จัดการข้อมูล</th>
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
                    <tr key={'table' + i}>
                      <td style={{ textAlign: 'center' }}>{i + 1}</td>
                      <td>{id.activity_detail}</td>
                      <td style={{ textAlign: 'center' }}>
                        <ProgressBar dataprogress={id.activity_progress} />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {this.thaiDate(id.activity_start)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {this.thaiDate(id.activity_finish)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Tooltip title="แก้ไข">
                          <span
                            className="edit-button"
                            onClick={() => this.onEdit(id.activity_id)}
                          >
                            <Icon style={{ fontSize: '14px' }}>edit</Icon>
                          </span>
                        </Tooltip>
                        &nbsp;
                        <Tooltip title="ลบ">
                          <span
                            className="delete-button"
                            onClick={() => this.testAxiosDELETE(id.activity_id)}
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

            {/* {this.state.data1.length != 0 ? (
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
            )} */}

            <div style={{ display: 'flex', justifyContent: 'right' }}>
              <NavLink to={`/AllProject/EditProject1/${this.state.projectId}`}>
                {'ข้อมูลหลัก <<'}
              </NavLink>
              <div className="box-10">{'หน้าก่อน'}</div>
              <div className="box-10">{'หน้าถัดไป'}</div>
              <NavLink to={`/AllProject/AddProject3/${this.state.projectId}`}>
                {'>> ข้อมูลชี้วัด'}
              </NavLink>
            </div>

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
                      ข้อมูลขั้นตอน/กิจกรรม <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="textarea"
                        name="ActivityDetail"
                        onChange={this.handleInputChange}
                        value={this.state.ActivityDetail}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ระยะเวลา <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Row>
                        <Col sm={2}>เริ่มต้น:</Col>
                        <Col sm={4}>
                          {/* <Input
                            type="date"
                            name="ActivityStart"
                            onChange={this.handleInputChangeDate}
                            value={this.state.ActivityStart}
                          /> */}
                          <MuiPickersUtilsProvider
                            utils={MomentUtils}
                            locale={'th'}
                          >
                            <DatePicker
                              //renderInput={params => <TextField {...params} />}
                              className="form-control"
                              format="DD/MM/YYYY"
                              pickerHeaderFormat="ddd D MMM"
                              yearOffset={543}
                              name="ActivityStart"
                              value={this.state.ActivityStart}
                              onChange={this.handleInputChangeDateStart}
                              TextFieldComponent={params => (
                                <Input {...params} />
                              )}
                              cancelLabel="ยกเลิก"
                              okLabel="ตกลง"
                            />
                          </MuiPickersUtilsProvider>
                        </Col>

                        <Col sm={2}>สิ้นสุด:</Col>
                        <Col sm={4}>
                          {/* <Input
                            type="date"
                            name="ActivityFinish"
                            onChange={this.handleInputChangeDate}
                            value={this.state.ActivityFinish}
                          /> */}
                          {/* <DatePicker
                            locale="th"
                            className="form-control"
                            name="ActivityFinish"
                            selected={this.state.ActivityFinish}
                            value={moment(this.state.ActivityFinish)
                              .add(543, 'y')
                              .format('DD/MM/YYYY')}
                            onChange={this.handleInputChangeDateFinish}
                            dateFormat="dd/MM/yyyy"
                          /> */}
                          <MuiPickersUtilsProvider
                            utils={MomentUtils}
                            locale={'th'}
                          >
                            <DatePicker
                              //renderInput={params => <TextField {...params} />}
                              className="form-control"
                              format="DD/MM/YYYY"
                              pickerHeaderFormat="ddd D MMM"
                              yearOffset={543}
                              name="ActivityFinish"
                              value={this.state.ActivityFinish}
                              onChange={this.handleInputChangeDateFinish}
                              TextFieldComponent={params => (
                                <Input {...params} />
                              )}
                              cancelLabel="ยกเลิก"
                              okLabel="ตกลง"
                            />
                          </MuiPickersUtilsProvider>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={6} style={{ color: 'red', marginTop: '5px' }}>
                          <div> {this.state.validationError2}</div>
                          <div>{this.state.validationError2_1}</div>
                        </Col>
                        <Col sm={6} style={{ color: 'red', marginTop: '5px' }}>
                          <div> {this.state.validationError3}</div>
                          <div> {this.state.validationError3_1}</div>
                        </Col>
                      </Row>
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ค่าน้ําหนัก (ไม่เกิน 100) <font color="red">*</font>:
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="number"
                        name="ActivityWeight"
                        max={100}
                        min={0}
                        onChange={this.handleInputChangeWeight}
                        value={this.state.ActivityWeight}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      <div> {this.state.validationError4}</div>
                      <div> {this.state.validationError4_1}</div>
                    </Col>
                    <Label for="PlanName" sm={12}>
                      เดือนที่รายงานผล{' '}
                      <font color="red">* ( เลือกได้มากกว่า 1 รายการ)</font> :
                    </Label>
                    <Col sm={12}>
                      {/* <Input
                        type="text"
                        name="ActivityReport"
                        onChange={this.handleInputChange}
                        value={this.state.ActivityReport}
                      /> */}
                      <Typeahead
                        clearButton
                        labelKey="name"
                        id="ActivityReport"
                        name="ActivityReport"
                        options={monthList}
                        onChange={e => this.handleMultiSelectChange(e)}
                        defaultSelected={this.state.ActivityReport}
                        // value={this.state.UserType}
                        multiple
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError6}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      จํานวนเงิน{' '}
                      <font color="red">* (ไม่เกินยอดเงินรวมของโครงการ)</font> :
                    </Label>
                    <Col sm={12}>
                      <InputGroup>
                        <Input
                          type="number"
                          name="ActivityCost"
                          onChange={this.handleInputChangeNumber}
                          value={this.state.ActivityCost}
                        />
                        <InputGroupText
                          style={{
                            borderTopLeftRadius: '0px',
                            borderBottomLeftRadius: '0px',
                          }}
                        >
                          บาท
                        </InputGroupText>
                      </InputGroup>
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError5}
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
