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
  InputGroupButton,
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
import { AiOutlineLink } from 'react-icons/ai';
import Checkbox from '@mui/material/Checkbox';
import SimpleMap from '../GoogleMap';
import MomentUtils from '@date-io/moment';
import { fetchData, processFileDocuments, b64toBlob, base64ToFile } from '../../utils/fileUtils';
import { userID, userName, token_id, monthList, performanceOptions, durationOptions, userPermission } from '../constants';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-thai-datepickers';
const MySwal = withReactContent(Swal);
const roundToTwoDecimalPlaces = num => Math.round((num + Number.EPSILON) * 100) / 100;
const BorderLinearProgress = styled(LinearProgress)(({ colors, theme }) => ({
  height: 7,
  borderRadius: 5,
  backgroundColor: colors + '50',
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    backgroundColor: colors,
  },
}));

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
        <BorderLinearProgress variant="determinate" value={dataprogress} colors={color} />
      </Grid>
      <Grid item sm={12} md={3}>
        <Chip label={dataprogress + '%'} color="primary" size="small" style={{ backgroundColor: color }} />
      </Grid>
    </Grid>
  );
}

export default class ReportActivityData extends React.Component {
  constructor(props) {
    super(props);
    let id;
    {
      this.props.page == ':id' || this.props.page == '' || this.props.page == undefined ? (id = 1) : (id = this.props.page);
    }
    this.state = {
      Budget: [],
      ButgetSources: [],
      refreshing: false,
      modal: false,
      modal1: false,
      modal2: false,
      modal3: false,
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
      url_upload: process.env.REACT_APP_SOURCE_URL_UPLOAD,
      projectId: id,
      ActivityId: '',
      ActivityDetail: '',
      ActivityWeight: '',
      ActivityWeight2: '',
      ActivityStart: moment().format('yyyy-MM-DD'),
      ActivityFinish: moment().format('yyyy-MM-DD'),
      ActivityStart2: moment().format('yyyy-MM-DD'),
      ActivityFinish2: moment().format('yyyy-MM-DD'),
      ActivityCost: '',
      ActivityReport: [],
      ActivityStatus: '',
      ActivityNote: '',
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
      progress_id: '',
      duration: '', //ระยะเวลาดำเนินการ หรือ สถานะผลการดำเนินงาน
      month_report: '', //เดือนที่รายงานผล
      performance: '', //ความก้าวหน้า
      result_detail: '', //ผลการดำเนินการ
      expenditure_budget_type: '', //ประเภทงบประมาณ ( รายจ่าย )
      expenditure_budget_type_name: '',
      used_cost: '', //งบประมาณที่ใช้ไป
      problem: '', //ปัญหาและอุปสรรค
      link: '',
      expenditureBudgets_list: [],

      reportError1: '',
      reportError2: '',
      reportError3: '',
      reportError4: '',
      reportError5: '',
      current_amount: '',
      activity_reported: [],
      send: false,
      isFile: 'file',
      files: [],
      isLoading: false,
      document_files: [],
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
  toggle1 = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal1: !this.state.modal1,
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
  toggle3 = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal3: !this.state.modal3,
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/projects/activities/activity/' + id)
      .then(res => {
        this.loadCommentsFromServer();
        this.props.onUpdateData();
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        //setTimeout(() => (window.location.href = '/plan1/'), 1000);
      })
      .catch(err => {
        // console.log(err);
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
  DeleteReport = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/projectsProgress/' + id, {
        headers: { Authorization: `Bearer ${token_id}` },
      })
      .then(res => {
        this.onViewReport(this.state.ActivityId);
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        this.loadCommentsFromServer();
        this.props.onUpdateData();
        //setTimeout(() => (window.location.href = '/plan1/'), 1000);
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    this.setState({
      modal: true,
      isForm: '',
      ActivityId: '',
      ActivityDetail: '',
      ActivityWeight: '',
      ActivityWeight2: '',
      ActivityCost: '',
      ActivityReport: [],
      ActivityStatus: '',
      ActivityNote: '',
      sumWeight: this.state.sumWeight2,
      location: '',
      lat: '',
      lng: '',
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
    // this.setState({ modal: true });
    axios.get(process.env.REACT_APP_SOURCE_URL + '/projects/activities/activity/' + id).then(res => {
      const { project_id, activity_id, activity_detail, activity_weight, activity_start, activity_finish, activity_cost, activity_report, map_position, map_data, activity_note } = res.data.result;
      const activity_report_map = activity_report.map(b => monthList.filter(a => a.no === b - 1)[0]);
      const formattedActivityCost = new Intl.NumberFormat('en-US').format(activity_cost);
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
        ActivityCost: formattedActivityCost,
        ActivityReport: activity_report_map,
        location: map_data,
        lat: map_position ? map_position.latitude : '',
        lng: map_position ? map_position.longitude : '',
        ActivityNote: activity_note,
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
  // handleInputChange = e => {
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   });
  // };

  onAdd() {
    this.setState({
      modal: true,
      isForm: '',
      ActivityId: '',
      ActivityDetail: '',
      ActivityWeight: '',
      ActivityStart: moment().format('yyyy-MM-DD'),
      ActivityFinish: moment().format('yyyy-MM-DD'),
      ActivityCost: '',
      ActivityReport: [],
      ActivityStatus: '',
      ActivityNote: '',
      sumWeight: this.state.sumWeight2,

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
      const map_position = {
        latitude: $('#lat').val(),
        longitude: $('#lng').val(),
      };
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/projects/activities/' + this.state.projectId,
          {
            activity_detail: this.state.ActivityDetail,
            map_data: this.state.location,
            map_position,
            activity_weight: parseFloat(this.state.ActivityWeight),
            activity_start: moment(this.state.ActivityStart).format('yyyy-MM-DD'),
            activity_finish: moment(this.state.ActivityFinish).format('yyyy-MM-DD'),
            activity_cost: parseFloat(this.state.ActivityCost.replace(/,/g, '')),
            activity_report: this.state.ActivityReport.map(data => {
              return data.no + 1;
            }),
            activity_note: this.state.ActivityNote,
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
          // console.log(err.response.data.message.toLowerCase());
          if (err.response.data.message.toLowerCase() === 'project_total_budget over') {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณโครงการ </br> ยอดงบประมาณ ${new Intl.NumberFormat().format(err.response.data.project_total_budget)} บาท`,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            });
          } else if (err.response.data.message.toLowerCase() === 'out of budget') {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณโครงการ </br> ยอดงบประมาณ ${new Intl.NumberFormat().format(err.response.data.project_total_budget)} บาท`,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            });
          } else if (err.response.data.message.toLowerCase() === 'total_weight over 100'.toLowerCase()) {
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
      const validationError1 = this.state.ActivityDetail.trim() ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.ActivityStart ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.ActivityFinish ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2_1 = moreThanTime !== false ? '' : 'วันเริ่มต้นห้ามมากกว่ามันสิ้นสุด';
      const validationError3_1 = moreThanTime !== false ? '' : 'วันสิ้นสุดห้ามน้อยกว่าวันเริ่มต้น';
      const validationError4 = this.state.ActivityWeight && this.state.ActivityWeight.toString() !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError4_1 = this.state.sumWeight <= 100 ? '' : 'ค่าน้ำหนักรวมทุกกิจกรรมต้องไม่เกิน 100 ปัจจุบัน ' + this.state.sumWeight;
      const validationError5 = this.state.ActivityCost && this.state.ActivityCost.toString() !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError6 = this.state.ActivityReport.length > 0 ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';

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
      const map_position = {
        latitude: $('#lat').val(),
        longitude: $('#lng').val(),
      };
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/projects/activities/' + ID,
          {
            //project_id: this.state.projectId,
            //activity_detail:this.state.ActivityId,
            activity_detail: this.state.ActivityDetail,
            map_data: $('#location').val(),
            map_position,
            activity_weight: parseFloat(this.state.ActivityWeight),
            activity_start: moment(this.state.ActivityStart).format('yyyy-MM-DD'),
            activity_finish: moment(this.state.ActivityFinish).format('yyyy-MM-DD'),
            activity_cost: parseFloat(this.state.ActivityCost.replace(/,/g, '')),
            activity_report: this.state.ActivityReport.map(data => {
              return data.no + 1;
            }),
            activity_note: this.state.ActivityNote,
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
          this.props.onUpdateData();
        })
        .catch(err => {
          // console.log(err.response.data.message.toLowerCase());
          if (err.response.data.message.toLowerCase() === 'project_total_budget over') {
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณโครงการ </br> ยอดงบประมาณ ${new Intl.NumberFormat().format(err.response.data.project_total_budget)} บาท`,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            });
          }
          if (err.response.data.message.toLowerCase() === 'out of budget') {
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณโครงการ </br> ยอดงบประมาณ ${new Intl.NumberFormat().format(err.response.data.project_total_budget)} บาท`,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            });
          }

          if (err.response.data.message.toLowerCase() === 'total_weight over 100'.toLowerCase()) {
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
      const validationError1 = this.state.ActivityDetail.trim() ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.ActivityStart ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.ActivityFinish ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2_1 = moreThanTime !== false ? '' : 'วันเริ่มต้นห้ามมากกว่ามันสิ้นสุด';
      const validationError3_1 = moreThanTime !== false ? '' : 'วันสิ้นสุดห้ามน้อยกว่าวันเริ่มต้น';
      const validationError4 = this.state.ActivityWeight && this.state.ActivityWeight.toString() !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError4_1 = this.state.sumWeight <= 100 ? '' : 'ค่าน้ำหนักรวมทุกกิจกรรมต้องไม่เกิน 100 ปัจจุบัน ' + this.state.sumWeight;
      const validationError5 = this.state.ActivityCost && this.state.ActivityCost.toString() !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError6 = this.state.ActivityReport.length > 0 ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';

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
    this.fetchDataExpenditureBudgets(this.props.projectStart);
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
    const { name, value, type } = e.target;
    // Always check for existence before using
    if (type === 'select-one' && e.nativeEvent && e.nativeEvent.target) {
      const nativeEvent = e.nativeEvent;
      const index = nativeEvent.target.selectedIndex;
      const options = nativeEvent.target.options;

      // Ensure index is within bounds
      const label = index >= 0 && index < options.length ? options[index].text : '';
      this.setState({
        [name]: value,
        [`${name}_name`]: label,
      });
    } else {
      this.setState({
        [name]: type === 'checkbox' ? e.target.checked : value,
      });
    }
  };
  handleInputChangeLink = e => {
    if (e.target.value === 'link') {
      this.setState({
        [e.target.name]: e.target.value,
        file: '',
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };
  handleInputChangeSend = e => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
    // this.loadCommentsFromServer();
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

      const isActivityWeight = name === 'ActivityWeight';

      // Handle ActivityWeight logic
      if (isActivityWeight) {
        const floatValue = parseFloat(numericValue);
        const adjustedSumWeight = this.state.isForm === 'edit' ? this.state.sumWeight2 - this.state.ActivityWeight2 + floatValue : this.state.sumWeight2 + floatValue;

        this.setState({
          validationError4: floatValue > 100 ? 'ห้ามกรอกค่าเกิน 100 ปัจจุบัน ' : '',
          sumWeight: roundToTwoDecimalPlaces(adjustedSumWeight),
        });
      }

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
  handleInputChangeWeight = e => {
    var value = NaN;
    if (parseInt(e.target.value) >= 0 && parseInt(e.target.value).toString() !== 'NaN') {
      if (e.target.name === 'ActivityWeight' && parseInt(e.target.value) > 100) {
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
          let sum = parseInt(this.state.sumWeight2) - parseInt(this.state.ActivityWeight2) + parseInt(e.target.value);
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
  uploadFile = e => {
    const extension = this.state.file.name.split('.').pop();
    const allowedExtensions = ['pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'jpg', 'jpeg', 'png'];
    if (this.state.duration && this.state.month_report && this.state.performance && this.state.expenditure_budget_type && this.state.used_cost) {
      if (allowedExtensions.includes(extension)) {
        // Upload file to the server
        this.setState({
          reportError1: '',
          reportError2: '',
          reportError3: '',
          reportError4: '',
          reportError5: '',
        });
        let formData = new FormData();
        formData.append('file', this.state.file);
        axios
          .post(this.state.url_upload, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(res => {
            if (res.data.message === 'File uploaded successfully') {
              this.setState({
                link: res.data.link,
              });
              if (this.state.isForm === 'edit') {
                this.handleUpdateReport(e);
              } else {
                this.handleSubmitAddReport(e);
              }
            } else if (res.data.message === 'Invalid file type') {
              MySwal.fire({
                title: <strong>อัปโหลดไฟล์ไม่สำเร็จ</strong>,
                html: (
                  <i>
                    ประเภทไฟล์อัปโหลดไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง <br />
                    'pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'jpg', 'jpeg', 'png'
                  </i>
                ),
                icon: 'error',
                timer: 2500,
                showConfirmButton: false,
              });
            } else if (res.data.message === 'A file with the same name already exists') {
              MySwal.fire({
                title: <strong>อัปโหลดไฟล์ไม่สำเร็จ</strong>,
                html: <i>ชื่อไฟล์นี้มีแล้ว กรุณาเปลี่ยนชื่อไฟล์</i>,
                icon: 'error',
                timer: 2500,
                showConfirmButton: false,
              });
            } else if (res.data.message === 'File size exceeds the maximum limit (2MB)') {
              MySwal.fire({
                title: <strong>อัปโหลดไฟล์ไม่สำเร็จ</strong>,
                html: <i>ไฟล์ต้องมีขนาดไม่เกิน 2 MB กรุณาตรวจสอบอีกครั้ง</i>,
                icon: 'error',
                timer: 2500,
                showConfirmButton: false,
              });
            } else {
              MySwal.fire({
                title: <strong>อัปโหลดไฟล์ไม่สำเร็จ</strong>,
                icon: 'error',
                timer: 1000,
                showConfirmButton: false,
              });
            }
          })
          .catch(error => {
            console.log(error);
            MySwal.fire({
              title: <strong>อัปโหลดไฟล์ไม่สำเร็จ</strong>,
              icon: 'error',
              timer: 1000,
              showConfirmButton: false,
            });
          });
      } else {
        // Handle error
        // console.log('invalid typ file');
        MySwal.fire({
          title: <strong>อัปโหลดไฟล์ไม่สำเร็จ</strong>,
          html: (
            <i>
              ประเภทไฟล์อัปโหลดไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง <br />
              'pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'jpg', 'jpeg', 'png'
            </i>
          ),
          icon: 'error',
          timer: 2500,
          showConfirmButton: false,
        });
      }
    } else {
      const reportError1 = this.state.month_report ? '' : 'กรุณาเลือกข้อมูล';
      const reportError2 = this.state.performance ? '' : 'กรุณาเลือกข้อมูล';
      const reportError3 = this.state.expenditure_budget_type ? '' : 'กรุณาเลือกข้อมูล';
      const reportError4 = this.state.used_cost ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const reportError5 = this.state.duration ? '' : 'กรุณาเลือกข้อมูล';
      this.setState({
        reportError1: reportError1,
        reportError2: reportError2,
        reportError3: reportError3,
        reportError4: reportError4,
        reportError5: reportError5,
      });
    }
  };

  handleInputChangeFile = e => {
    const files = Array.from(e.target.files);
    let invalidFiles = 0;
    const maxFileSize = 104857600; // 100MB
    const acceptTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/msword',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    // Show loading message while uploading files
    this.setState({ isLoading: true });
    Swal.fire({
      title: 'กำลังโหลด...',
      html: 'กรุณารอขณะกำลังอัปโหลดไฟล์',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const newFiles = [];
    const existingFiles = (Array.isArray(this.state.files) ? this.state.files : []).map(file => file.name);

    files.forEach(file => {
      if (file.size < maxFileSize && acceptTypes.includes(file.type)) {
        if (!existingFiles.includes(file.name)) {
          newFiles.push(file);
        } else {
          MySwal.fire({
            icon: 'warning',
            title: 'ไฟล์ซ้ำ',
            text: `ไฟล์ ${file.name} มีอยู่แล้ว`,
            showConfirmButton: true,
          });
        }
      } else {
        invalidFiles++;
        MySwal.fire({
          icon: 'error',
          title: '<strong>อัปโหลดไฟล์ไม่สำเร็จ</strong>',
          text: file.size > maxFileSize ? 'ขนาดไฟล์ใหญ่เกินไป' : 'ประเภทไฟล์ไม่ถูกต้อง',
          showConfirmButton: true,
        });
      }
    });

    if (newFiles.length > 0) {
      // Update state with new files
      this.setState(prevState => ({
        files: [...(prevState.files || []), ...newFiles],
        isLoading: false,
      }));

      Swal.close(); // Close loading window

      // Show success message if new files are uploaded
      MySwal.fire({
        icon: 'success',
        title: 'อัพโหลดไฟล์สำเร็จ!',
        text: 'ไฟล์ของคุณได้ถูกอัพโหลดแล้ว',
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      // Close loading window even if there are no new files
      this.setState({ isLoading: false });
      Swal.close(); // Close loading window
    }
  };

  handleRemoveFile = index => {
    this.setState(prevState => {
      const files = [...prevState.files];
      files.splice(index, 1); // Remove selected file
      return { files };
    });
  };

  renderFilePreview = (file, index, check) => {
    let url;
    let typeFile;
    let name;
    // Check if the file is a valid custom object
    if (file.data && file.filename && file.contentType) {
      const blob = b64toBlob(file.data, file.contentType);
      typeFile = file.contentType;
      url = URL.createObjectURL(blob);
      name = file.filename;
    } else if (file instanceof File) {
      typeFile = file.type;
      url = URL.createObjectURL(file);
      name = file.name;
    } else {
      console.error(`Invalid file object at index ${index}:`, file);
      return null; // Return fallback UI or null
    }

    const contentType = typeFile || '';
    const isImageOrPdf = contentType === 'application/pdf' || contentType.startsWith('image/');

    const fileIcons = {
      'application/pdf': <iframe src={url} className="m-1" width="100px" height="100px" title="PDF Preview" />,
      'application/msword': <img className="thumbnail" src={`${process.env.PUBLIC_URL}/word.png`} alt="Word Icon" />,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <img className="thumbnail" src={`${process.env.PUBLIC_URL}/word.png`} alt="Word Icon" />,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <img className="thumbnail" src={`${process.env.PUBLIC_URL}/excel.png`} alt="Excel Icon" />,
      'application/vnd.ms-excel': <img className="thumbnail" src={`${process.env.PUBLIC_URL}/excel.png`} alt="Excel Icon" />,
      'application/vnd.ms-powerpoint': <img className="thumbnail" src={`${process.env.PUBLIC_URL}/ppt.png`} alt="PowerPoint Icon" />,
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': <img className="thumbnail" src={`${process.env.PUBLIC_URL}/ppt.png`} alt="PowerPoint Icon" />,
    };

    const content = fileIcons[contentType] || <img className="thumbnail" src={url} style={{ width: '100px', height: '100px' }} alt="Preview" />;

    return (
      <div style={{ width: '120px', position: 'relative' }} key={index}>
        <a href={url} download={!isImageOrPdf ? name : undefined} target={isImageOrPdf ? '_blank' : undefined} rel="noopener noreferrer">
          {content}
          <label className="m-1" style={{ wordBreak: 'break-all', cursor: 'pointer' }}>
            {name}
          </label>
        </a>
        {check === 1 && (
          <button
            type="button"
            onClick={() => this.handleRemoveFile(index)}
            style={{
              position: 'absolute',
              top: '2px',
              right: '5px',
              background: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '25px',
              height: '25px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              lineHeight: '16px',
            }}
          >
            x
          </button>
        )}
      </div>
    );
  };
  fetchDataExpenditureBudgets(e) {
    const year = e ? e : moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543;
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          // '/dataExpenditureTypes/list?size=100',
          '/expenditureBudgets/reports?page=0&expenditure_budget_year=' +
          year,
      )
      .then(res => {
        this.setState({
          expenditureBudgets_list: res.data.result,
        });
      });
  }
  handleSubmit3 = e => {
    e.preventDefault();
    if (this.state.isForm === 'edit') {
      // if (
      //   this.state.file !== '' &&
      //   this.state.file !== undefined &&
      //   this.state.file !== null
      // ) {
      //   this.uploadFile(e);
      // } else {
      this.handleUpdateReport(e);
      // }
    } else {
      // if (
      //   this.state.file !== '' &&
      //   this.state.file !== undefined &&
      //   this.state.file !== null
      // ) {
      //   this.uploadFile(e);
      // } else {
      this.handleSubmitAddReport(e);
      // }
    }
  };

  handleSubmitAddReport = e => {
    e.preventDefault();

    if (this.state.duration && this.state.month_report && this.state.performance && this.state.expenditure_budget_type && this.state.used_cost) {
      let formData = new FormData();
      formData.append('duration', this.state.duration.toString()); //ระยะเวลาดำเนินการ หรือ สถานะผลการดำเนินงาน
      formData.append('month_report', parseInt(this.state.month_report)); //เดือนที่รายงานผล
      formData.append('send_inventory', this.state.send == true ? 1 : 0);
      formData.append('performance', this.state.performance); //ความก้าวหน้า
      formData.append('result_detail', this.state.result_detail); //ผลการดำเนินการ
      formData.append('expenditure_budget_type', this.state.expenditure_budget_type); //ประเภทงบประมาณ ( รายจ่าย )
      // formData.append(
      //   'expenditure_budget_type_name',
      //   this.state.expenditureBudgets_list.filter(
      //     a => a.expenditure_type_id === this.state.expenditure_budget_type,
      //   )[0].expenditure_type_name,
      // );
      formData.append('expenditure_budget_type_name', this.state.expenditure_budget_type_name);
      formData.append('used_cost', parseFloat(this.state.used_cost.replace(/,/g, ''))); //งบประมาณที่ใช้ไป
      formData.append('problem', this.state.problem); //ปัญหาและอุปสรรค
      formData.append('user_id', userID);
      formData.append('user_name', userName);
      formData.append('document_link', this.state.link);
      let files = this.state.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append('document_files', files[i]);
        }
      } else {
        // formData.append('document_files', '');
      }
      $.ajax({
        type: 'POST',
        url: process.env.REACT_APP_SOURCE_URL + '/projectsProgress/' + this.state.ActivityId,
        data: formData,
        headers: { Authorization: `Bearer ${token_id}` },
        processData: false,
        contentType: false,
        context: this,
      })
        .done(function (response) {
          MySwal.fire({
            title: <strong>บันทึกข้อมูลรายงานผลสำเร็จ</strong>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          this.loadCommentsFromServer();
          this.props.onUpdateData();
          this.setState({
            modal2: false,
          });
        })
        .fail(function (errResponse) {
          console.log(errResponse.responseJSON,errResponse.responseJSON.message.split('\n')[1])
          if (errResponse.responseJSON.message.toLowerCase() === 'activity progress is 100! \nPlease Check your performance!') {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `อัตราส่วน % ความก้าวหน้า ${new Intl.NumberFormat().format(errResponse.responseJSON.activity_cost)}`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          } else if (errResponse.responseJSON.message.toLowerCase() === 'out of budget') {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณกิจกรรม </br> ยอดงบประมาณกิจกรรม ${new Intl.NumberFormat().format(errResponse.responseJSON.activity_cost)}`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          } else if (errResponse.responseJSON.message.toLowerCase() === 'used cost over!') {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณกิจกรรม </br> ยอดงบประมาณกิจกรรม ${new Intl.NumberFormat().format(errResponse.responseJSON.activity_cost)} </br> ปัจจุบันที่ใช้ไปแล้ว 
    ${new Intl.NumberFormat().format(errResponse.responseJSON.current_amount)} </br> คงเหลือใช้ได้ ${new Intl.NumberFormat().format(
                errResponse.responseJSON.activity_cost - errResponse.responseJSON.current_amount,
              )}`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          } else if (errResponse.responseJSON.message.split('\n')[1] === 'Please Check your performance!') {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `อัตราส่วน % ความก้าวหน้าต้องไม่น้อยกว่าปัจจุบัน </br> ปัจจุบันมีความก้าวหน้า <b>${errResponse.responseJSON.performance} % </b>`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          } else {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `ใส่ข้อมูลไม่ถูกต้อง</b>`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          }
        });
    } else {
      const reportError1 = this.state.month_report ? '' : 'กรุณาเลือกข้อมูล';
      const reportError2 = this.state.performance ? '' : 'กรุณาเลือกข้อมูล';
      const reportError3 = this.state.expenditure_budget_type ? '' : 'กรุณาเลือกข้อมูล';
      const reportError4 = this.state.used_cost ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const reportError5 = this.state.duration ? '' : 'กรุณาเลือกข้อมูล';
      this.setState({
        reportError1: reportError1,
        reportError2: reportError2,
        reportError3: reportError3,
        reportError4: reportError4,
        reportError5: reportError5,
      });
    }
  };
  handleUpdateReport = e => {
    e.preventDefault();
    if (this.state.duration && this.state.month_report && this.state.performance && this.state.expenditure_budget_type && this.state.used_cost) {
      let formData = new FormData();
      formData.append('duration', this.state.duration.toString()); //ระยะเวลาดำเนินการ หรือ สถานะผลการดำเนินงาน
      formData.append('month_report', parseInt(this.state.month_report)); //เดือนที่รายงานผล
      formData.append('send_inventory', this.state.send == true ? 1 : 0);
      formData.append('performance', this.state.performance); //ความก้าวหน้า
      formData.append('result_detail', this.state.result_detail); //ผลการดำเนินการ
      formData.append('expenditure_budget_type', this.state.expenditure_budget_type);
      formData.append('expenditure_budget_type_name', this.state.expenditure_budget_type_name);
      formData.append('used_cost', parseFloat(this.state.used_cost.replace(/,/g, ''))); //งบประมาณที่ใช้ไป
      formData.append('problem', this.state.problem); //ปัญหาและอุปสรรค
      formData.append('user_id', userID);
      formData.append('user_name', userName);
      if (this.state.isFile === 'link') {
        formData.append('document_link', this.state.link);
      }
      if (this.state.files && this.state.files.length > 0) {
              for (const file of this.state.files) {
                if (file.data) {
                  // ถ้าเป็นไฟล์ที่มีข้อมูลแบบกำหนดเอง
                  const fileObject = base64ToFile(file.data, file.filename, file.contentType);
                  formData.append('document_files', fileObject);
                } else {
                  formData.append('document_files', file); // ถ้าเป็น File จริง
                }
              }
            }
      $.ajax({
        type: 'patch',
        url: process.env.REACT_APP_SOURCE_URL + '/projectsProgress/' + this.state.progress_id,
        data: formData,
        headers: { Authorization: `Bearer ${token_id}` },
        processData: false,
        contentType: false,
        context: this,
      })
        .done(function (response) {
          MySwal.fire({
            title: <strong>แก้ไขข้อมูลรายงานผลสำเร็จ</strong>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          this.setState({
            modal2: false,
          });
          this.loadCommentsFromServer();
          this.onViewReport(this.state.ActivityId);
          this.props.onUpdateData();
        })
        .fail(function (errResponse) {
          if (errResponse.responseJSON.message.toLowerCase() === 'out of budget') {
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณกิจกรรม </br> ยอดงบประมาณกิจกรรม ${new Intl.NumberFormat().format(errResponse.responseJSON.activity_cost)}`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          } else if (errResponse.responseJSON.message.toLowerCase() === 'used cost over!') {
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณกิจกรรม </br> ยอดงบประมาณกิจกรรม ${new Intl.NumberFormat().format(errResponse.responseJSON.activity_cost)}</br> ปัจจุบันที่ใช้ไปแล้ว 
    ${new Intl.NumberFormat().format(errResponse.responseJSON.current_amount)} </br> คงเหลือใช้ได้ ${new Intl.NumberFormat().format(
                errResponse.responseJSON.activity_cost - errResponse.responseJSON.current_amount,
              )}`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          } else if (errResponse.responseJSON.message.split('\n')[1] === 'Please Check your performance!') {
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `อัตราส่วน % ความก้าวหน้าต้องไม่น้อยกว่าปัจจุบัน </br> ปัจจุบันมีความก้าวหน้า <b>${errResponse.responseJSON.performance} % </b>`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          }
        });
    } else {
      const reportError1 = this.state.month_report ? '' : 'กรุณาเลือกข้อมูล';
      const reportError2 = this.state.performance ? '' : 'กรุณาเลือกข้อมูล';
      const reportError3 = this.state.expenditure_budget_type ? '' : 'กรุณาเลือกข้อมูล';
      const reportError4 = this.state.used_cost ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const reportError5 = this.state.duration ? '' : 'กรุณาเลือกข้อมูล';
      this.setState({
        reportError1: reportError1,
        reportError2: reportError2,
        reportError3: reportError3,
        reportError4: reportError4,
        reportError5: reportError5,
      });
    }
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
    data && data.map(a => (sum = sum + parseFloat(a.activity_weight)));
    sum = parseFloat(sum.toFixed(2)); // ปัดค่าทศนิยมให้ได้ 2 ตำแหน่ง
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

  onAddReport = id => {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/projects/activities/activity/' + id).then(res => {
      const { project_id, activity_id, activity_detail, activity_report, activity_start } = res.data.result;
      const activity_report_map = activity_report.map(b => monthList.filter(a => a.no === b - 1)[0]);
      const reportYear = moment(activity_start).year() + 543 + (moment(activity_start).month() > 8 ? 1 : 0);
      this.fetchDataExpenditureBudgets(this.props.projectStart);
      this.setState({
        modal2: true,
        ID: project_id,
        isForm: '',
        header: 'รายงานผลข้อมูลกิจกรรม',
        ActivityId: activity_id,
        ActivityReport: activity_report_map,
        ActivityDetail: activity_detail,
        duration: 1, //ระยะเวลาดำเนินการ หรือ สถานะผลการดำเนินงาน
        month_report: activity_report[0], //เดือนที่รายงานผล
        performance: 100, //ความก้าวหน้า
        result_detail: '', //ผลการดำเนินการ
        expenditure_budget_type: '', //ประเภทงบประมาณ ( รายจ่าย )
        expenditure_budget_type_name: '',
        used_cost: '', //งบประมาณที่ใช้ไป
        problem: '', //ปัญหาและอุปสรรค
        counsel: '',
        problem_check: false,
        counsel_check: false,
        link: '',
        files: '',
        file: '',
        isFile: 'file',
        reportError1: '',
        reportError2: '',
        reportError3: '',
        reportError4: '',
        reportError5: '',
        send: false,
      });
    });
  };
  onEditReport = id => {
    this.setState({
      isForm: '',
      duration: 1,
      performance: 100,
      result_detail: '',
      expenditure_budget_type: '',
      expenditure_budget_type_name: '',
      used_cost: '',
      problem: '',
      counsel: '',
      problem_check: false,
      counsel_check: false,
      files: [],
      link: '',
      reportError1: '',
      reportError2: '',
      reportError3: '',
      reportError4: '',
      reportError5: '',
      send: false,
    });

    // Fetch data from API
    fetchData(`${process.env.REACT_APP_SOURCE_URL}/projectsProgress/${id}`, result => {
      const {
        progress_id,
        activity_id,
        activity_detail,
        duration,
        month_report,
        performance,
        result_detail,
        expenditure_budget_type,
        problem,
        counsel,
        used_cost,
        document_link,
        document_files,
        send_inventory,
        activity_start,
        expenditure_budget_type_name,
      } = result;
      const reportYear = moment(activity_start).year() + 543 + (moment(activity_start).month() > 8 ? 1 : 0);
      const formattedUseCost = new Intl.NumberFormat('en-US').format(used_cost);
      this.fetchDataExpenditureBudgets(this.props.projectStart);
      this.setState({
        modal2: true,
        isForm: 'edit',
        header: `แก้ไข${this.props.title}`,
        progress_id,
        ActivityId: activity_id,
        ActivityReport: monthList,
        ActivityDetail: activity_detail,
        duration,
        month_report,
        performance,
        result_detail,
        expenditure_budget_type,
        expenditure_budget_type_name,
        used_cost: formattedUseCost,
        problem_check: problem ? true : false,
        problem,
        counsel_check: counsel ? true : false,
        counsel,
        link: document_link,
        isFile: document_link ? 'link' : 'file',
        send: send_inventory === 1,
        files: document_files || [], // Ensure it's an array
      });
    });
  };
  onViewFile = id => {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/projectsProgress/' + id).then(res => {
      this.setState({
        modal3: true,
        isForm: 'edit',
        header: 'ดูไฟล์' + this.props.title,
      });
      $('#resultFile').find('div:gt(0)').remove();
      if (res.data.result.document_files && res.data.result.document_files.length > 0) {
        res.data.result.document_files.forEach(element => {
          let myFiles = `data:${element.contentType};base64,${element.data}`;
          const blob = b64toBlob(element.data, element.contentType);

          const blobUrl = URL.createObjectURL(blob);
          let markup;
          if (element.contentType == 'application/pdf') {
            markup = `<div style="width:120px">
                    <a target="_blank" href="${blobUrl}">
                    <iframe src="${blobUrl}" class='m-1' width="100px" height="100px"></iframe>
                    <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${element.filename}</label></a>
                    </div>`;
          } else if (element.contentType == 'application/msword' || element.contentType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            markup = `<div style="width:120px"><a target="_blank" href="${blobUrl}" download="${element.filename}"><img class='thumbnail' src="${process.env.PUBLIC_URL + '/word.png'}" />
                    <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${element.filename}</label></a></div>`;
          } else if (element.contentType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || element.contentType == 'application/vnd.ms-excel') {
            markup = `<div style="width:120px"><a target="_blank" href="${blobUrl}" download="${element.filename}"><img class='thumbnail' src="${process.env.PUBLIC_URL + '/excel.png'}" />
                    <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${element.filename}</label></a>
                    </div>`;
          } else if (element.contentType == 'application/vnd.ms-powerpoint' || element.contentType == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            markup = `<div style="width:120px"><a target="_blank" href="${blobUrl}" download="${element.filename}"><img class='thumbnail' src="${process.env.PUBLIC_URL + '/ppt.png'}" />
                      <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${element.filename}</label></a></div>`;
          } else {
            markup = `<div style="width:120px"><a target="_blank" href="${blobUrl}"><img class='thumbnail' src='${blobUrl}' /> <br><label class='m-1' style='word-break: break-all;cursor: pointer;'>${element.filename}</label></a></div>`;
          }
          // let markup = `<div style="width:120px"><a  target="_blank" href="${blobUrl}"><img class='thumbnail' src='${blobUrl}' /> <br><label class='m-1' style='word-break: break-all;'>${element.filename}</label></a></div>`;
          $('#resultFile').append(markup);
        });
      }
    });
  };
  onViewReport = id => {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/projects/activities/activity/' + id).then(res => {
      const { activity_id, activity_detail, activity_start, activity_finish, current_amount, activity_reported } = res.data.result;
      this.setState({
        modal1: true,
        //isForm: 'edit',
        //header: 'แก้ไข' + this.props.title,
        ActivityId: activity_id,
        ActivityDetail: activity_detail,
        ActivityStart2: activity_start,
        ActivityFinish2: activity_finish,
        current_amount: current_amount,
        activity_reported: activity_reported,
      });
    });
  };

  projectMoneyFormat = e => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e);
  };
  changeMap = e => {
    const { map_data, lat, lng } = e;
    // console.log(map_data, this.state.lat, lat, lng); // ตรวจสอบค่าก่อนที่จะอัปเดต
    this.setState(prevState => ({
      map_data: map_data !== prevState.map_data ? map_data : prevState.map_data,
      lat: lat !== prevState.lat ? lat : prevState.lat,
      lng: lng !== prevState.lng ? lng : prevState.lng,
    }));
  };
  handleInputChangeSet = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const defaultLat = 13.861721108172372; // default latitude
    const defaultLng = 100.51356196403503; // default longitude
    const defaultmap_data = 'สำนักงานเทศบาลนครนนทบุรี'; //default map_data
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
                  <th style={{ textAlign: 'center', width: '10%' }}>ค่าน้ำหนัก</th>
                  <th style={{ textAlign: 'center' }}>ความก้าวหน้าโครงการ</th>
                  <th style={{ textAlign: 'center' }}>วันเริ่มต้นโครงการ</th>
                  <th style={{ textAlign: 'center' }}>วันสิ้นสุดโครงการ</th>
                  {userPermission[0].showReportProjectData === true || userPermission[0].manageReportProjectData === true ? <th style={{ textAlign: 'center' }}>รายงานผลกิจกรรม</th> : ''}
                  {/* <th style={{ textAlign: 'center' }}>
                    ข้อมูลการรายงานผลกิจกรรม
                  </th> */}
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
                      <td style={{ textAlign: 'center' }}>{id.activity_weight}</td>
                      <td style={{ textAlign: 'center' }}>
                        <ProgressBar dataprogress={id.activity_progress} />
                      </td>
                      <td style={{ textAlign: 'center' }}>{this.thaiDate(id.activity_start)}</td>
                      <td style={{ textAlign: 'center' }}>{this.thaiDate(id.activity_finish)}</td>
                      {userPermission[0].showReportProjectData === true || userPermission[0].manageReportProjectData === true ? (
                        <td style={{ textAlign: 'center' }}>
                          {' '}
                          {userPermission[0].manageReportProjectData === true ? (
                            <Tooltip title="รายงานผล">
                              <span className="calendar-button" onClick={() => this.onAddReport(id.activity_id)}>
                                <Icon style={{ fontSize: '14px' }}>calendar_month</Icon>
                              </span>
                            </Tooltip>
                          ) : (
                            ''
                          )}
                          {/* &nbsp;
                        <Tooltip title="แก้ไขการรายงาน">
                          <span
                            className="edit-button-2"
                            onClick={() => this.onEditReport(id.activity_id)}
                          >
                            <Icon style={{ fontSize: '14px' }}>edit</Icon>
                          </span>
                        </Tooltip> */}
                          &nbsp;
                          <Tooltip title="แก้ไข">
                            <span className="edit-button-2" onClick={() => this.onEdit(id.activity_id)}>
                              <Icon style={{ fontSize: '14px' }}>edit</Icon>
                            </span>
                          </Tooltip>
                          &nbsp;
                          {userPermission[0].manageReportProjectData === true || userPermission[0].showReportProjectData === true ? (
                            <Tooltip title="ข้อมูล">
                              <span className="view-button" onClick={() => this.onViewReport(id.activity_id)}>
                                <Icon style={{ fontSize: '14px' }}>grid_view</Icon>
                              </span>
                            </Tooltip>
                          ) : (
                            ''
                          )}
                        </td>
                      ) : (
                        ''
                      )}
                      {/* <td style={{ textAlign: 'center' }}>
                       
                      </td> */}
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
              <NavLink to={`/ReportActivities/ReportDetail1/${this.state.projectId}`}>{'ข้อมูลหลัก <<'}</NavLink>
              <div className="box-10">{'หน้าก่อน'}</div>
              <div className="box-10">{'หน้าถัดไป'}</div>
              <NavLink to={`/ReportActivities/ReportDetail3/${this.state.projectId}`}>{'>> ข้อมูลชี้วัด'}</NavLink>
            </div>

            <Modal isOpen={this.state.modal} toggle={this.toggle()} className={this.props.className} size="lg">
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
                      <Input type="textarea" name="ActivityDetail" value={this.state.ActivityDetail} onChange={this.handleInputChange} />
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ข้อมูลสถานที่:
                    </Label>
                    <Col sm={12}>
                      <Input type="text" id="map_data" name="map_data" value={this.state.map_data || ''} onChange={this.handleInputChangeSet} />
                    </Col>

                    <Label for="PlanName" sm={12}>
                      ตำแหน่งที่ตั้ง:
                    </Label>
                    <Col sm={12}>
                      <Row>
                        <Col sm={2}>ละติจูด:</Col>
                        <Col sm={4}>
                          <Input type="text" name="lat" id="lat" value={this.state.lat} onChange={this.handleInputChangeSet} />
                        </Col>
                        <Col sm={2}>ลองติจูด:</Col>
                        <Col sm={4}>
                          <Input type="text" name="lng" id="lng" value={this.state.lng} onChange={this.handleInputChangeSet} />
                        </Col>
                      </Row>
                    </Col>
                    {/* <Col sm={12} style={{ alignContent: 'end' }}>
                        <button type="button" className="btn btn-info">
                          ค้นหา
                        </button>
                      </Col> */}
                    <Col sm={12} className="mt-2">
                      <SimpleMap lat={parseFloat(this.state.lat) || defaultLat} lng={parseFloat(this.state.lng) || defaultLng} place={this.state.map_data} onChangeMap={this.changeMap} />
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
                          <MuiPickersUtilsProvider utils={MomentUtils} locale={'th'}>
                            <DatePicker
                              //renderInput={params => <TextField {...params} />}
                              className="form-control"
                              format="DD/MM/YYYY"
                              pickerHeaderFormat="ddd D MMM"
                              yearOffset={543}
                              name="ActivityStart"
                              value={this.state.ActivityStart}
                              onChange={this.handleInputChangeDateStart}
                              TextFieldComponent={params => <Input {...params} />}
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
                          <MuiPickersUtilsProvider utils={MomentUtils} locale={'th'}>
                            <DatePicker
                              //renderInput={params => <TextField {...params} />}
                              className="form-control"
                              format="DD/MM/YYYY"
                              pickerHeaderFormat="ddd D MMM"
                              yearOffset={543}
                              name="ActivityFinish"
                              value={this.state.ActivityFinish}
                              onChange={this.handleInputChangeDateFinish}
                              TextFieldComponent={params => <Input {...params} />}
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
                      <Input type="number" name="ActivityWeight" step="0.01" value={this.state.ActivityWeight} onChange={this.handleInputChangeNumber} />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      <div> {this.state.validationError4}</div>
                      <div> {this.state.validationError4_1}</div>
                    </Col>
                    <Label for="PlanName" sm={12}>
                      เดือนที่รายงานผล <font color="red">* ( เลือกได้มากกว่า 1 รายการ)</font> :
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
                        selected={this.state.ActivityReport}
                        // defaultSelected={this.state.ActivityReport}
                        // value={this.state.UserType}
                        multiple
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError6}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      จํานวนเงิน <font color="red">* (ไม่เกินยอดเงินรวมของโครงการ)</font> :
                    </Label>
                    <Col sm={12}>
                      <InputGroup>
                        <Input type="text" name="ActivityCost" value={this.state.ActivityCost} onChange={this.handleInputChangeNumber} />
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
                    <Label for="Note" sm={12}>
                      หมายเหตุ :
                    </Label>
                    <Col sm={12}>
                      <textarea name="ActivityNote" className="form-control" rows={5} style={{ width: '100%' }} value={this.state.ActivityNote} onChange={this.handleInputChange}></textarea>
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

            <Modal isOpen={this.state.modal2} toggle={this.toggle2()} className={this.props.className} size="lg">
              <ModalHeader
                toggle={this.toggle2()}
                style={{
                  backgroundColor: '#e0ecfa',
                  borderTopLeftRadius: '1.5rem',
                  borderTopRightRadius: '1.5rem',
                }}
              >
                {/* {this.state.header} */}
                แบบฟอร์มรายการปฏิบัติงาน
              </ModalHeader>
              <ModalBody
                style={{
                  borderRadius: '1.5rem',
                }}
              >
                <Form onSubmit={this.handleSubmit3}>
                  <FormGroup>
                    <Row>
                      <Label for="PlanName" sm={12}>
                        <span style={{ fontWeight: '600' }}>ขั้นตอน/กิจกรรม : {this.state.ActivityDetail}</span>
                      </Label>

                      <Label for="PlanName" sm={12}>
                        เดือนที่รายงานผล <font color="red">*</font> :
                      </Label>
                      <Col sm={12}>
                        <Input type="select" name="month_report" value={this.state.month_report} onChange={this.handleInputChange} disabled={this.state.isForm === 'edit' ? true : false}>
                          {this.state.ActivityReport.map(item => (
                            <option key={'selectmonth' + item.no} value={item.no + 1}>
                              {item.name}
                            </option>
                          ))}
                        </Input>
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.reportError1}
                      </Col>
                      <Label for="PlanName" sm={12}>
                        อัตราส่วน % ความก้าวหน้า <font color="red">*</font> :
                      </Label>
                      <Col sm={12}>
                        <Input type="select" name="performance" value={this.state.performance} onChange={this.handleInputChange}>
                          {performanceOptions.map(id => (
                            <option key={id.id} value={id.id}>
                              {id.label}
                            </option>
                          ))}
                        </Input>
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.reportError2}
                      </Col>
                      <Label for="PlanName" sm={12}>
                        ยอดเงินการเบิกจ่ายงบประมาณที่ใช้ไป
                        <font color="red">* </font> :
                      </Label>
                      <Col sm={12}>
                        <InputGroup>
                          <Input type="text" name="used_cost" value={this.state.used_cost} onChange={this.handleInputChangeNumber} />
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
                        {this.state.reportError4}
                      </Col>
                      <Col sm={12}>
                        <Checkbox onChange={this.handleInputChangeSend} inputProps={{ 'aria-label': 'controlled' }} name="send" checked={this.state.send} />
                        <Label style={{ color: 'rgb(17, 153, 238)' }}>ส่งคลังแล้ว</Label>
                      </Col>
                      <Label for="PlanName" sm={12}>
                        ประเภทงบประมาณ ( รายจ่าย ) <font color="red">*</font> :
                      </Label>
                      <Col sm={12}>
                        <Input type="select" name="expenditure_budget_type" value={this.state.expenditure_budget_type} onChange={this.handleInputChange}>
                          <option value={''}>กรุณาเลือก</option>
                          {this.state.expenditureBudgets_list.map(id => (
                            <option key={id.expenditure_budget_type} value={id.expenditure_budget_type}>
                              {id.expenditure_budget_type_name}
                            </option>
                          ))}
                        </Input>
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.reportError3}
                      </Col>
                      <Label for="PlanName" sm={12}>
                        สถานะผลการดําเนินงาน <font color="red">*</font> :
                      </Label>
                      <Col sm={12}>
                        <Input type="select" name="duration" value={this.state.duration} onChange={this.handleInputChange}>
                          {durationOptions.map(id => (
                            <option key={id.id} value={id.id}>
                              {id.label}
                            </option>
                          ))}
                        </Input>
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.reportError5}
                      </Col>
                      <Col className="px-2" xs={12} md={12} item>
                        <Label for="PlanName" className="px-2" sm={5}>
                          ปัญหาและอุปสรรคในการดําเนินงาน :{' '}
                          <Checkbox onChange={this.handleInputChange} inputProps={{ 'aria-label': 'controlled' }} name="problem_check" className="pt-0 pb-1" checked={this.state.problem_check} />
                          มี{' '}
                        </Label>
                      </Col>
                      {this.state.problem_check && (
                        <Col sm={12}>
                          <Input type="textarea" name="problem" value={this.state.problem} onChange={this.handleInputChange} />
                        </Col>
                      )}

                      {/* Counsel Section */}

                      <Col className="px-2" xs={12} md={12} item>
                        <Label for="PlanName" className="px-2" sm={4}>
                          ข้อเสนอแนะ :{' '}
                          <Checkbox onChange={this.handleInputChange} inputProps={{ 'aria-label': 'controlled' }} name="counsel_check" className="pt-0 pb-1" checked={this.state.counsel_check} />
                          มี
                        </Label>
                      </Col>
                      {this.state.counsel_check && (
                        <Col sm={12}>
                          <Input type="textarea" name="counsel" value={this.state.counsel} onChange={this.handleInputChange} />
                        </Col>
                      )}
                    </Row>
                  </FormGroup>
                  {/* <Label for="PlanName" sm={12}>
                    ตู้เอกสาร :
                  </Label>
                  <Col sm={12}>
                    <Input
                      type="select"
                      name="doc1"
                      // value={this.state.duration}
                      // onChange={this.handleInputChange}
                    >
                      {doc1.map(id => (
                        <option key={id.id} value={id.id}>
                          {id.label}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Label for="PlanName" sm={12}>
                    ลิ้นชักเอกสาร :
                  </Label>
                  <Col sm={12}>
                    <Input
                      type="select"
                      name="doc2"
                      // value={this.state.duration}
                      // onChange={this.handleInputChange}
                    >
                      {doc2.map(id => (
                        <option key={id.id} value={id.id}>
                          {id.label}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Label for="PlanName" sm={12}>
                    แฟ้มเอกสาร :
                  </Label>
                  <Col sm={12}>
                    <Input
                      type="select"
                      name="doc3"
                      // value={this.state.duration}
                      // onChange={this.handleInputChange}
                    >
                      {doc3.map(id => (
                        <option key={id.id} value={id.id}>
                          {id.label}
                        </option>
                      ))}
                    </Input>
                  </Col> */}
                  {/* <Label for="PlanName" sm={12}>
                    แนบลิงค์เอกสาร :
                  </Label>
                  <Col sm={12}>
                    <Input
                      name="link"
                      type="text"
                      value={this.state.link}
                      onChange={this.handleInputChange}
                    />
                  </Col> */}
                  <Col sm={12}>
                    <Col sm={6}>
                      <Input type="radio" name="isFile" value="link" onChange={this.handleInputChangeLink} checked={this.state.isFile === 'link'} />
                      <Label>แนบลิงค์เอกสาร</Label>
                    </Col>
                    <Col sm={6}>
                      <Input type="radio" name="isFile" value="file" onChange={this.handleInputChangeLink} checked={this.state.isFile === 'file'} />
                      <Label>แนบไฟล์</Label>
                    </Col>
                  </Col>
                  {this.state.isFile === 'link' ? (
                    <>
                      <Label for="PlanName" sm={12}>
                        แนบลิงค์เอกสาร :
                      </Label>
                      <Col sm={12}>
                        <Input name="link" type="url" value={this.state.link} onChange={this.handleInputChange} pattern="https?://.+" />
                      </Col>
                    </>
                  ) : (
                    <>
                      <Label for="PlanName" sm={12}>
                        แนบไฟล์ :
                      </Label>
                      <Col sm={12}>
                        <input
                          name="file"
                          id="file"
                          type="file"
                          className="form-control"
                          style={{
                            width: '100%',
                            height: 'fit-content',
                            padding: '0',
                          }}
                          multiple
                          onChange={this.handleInputChangeFile}
                          accept="image/png, image/jpeg , image/jpg , .xlxs, .pdf, .doc, .docx, .xlsx, .xls, .ppt, .pptx"
                        />
                        <FormText>คาดหวังประเภทไฟล์ 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'jpg', 'jpeg', 'png'</FormText>
                        <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                          {this.state.reportError6}
                        </Col>
                        <div id="result" className="row m-0">
                          {this.state.files.length > 0 && this.state.files.map((file, index) => this.renderFilePreview(file, index, 1))}
                        </div>
                        {this.state.isLoading && <p>กำลังอัปโหลดไฟล์...</p>}
                      </Col>
                    </>
                  )}

                  {/* <Label for="PlanName" sm={12}>
                    แนบไฟล์ :
                  </Label>
                  <Col sm={12}>
                    <input
                      name="file"
                      type="file"
                      className="form-control"
                      style={{
                        width: '100%',
                        height: 'fit-content',
                        padding: '0',
                      }}
                    /> */}

                  {/* <FormText>
                      This is some placeholder block-level help text for the
                      above input. It‘s a bit lighter and easily wraps to a new
                      line.
                    </FormText> 
                  </Col>*/}

                  <FormGroup style={{ textAlign: 'center' }} className="mt-3">
                    <Button color="success">บันทึก</Button>&nbsp;
                    <Button color="danger" onClick={this.toggle2()}>
                      ยกเลิก
                    </Button>
                  </FormGroup>
                </Form>
              </ModalBody>
            </Modal>

            <Modal isOpen={this.state.modal1} toggle={this.toggle1()} className={this.props.className} size="xl">
              <ModalHeader
                toggle={this.toggle1()}
                style={{
                  backgroundColor: '#e0ecfa',
                  borderTopLeftRadius: '1.5rem',
                  borderTopRightRadius: '1.5rem',
                }}
              >
                {/* {this.state.header} */}
                ข้อมูลกิจกรรม
              </ModalHeader>
              <ModalBody
                style={{
                  borderRadius: '1.5rem',
                }}
              >
                <Form>
                  <FormGroup>
                    <Label for="PlanName" sm={12}>
                      ข้อมูลขั้นตอน/กิจกรรม :
                    </Label>
                    <Col sm={12}>
                      <Input type="textarea" name="ActivityDetail" disabled value={this.state.ActivityDetail} />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ระยะเวลา :
                    </Label>
                    <Col sm={12}>
                      <Row>
                        <Col sm={2}>เริ่มต้น:</Col>
                        <Col sm={4}>
                          <Input type="text" name="ActivityStart" disabled value={this.thaiDate(this.state.ActivityStart2)} />
                        </Col>
                        <Col sm={2}>สิ้นสุด:</Col>
                        <Col sm={4}>
                          <Input type="text" name="ActivityFinish" disabled value={this.thaiDate(this.state.ActivityFinish2)} />
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
                              <th style={{ textAlign: 'left' }}>เดือนที่รายงานผล</th>
                              <th style={{ textAlign: 'center' }}>ผลการรายงาน</th>
                              <th style={{ textAlign: 'center' }}>% ความก้าวหน้า</th>
                              <th style={{ textAlign: 'center' }}>ประเภทงบประมาณ</th>
                              <th style={{ textAlign: 'center' }}>การเบิกจ่ายงบประมาณ</th>
                              <th style={{ textAlign: 'center' }}>สถานะผลการดำเนินงาน</th>
                              <th style={{ textAlign: 'center' }}>วันที่บันทึกผล</th>

                              <th style={{ textAlign: 'center' }}>ปัญหาและอุปสรรค</th>
                              <th style={{ textAlign: 'center' }}>ลิงค์เอกสาร</th>
                              {userPermission[0].manageReportProjectData === true ? (
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
                            {this.state.activity_reported.length == 0 ? (
                              <tr>
                                <td colSpan="8" align="center">
                                  ยังไม่มีการรายงาน
                                </td>
                              </tr>
                            ) : (
                              this.state.activity_reported.map((id, i) => (
                                <tr key={id._id}>
                                  <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                  <td style={{ textAlign: 'left' }}>
                                    {/* {id.month_report} */}
                                    {monthList.filter(a => a.no === id.month_report - 1)[0].name}
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
                                  <td style={{ textAlign: 'center' }}>{id.performance}%</td>
                                  <td style={{ textAlign: 'center' }}>{id.expenditure_budget_type_name}</td>
                                  <td style={{ textAlign: 'center' }}>{this.projectMoneyFormat(id.used_cost)}</td>
                                  <td style={{ textAlign: 'center' }}>{durationOptions.filter(a => a.id === id.duration)[0].label}</td>
                                  <td style={{ textAlign: 'center' }}>{this.thaiDate(id.create_date)}</td>
                                  <td style={{ textAlign: 'center' }}>{id.problem === '' ? '-' : id.problem}</td>
                                  <td style={{ textAlign: 'center' }}>
                                    {id.document_link && id.document_link.trim() !== '' ? (
                                      <Tooltip title="เปิดลิงค์เอกสาร">
                                        <a href={id.document_link} target="_blank">
                                          <span className="view-button">
                                            {/* <AiOutlineLink fontSize={'14px'} /> */}
                                            <Icon style={{ fontSize: '14px' }}>link</Icon>
                                          </span>
                                        </a>
                                      </Tooltip>
                                    ) : id.document_files && id.document_files.length > 0 ? (
                                      <Tooltip title="เปิดไฟล์เอกสาร">
                                        <a onClick={() => this.onViewFile(id.progress_id)}>
                                          <span className="view-button">
                                            {/* <AiOutlineLink fontSize={'14px'} /> */}
                                            <Icon style={{ fontSize: '14px' }}>link</Icon>
                                          </span>
                                        </a>
                                      </Tooltip>
                                    ) : (
                                      <Tooltip title="ไม่มีลิงค์เอกสาร">
                                        <span className="disabled-button">
                                          {/* <AiOutlineLink fontSize={'14px'} /> */}
                                          <Icon style={{ fontSize: '14px' }}>link</Icon>
                                        </span>
                                      </Tooltip>
                                    )}
                                  </td>
                                  {userPermission[0].manageReportProjectData === true ? (
                                    <td style={{ textAlign: 'center' }}>
                                      <Tooltip title="แก้ไขการรายงาน">
                                        <span className="edit-button-2" onClick={() => this.onEditReport(id.progress_id)}>
                                          <Icon style={{ fontSize: '14px' }}>edit</Icon>
                                        </span>
                                      </Tooltip>
                                      &nbsp;
                                      <Tooltip title="ลบรายงานผล">
                                        <span className="delete-button" onClick={() => this.testAxiosDELETE2(id.progress_id)}>
                                          <Icon style={{ fontSize: '14px' }}>delete_outline</Icon>
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
                    <Label for="PlanName" sm={12}>
                      ยอดเงินการเบิกจ่ายรวม :
                    </Label>
                    <Col sm={12}>
                      <InputGroup>
                        <Input type="text" name="current_amount" disabled value={this.projectMoneyFormat(this.state.current_amount)} />
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
                  </FormGroup>
                  <FormGroup style={{ textAlign: 'center' }}>
                    {/* <Button color="success">บันทึก</Button>&nbsp; */}
                    <Button color="danger" onClick={this.toggle1()}>
                      ปิด
                    </Button>
                  </FormGroup>
                </Form>
              </ModalBody>
              {/* <ModalFooter /> */}
            </Modal>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal3} toggle={this.toggle3()} className={this.props.className} size="lg">
          <ModalHeader
            toggle={this.toggle3()}
            style={{
              backgroundColor: '#e0ecfa',
              borderTopLeftRadius: '1.5rem',
              borderTopRightRadius: '1.5rem',
            }}
          >
            {/* {this.state.header} */}
            แบบฟอร์มรายการปฏิบัติงาน
          </ModalHeader>
          <ModalBody
            style={{
              borderRadius: '1.5rem',
            }}
          >
            <Form name="form2" id="form2">
              <FormGroup>
                <Label for="PlanName" sm={12}>
                  ไฟล์เอกสาร :
                </Label>
                <Col sm={12}>
                  <div id="resultFile" className="row m-0">
                    {this.state.files.length > 0 && this.state.files.map((file, index) => this.renderFilePreview(file, index, 2))}
                  </div>
                </Col>
              </FormGroup>
              <FormGroup style={{ textAlign: 'center' }} className="mt-3">
                <Button color="danger" onClick={this.toggle3()}>
                  ปิด
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
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
