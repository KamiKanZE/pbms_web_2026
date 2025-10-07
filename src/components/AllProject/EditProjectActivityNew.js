import React, { Component } from 'react';
import { Col, Row, Table, Modal, ModalBody, ModalHeader, Form, FormText, Input, Label, Button, FormGroup, InputGroup, InputGroupText } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Chip, Fab, Grid, LinearProgress, styled,TextField } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import { NavLink } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-thai-datepickers';

import 'moment/locale/th';
import SimpleMap from '../GoogleMap';
import ProgressBar from '../ProgressBar';
import { fetchData, processFileDocuments, b64toBlob, base64ToFile } from '../../utils/fileUtils';
import { userID, userName, token_id, monthList, performanceOptions, durationOptions, userPermission } from '../constants';
// Constants & Defaults
const MySwal = withReactContent(Swal);
const roundToTwoDecimalPlaces = num => Math.round((num + Number.EPSILON) * 100) / 100;
class EditProjectActivityData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modal1: false,
      modal2: false,
      modal3: false,
      ID: this.props.page === ':id' || this.props.page === '' || this.props.page === undefined ? 1 : this.props.page,
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
      duration: '',
      month_report: '',
      performance: '',
      result_detail: '',
      expenditure_budget_type: '',
      expenditure_budget_type_name: '',
      used_cost: '',
      problem: '',
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
      data: [], // initialize data as an empty array
      map_data: '',
      lat: '',
      lng: '',
      hasError: false,
      files: [],
      isLoading: false,
      document_files: [],
    };
  }

  toggle = modalType => () => {
    this.setState(prevState => ({
      [modalType]: !prevState[modalType],
    }));
  };

  componentDidMount() {
    this.loadCommentsFromServer();
  }

  loadCommentsFromServer = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_SOURCE_URL}/projects/activities/${this.state.ID}`);
      const { result } = res.data;
      const sumWeight = Math.round((result.reduce((sum, { activity_weight = 0 }) => sum + parseFloat(activity_weight), 0) + Number.EPSILON) * 100) / 100;
      this.setState({ data: result, sumWeight, sumWeight2: sumWeight });
    } catch (err) {
      console.error('Error loading data from server', err);
    }
  };
  onEdit = id => {
    this.resetFormState('edit');
    axios.get(`${process.env.REACT_APP_SOURCE_URL}/projects/activities/activity/${id}`).then(res => {
      const { project_id, activity_id, activity_detail, activity_weight, activity_start, activity_finish, activity_cost, activity_report, map_position, map_data, activity_note } = res.data.result;

      const activity_report_map = activity_report.map(b => monthList.find(a => a.no === b - 1));

      const formattedActivityCost = new Intl.NumberFormat('en-US').format(activity_cost);

      this.setState({
        ID: project_id,
        ActivityId: activity_id,
        ActivityDetail: activity_detail,
        ActivityWeight: activity_weight,
        ActivityWeight2: activity_weight,
        ActivityStart: new Date(moment(activity_start)),
        ActivityFinish: new Date(moment(activity_finish)),
        ActivityCost: formattedActivityCost, // Set the formatted cost
        ActivityReport: activity_report_map,
        map_data: map_data,
        lat: (map_position && map_position.latitude) || '',
        lng: (map_position && map_position.longitude) || '',
        ActivityNote: activity_note,
      });
    });
  };

  onAdd = () => {
    this.resetFormState('');
  };

  resetFormState = formType => {
    this.setState({
      modal: true,
      isForm: formType,
      ActivityId: '',
      ActivityDetail: '',
      ActivityWeight: '',
      ActivityStart: new Date(),
      ActivityFinish: new Date(),
      ActivityCost: '',
      ActivityReport: [],
      ActivityStatus: '',
      ActivityNote: '',
      sumWeight: this.state.sumWeight2,
      map_data: '',
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
      header: formType === 'edit' ? 'แก้ไขข้อมูลกิจกรรม' : 'เพิ่มข้อมูลกิจกรรม',
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.isForm === 'edit') {
      this.handleUpdate(e);
    } else {
      this.handleSubmit1(e);
    }
  };

  checkTime = () => {
    const { ActivityStart, ActivityFinish } = this.state;

    // กรณีที่ `ActivityStart` หรือ `ActivityFinish` เป็น null หรือ undefined
    if (!ActivityStart || !ActivityFinish) {
      return false; // หรือ true ขึ้นอยู่กับว่าคุณต้องการให้เป็น default value อะไร
    }

    // ใช้ moment.js เพื่อเปรียบเทียบวันที่
    const start = moment(ActivityStart);
    const finish = moment(ActivityFinish);

    // ตรวจสอบว่าค่า start น้อยกว่าหรือเท่ากับ finish
    const isValid = start.isBefore(finish) || start.isSame(finish);
    return isValid;
  };

  handleSubmit1 = e => {
    e.preventDefault();
    if (this.validateForm()) {
      const map_position = {
        latitude: this.state.lat.toString(),
        longitude: this.state.lng.toString(),
      };
      axios
        .post(
          `${process.env.REACT_APP_SOURCE_URL}/projects/activities/${this.state.ID}`,
          {
            activity_detail: this.state.ActivityDetail,
            map_data: this.state.map_data,
            map_position,
            activity_weight: parseFloat(this.state.ActivityWeight),
            activity_start: moment(this.state.ActivityStart).format('yyyy-MM-DD'),
            activity_finish: moment(this.state.ActivityFinish).format('yyyy-MM-DD'),
            activity_cost: parseFloat(this.state.ActivityCost.replace(/,/g, '')),
            activity_report: this.state.ActivityReport.map(data => data.no + 1),
            activity_note: this.state.ActivityNote,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(() => {
          this.showSuccessAlert('บันทึกข้อมูลสำเร็จ');
          this.closeModalAndReload();
        })
        .catch(err => this.handleError(err));
    }
  };

  validateForm = () => {
    const activityCostWithoutCommas = this.state.ActivityCost.replace(/,/g, '');
    // const preciseDifference = Math.round((this.state.sumWeight2 - this.state.ActivityWeight2) * 100) / 100;
    const validationErrors = {
      validationError1: this.state.ActivityDetail.trim() ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน',
      validationError2: this.state.ActivityStart ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน',
      validationError3: this.state.ActivityFinish ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน',
      validationError2_1: this.checkTime() !== false ? '' : 'วันเริ่มต้นห้ามมากกว่ามันสิ้นสุด',
      validationError3_1: this.checkTime() !== false ? '' : 'วันสิ้นสุดห้ามน้อยกว่าวันเริ่มต้น',
      validationError4: this.state.ActivityWeight !== '' && !isNaN(this.state.ActivityWeight) ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน',
      validationError4_1: this.state.sumWeight <= 100 ? '' : 'ค่าน้ำหนักรวมทุกกิจกรรมต้องไม่เกิน 100 ปัจจุบัน ' + this.state.sumWeight,
      validationError5: activityCostWithoutCommas !== '' && !isNaN(activityCostWithoutCommas) ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน',
      validationError6: this.state.ActivityReport.length > 0 ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน',
    };

    this.setState(validationErrors);
    return Object.values(validationErrors).every(error => error === '');
  };

  showSuccessAlert = message => {
    MySwal.fire({
      title: <strong>{message}</strong>,
      icon: 'success',
      timer: 1000,
      showConfirmButton: false,
    });
  };

  handleError = err => {
    let errorMsg = 'บันทึกข้อมูลไม่สำเร็จ';
    // Check if `err.response.data.message` exists before calling `toLowerCase()`
    if (err.response && err.response.data && err.response.data.message) {
      const message = err.response.data.message.toLowerCase();

      if (message === 'project_total_budget over' || message === 'out of budget') {
        errorMsg = (
          <span>
            จำนวนเงินเกินงบประมาณโครงการ <br />
            ยอดงบประมาณ {new Intl.NumberFormat().format(err.response.data.project_total_budget)} บาท <br />
            สามารถใช้ได้อีก {new Intl.NumberFormat().format(err.response.data.project_total_budget - err.response.data.project_used_budget)} บาท
          </span>
        );
      } else if (message === 'total_weight over 100') {
        errorMsg = (
          <span>
            ค่าน้ำหนักเกิน 100 <br /> ค่าน้ำหนักรวม {err.response.data.total_weight}{' '}
          </span>
        );
      }
      // } else if (err.response.data.activity_weight.split('must be larger than or equal to ')[1] === '1') {
      //   errorMsg = `ค่าน้ำหนักต้องเริ่มจาก 1`;
    }

    MySwal.fire({
      title: <strong>{errorMsg}</strong>,
      icon: 'error',
      showConfirmButton: true,
      confirmButtonText: 'ปิด',
    });
  };

  closeModalAndReload = () => {
    this.setState({ modal: false });
    this.loadCommentsFromServer();
  };
  handleUpdate = e => {
    e.preventDefault();
    if (this.validateForm()) {
      const ID = this.state.ActivityId;
      const map_position = {
        latitude: this.state.lat.toString(),
        longitude: this.state.lng.toString(),
      };
      axios
        .patch(
          `${process.env.REACT_APP_SOURCE_URL}/projects/activities/${ID}`,
          {
            activity_detail: this.state.ActivityDetail,
            map_data: this.state.map_data,
            map_position,
            activity_weight: parseFloat(this.state.ActivityWeight),
            activity_start: moment(this.state.ActivityStart).format('yyyy-MM-DD'),
            activity_finish: moment(this.state.ActivityFinish).format('yyyy-MM-DD'),
            activity_cost: parseFloat(this.state.ActivityCost.replace(/,/g, '')),
            activity_report: this.state.ActivityReport.map(data => data.no + 1),
            activity_note: this.state.ActivityNote,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(() => {
          this.showSuccessAlert('แก้ไขข้อมูลสำเร็จ');
          this.closeModalAndReload();
        })
        .catch(err => this.handleError(err));
    }
  };
  testAxiosDELETE = async id => {
    if (id === undefined) {
      await MySwal.fire({
        title: <strong>ไม่พบ Activity ID</strong>,
        html: <i>กรุณาลองใหม่อีกครั้ง</i>,
        icon: 'error',
        confirmButtonColor: '#66BB66',
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    const { isConfirmed } = await MySwal.fire({
      title: <strong>คุณต้องการจะลบข้อมูลนี้</strong>,
      icon: 'warning',
      confirmButtonColor: '#66BB66',
      confirmButtonText: 'ยืนยัน',
      showCancelButton: true,
      cancelButtonColor: '#EE4444',
      cancelButtonText: 'ยกเลิก',
    });

    if (isConfirmed) {
      await this.DELETE(id);
    }
  };

  DELETE = async id => {
    try {
      await axios.delete(`${process.env.REACT_APP_SOURCE_URL}/projects/activities/activity/${id}`, { headers: { Authorization: `Bearer ${token_id}` } });
      this.loadCommentsFromServer();
      await MySwal.fire({
        title: <strong>ลบข้อมูลสำเร็จ</strong>,
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (err) {
      console.error('Error deleting data:', err);
      await MySwal.fire({
        title: <strong>ลบข้อมูลไม่สำเร็จ</strong>,
        html: <i>กรุณาลองใหม่อีกครั้ง</i>,
        icon: 'error',
        confirmButtonColor: '#66BB66',
        showConfirmButton: false,
        timer: 1000,
      });
    }
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
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      file: value === 'link' ? '' : this.state.file,
      link: value === 'link' ? this.state.link : '',
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

  fetchDataExpenditureBudgets(year = moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543) {
    console.log(year)
    axios.get(`${process.env.REACT_APP_SOURCE_URL}/expenditureBudgets/reports?page=0&expenditure_budget_year=${year}`).then(res => this.setState({ expenditureBudgets_list: res.data.result }));
  }

  // Event Handlers for inputs
  handleInputChangeDateStart = e => {
    this.setState({ ActivityStart: e });
  };
  handleInputChangeDateFinish = e => {
    this.setState({ ActivityFinish: e });
  };

  handleMultiSelectChange = e => {
    this.setState({
      ActivityReport: e,
    });
  };

  thaiDate = e => {
    if (!e) return '';
    const date = moment(e).format('D');
    const month = moment(e).format('M') - 1; // monthList is 0-based
    const year = moment(e).year() + 543;
    const monthThai = monthList.filter(list => list.no === month)[0].nameshort;
    return `${date} ${monthThai} ${year}`;
  };

  onAddReport = id => {
    fetchData(`${process.env.REACT_APP_SOURCE_URL}/projects/activities/activity/${id}`, result => {
      const { project_id, activity_id, activity_detail, activity_report, activity_start } = result;
      const activity_report_map = activity_report.map(b => monthList.find(a => a.no === b - 1));
      const reportYear = moment(activity_start).year() + 543 + (moment(activity_start).month() > 8 ? 1 : 0);
      
      this.fetchDataExpenditureBudgets(this.props.projectStart);
      this.setState({
        modal2: true,
        isForm: '',
        header: 'รายงานผลข้อมูลกิจกรรม',
        ActivityId: activity_id,
        ActivityReport: activity_report_map,
        ActivityDetail: activity_detail,
        duration: 1,
        month_report: activity_report[0],
        performance: 100,
        result_detail: '',
        expenditure_budget_type: '',
        expenditure_budget_type_name: '',
        used_cost: '',
        problem: '',
        counsel: '',
        problem_check:false,
        counsel_check:false,
        link: '',
        isFile: 'file',
        files: '',
        file: '',
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
      problem_check:false,
      counsel_check:false,
      problem: '',
      counsel: '',
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
    this.setState({
      files: [],
    });
    fetchData(`${process.env.REACT_APP_SOURCE_URL}/projectsProgress/${id}`, result => {
      this.setState({
        modal3: true,
        header: `ดูไฟล์${this.props.title}`,
        files: result.document_files,
      });
      // processFileDocuments(result.document_files || [], '#resultFile', this.deleteFile, false); // Don't show delete button
    });
  };

  onViewReport = id => {
    fetchData(`${process.env.REACT_APP_SOURCE_URL}/projects/activities/activity/${id}`, result => {
      const { activity_id, activity_detail, activity_start, activity_finish, current_amount, activity_reported } = result;
      this.setState({
        modal1: true,
        ActivityId: activity_id,
        ActivityDetail: activity_detail,
        ActivityStart2: activity_start,
        ActivityFinish2: activity_finish,
        current_amount,
        activity_reported,
      });
    });
  };
  testAxiosDELETE2 = async id => {
    if (!id) {
      return MySwal.fire({
        title: <strong>ไม่พบ Activity ID</strong>,
        html: <i>กรุณาลองใหม่อีกครั้ง</i>,
        icon: 'error',
        confirmButtonColor: '#66BB66',
        showConfirmButton: false,
        timer: 1000,
      });
    }

    const { isConfirmed } = await MySwal.fire({
      title: <strong>คุณต้องการจะลบข้อมูลรายงานผลนี้</strong>,
      icon: 'warning',
      confirmButtonColor: '#66BB66',
      confirmButtonText: 'ยืนยัน',
      showCancelButton: true,
      cancelButtonColor: '#EE4444',
      cancelButtonText: 'ยกเลิก',
    });

    if (isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_SOURCE_URL}/projectsProgress/${id}`, {
          headers: { Authorization: `Bearer ${token_id}` },
        });

        MySwal.fire({
          title: <strong>ลบข้อมูลรายงานผลสำเร็จ</strong>,
          icon: 'success',
          confirmButtonColor: '#66BB66',
          showConfirmButton: false,
          timer: 1000,
        });
        this.loadCommentsFromServer();
        // Optionally, refresh the data or update the state here
        this.onViewReport(this.state.ActivityId);
      } catch (error) {
        console.error('Error deleting report:', error);

        MySwal.fire({
          title: <strong>ลบข้อมูลรายงานผลไม่สำเร็จ</strong>,
          html: <i>เกิดข้อผิดพลาด: {error.message}</i>,
          icon: 'error',
          confirmButtonColor: '#EE4444',
        });
      }
    }
  };
  handleSubmit3 = e => {
    e.preventDefault();
    if (this.state.isForm === 'edit') {
      this.handleUpdateReport(e);
    } else {
      this.handleSubmitAddReport(e);
    }
  };

  handleSubmitAddReport = async e => {
    e.preventDefault();

    if (this.state.duration && this.state.month_report && this.state.performance && this.state.expenditure_budget_type && this.state.used_cost) {
      const formData = new FormData();
      formData.append('duration', this.state.duration.toString());
      formData.append('month_report', parseFloat(this.state.month_report));
      formData.append('send_inventory', this.state.send ? 1 : 0);
      formData.append('performance', this.state.performance);
      formData.append('result_detail', this.state.result_detail);
      formData.append('expenditure_budget_type', this.state.expenditure_budget_type);
      formData.append('expenditure_budget_type_name', this.state.expenditure_budget_type_name);
      formData.append('used_cost', parseFloat(this.state.used_cost.replace(/,/g, '')));
      formData.append('problem', this.state.problem);
      formData.append('counsel', this.state.counsel);
      formData.append('user_id', userID);
      formData.append('user_name', userName);
      formData.append('document_link', this.state.link);

      if (this.state.files && this.state.files.length > 0) {
        for (const file of this.state.files) {
          formData.append('document_files', file);
        }
      } else {
        formData.append('document_files', '');
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_SOURCE_URL}/projectsProgress/${this.state.ActivityId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token_id}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          this.handleErrorResponse(errorResponse);
          return;
        }

        MySwal.fire({
          title: <strong>บันทึกข้อมูลรายงานผลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
          cancelButtonText: 'ปิด',
        });

        this.loadCommentsFromServer();
        this.setState({ modal2: false });
      } catch (error) {
        console.error('Error:', error);
        MySwal.fire({
          title: <strong>บันทึกข้อมูลรายงานผลไม่สำเร็จ</strong>,
          html: `เกิดข้อผิดพลาด: ${error.message}`,
          icon: 'error',
          showConfirmButton: false,
          cancelButtonText: 'ปิด',
        });
      }
    } else {
      this.setState({
        reportError1: this.state.month_report ? '' : 'กรุณาเลือกข้อมูล',
        reportError2: this.state.performance ? '' : 'กรุณาเลือกข้อมูล',
        reportError3: this.state.expenditure_budget_type ? '' : 'กรุณาเลือกข้อมูล',
        reportError4: this.state.used_cost ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน',
        reportError5: this.state.duration ? '' : 'กรุณาเลือกข้อมูล',
      });
    }
  };

  handleUpdateReport = async e => {
    e.preventDefault();

    if (this.state.duration && this.state.month_report && this.state.performance && this.state.expenditure_budget_type && this.state.used_cost) {
      const formData = new FormData();
      formData.append('duration', this.state.duration.toString());
      formData.append('month_report', parseFloat(this.state.month_report));
      formData.append('send_inventory', this.state.send ? 1 : 0);
      formData.append('performance', this.state.performance);
      formData.append('result_detail', this.state.result_detail);
      formData.append('expenditure_budget_type', this.state.expenditure_budget_type);
      formData.append('expenditure_budget_type_name', this.state.expenditure_budget_type_name);
      formData.append('used_cost', parseFloat(this.state.used_cost.replace(/,/g, '')));
      formData.append('problem', this.state.problem);
      formData.append('counsel', this.state.counsel);
      formData.append('user_id', userID);
      formData.append('user_name', userName);
      formData.append('document_link', this.state.link);
      // ตรวจสอบว่า files มีไฟล์แบบกำหนดเอง
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
      try {
        const response = await fetch(`${process.env.REACT_APP_SOURCE_URL}/projectsProgress/${this.state.progress_id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token_id}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          this.handleErrorResponse(errorResponse);
          return;
        }

        MySwal.fire({
          title: <strong>แก้ไขข้อมูลรายงานผลสำเร็จ</strong>,
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });

        this.setState({ modal2: false });
        this.loadCommentsFromServer();
        this.onViewReport(this.state.ActivityId);
      } catch (error) {
        console.error('Error:', error);
        MySwal.fire({
          title: <strong>แก้ไขข้อมูลรายงานผลไม่สำเร็จ</strong>,
          html: `เกิดข้อผิดพลาด: ${error.message}`,
          icon: 'error',
          timer: 2500,
          showConfirmButton: false,
        });
      }
    } else {
      this.setState({
        reportError1: this.state.month_report ? '' : 'กรุณาเลือกข้อมูล',
        reportError2: this.state.performance ? '' : 'กรุณาเลือกข้อมูล',
        reportError3: this.state.expenditure_budget_type ? '' : 'กรุณาเลือกข้อมูล',
        reportError4: this.state.used_cost ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน',
        reportError5: this.state.duration ? '' : 'กรุณาเลือกข้อมูล',
      });
    }
  };

  handleErrorResponse = errorResponse => {
    const message = errorResponse.message.toLowerCase();
    let title, html;

    if (message.includes('activity progress is 100!')) {
      title = 'บันทึกข้อมูลรายงานผลไม่สำเร็จ';
      html = `อัตราส่วน % ความก้าวหน้า ${new Intl.NumberFormat().format(errorResponse.performance)} % แล้ว`;
    } else if (message === 'out of budget') {
      title = 'บันทึกข้อมูลรายงานผลไม่สำเร็จ';
      html = `จำนวนเงินเกินงบประมาณกิจกรรม <br /> ยอดงบประมาณกิจกรรม ${new Intl.NumberFormat().format(errorResponse.activity_cost)}`;
    } else if (message === 'used cost over!') {
      title = 'บันทึกข้อมูลรายงานผลไม่สำเร็จ';
      html = `จำนวนเงินเกินงบประมาณกิจกรรม <br /> ยอดงบประมาณกิจกรรม ${new Intl.NumberFormat().format(errorResponse.activity_cost)} <br /> ปัจจุบันที่ใช้ไปแล้ว 
    ${new Intl.NumberFormat().format(errorResponse.current_amount)} <br /> คงเหลือใช้ได้ ${new Intl.NumberFormat().format(errorResponse.activity_cost - errorResponse.current_amount)}`;
    } else if (message.includes('please check your performance!')) {
      title = 'บันทึกข้อมูลรายงานผลไม่สำเร็จ';
      html = `อัตราส่วน % ความก้าวหน้าต้องไม่น้อยกว่าปัจจุบัน <br /> ปัจจุบันมีความก้าวหน้า <b>${errorResponse.performance} % </b>`;
    } else {
      title = 'บันทึกข้อมูลรายงานผลไม่สำเร็จ';
      html = `ใส่ข้อมูลไม่ถูกต้อง</b>`;
    }

    MySwal.fire({
      title: <strong>{title}</strong>,
      html: html,
      icon: 'error',
      showConfirmButton: true,
      confirmButtonText: 'ปิด',
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
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.lat !== this.state.lat || prevState.lng !== this.state.lng) {
  //       console.log('ค่าพิกัดเปลี่ยนแปลง:', this.state.lat, this.state.lng);
  //   }
  // }
  handleInputChangeCheck = e => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };
  render() {
    const defaultLat = 13.861721108172372; // default latitude
    const defaultLng = 100.51356196403503; // default longitude
    const defaultmap_data = 'สำนักงานเทศบาลนครนนทบุรี'; //default map_data
    return (
      <div>
        <Row>
          <Col sm={12}>
            <div className="box-9">ข้อมูลกิจกรรม</div>
          </Col>
          <Col>
            <Table responsive borderless id="table1">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  <th style={{ textAlign: 'left', width: '35%' }}>ขั้นตอน/กิจกรรม</th>
                  <th style={{ textAlign: 'center', width: '10%' }}>ค่าน้ำหนัก</th>
                  <th style={{ textAlign: 'center', width: '20%' }}>ความก้าวหน้าโครงการ</th>
                  <th style={{ textAlign: 'center' }}>วันเริ่มต้นโครงการ</th>
                  <th style={{ textAlign: 'center' }}>วันสิ้นสุดโครงการ</th>
                  {userPermission[0].showReportProjectData === true || userPermission[0].manageReportProjectData === true ? <th style={{ textAlign: 'center' }}>รายงานผลกิจกรรม</th> : ''}
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
                      <td style={{ textAlign: 'center' }}>
                        <Tooltip title="แก้ไข">
                          <span className="edit-button" onClick={() => this.onEdit(id.activity_id)}>
                            <Icon style={{ fontSize: '14px' }}>edit</Icon>
                          </span>
                        </Tooltip>
                        &nbsp;
                        <Tooltip title="ลบ">
                          <span className="delete-button" onClick={() => this.testAxiosDELETE(id.activity_id)}>
                            <Icon style={{ fontSize: '14px' }}>delete_outline</Icon>
                          </span>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <div style={{ display: 'flex', justifyContent: 'right' }}>
              <NavLink to={`/AllProject/EditProject1/${this.state.ID}`}>{'ข้อมูลหลัก <<'}</NavLink>
              <div className="box-10">{'หน้าก่อน'}</div>
              <div className="box-10">{'หน้าถัดไป'}</div>
              <NavLink to={`/AllProject/EditProject3/${this.state.ID}`}>{'>> ข้อมูลชี้วัด'}</NavLink>
            </div>

            <Modal isOpen={this.state.modal} toggle={this.toggle('modal')} className={this.props.className} size="lg" id="modalAddActivity">
              <ModalHeader
                toggle={this.toggle('modal')}
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
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
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

                    <Col sm={12} className="mt-2">
                      <SimpleMap lat={parseFloat(this.state.lat) || defaultLat} lng={parseFloat(this.state.lng) || defaultLng} place={this.state.map_data||defaultmap_data} onChangeMap={this.changeMap} />
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ระยะเวลา <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Row>
                        <Col sm={2}>เริ่มต้น:</Col>
                        <Col sm={4}>
                          <MuiPickersUtilsProvider utils={MomentUtils} locale={'th'}>
                            <DatePicker
                              className="form-control"
                              format="DD/MM/YYYY"
                              pickerHeaderFormat="ddd D MMM"
                              yearOffset={543}
                              name="ActivityStart"
                              value={this.state.ActivityStart}
                              onChange={this.handleInputChangeDateStart}
                              TextFieldComponent={params => <TextField {...params} />}
                              cancelLabel="ยกเลิก"
                              okLabel="ตกลง"
                            />
                          </MuiPickersUtilsProvider>
                        </Col>

                        <Col sm={2}>สิ้นสุด:</Col>
                        <Col sm={4}>
                          <MuiPickersUtilsProvider utils={MomentUtils} locale={'th'}>
                            <DatePicker
                              className="form-control"
                              format="DD/MM/YYYY"
                              pickerHeaderFormat="ddd D MMM"
                              yearOffset={543}
                              name="ActivityFinish"
                              value={this.state.ActivityFinish}
                              onChange={this.handleInputChangeDateFinish}
                              TextFieldComponent={params => <TextField {...params} />}
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
                      {/* ค่าน้ําหนัก (ไม่เกิน 100) <font color="red">*</font> (ปัจจุบัน {this.state.sumWeight2}): */}
                      ค่าน้ําหนัก (ไม่เกิน 100) <font color="red">*</font>
                    </Label>
                    <Col sm={12}>
                      <Input type="number" name="ActivityWeight" step="0.01" onChange={this.handleInputChangeNumber} value={this.state.ActivityWeight} />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      <div> {this.state.validationError4}</div>
                      <div> {this.state.validationError4_1}</div>
                    </Col>
                    <Label for="PlanName" sm={12}>
                      เดือนที่รายงานผล <font color="red">* ( เลือกได้มากกว่า 1 รายการ)</font> :
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
                      <textarea name="ActivityNote" className="form-control" value={this.state.ActivityNote} onChange={this.handleInputChange} rows={5} style={{ width: '100%' }}></textarea>
                    </Col>
                  </FormGroup>
                  <FormGroup style={{ textAlign: 'center' }}>
                    <Button type="submit" color="success">
                      บันทึก
                    </Button>
                    &nbsp;
                    <Button color="danger" onClick={this.toggle('modal')}>
                      ยกเลิก
                    </Button>
                  </FormGroup>
                </Form>
              </ModalBody>
            </Modal>

            <Modal isOpen={this.state.modal2} toggle={this.toggle('modal2')} className={this.props.className} size="lg" id="modalReportActivity">
              <ModalHeader
                toggle={this.toggle('modal2')}
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
                <Form onSubmit={this.handleSubmit3} encType="multipart/form-data" method="post" name="form1" id="form1">
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
                        <Checkbox onChange={this.handleInputChange} inputProps={{ 'aria-label': 'controlled' }} name="send" checked={this.state.send} />
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
                      {/* Problem Section */}

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
                  <FormControl className="ml-3">
                    <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="isFile">
                      <FormControlLabel value="link" control={<Radio />} label="แนบลิงค์เอกสาร" checked={this.state.isFile === 'link'} onChange={this.handleInputChangeLink} />
                      <FormControlLabel value="file" control={<Radio />} label="แนบไฟล์" checked={this.state.isFile === 'file'} onChange={this.handleInputChangeLink} />
                    </RadioGroup>
                  </FormControl>
                  {this.state.isFile === 'link' ? (
                    <>
                      <Label for="PlanName" sm={12}>
                        แนบลิงค์เอกสาร :
                      </Label>
                      <Col sm={12}>
                        <Input name="link" type="url" value={this.state.link} onChange={this.handleInputChange} pattern="https?://.+" />
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
                        <FormText>คาดหวังประเภทไฟล์ 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'jpg', 'jpeg', 'png' ( ขนาด 100 MB )</FormText>
                        <div id="result" className="row m-0">
                          {this.state.files.length > 0 && this.state.files.map((file, index) => this.renderFilePreview(file, index, 1))}
                        </div>
                        {this.state.isLoading && <p>กำลังอัปโหลดไฟล์...</p>}
                      </Col>
                    </>
                  )}
                  <FormGroup style={{ textAlign: 'center' }} className="mt-3">
                    <Button color="success">บันทึก</Button>&nbsp;
                    <Button color="danger" onClick={this.toggle('modal2')}>
                      ยกเลิก
                    </Button>
                  </FormGroup>
                </Form>
              </ModalBody>
            </Modal>
            <Modal isOpen={this.state.modal1} toggle={this.toggle('modal1')} className={this.props.className} size="xl" id="modalActivity">
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
                          <Input type="text" name="ActivityStart2" disabled value={this.thaiDate(this.state.ActivityStart2)} />
                        </Col>
                        <Col sm={2}>สิ้นสุด:</Col>
                        <Col sm={4}>
                          <Input type="text" name="ActivityFinish2" disabled value={this.thaiDate(this.state.ActivityFinish2)} />
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
                                  <td style={{ textAlign: 'left' }}>{monthList.filter(a => a.no === id.month_report - 1)[0].name}</td>
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
                                            <Icon style={{ fontSize: '14px' }}>link</Icon>
                                          </span>
                                        </a>
                                      </Tooltip>
                                    ) : id.document_files && id.document_files.length > 0 ? (
                                      <Tooltip title="เปิดลิงค์เอกสาร">
                                        <a onClick={() => this.onViewFile(id.progress_id)}>
                                          <span className="view-button">
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
                    <Label for="current_amount" sm={12}>
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
                    <Button color="danger" onClick={this.toggle('modal1')}>
                      ปิด
                    </Button>
                  </FormGroup>
                </Form>
              </ModalBody>
            </Modal>
            <Modal isOpen={this.state.modal3} toggle={this.toggle('modal3')} className={this.props.className} size="lg" id="modalViewFile">
              <ModalHeader
                toggle={this.toggle('modal3')}
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
                <Form encType="multipart/form-data" name="form2" id="form2">
                  <FormGroup>
                    <Label for="resultFile" sm={12}>
                      ไฟล์เอกสาร :
                    </Label>
                    <Col sm={12}>
                      {/* แสดงไฟล์ที่มีอยู่ */}

                      <div id="resultFile" className="row m-0">
                        {this.state.files.length > 0 && this.state.files.map((file, index) => this.renderFilePreview(file, index, 2))}
                      </div>
                    </Col>
                  </FormGroup>
                  <FormGroup style={{ textAlign: 'center' }} className="mt-3">
                    <Button color="danger" onClick={this.toggle('modal3')}>
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
          </Col>
        </Row>
      </div>
    );
  }
}

export default EditProjectActivityData;
