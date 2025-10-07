import React from 'react';
import axios from 'axios';
import Page from 'components/Page';
import { Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormFeedback, FormText, Input, Label, Button, FormGroup, keyword } from 'reactstrap';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import { Chip, Fab, Grid, LinearProgress, styled } from '@material-ui/core';
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
import ExportCSV from '../exportData/ExportXlsx';
import ExportExcel from '../exportData/ExportExcel';
import ExportBudget from '../exportData/ExportBudget';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { BsDot } from 'react-icons/bs';
import ProgressBar from '../ProgressBar';
import { userID, userName, userEmail, userDepartmentID, token_id, monthList, performanceOptions, durationOptions, userPermission,userType } from '../constants';
import { withStyles } from '@material-ui/core/styles';
const MySwal = withReactContent(Swal);
const CustomTooltip = withStyles(theme => ({
  tooltip: {
    fontSize: '12px', // ขยายขนาดตัวอักษร
    maxWidth: 600, // ขยายความกว้างของ Tooltip
    padding: theme.spacing(1), // เพิ่ม padding เพื่อขยาย Tooltip
  },
}))(Tooltip);
export default class ReportList extends React.Component {
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
      validationError: '',
      validationError1: '',
      PlanID: '',
      PlanName: '',
      ID: '',
      isForm: '',
      data: [],
      data1: [],
      data2: [],
      data3: [],
      selected: id,
      currenpage: id - 1,
      offset: 0,
      perPage: 10,
      offset2: 0,
      perPage2: 1000,
      keyword: '',
      namesearch: '',
      url: process.env.REACT_APP_SOURCE_URL + '/projects/list',
      url1: process.env.REACT_APP_SOURCE_URL + '/projects/listproject',
      departmentSearch: userType !== '3' ? '' : '&project_department=' + userDepartmentID,
      selectData: '',
      dataType: '',
      projectStatus: '',
      projects: [],
      searchParam: ['project_name'],
    };
  }
  handleMouseEnter = projectId => {
    // ส่งข้อมูลไปหาฟังก์ชันเพื่อดึงข้อมูลเพิ่มเติม
    this.fetchProjectDetails(projectId);
  };

  handleMouseLeave = () => {
    // ลบข้อมูล tooltip เมื่อเอาเมาส์ออก
    this.setState({ tooltipContent: '', hoverRowId: null });
  };
  fetchProjectDetails = projectId => {
    // สมมติว่าคุณจะดึงข้อมูลเพิ่มเติมจาก API โดยใช้ projectId
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/projects/' + projectId)
      .then(response => {
        const { project_object, project_output_goal, project_outcome_goal, project_expected_benefit, project_benefit, project_note } = response.data.result;

        // สร้าง HTML string โดยใช้ class แทน className
        let detail = `
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-4 text-right">วัตถุประสงค์โครงการ :</div>
            <div class="col-md-8">${project_object}</div>
            <div class="col-md-4 text-right">เป้าหมายเชิงผลผลิต :</div>
            <div class="col-md-8">${project_output_goal}</div>
            <div class="col-md-4 text-right">เป้าหมายเชิงผลลัพธ์ :</div>
            <div class="col-md-8">${project_outcome_goal}</div>
            <div class="col-md-4 text-right">ผลที่คาดว่าจะได้รับ :</div>
            <div class="col-md-8">${project_expected_benefit}</div>
            <div class="col-md-4 text-right">กลุ่มเป้าหมาย/ผู้ที่ได้รับประโยชน์ :</div>
            <div class="col-md-8">${project_benefit}</div>
            <div class="col-md-4 text-right">หมายเหตุ :</div>
            <div class="col-md-8">${project_note}</div>
          </div>
        </div>
      `;

        // ตั้งค่า tooltipContent และ hoverRowId
        this.setState({
          tooltipContent: detail,
          hoverRowId: projectId,
        });
      })
      .catch(error => {
        console.error('Error fetching project details:', error);
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/projects/' + id)
      .then(res => {
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        this.loadCommentsFromServer();
        this.loadCommentsFromServer1();
        this.loadCommentsFromServer2();
        this.loadCommentsFromServer3();
        //setTimeout(() => (window.location.href = '/AllProject/'), 1000);
        // this.loadCommentsFromServer();this.loadCommentsFromServer2();
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    // this.setState({ modal: true });
    axios.get(process.env.REACT_APP_SOURCE_URL + '/projects/' + id).then(res => {
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
        header: 'แก้ไข' + this.props.title,
      });
    });
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      validationError1: '',
    });
  };
  onAdd() {
    this.setState({
      PlanID: '',
      PlanName: '',
      modal: true,
      isForm: '',
      validationError: '',
      validationError1: '',
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
    if (this.state.PlanName.trim()) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/projects',
          {
            // plan_id: this.state.PlanID.trim(),
            plan_name: this.state.PlanName.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.loadCommentsFromServer2();
          this.setState({
            modal: false,
            PlanID: '',
            PlanName: '',
          });
          // //confirmAlert({
          //   //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
          //   message: 'บันทึกข้อมูลเรียบร้อย',
          //   buttons: [
          //     {
          //       label: 'ตกลง',
          //     },
          //   ],
          // });
          confirmAlert({
            message: 'บันทึกข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(() => (window.location.href = '/plan1/'), 1000);
        })
        .catch(err => {
          if (err.response.data == 'Please Check your plan name!') {
            const validationError1 = 'ชื่อข้อมูลแผนงานซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError1: validationError1,
            });
          }
        });
    } else {
      // const validationError = this.state.PlanID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.PlanName.trim() ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        // validationError: validationError,
        validationError1: validationError1,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.ID;
    if (
      // this.state.PlanID.trim() &&
      this.state.PlanName.trim()
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/projects/' + ID,
          {
            // plan_id: this.state.PlanID.trim(),
            plan_name: this.state.PlanName.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.loadCommentsFromServer2();
          this.setState({
            modal: false,
            // PlanID: '',
            PlanName: '',
            isForm: '',
            ID: '',
          });

          confirmAlert({
            message: 'แก้ไขข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(() => (window.location.href = '/plan1/' + this.state.selected), 1000);
        })
        .catch(err => {
          if (err.response.data == 'Please Check your plan name!') {
            const validationError1 = 'ชื่อข้อมูลแผนงานซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError1: validationError1,
            });
          }
        });
    } else {
      const validationError = this.state.PlanID.trim() ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.PlanName.trim() ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        validationError: validationError,
        validationError1: validationError1,
      });
    }
  };
  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
    this.loadCommentsFromServer1();
    this.loadCommentsFromServer2();
    this.loadCommentsFromServer3();
  }
  // componentDidUpdate(prevProps, prevState) {
  //   // if (prevProps.year !== this.props.year) {
  //   //   console.log('year state has changed.');
  //   //   this.loadCommentsFromServer();
  //   //   // this.loadCommentsFromServer2();
  //   // }
  //   // if (prevProps.period !== this.props.period) {
  //   //   console.log('period state has changed.');
  //   //   this.loadCommentsFromServer();
  //   //   // this.loadCommentsFromServer2();
  //   // }
  //   // if (prevState.keyword !== this.state.keyword) {
  //   //   console.log('keyword state has changed.');
  //   //   this.loadCommentsFromServer();
  //   //   this.loadCommentsFromServer2();
  //   // }
  //   // if (prevState.projectStatus !== this.state.projectStatus) {
  //   //   console.log('projectStatus state has changed.');
  //   //   this.loadCommentsFromServer();
  //   //   this.loadCommentsFromServer2();
  //   // }
  //   if (prevProps.year !== this.props.year) {
  //     // console.log('year3 state has changed.');
  //     this.loadCommentsFromServer();
  //     this.loadCommentsFromServer1();
  //     this.loadCommentsFromServer2();
  //     this.loadCommentsFromServer3();
  //   }
  //   if (
  //     prevProps.period !== this.props.period ||
  //     prevProps.start !== this.props.start ||
  //     prevProps.end !== this.props.end
  //   ) {
  //     // console.log('year3 state has changed.');
  //     this.loadCommentsFromServer();
  //     this.loadCommentsFromServer2();
  //   }
  // }
  componentDidUpdate(prevProps) {
    const { year, period, start, end, department } = this.props;
    if (prevProps.year !== year || prevProps.period !== period || prevProps.start !== start || prevProps.end !== end || prevProps.department !== department) {
      this.loadInitialData();
    }
  }

  loadInitialData = async () => {
    try {
      this.loadCommentsFromServer();
      this.loadCommentsFromServer1();
      this.loadCommentsFromServer3();
      this.loadCommentsFromServer2();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  loadCommentsFromServer() {
    let period = this.props.period || this.state.period;
    axios
      .get(
        this.state.url +
          '?page=' +
          this.state.selected +
          '&size=' +
          this.state.perPage +
          '&year=' +
          (parseInt(this.props.year) - 543) +
          '&time=' +
          period +
          this.state.departmentSearch +
          '&project_name=' +
          this.state.keyword +
          (this.state.projectStatus ? '&project_status=' + this.state.projectStatus : '') +
          '&month_start=' +
          this.props.start +
          '&month_end=' +
          this.props.end,
        { totalPage: this.state.perPage, offset: this.state.offset },
      )
      .then(res => {
        const resultz = res.data.result.result;
        if (resultz.length === 0 && this.state.selected > 1) {
          this.handlePageClick({ selected: this.state.selected - 2 }); // ลดเพจเมื่อไม่มีผลลัพธ์และ selected มากกว่า 1
        } else {
          this.setState({
            data: resultz,
            pageCount: Math.ceil(res.data.result.pagination.itemTotal / this.state.perPage),
          });
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  handlePageClick = data => {
    let selected = data.selected + 1; // เพิ่ม 1 เพราะ data.selected เริ่มจากศูนย์

    // ตรวจสอบให้แน่ใจว่า selected ไม่มีทางน้อยกว่า 1
    if (selected < 1) {
      selected = 1;
    }

    let offset = (selected - 1) * this.state.perPage; // คำนวณ offset ตาม selected page

    // ป้องกัน offset ติดลบ
    if (offset < 0) offset = 0;

    this.setState({ offset, selected, currenpage: selected - 1 }, () => {
      this.loadCommentsFromServer();
      this.loadCommentsFromServer2();
    });
  };
  loadCommentsFromServer1() {
    $.ajax({
      url: process.env.REACT_APP_SOURCE_URL + '/budgetReports/getReport?year=' + (parseInt(this.props.year) - 543),
      dataType: 'json',
      type: 'GET',
      success: data => {
        let resultz = data;
        let a = data.report;
        let b = data.summary;
        this.setState({
          data1: resultz,
          projects: a,
          budget: b,
        });
      },

      error: (xhr, status, err) => {
        console.error(this.state.url, status, err.toString()); // eslint-disable-line
      },
    });
  }
  loadCommentsFromServer3() {
    $.ajax({
      url: process.env.REACT_APP_SOURCE_URL + '/budgetReports/getReportSuccess?year=' + (parseInt(this.props.year) - 543),
      dataType: 'json',
      type: 'GET',
      success: data => {
        this.setState({
          data3: data,
        });
      },
      error: (xhr, status, err) => {
        console.error(this.state.url, status, err.toString()); // eslint-disable-line
      },
    });
  }
  loadCommentsFromServer2() {
    let period = this.props.period ? this.props.period : this.state.period ? this.state.period : '';
    axios
      .get(
        this.state.url1 +
          '?year=' +
          (parseInt(this.props.year) - 543) +
          '&time=' +
          period +
          this.state.departmentSearch +
          '&project_name=' +
          this.state.keyword +
          (this.state.projectStatus ? '&project_status=' + this.state.projectStatus : '') +
          '&month_start=' +
          this.props.start +
          '&month_end=' +
          this.props.end,
        { totalPage: this.state.perPage, offset: this.state.offset },
      )
      .then(res => {
        let resultz = res.data;
        this.setState({
          data2: resultz,
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    // if (e.target.name === 'keyword') {
    //   this.setState({
    //     data: this.state.data1.filter(item => {
    //       return this.state.searchParam.some(newItem => {
    //         return (
    //           item[newItem]
    //             .toString()
    //             .toLowerCase()
    //             .indexOf(e.target.value.toLowerCase()) > -1
    //         );
    //       });
    //     }),
    //   });
    // }
    // this.loadCommentsFromServer();
    // this.loadCommentsFromServer2();
  };
  thaiDate = e => {
    // ตรวจสอบว่าค่าที่ส่งเข้ามาถูกต้องหรือไม่
    if (!e || !moment(e).isValid()) return '';

    // ดึงค่าต่าง ๆ จากวันที่
    var date = moment(e).get('date');
    var month = moment(e).get('month'); // ค่าของเดือนจะอยู่ในช่วง 0-11
    var year = moment(e).get('year') + 543; // แปลงปี

    // หาชื่อเดือนที่ตรงกับค่า month
    let monthObj = monthList.find(list => list.no === month);

    // ตรวจสอบว่าพบชื่อเดือนหรือไม่
    let monthThai = monthObj ? monthObj.nameshort : ''; // ใช้ nameshort

    // ส่งค่ากลับในรูปแบบ วันที่ ชื่อเดือน ปี
    return `${date} ${monthThai} ${year}`;
  };
  projectProgressStatus = e => {
    let status;
    if (e === 0) {
      status = 'โครงการยังไม่ดำเนินการ';
    }
    if (e === 1) {
      status = 'โครงการได้ตามกำหนดการ';
    }
    if (e === 2) {
      status = 'โครงการดำเนินการแล้วแต่ล่าช้า';
    }
    if (e === 3) {
      status = 'โครงการเบิกเงินแล้วสิ้นสุด';
    }
    if (e === 4) {
      status = 'โครงการยกเลิก';
    }
    if (e === 5) {
      status = 'โครงการเลยเวลามาแล้วยังไม่ดำเนินการทำ';
    }
    return status;
  };
  projectMoneyFormat = e => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e);
  };

  handleSelectPage = e => {
    this.setState({
      [e.target.name]: e.target.value,
      currenpage: 0,
      selected: 1,
    });
    setTimeout(() => {
      this.loadCommentsFromServer();
      this.loadCommentsFromServer2();
    }, 500);
  };

  headleSelectStatus = e => {
    let data = [];
    if (e.target.value !== '') {
      data = this.state.data1.filter(a => a.project_status.toString() === e.target.value.toString());
      this.setState({
        projectStatus: e.target.value,
        // data: data,
      });
    } else {
      this.setState({
        projectStatus: e.target.value,
        // data: this.state.data1,
      });
    }
  };
  handleSearch = e => {
    let form = $('#search')[0];
    const data = new FormData(form);
    for (const [name, value] of data) {
      this.setState({
        [name]: value,
      });
    }
    setTimeout(() => {
      this.loadCommentsFromServer();
      this.loadCommentsFromServer2();
    }, 100);
  };
  takeshot() {
    let div = document.getElementById('gendiv1');

    html2canvas(div)
      .then(function (canvas) {
        const img = canvas.toDataURL('image/png');
        let a = document.createElement('a');

        // Format the date using moment.js for a more readable filename
        let formattedDate = moment().format('YYYY-MM-DD_HH-mm-ss');
        a.href = img;
        a.download = `Image_project_${formattedDate}.png`; // Use formatted date
        a.click();
      })
      .catch(function (error) {
        console.error('Error capturing screenshot:', error); // Error handling
      });
  }
  countDate(start, finish) {
    var a = moment(start);
    var b = moment(finish);
    var diff = b.diff(a, 'days');
    return diff >= 0 ? diff + 1 : 0;
  }
  render() {
    return (
      <>
        <Row>
          {/* <Col sm={12} className="form-inline" style={{ paddingLeft: '0px' }}> */}
          <Col sm={12}>
            <div className="mb-2">
              <div className="box-14 ">
                <Grid container spacing={1}>
                  <Form id="search" className="col-md-12">
                    <Row>
                      <Grid item md={3} style={{ textAlign: 'right' }}>
                        <table style={{ width: '100%', textAlign: 'right' }}>
                          <tbody>
                            <tr style={{ height: '50px' }}>
                              <td>
                                <div>
                                  <BsDot size={24} /> เลือกแสดง
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Grid>
                      <Grid item md={6}>
                        <table style={{ width: '100%' }}>
                          <tbody>
                            <tr style={{ height: '50px' }}>
                              <td>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>ค้นหา</span>
                                  <Input type="text" name="keyword" value={this.state.keyword} onChange={this.handleInputChange} placeholder={'ค้นหา' + this.props.title}></Input>
                                  {/* <Input
                                type="select"
                                name="selectData"
                                value={this.state.selectData}
                                onChange={this.handleInputChange}
                              >
                                <option value={''}>ทั้งหมด</option>
                                <option value={1}>ข้อมูลยุทธศาสตร์</option>
                                <option value={2}>ข้อมูลแผนงาน</option>
                                <option value={3}>
                                  ข้อมูลนโยบายนายกเทศมนตรีประจำปี
                                </option>
                                <option value={4}>
                                  ข้อมูลประเภทงบประมาณ (งบประมาณรายรับ)
                                </option>
                                <option value={5}>
                                  ข้อมูลประเภทงบประมาณ (งบประมาณรายจ่าย)
                                </option>
                                <option value={6}>ข้อมูลประเภทโครงการ</option>
                              </Input> */}
                                </div>
                              </td>
                              {/* <td style={{ width: '50%' }}></td> */}
                            </tr>
                            {this.state.selectData.toString() === '1' ? (
                              <tr style={{ height: '50px' }}>
                                <td style={{ width: '50%' }}>
                                  <div className="flex">
                                    <span style={{ width: '30%' }}>ด้าน</span>
                                    <Input type="select" name="dataType" value={this.state.dataType} onChange={this.handleInputChange}>
                                      <option>ทั้งหมด</option>
                                      <option>ข้อมูลยุทธศาสตร์ชาติ</option>
                                      <option>ข้อมูลแผนแม่บทชาติ</option>
                                      <option>ข้อมูลแผนพัฒนาเศรษฐกิจ</option>
                                      <option>ข้อมูลการพัฒนาที่ยั่งยืน (SDGs)</option>
                                      <option>ข้อมูลยุทธศาสตร์จังหวัด</option>
                                      <option>ข้อมูลยุทธศาสตร์องค์การปกครองท้องถิ่น</option>
                                      <option>ข้อมูลยุทธศาสตร์เทศบาลนครนนทบุรี</option>
                                    </Input>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              ''
                            )}

                            {this.state.selectData.toString() === '2' ? (
                              <tr style={{ height: '50px' }}>
                                <td style={{ width: '50%' }}>
                                  <div className="flex">
                                    <span style={{ width: '30%' }}>ด้าน</span>
                                    <Input type="select" name="dataType" value={this.state.dataType} onChange={this.handleInputChange}>
                                      <option>ทั้งหมด</option>
                                      <option>ด้านบริหารทั่วไป</option>
                                      <option>ด้านบริการชุมชนและสังคม</option>
                                      <option>ด้านการเศรษฐกิจ</option>
                                      <option>ด้านการดำเนินงานอื่น</option>
                                    </Input>
                                  </div>
                                </td>
                                <td style={{ width: '50%' }}>
                                  {this.state.selectData.toString() === '2' ? (
                                    <div className="flex">
                                      <span style={{ width: '30%' }}>แผน</span>
                                      <Input type="select" name="plan" placeholder="">
                                        <option>ทั้งหมด</option>
                                      </Input>
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                </td>
                              </tr>
                            ) : (
                              ''
                            )}
                            <tr style={{ height: '50px' }}>
                              <td>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>สถานะ</span>
                                  <Input
                                    type="select"
                                    name="projectStatus"
                                    // value={this.state.projectStatus}
                                    // onChange={this.handleInputChange}
                                  >
                                    <option value="">ทั้งหมด</option>
                                    {/* <option value="0">
                                      บันทึกข้อมูลโครงการ
                                    </option>
                                    <option value="1">ยังไม่ดำเนินการ</option>
                                    <option value="2">
                                      อยู่ระหว่างดำเนินการ
                                    </option>
                                    <option value="3">ดำเนินการแล้ว</option>
                                    <option value="4">
                                      ยกเลิกการดำเนินการ
                                    </option> */}
                                    <option value={3}>โครงการเบิกเงินแล้วสิ้นสุด</option>
                                    <option value={1}>โครงการได้ตามกำหนดการ</option>
                                    <option value={2}>โครงการดำเนินการแล้วแต่ล่าช้า</option>
                                    <option value={0}>โครงการยังไม่ดำเนินการ</option>
                                    <option value={5}>โครงการเลยเวลามาแล้วยังไม่ดำเนินการทำ</option>
                                    <option value={4}>โครงการยกเลิก</option>
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Grid>
                      <Grid item md={1} style={{ alignContent: 'end' }}>
                        {/* <Input
                          type="button"
                          className="btn btn-success ml-2"
                          style={{ marginBottom: '5px' }}
                          value="ค้นหา"
                          onClick={this.handleSearch}
                        /> */}
                        <Button type="button" className="btn btn-success" style={{ marginBottom: '6px', borderRadius: '10px' }} onClick={this.handleSearch}>
                          ค้นหา
                        </Button>
                      </Grid>
                    </Row>
                  </Form>
                </Grid>
                <div></div>
              </div>
            </div>
          </Col>
          <Col sm={6}>
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

          <Col sm={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* <ExportCSV
              fileName={
                'ข้อมูลโครงการ' +
                moment().format('DD/MM') +
                '/' +
                (moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543)
              }
              tableId={document.getElementById('table1')}
            />
            <div className="box-5 ml-2" onClick={this.takeshot}>
              Export PNG
            </div> */}

            <ExportExcel DataExport={this.state.data2} fileName={'ข้อมูลโครงการ ' + moment().format('DD/MM') + '/' + (moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543)} />
            <div className="box-16 ml-2" onClick={this.takeshot}>
              ส่งออก PNG
            </div>
            {userPermission[0].manageUsersData === true ? (
              <ExportBudget
                data={this.state.data1}
                projects={this.state.projects}
                reportSucess={this.state.data3}
                summary={this.state.budget}
                fileName={'ข้อมูลงบประมาณ' + moment().format('DD/MM') + '/' + (moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543)}
                year={this.props.year}
              />
            ) : (
              ''
            )}
          </Col>

          <Col>
            {/* <Card className="mb-12">
            <CardBody> */}
            <span
              id="gendiv1"
              style={{
                width: '100%',
                height: '100%',
                //position: 'absolute',
              }}
            >
              <Table responsive borderless id="table1">
                <thead>
                  <tr style={{ backgroundColor: '#e0ecfa' }}>
                    <th style={{ textAlign: 'center' }}>ลำดับ</th>
                    {/* <th>BudgetSouceID</th> */}
                    <th style={{ textAlign: 'center', width: '400px' }}>ชื่อโครงการ</th>
                    <th style={{ textAlign: 'center' }}>แหล่งที่มาของเงินงบประมาณ</th>
                    <th style={{ textAlign: 'left' }}>งบประมาณ</th>
                    <th style={{ textAlign: 'center', width: '15%' }}>การเบิกจ่ายงบประมาณ</th>
                    <th style={{ textAlign: 'center', width: '15%' }}>ความก้าวหน้าโครงการ</th>
                    <th style={{ textAlign: 'center' }}>วันเริ่มต้นโครงการ</th>
                    <th style={{ textAlign: 'center' }}>วันสิ้นสุดโครงการ</th>
                    <th style={{ textAlign: 'center' }}>ระยะเวลาดําเนินโครงการ</th>
                    <th style={{ textAlign: 'center' }}>หมายเหตุ</th>
                    <th style={{ textAlign: 'center' }}>สถานะ</th>
                    <th style={{ textAlign: 'center' }}>รายงาน</th>
                    <th style={{ textAlign: 'center', width: '120px' }}>จัดการข้อมูล</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.length == 0 ? (
                    <tr>
                      <td colSpan="8" align="center">
                        ไม่มีข้อมูล
                      </td>
                    </tr>
                  ) : (
                    this.state.data.map((id, i) => (
                      <CustomTooltip
                        key={id.project_id}
                        title={this.state.hoverRowId === id.project_id && this.state.tooltipContent ? <div dangerouslySetInnerHTML={{ __html: this.state.tooltipContent }} /> : ''}
                        arrow
                        placement="top"
                      >
                        <tr onMouseEnter={() => this.handleMouseEnter(id.project_id)} onMouseLeave={this.handleMouseLeave}>
                        <td style={{ textAlign: 'center' }}>{(parseInt(this.state.selected) - 1) * this.state.perPage + (i + 1)}</td>
                        <td>{id.project_name}</td>
                        <td>{id.project_revenue_budget_type_name}</td>
                        <td style={{ textAlign: 'center' }}>{this.projectMoneyFormat(id.project_total_budget)}</td>
                        <td style={{ textAlign: 'center' }}>
                          {/* <Grid container spacing={1} className="flex">
                          <Grid item sm={12} md={9}>
                            <BorderLinearProgress
                              variant="determinate"
                              value={49}
                              colors={'#ffaa22'}
                            />
                          </Grid>
                          <Grid item sm={12} md={3}>
                            <Chip
                              label="49%"
                              color="primary"
                              size="small"
                              style={{ backgroundColor: '#ffaa22' }}
                            />
                          </Grid>
                        </Grid> */}
                          <ProgressBar dataprogress={id.budget_progress} />
                          {/* <ProgressBar dataprogress={97} /> */}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <ProgressBar dataprogress={id.project_progress} />
                          {/* <ProgressBar dataprogress={100} /> */}
                        </td>
                        <td style={{ textAlign: 'center' }}>{this.thaiDate(id.project_start)}</td>
                        <td style={{ textAlign: 'center' }}>{this.thaiDate(id.project_finish)}</td>
                        <td style={{ textAlign: 'center' }}>{id.project_count_day ? id.project_count_day : this.countDate(id.project_start, id.project_finish)} วัน</td>
                        <td style={{ textAlign: 'center' }}>{id.project_note && id.project_note.length > 50 ? id.project_note.substring(0, 50) + '...' : id.project_note}</td>
                        <td style={{ textAlign: 'center' }}>{this.projectProgressStatus(id.project_status)}</td>
                        <td style={{ textAlign: 'center' }}>
                          {id.project_executive > 0 ? (
                            <span className="Report-button">
                              <Icon style={{ color: 'green' }}>check</Icon>
                            </span>
                          ) : (
                            <span className="Report-button">
                              <Icon style={{ color: 'red' }}>clearoutlined</Icon>
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Grid container spacing={1} className="flex">
                            {/* <Grid item sm={6} md={4}>
                              <Tooltip title="แก้ไข">
                                <span
                                  className="edit-button"
                                  onClick={() =>
                                    (window.location.href = `/AllProject/EditProject1/${id.project_id}`)
                                  }
                                >
                                  <Icon style={{ fontSize: '14px' }}>edit</Icon>
                                </span>
                              </Tooltip>
                            </Grid>
                            <Grid item sm={6} md={4}>
                              <Tooltip title="ลบ">
                                <span
                                  className="delete-button"
                                  onClick={() =>
                                    this.testAxiosDELETE(id.project_id)
                                  }
                                >
                                  <Icon style={{ fontSize: '14px' }}>
                                    delete_outline
                                  </Icon>
                                </span>
                              </Tooltip>
                            </Grid> */}
                            <Grid item sm={12} md={12}>
                              <Tooltip title="ดูข้อมูล">
                                <Link to={`/ReportActivities/ReportDetail2/${id.project_id}`}>
                                  <span className="view-button">
                                    <Icon style={{ fontSize: '14px' }}>grid_view</Icon>
                                  </span>
                                </Link>
                              </Tooltip>
                            </Grid>
                          </Grid>

                          {/* </div> */}
                        </td>
                      </tr>
                      </CustomTooltip>
                    ))
                  )}
                </tbody>
              </Table>
            </span>
            <Table responsive borderless id="table2" style={{ display: 'none' }}>
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  {/* <th>BudgetSouceID</th> */}
                  <th style={{ textAlign: 'center' }}>ชื่อโครงการ</th>
                  <th style={{ textAlign: 'left' }}>งบประมาณ</th>
                  <th style={{ textAlign: 'center' }}>การเบิกจ่ายงบประมาณ(%)</th>
                  <th style={{ textAlign: 'center' }}>ความก้าวหน้าโครงการ(%)</th>
                  <th style={{ textAlign: 'center' }}>วันเริ่มต้นโครงการ</th>
                  <th style={{ textAlign: 'center' }}>วันสิ้นสุดโครงการ</th>
                  <th style={{ textAlign: 'center' }}>สถานะ</th>
                  {/* <th style={{ textAlign: 'center' }}>จัดการข้อมูล</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.data2.length == 0 ? (
                  <tr>
                    <td colSpan="8" align="center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  this.state.data2.map((id, i) => (
                    <tr key={'tableproject2' + i}>
                      <td style={{ textAlign: 'center' }}>{(parseInt(this.state.selected) - 1) * 10 + (i + 1)}</td>
                      <td>{id.project_name}</td>
                      <td style={{ textAlign: 'center' }}>{this.projectMoneyFormat(id.project_total_budget)}</td>
                      <td style={{ textAlign: 'center' }}>
                        {id.budget_progress}
                        {/* <ProgressBar dataprogress={id.budget_progress} /> */}
                        {/* <ProgressBar dataprogress={97} /> */}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {id.project_progress}
                        {/* <ProgressBar dataprogress={id.project_progress} /> */}
                        {/* <ProgressBar dataprogress={100} /> */}
                      </td>
                      <td style={{ textAlign: 'center' }}>{this.thaiDate(id.project_start)}</td>
                      <td style={{ textAlign: 'center' }}>{this.thaiDate(id.project_finish)}</td>
                      <td style={{ textAlign: 'center' }}>{this.projectProgressStatus(id.project_status)}</td>
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
            <Modal isOpen={this.state.modal} toggle={this.toggle()} className={this.props.className}>
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
                        name="ministry"
                        placeholder="ชื่อข้อมูล"
                        // onChange={this.handleInputChange}
                        // value={this.state.PlanName}
                        //
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
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
