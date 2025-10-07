import React,{useRef} from 'react';
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
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
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
import { color, height } from '@mui/system';
// import SimpleMap from './googlemap';
// import MapContainer from './markerMap';
import Google from '../GoogleMap';


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

const performanceOptions = [
  { id: 100, label: '100%' },
  { id: 90, label: '90%' },
  { id: 80, label: '80%' },
  { id: 70, label: '70%' },
  { id: 60, label: '60%' },
  { id: 50, label: '50%' },
  { id: 40, label: '40%' },
  { id: 30, label: '30%' },
  { id: 20, label: '20%' },
  { id: 10, label: '10%' },
];
const durationOptions = [
  {
    id: '1',
    label: 'ตรงตามเวลาที่กำหนด',
  },
  { id: '2', label: 'ช้ากว่าที่กำหนด' },
  {
    id: '3',
    label: 'เร็วกว่าที่กำหนด',
  },
];
const doc1 = [
  {
    id: '1',
    label: 'กรุณาเลือก',
  },
];
const doc2 = [
  {
    id: '1',
    label: 'กรุณาเลือก',
  },
];
const doc3 = [
  {
    id: '1',
    label: 'กรุณาเลือก',
  },
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
function base64ToBlob({ base64, type = 'application/octet-stream' }) {
  const binStr = atob(base64);
  const len = binStr.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr], { type: type });
}
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export default class EditProjectActivityData extends React.Component {
  constructor(props) {
    super(props);
    // this.handler = this.handler.bind(this);
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
      // url_upload: process.env.REACT_APP_SOURCE_URL_UPLOAD,
      projectId: id,
      ActivityId: '',
      ActivityDetail: '',
      ActivityWeight: '',
      ActivityWeight2: '',
      ActivityStart: new Date(),
      ActivityFinish: new Date(),
      ActivityStart2: new Date(),
      ActivityFinish2: new Date(),
      ActivityCost: '',
      ActivityReport: [],
      ActivityStatus: '',
      ActivityNote:'',
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
      dataMap: [],
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
        icon: 'warning',
        confirmButtonColor: '#66BB66',
        confirmButtonText: 'ยืนยัน',
        showCancelButton: true,
        cancelButtonColor: '#EE4444',
        cancelButtonText: 'ยกเลิก',
      }).then(result => {
        if (result.isConfirmed) {
          this.DELETE(id);
        }
      });
    } else {
      MySwal.fire({
        title: <strong>ไม่พบ Activity ID</strong>,
        html: <i>กรุณาลองใหม่อีกครั้ง</i>,
        icon: 'error',
        confirmButtonColor: '#66BB66',
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
        id,
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        this.loadCommentsFromServer();
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch(err => {
        console.log(err);
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
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        this.loadCommentsFromServer();
        this.onViewReport(this.state.ActivityId);
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
      ActivityNote:'',
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
          map_position,
          map_data,
          activity_note
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
          location: map_data,
          lat: map_position ? map_position.latitude : '',
          lng: map_position ? map_position.longitude : '',
          ActivityNote:activity_note,
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
      ActivityNote:'',
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
        latitude: this.state.lat.toString(),
        longitude: this.state.lng.toString(),
      };
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL +
          '/projects/activities/' +
          this.state.projectId,
          {
            //project_id: this.state.projectId,
            //activity_detail:this.state.ActivityId,
            activity_detail: this.state.ActivityDetail,
            map_data: this.state.location,
            map_position,
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
            activity_note:this.state.ActivityNote
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
      const map_position = {
        latitude: this.state.lat.toString(),
        longitude: this.state.lng.toString(),
      };
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/projects/activities/' + ID,
          {
            //project_id: this.state.projectId,
            //activity_detail:this.state.ActivityId,
            activity_detail: this.state.ActivityDetail,
            map_data: this.state.location,
            map_position,
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
            activity_note:this.state.ActivityNote
            //activity_detail:this.state.ActivityStatus,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
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
    this.toggle1();
    this.toggle2();
    this.toggle3();
    this.loadCommentsFromServer();
    // this.fetchDatarExpenditureBudgets();
  }
  // componentDidUpdate(prevProps, prevState) {
  //   console.log(prevProps,prevState)
  // }
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
    if (e.target.name == 'expenditure_budget_type') {
      let index = e.nativeEvent.target.selectedIndex;
      let label = e.nativeEvent.target[index].text;
      let value = e.target.value;
      const typename = e.target.name + '_name';
      this.setState({
        [e.target.name]: value,
        expenditure_budget_type_name: label,
      });
    } else if (e.target.name == 'lat' || e.target.name == 'lng') {
      this.setState({
        [e.target.name]: e.target.value,
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
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
        link: '',
      });
    }
  };
  handleInputChangeSend = e => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
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
      if (e.target.name === 'ActivityWeight') {
        if (parseInt(e.target.value) > 100) {
          value = this.state.ActivityWeight;
          this.setState({
            validationError4: 'ห้ามกรอกค่าเกิน 100',
          });
        } else {
          value = e.target.value;
          this.setState({
            validationError4: '',
          });
        }
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

  handleInputChangeFile = e => {
    $('#result').find('div:gt(0)').remove();
    let isFilesReady = true;
    const files = e.target.files;
    let checking = 0;
    let text;
    const maxFileSize = 104857600; // 4MB
    const acceptType = [
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
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const url = window.URL.createObjectURL(file);
      if (file.size < maxFileSize && acceptType.includes(file.type)) {
        let markup;
        if (file.type == 'application/pdf') {
          markup = `<div style="width:120px">
                    <a target="_blank" href="${url}">
                    <iframe src="${url}" class='m-1' width="100px" height="100px"></iframe>
                    <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${file.name}</label></a>
                    </div>`;
        } else if (
          file.type == 'application/msword' ||
          file.type ==
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          markup = `<div style="width:120px"><a target="_blank" href="${url}" download="${file.name
            }"><img class='thumbnail' src="${process.env.PUBLIC_URL + '/word.png'
            }" />
                    <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${file.name
            }</label></a></div>`;
        } else if (
          file.type ==
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type == 'application/vnd.ms-excel'
        ) {
          markup = `<div style="width:120px"><a target="_blank" href="${url}" download="${file.name
            }"><img class='thumbnail' src="${process.env.PUBLIC_URL + '/excel.png'
            }" />
                    <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${file.name
            }</label></a>
                    </div>`;
        } else if (
          file.type == 'application/vnd.ms-powerpoint' ||
          file.type ==
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ) {
          markup = `<div style="width:120px"><a target="_blank" href="${url}" download="${file.name
            }"><img class='thumbnail' src="${process.env.PUBLIC_URL + '/ppt.png'
            }" />
                      <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${file.name
            }</label></a></div>`;
        } else {
          markup = `<div style="width:120px"><a target="_blank" href="${url}"><img class='thumbnail' src='${url}' /> <br><label class='m-1' style='word-break: break-all;cursor: pointer;'>${file.name}</label></a></div>`;
        }
        $('#result').append(markup);
      } else {
        checking = checking + 1;
        if (maxFileSize < file.size) {
          text = 'ขนาดไฟล์ใหญ่เกินไป';
        } else {
          text = `ประเภทไฟล์อัปโหลดไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง <br />
                'pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'jpg', 'jpeg',
                'png'`;
        }
      }
    }
    if (checking > 0) {
      $('#file').val('');
      $('#result').find('div:gt(0)').remove();
      Swal.fire({
        icon: 'error',
        title: '<strong>อัปโหลดไฟล์ไม่สำเร็จ</strong>',
        text: text,
        timer: 2500,
        showConfirmButton: false,
      });
      this.setState({
        file: '',
        files: '',
      });
    } else {
      this.setState({
        link: '',
        files: files,
      });
    }
  };

  uploadFile = e => {
    const extension = this.state.file.name.split('.').pop();
    const allowedExtensions = [
      'pdf',
      'doc',
      'docx',
      'xlsx',
      'xls',
      'ppt',
      'pptx',
      'jpg',
      'jpeg',
      'png',
    ];
    if (
      this.state.duration &&
      this.state.month_report &&
      this.state.performance &&
      this.state.expenditure_budget_type &&
      this.state.used_cost
    ) {
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
                    'pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'jpg',
                    'jpeg', 'png'
                  </i>
                ),
                icon: 'error',
                timer: 2500,
                showConfirmButton: false,
              });
            } else if (
              res.data.message === 'A file with the same name already exists'
            ) {
              MySwal.fire({
                title: <strong>อัปโหลดไฟล์ไม่สำเร็จ</strong>,
                html: <i>ชื่อไฟล์นี้มีแล้ว กรุณาเปลี่ยนชื่อไฟล์</i>,
                icon: 'error',
                timer: 2500,
                showConfirmButton: false,
              });
            } else if (
              res.data.message === 'File size exceeds the maximum limit (2MB)'
            ) {
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
        MySwal.fire({
          title: <strong>อัปโหลดไฟล์ไม่สำเร็จ</strong>,
          html: (
            <i>
              ประเภทไฟล์อัปโหลดไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง <br />
              'pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'jpg', 'jpeg',
              'png'
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
      const reportError3 = this.state.expenditure_budget_type
        ? ''
        : 'กรุณาเลือกข้อมูล';
      const reportError4 = this.state.used_cost
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
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

  fetchDatarExpenditureBudgets(e) {
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
      this.handleUpdateReport(e);
    } else {
      this.handleSubmitAddReport(e);
    }
  };

  handleSubmitAddReport = e => {
    e.preventDefault();
    if (
      this.state.duration &&
      this.state.month_report &&
      this.state.performance &&
      this.state.expenditure_budget_type &&
      this.state.used_cost
    ) {
      let formData = new FormData();
      formData.append('duration', this.state.duration.toString()); //ระยะเวลาดำเนินการ หรือ สถานะผลการดำเนินงาน
      formData.append('month_report', parseInt(this.state.month_report)); //เดือนที่รายงานผล
      formData.append('send_inventory', this.state.send == true ? 1 : 0);
      formData.append('performance', this.state.performance); //ความก้าวหน้า
      formData.append('result_detail', this.state.result_detail); //ผลการดำเนินการ
      formData.append(
        'expenditure_budget_type',
        this.state.expenditure_budget_type,
      ); //ประเภทงบประมาณ ( รายจ่าย )
      formData.append(
        'expenditure_budget_type_name',
        this.state.expenditure_budget_type_name,
      );
      formData.append('used_cost', parseInt(this.state.used_cost)); //งบประมาณที่ใช้ไป
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
        formData.append('document_files', '');
      }
      $.ajax({
        type: 'POST',
        url:
          process.env.REACT_APP_SOURCE_URL +
          '/projectsProgress/' +
          this.state.ActivityId,
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
          this.setState({
            modal2: false,
          });
        })
        .fail(function (errResponse) {
          if (
            errResponse.responseJSON.message.split(' \n')[0] ==
            'activity progress is 100!'
          ) {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `อัตราส่วน % ความก้าวหน้า ${new Intl.NumberFormat().format(
                errResponse.responseJSON.performance,
              )} % แล้ว`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          } else if (
            errResponse.responseJSON.message.toLowerCase() === 'out of budget'
          ) {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณกิจกรรม </br> ยอดงบประมาณกิจกรรม ${new Intl.NumberFormat().format(
                errResponse.responseJSON.activity_cost,
              )}`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          } else if (
            errResponse.responseJSON.message.toLowerCase() === 'used cost over!'
          ) {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณกิจกรรม </br> ยอดงบประมาณกิจกรรม ${new Intl.NumberFormat().format(
                errResponse.responseJSON.activity_cost,
              )}`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          } else if (
            errResponse.responseJSON.message.split('\n')[1] ===
            'Please Check your performance!'
          ) {
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
        })
        .always(function (ee) {
          console.log(ee);
        });
    } else {
      const reportError1 = this.state.month_report ? '' : 'กรุณาเลือกข้อมูล';
      const reportError2 = this.state.performance ? '' : 'กรุณาเลือกข้อมูล';
      const reportError3 = this.state.expenditure_budget_type
        ? ''
        : 'กรุณาเลือกข้อมูล';
      const reportError4 = this.state.used_cost
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
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
    if (
      this.state.duration &&
      this.state.month_report &&
      this.state.performance &&
      this.state.expenditure_budget_type &&
      this.state.used_cost
    ) {
      let formData = new FormData();
      formData.append('duration', this.state.duration.toString()); //ระยะเวลาดำเนินการ หรือ สถานะผลการดำเนินงาน
      formData.append('month_report', parseInt(this.state.month_report)); //เดือนที่รายงานผล
      formData.append('send_inventory', this.state.send == true ? 1 : 0);
      formData.append('performance', this.state.performance); //ความก้าวหน้า
      formData.append('result_detail', this.state.result_detail); //ผลการดำเนินการ
      formData.append(
        'expenditure_budget_type',
        this.state.expenditure_budget_type,
      ); //ประเภทงบประมาณ ( รายจ่าย )
      formData.append(
        'expenditure_budget_type_name',
        this.state.expenditure_budget_type_name,
      );
      formData.append('used_cost', parseInt(this.state.used_cost)); //งบประมาณที่ใช้ไป
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
        // formData.append('document_files', files);
      }
      $.ajax({
        type: 'patch',
        url:
          process.env.REACT_APP_SOURCE_URL +
          '/projectsProgress/' +
          this.state.progress_id,
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
        })
        .fail(function (errResponse) {
          if (
            errResponse.responseJSON.message.split(' \n')[0] ==
            'activity progress is 100!'
          ) {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `อัตราส่วน % ความก้าวหน้า ${new Intl.NumberFormat().format(
                errResponse.responseJSON.performance,
              )} % แล้ว`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          } else if (
            errResponse.responseJSON.message.toLowerCase() === 'out of budget'
          ) {
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณกิจกรรม </br> ยอดงบประมาณกิจกรรม ${new Intl.NumberFormat().format(
                errResponse.responseJSON.activity_cost,
              )}`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          } else if (
            errResponse.responseJSON.message.toLowerCase() === 'used cost over!'
          ) {
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลรายงานผลไม่สำเร็จ</strong>,
              html: `จำนวนเงินเกินงบประมาณกิจกรรม </br> ยอดงบประมาณกิจกรรม ${new Intl.NumberFormat().format(
                errResponse.responseJSON.activity_cost,
              )}`,
              icon: 'error',
              timer: 2500,
              showConfirmButton: false,
            });
          } else if (
            errResponse.responseJSON.message.split('\n')[1] ===
            'Please Check your performance!'
          ) {
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
      const reportError3 = this.state.expenditure_budget_type
        ? ''
        : 'กรุณาเลือกข้อมูล';
      const reportError4 = this.state.used_cost
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
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
    });
  };

  handleMultiSelectChange(e) {
    const selected = e.map(data => {
      return {
        no: data.no,
        name: data.name,
      };
    });
    this.setState({ ActivityReport: [] });
    this.setState(prevState => ({
      ActivityReport: prevState.ActivityReport.concat(selected),
    }));
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

  onAddReport = id => {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
        '/projects/activities/activity/' +
        id,
      )
      .then(res => {
        const { project_id, activity_id, activity_detail, activity_report } =
          res.data.result;

        const activity_report_map = activity_report.map(
          b => monthList.filter(a => a.no === b - 1)[0],
        );

        let reportYear = moment(res.data.result.activity_finish).year() + 543;
        const month = moment(res.data.result.activity_finish).month();
        if (month > 8) {
          reportYear = reportYear + 1;
        }
        this.fetchDatarExpenditureBudgets(reportYear);
        this.setState({
          modal2: true,
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
          link: '',
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
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/projectsProgress/' + id)
      .then(res => {
        const {
          _id,
          progress_id,
          activity_id,
          activity_detail,
          duration,
          month_report,
          performance,
          result_detail,
          expenditure_budget_type,
          problem,
          used_cost,
          document_link,
          document_files,
          send_inventory,
        } = res.data.result;

        this.setState({
          modal2: true,
          isForm: 'edit',
          header: 'แก้ไข' + this.props.title,
          progress_id: progress_id,
          ActivityId: activity_id,
          ActivityReport: monthList,
          ActivityDetail: activity_detail,
          duration: duration, //ระยะเวลาดำเนินการ หรือ สถานะผลการดำเนินงาน
          month_report: month_report, //เดือนที่รายงานผล
          performance: performance, //ความก้าวหน้า
          result_detail: result_detail, //ผลการดำเนินการ
          expenditure_budget_type: expenditure_budget_type, //ประเภทงบประมาณ ( รายจ่าย )
          used_cost: used_cost, //งบประมาณที่ใช้ไป
          problem: problem, //ปัญหาและอุปสรรค
          link: document_link,
          isFile: document_link ? 'link' : 'file',
          send: send_inventory != 1 ? false : true,
        });
        let reportYear = moment(res.data.result.activity_finish).year() + 543;
        const month = moment(res.data.result.activity_finish).month();
        if (month > 8) {
          reportYear = reportYear + 1;
        }
        this.fetchDatarExpenditureBudgets(reportYear);
        $('#result').find('div:gt(0)').remove();
        if (
          res.data.result.document_files &&
          res.data.result.document_files.length > 0
        ) {
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
            } else if (
              element.contentType == 'application/msword' ||
              element.contentType ==
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
              markup = `<div style="width:120px"><a target="_blank" href="${blobUrl}" download="${element.filename
                }"><img class='thumbnail' src="${process.env.PUBLIC_URL + '/word.png'
                }" />
                    <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${element.filename
                }</label></a></div>`;
            } else if (
              element.contentType ==
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
              element.contentType == 'application/vnd.ms-excel'
            ) {
              markup = `<div style="width:120px"><a target="_blank" href="${blobUrl}" download="${element.filename
                }"><img class='thumbnail' src="${process.env.PUBLIC_URL + '/excel.png'
                }" />
                    <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${element.filename
                }</label></a>
                    </div>`;
            } else if (
              element.contentType == 'application/vnd.ms-powerpoint' ||
              element.contentType ==
              'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ) {
              markup = `<div style="width:120px"><a target="_blank" href="${blobUrl}" download="${element.filename
                }"><img class='thumbnail' src="${process.env.PUBLIC_URL + '/ppt.png'
                }" />
                      <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${element.filename
                }</label></a></div>`;
            } else {
              markup = `<div style="width:120px"><a target="_blank" href="${blobUrl}"><img class='thumbnail' src='${blobUrl}' /> <br><label class='m-1' style='word-break: break-all;cursor: pointer;'>${element.filename}</label></a></div>`;
            }
            $('#result').append(markup);
          });
        }
      });
  };
  onViewFile = id => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/projectsProgress/' + id)
      .then(res => {
        this.setState({
          modal3: true,
          isForm: 'edit',
          header: 'ดูไฟล์' + this.props.title,
        });
        $('#resultFile').find('div:gt(0)').remove();
        if (
          res.data.result.document_files &&
          res.data.result.document_files.length > 0
        ) {
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
            } else if (
              element.contentType == 'application/msword' ||
              element.contentType ==
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
              markup = `<div style="width:120px"><a target="_blank" href="${blobUrl}" download="${element.filename
                }"><img class='thumbnail' src="${process.env.PUBLIC_URL + '/word.png'
                }" />
                    <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${element.filename
                }</label></a></div>`;
            } else if (
              element.contentType ==
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
              element.contentType == 'application/vnd.ms-excel'
            ) {
              markup = `<div style="width:120px"><a target="_blank" href="${blobUrl}" download="${element.filename
                }"><img class='thumbnail' src="${process.env.PUBLIC_URL + '/excel.png'
                }" />
                    <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${element.filename
                }</label></a>
                    </div>`;
            } else if (
              element.contentType == 'application/vnd.ms-powerpoint' ||
              element.contentType ==
              'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ) {
              markup = `<div style="width:120px"><a target="_blank" href="${blobUrl}" download="${element.filename
                }"><img class='thumbnail' src="${process.env.PUBLIC_URL + '/ppt.png'
                }" />
                      <br><label class='m-1' style='word-break: break-all; cursor: pointer;'>${element.filename
                }</label></a></div>`;
            } else {
              markup = `<div style="width:120px"><a target="_blank" href="${blobUrl}"><img class='thumbnail' src='${blobUrl}' /> <br><label class='m-1' style='word-break: break-all;cursor: pointer;'>${element.filename}</label></a></div>`;
            }
            $('#resultFile').append(markup);
          });
        }
      });
  };
  onViewReport = id => {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
        '/projects/activities/activity/' +
        id,
      )
      .then(res => {
        const {
          activity_id,
          activity_detail,
          activity_start,
          activity_finish,
          current_amount,
          activity_reported,
        } = res.data.result;

        this.setState({
          modal1: true,
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
  changeMap=e=>{
    if(e.location!==this.state.location){
      this.setState({
          location: e.location,
        })
    }
    if(e.lat!==this.state.lat){
      this.setState({
          lat: e.lat,
        })
    }
    if(e.lng!==this.state.lng){
      this.setState({
          lng: e.lng,
        })
    }
  }
  render() {
    return (
      <>
        <Row>
          <Col sm={12}>
            <div className="box-9">ข้อมูลกิจกรรม</div>
          </Col>
          <Col>
            <Table responsive borderless id="table1">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  <th style={{ textAlign: 'left' }}>ขั้นตอน/กิจกรรม</th>
                  <th style={{ textAlign: 'center' }}>ความก้าวหน้าโครงการ</th>
                  <th style={{ textAlign: 'center' }}>วันเริ่มต้นโครงการ</th>
                  <th style={{ textAlign: 'center' }}>วันสิ้นสุดโครงการ</th>
                  {userPermission[0].showReportProjectData === true ||
                    userPermission[0].manageReportProjectData === true ? (
                    <th style={{ textAlign: 'center' }}>รายงานผลกิจกรรม</th>
                  ) : (
                    ''
                  )}
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
                      {userPermission[0].showReportProjectData === true ||
                        userPermission[0].manageReportProjectData === true ? (
                        <td style={{ textAlign: 'center' }}>
                          {' '}
                          {userPermission[0].manageReportProjectData ===
                            true ? (
                            <Tooltip title="รายงานผล">
                              <span
                                className="calendar-button"
                                onClick={() => this.onAddReport(id.activity_id)}
                              >
                                <Icon style={{ fontSize: '14px' }}>
                                  calendar_month
                                </Icon>
                              </span>
                            </Tooltip>
                          ) : (
                            ''
                          )}
                          &nbsp;
                          {userPermission[0].manageReportProjectData === true ||
                            userPermission[0].showReportProjectData === true ? (
                            <Tooltip title="ข้อมูล">
                              <span
                                className="view-button"
                                onClick={() =>
                                  this.onViewReport(id.activity_id)
                                }
                              >
                                <Icon style={{ fontSize: '14px' }}>
                                  grid_view
                                </Icon>
                              </span>
                            </Tooltip>
                          ) : (
                            ''
                          )}
                        </td>
                      ) : (
                        ''
                      )}
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <div style={{ display: 'flex', justifyContent: 'right' }}>
              <NavLink to={`/AllProject/EditProject1/${this.state.projectId}`}>
                {'ข้อมูลหลัก <<'}
              </NavLink>
              <div className="box-10">{'หน้าก่อน'}</div>
              <div className="box-10">{'หน้าถัดไป'}</div>
              <NavLink to={`/AllProject/EditProject3/${this.state.projectId}`}>
                {'>> ข้อมูลชี้วัด'}
              </NavLink>
            </div>

            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle()}
              className={this.props.className}
              size="lg"
              id="modalAddActivity"
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
                      ข้อมูลสถานที่ :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="text"
                        id="location"
                        name="location"
                        onChange={this.handleInputChange}
                        value={this.state.location}
                      />
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ตำแหน่งที่ตั้ง :
                    </Label>
                    <Col sm={12}>
                      <Row>
                        {' '}
                        <Col sm={2}>ละติจูด :</Col>
                        <Col sm={4}>
                          <Input
                            type="text"
                            name="lat"
                            id="lat"
                            onChange={this.handleInputChange}
                            value={this.state.lat}
                          />
                        </Col>
                        <Col sm={2}>ลองติจูด :</Col>
                        <Col sm={4}>
                          <Input
                            type="text"
                            name="lng"
                            id="lng"
                            onChange={this.handleInputChange}
                            value={this.state.lng}
                          />
                        </Col>
                      </Row>
                      </Col>
                      <Col sm={12} className="mt-2">
                        <Google
                          lat={this.state.lat}
                          lng={this.state.lng}
                          place={this.state.location}
                          onChangeMap={this.changeMap}
                        />
                      </Col>
                    <Label for="PlanName" sm={12}>
                      ระยะเวลา <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Row>
                        <Col sm={2}>เริ่มต้น:</Col>
                        <Col sm={4}>
                          <MuiPickersUtilsProvider
                            utils={MomentUtils}
                            locale={'th'}
                          >
                            <DatePicker
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
                          <MuiPickersUtilsProvider
                            utils={MomentUtils}
                            locale={'th'}
                          >
                            <DatePicker
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
                      <Typeahead
                        clearButton
                        labelKey="name"
                        id="ActivityReport"
                        name="ActivityReport"
                        options={monthList}
                        onChange={e => this.handleMultiSelectChange(e)}
                        selected={this.state.ActivityReport}
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
                    <Label for="Note" sm={12}>
                    หมายเหตุ :
                    </Label>
                    <Col sm={12}>                   
                        <textarea name="ActivityNote" class='form-control' onChange={this.handleInputChange} rows={5} style={{width:'100%'}} value={this.state.ActivityNote}></textarea>
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
              size="lg"
              id="modalReportActivity"
            >
              <ModalHeader
                toggle={this.toggle2()}
                style={{
                  backgroundColor: '#e0ecfa',
                  borderTopLeftRadius: '1.5rem',
                  borderTopRightRadius: '1.5rem',
                }}
              >
                แบบฟอร์มรายการปฏิบัติงาน
              </ModalHeader>
              <ModalBody
                style={{
                  borderRadius: '1.5rem',
                }}
              >
                <Form
                  onSubmit={this.handleSubmit3}
                  enctype="multipart/form-data"
                  method="post"
                  name="form1"
                  id="form1"
                >
                  <FormGroup>
                    <Label for="PlanName" sm={12}>
                      <span style={{ fontWeight: '600' }}>
                        ขั้นตอน/กิจกรรม : {this.state.ActivityDetail}
                      </span>
                    </Label>

                    <Label for="PlanName" sm={12}>
                      เดือนที่รายงานผล <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="select"
                        name="month_report"
                        value={this.state.month_report}
                        onChange={this.handleInputChange}
                        disabled={this.state.isForm === 'edit' ? true : false}
                      >
                        {this.state.ActivityReport.map(item => (
                          <option
                            key={'selectmonth' + item.no}
                            value={item.no + 1}
                          >
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
                      <Input
                        type="select"
                        name="performance"
                        value={this.state.performance}
                        onChange={this.handleInputChange}
                      >
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
                        <Input
                          type="number"
                          name="used_cost"
                          value={this.state.used_cost}
                          onChange={this.handleInputChangeNumber}
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
                      {this.state.reportError4}
                    </Col>
                    <Col sm={12}>
                      <Checkbox
                        onChange={this.handleInputChangeSend}
                        inputProps={{ 'aria-label': 'controlled' }}
                        name="send"
                        checked={this.state.send}
                      />
                      <Label style={{ color: 'rgb(17, 153, 238)' }}>
                        ส่งคลังแล้ว
                      </Label>
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ประเภทงบประมาณ ( รายจ่าย ) <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="select"
                        name="expenditure_budget_type"
                        value={this.state.expenditure_budget_type}
                        onChange={this.handleInputChange}
                      >
                        <option value={''}>กรุณาเลือก</option>
                        {this.state.expenditureBudgets_list.map(id => (
                          <option
                            key={id.expenditure_budget_type}
                            value={id.expenditure_budget_type}
                          >
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
                      <Input
                        type="select"
                        name="duration"
                        value={this.state.duration}
                        onChange={this.handleInputChange}
                      >
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
                    <Label for="PlanName" sm={12}>
                      หมายเหตุ/ปัญหาและอุปสรรคในการดําเนินงาน :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="textarea"
                        name="problem"
                        value={this.state.problem}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                  </FormGroup>
                  <FormControl className="ml-3">
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="isFile"
                    >
                      <FormControlLabel
                        value="link"
                        control={<Radio />}
                        label="แนบลิงค์เอกสาร"
                        checked={this.state.isFile === 'link'}
                        onChange={this.handleInputChangeLink}
                      />
                      <FormControlLabel
                        value="file"
                        control={<Radio />}
                        label="แนบไฟล์"
                        checked={this.state.isFile === 'file'}
                        onChange={this.handleInputChangeLink}
                      />
                    </RadioGroup>
                  </FormControl>
                  {this.state.isFile === 'link' ? (
                    <>
                      <Label for="PlanName" sm={12}>
                        แนบลิงค์เอกสาร :
                      </Label>
                      <Col sm={12}>
                        <Input
                          name="link"
                          type="url"
                          value={this.state.link}
                          onChange={this.handleInputChange}
                          pattern="https?://.+"
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.reportError6}
                      </Col>
                    </>
                  ) : (
                    <>
                      <Label for="PlanName" sm={12}>
                        แนบไฟล์ :{' '}
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
                        <FormText>
                          คาดหวังประเภทไฟล์ 'pdf', 'doc', 'docx', 'xlsx', 'xls',
                          'ppt', 'pptx', 'jpg', 'jpeg', 'png' ( ขนาด 100 MB )
                        </FormText>
                        <div id="result" className="row m-0">
                          <div></div>
                        </div>
                      </Col>
                    </>
                  )}
                  <FormGroup style={{ textAlign: 'center' }} className="mt-3">
                    <Button color="success">บันทึก</Button>&nbsp;
                    <Button color="danger" onClick={this.toggle2()}>
                      ยกเลิก
                    </Button>
                  </FormGroup>
                </Form>
              </ModalBody>
            </Modal>
            <Modal
              isOpen={this.state.modal1}
              toggle={this.toggle1()}
              className={this.props.className}
              size="xl"
              id="modalActivity"
            >
              <ModalHeader
                style={{
                  backgroundColor: '#e0ecfa',
                  borderTopLeftRadius: '1.5rem',
                  borderTopRightRadius: '1.5rem',
                }}
              >
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
                      ข้อมูลขั้นตอน/กิจกรรม : {this.state.ActivityDetail}
                    </Label>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ระยะเวลา
                    </Label>
                    <Col sm={12}>
                      <Row>
                        <Col sm={2}>เริ่มต้น:</Col>
                        <Col sm={4}>
                          <Input
                            type="text"
                            name="ActivityStart2"
                            disabled
                            value={this.thaiDate(this.state.ActivityStart2)}
                          />
                        </Col>
                        <Col sm={2}>สิ้นสุด:</Col>
                        <Col sm={4}>
                          <Input
                            type="text"
                            name="ActivityFinish2"
                            disabled
                            value={this.thaiDate(this.state.ActivityFinish2)}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Label for="PlanName" sm={12}>
                      เดือนที่รายงานผล :
                    </Label>
                    <Col sm={12}>
                      <div style={{ border: 'solid 1px #000000' }}>
                        <Table responsive borderless id="table2">
                          <thead>
                            <tr style={{ backgroundColor: '#e0ecfa' }}>
                              <th style={{ textAlign: 'center' }}>ลำดับ</th>
                              <th style={{ textAlign: 'left' }}>
                                เดือนที่รายงานผล
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                ผลการรายงาน
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                % ความก้าวหน้า
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                ประเภทงบประมาณ
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                การเบิกจ่ายงบประมาณ
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                สถานะผลการดำเนินงาน
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                วันที่บันทึกผล
                              </th>

                              <th style={{ textAlign: 'center' }}>
                                ปัญหาและอุปสรรค
                              </th>
                              <th style={{ textAlign: 'center' }}>
                                ลิงค์เอกสาร
                              </th>
                              {userPermission[0].manageReportProjectData ===
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
                            {this.state.activity_reported.length == 0 ? (
                              <tr>
                                <td colSpan="8" align="center">
                                  ยังไม่มีการรายงาน
                                </td>
                              </tr>
                            ) : (
                              this.state.activity_reported.map((id, i) => (
                                <tr key={id._id}>
                                  <td style={{ textAlign: 'center' }}>
                                    {i + 1}
                                  </td>
                                  <td style={{ textAlign: 'left' }}>
                                    {
                                      monthList.filter(
                                        a => a.no === id.month_report - 1,
                                      )[0].name
                                    }
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
                                    {id.performance}%
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {id.expenditure_budget_type_name}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {this.projectMoneyFormat(id.used_cost)}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {
                                      durationOptions.filter(
                                        a => a.id === id.duration,
                                      )[0].label
                                    }
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {this.thaiDate(id.create_date)}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {id.problem === '' ? '-' : id.problem}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {id.document_link &&
                                      id.document_link.trim() !== '' ? (
                                      <Tooltip title="เปิดลิงค์เอกสาร">
                                        <a
                                          href={id.document_link}
                                          target="_blank"
                                        >
                                          <span className="view-button">
                                            <Icon style={{ fontSize: '14px' }}>
                                              link
                                            </Icon>
                                          </span>
                                        </a>
                                      </Tooltip>
                                    ) : id.document_files &&
                                      id.document_files.length > 0 ? (
                                      <Tooltip title="เปิดลิงค์เอกสาร">
                                        <a
                                          onClick={() =>
                                            this.onViewFile(id.progress_id)
                                          }
                                        >
                                          <span className="view-button">
                                            <Icon style={{ fontSize: '14px' }}>
                                              link
                                            </Icon>
                                          </span>
                                        </a>
                                      </Tooltip>
                                    ) : (
                                      <Tooltip title="ไม่มีลิงค์เอกสาร">
                                        <span className="disabled-button">
                                          {/* <AiOutlineLink fontSize={'14px'} /> */}
                                          <Icon style={{ fontSize: '14px' }}>
                                            link
                                          </Icon>
                                        </span>
                                      </Tooltip>
                                    )}
                                  </td>
                                  {userPermission[0].manageReportProjectData ===
                                    true ? (
                                    <td style={{ textAlign: 'center' }}>
                                      <Tooltip title="แก้ไขการรายงาน">
                                        <span
                                          className="edit-button-2"
                                          onClick={() =>
                                            this.onEditReport(id.progress_id)
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
                                              id.progress_id,
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
                    <Label for="current_amount" sm={12}>
                      ยอดเงินการเบิกจ่ายรวม :
                    </Label>
                    <Col sm={12}>
                      <InputGroup>
                        <Input
                          type="text"
                          name="current_amount"
                          disabled
                          value={this.projectMoneyFormat(
                            this.state.current_amount,
                          )}
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
                  </FormGroup>
                  <FormGroup style={{ textAlign: 'center' }}>
                    <Button color="danger" onClick={this.toggle1()}>
                      ปิด
                    </Button>
                  </FormGroup>
                </Form>
              </ModalBody>
            </Modal>
          </Col>
        </Row>
        <Modal
          isOpen={this.state.modal3}
          toggle={this.toggle3()}
          className={this.props.className}
          size="lg"
          id="modalViewFile"
        >
          <ModalHeader
            toggle={this.toggle3()}
            style={{
              backgroundColor: '#e0ecfa',
              borderTopLeftRadius: '1.5rem',
              borderTopRightRadius: '1.5rem',
            }}
          >
            แบบฟอร์มรายการปฏิบัติงาน
          </ModalHeader>
          <ModalBody
            style={{
              borderRadius: '1.5rem',
            }}
          >
            <Form enctype="multipart/form-data" name="form2" id="form2">
              <FormGroup>
                <Label for="resultFile" sm={12}>
                  ไฟล์เอกสาร :
                </Label>
                <Col sm={12}>
                  <div id="resultFile" className="row m-0">
                    <div></div>
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
            >
              <Icon color="primary">add</Icon>
            </Fab>
          </Tooltip>
        </div>
      </>
    );
  }
}
