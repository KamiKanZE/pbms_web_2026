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
import { Link } from 'react-router-dom';
import { AiOutlineEye } from 'react-icons/ai';
import ProgressBar from '../ProgressBar';
import { fetchData, processFileDocuments } from '../../utils/fileUtils';
import { userID, userName, token_id, monthList, performanceOptions, durationOptions, userPermission } from '../constants';
import { withStyles } from '@material-ui/core/styles';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GridViewIcon from '@mui/icons-material/GridView';

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    fontSize: '12px', // ขยายขนาดตัวอักษร
    maxWidth: 600, // ขยายความกว้างของ Tooltip
    padding: theme.spacing(1), // เพิ่ม padding เพื่อขยาย Tooltip
  },
}))(Tooltip);
const MySwal = withReactContent(Swal);

export default class DashboardReportProjectList extends React.Component {
  constructor(props) {
    super(props);
    const defaultPage = this.props.page ? parseInt(this.props.page, 10) : 1;
    this.state = {
      Budget: [],
      BudgetSources: [],
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
      selected: defaultPage,
      currentPage: defaultPage - 1,
      offset: 0,
      perPage: 10,
      offset2: 0,
      perPage2: 10,
      keyword: '',
      url: `${process.env.REACT_APP_SOURCE_URL}/projects/list`,
      selectData: '',
      subStrategy: '',
      dataType: '',
      projectStatus: this.props.select_status || '',
      selectBasicData: '',
      departmentSearch: this.props.select_department ? `&project_department=${this.props.select_department}` : '',
      projectTypeList: [],
      projectNationalStrategyList: [],
      projectPolicyList: [],
      projectMasterplanList: [],
      projectDevelopmentPlanList: [],
      projectDevelopmentGoalList: [],
      projectProvinceStrategyList: [],
      projectLocalStrategyList: [],
      projectMunicipalityStrategyList: [],
      subStrategyList: [],
      projectNonLivableList: [],
      projectITMasterPlanList: [],
      projectSmartCityList: [],
      projectPlanList: [],
      projectRevenueBudgetTypeList: [],
      projectExpenditureBudgetTypeList: [],
      projectDepartmentList: [],
      tooltipContent: '',
      hoverRowId: null,
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
        const { project_object, project_output_goal, project_outcome_goal, project_expected_benefit, project_benefit } = response.data.result;

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

  // _onRefresh = () => {
  //   this.setState({ refreshing: true });
  //   this.loadCommentsFromServer().then(() => {
  //     this.setState({ refreshing: false });
  //   });
  // };

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
      .delete(process.env.REACT_APP_SOURCE_URL + '/projects/' + id, {
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
        //this.loadCommentsFromServer2();
        //setTimeout(() => (window.location.href = '/AllProject/'), 1000);
        // this.loadCommentsFromServer();//this.loadCommentsFromServer2();
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
          //this.loadCommentsFromServer2();
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
          //this.loadCommentsFromServer2();
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
    //this.loadCommentsFromServer2();
    this.getProjectType();
    this.getDataNationPlans();
    this.getDataPolicies();
    this.getDataMasterPlans();
    this.getDataDevelopmentPlans();
    this.getDataDevelopmentGoals();
    this.getDataProvincePlans();
    this.getDataLocalPlans();
    this.getDataMunicipalityPlans();
    this.getDataLivableCities();
    this.getDataITMasterPlan();
    this.getDataSmartCity();
    this.getDataPlans();
    this.getDataRevenueTypes();
    this.getDataExpenditureTypes();
    this.getDataDepartments();
  }
  getProjectType() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataProjectTypes/list?size=100').then(res => {
      this.setState({
        projectTypeList: res.data.result,
      });
    });
  }
  getDataNationPlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataNationPlans/list?size=100').then(res => {
      this.setState({
        projectNationalStrategyList: res.data.result,
      });
    });
  }
  getDataPolicies() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataPolicies/list?size=100').then(res => {
      this.setState({
        projectPolicyList: res.data.result,
      });
    });
  }
  getDataMasterPlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataMasterPlans/list?size=100').then(res => {
      this.setState({
        projectMasterplanList: res.data.result,
      });
    });
  }
  getDataDevelopmentPlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataDevelopmentPlans/list?size=100').then(res => {
      this.setState({
        projectDevelopmentPlanList: res.data.result,
      });
    });
  }
  getDataDevelopmentGoals() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataDevelopmentGoals/list?size=100').then(res => {
      this.setState({
        projectDevelopmentGoalList: res.data.result,
      });
    });
  }
  getDataProvincePlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataProvincePlans/list?size=100').then(res => {
      this.setState({
        projectProvinceStrategyList: res.data.result,
      });
    });
  }
  getDataLocalPlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataLocalPlans/list?size=100').then(res => {
      this.setState({
        projectLocalStrategyList: res.data.result,
      });
    });
  }
  getDataMunicipalityPlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataMunicipalityPlans/list?size=100').then(res => {
      this.setState({
        projectMunicipalityStrategyList: res.data.result,
      });
    });
  }
  getDataSubStrategy(id) {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataMunicipalityPlans/subStrategy/list/' + id).then(res => {
      this.setState({
        subStrategyList: res.data,
      });
    });
  }
  getDataLivableCities() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataLivableCities/list?size=100').then(res => {
      this.setState({
        projectNonLivableList: res.data.result,
      });
    });
  }
  getDataITMasterPlan() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataITMasterPlans/list?size=100').then(res => {
      this.setState({
        projectITMasterPlanList: res.data.result,
      });
    });
  }
  getDataSmartCity() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataSmartCities/list?size=100').then(res => {
      this.setState({
        projectSmartCityList: res.data.result,
      });
    });
  }
  getDataPlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataPlans/list?size=100').then(res => {
      this.setState({
        projectPlanList: res.data.result,
      });
    });
  }
  getDataRevenueTypes() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataRevenueTypes/list?size=100').then(res => {
      this.setState({
        projectRevenueBudgetTypeList: res.data.result,
      });
    });
  }
  getDataExpenditureTypes() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataExpenditureTypes/list?size=100').then(res => {
      this.setState({
        projectExpenditureBudgetTypeList: res.data.result,
      });
    });
  }
  getDataDepartments() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataDepartments/list?size=100').then(res => {
      this.setState({
        projectDepartmentList: res.data.result,
      });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log(prevProps.select_department,this.props.select_department);
    if (prevProps.year !== this.props.year) {
      // console.log('year3 state has changed.');
      this.loadCommentsFromServer();
    }
    if (prevProps.select_department !== this.props.select_department) {
      // console.log('select_department state has changed.');
      this.loadCommentsFromServer();
    }
    if (prevProps.period !== this.props.period) {
      // console.log('period report list state has changed.');
      this.loadCommentsFromServer();
    }
    if (prevState.projectStatus !== this.state.projectStatus) {
      // console.log('projectStatus state has changed.');
      this.loadCommentsFromServer();
    }
    if (prevState.selectBasicData !== this.state.selectBasicData) {
      // console.log('selectBasicData state has changed.');
      this.loadCommentsFromServer();
    }
    if (prevState.subStrategy !== this.state.subStrategy) {
      this.loadCommentsFromServer();
    }
    if (prevProps.select_status !== this.props.select_status) {
      this.setState({
        projectStatus: this.props.select_status,
      });
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
        '&year=' +
        (parseInt(this.props.year) - 543) +
        '&time=' +
        (this.props.period ? this.props.period : '') +
        (this.props.select_department ? '&project_department=' + this.props.select_department : '') +
        (this.state.projectStatus || this.state.projectStatus == 0 ? '&project_status=' + this.state.projectStatus : '') +
        (this.state.selectBasicData ? '&' + this.state.selectBasicData : '') +
        (this.state.subStrategy ? '&sub_strategy=' + this.state.subStrategy : ''),

      data: {
        totalPage: this.state.perPage,
        offset: this.state.offset,
      },
      dataType: 'json',
      type: 'GET',
      success: data => {
        let resultz = data.result.result;
        if (data.result.result.length === 0 && this.state.selected !== 0) {
          this.handlePageClick({ selected: this.state.selected - 2 });
        } else {
          if (this.state.selected === 0) {
            this.setState({
              selected: 1,
            });
          }
          this.setState({
            data: resultz,
            pageCount: Math.ceil(data.result.pagination.itemTotal / this.state.perPage),
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
    this.setState({ offset: offset, selected: selected, currenpage: selected - 1 }, () => {
      this.loadCommentsFromServer();
      //this.loadCommentsFromServer2();
    });
  };
  handleInputChange = e => {

    if (e.target.name === 'selectData' && e.target.value === '') {
      this.setState({
        [e.target.name]: e.target.value,
        dataType: '',
        selectBasicData: '',
        subStrategy: '',
        // projectStatus: '', //เปลี่ยน status เป็นทั้งหมด
      });
    } else if (e.target.name === 'selectBasicData' && this.state.selectData.toString() === '1' && this.state.dataType.toString() === '7') {
      const v = e.target.value.split('=')[1];
      this.getDataSubStrategy(v);
      this.setState({
        [e.target.name]: e.target.value,
        subStrategy: '',
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
        // selectBasicData: '',
      });
    }

    //this.loadCommentsFromServer();
    //this.loadCommentsFromServer2();
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
    // if (e === 0) {
    //   status = 'บันทึกข้อมูลโครงการ';
    // }
    // if (e === 1) {
    //   status = 'ยังไม่ดำเนินการ';
    // }
    // if (e === 2) {
    //   status = 'อยู่ระหว่างดำเนินการ';
    // }
    // if (e === 3) {
    //   status = 'ดำเนินการแล้ว';
    // }
    // if (e === 4) {
    //   status = 'ยกเลิกการดำเนินการ';
    // }
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
    });
    setTimeout(() => {
      this.loadCommentsFromServer();
      //this.loadCommentsFromServer2();
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

  render() {
    return (
      <>
        <Row>
          <Col sm={12}>
            <div>
              <div className="box-13 mb-2">ข้อมูลโครงการทั้งหมด</div>
              <div className="mb-2">
                <div className="box-14 ">
                  <Grid container spacing={1}>
                    <Grid item md={3} style={{ textAlign: 'right' }}>
                      <li className="mt-2">เลือกแสดง</li>
                    </Grid>
                    <Grid item md={9}>
                      <table style={{ width: '80%' }}>
                        <tbody>
                          <tr style={{ height: '50px' }}>
                            <td style={{ width: '100%' }}>
                              <div className="flex">
                                <span style={{ width: '30%' }}>ข้อมูล</span>
                                <Input type="select" name="selectData" value={this.state.selectData} onChange={this.handleInputChange}>
                                  <option value={''}>ทั้งหมด</option>
                                  <option value={1}>ข้อมูลยุทธศาสตร์</option>
                                  <option value={2}>ข้อมูลแผนงาน</option>
                                  <option value={3}>ข้อมูลนโยบายนายกเทศมนตรีประจำปี</option>
                                  <option value={4}>ข้อมูลประเภทงบประมาณ (งบประมาณรายรับ)</option>
                                  <option value={5}>ข้อมูลประเภทงบประมาณ (งบประมาณรายจ่าย)</option>
                                  <option value={6}>ข้อมูลประเภทโครงการ</option>
                                </Input>
                              </div>
                            </td>
                          </tr>
                          {this.state.selectData.toString() === '1' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>ด้าน</span>
                                  <Input type="select" name="dataType" value={this.state.dataType} onChange={this.handleInputChange}>
                                    <option value={0}>ทั้งหมด</option>
                                    <option value={1}>ข้อมูลยุทธศาสตร์ชาติ 20 ปี</option>
                                    <option value={2}>ข้อมูลแผนแม่บทชาติ</option>
                                    <option value={3}>ข้อมูลแผนพัฒนาเศรษฐกิจ</option>
                                    <option value={4}>ข้อมูลการพัฒนาที่ยั่งยืน (SDGs)</option>
                                    <option value={5}>ข้อมูลยุทธศาสตร์จังหวัด</option>
                                    <option value={6}>ข้อมูลยุทธศาสตร์องค์การปกครองท้องถิ่น</option>
                                    <option value={7}>ข้อมูลยุทธศาสตร์เทศบาลนนทบุรี</option>
                                    <option value={8}>ข้อมูล 6 ดี ของจังหวัดนนทบุรี</option>
                                    <option value={9}>ข้อมูลแผนปฎิบัติการดิจิทัลระยะ 5 ปี</option>
                                    <option value={10}>ข้อมูล Smart City</option>
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {/* ตัวเลือกข้อมูลพื้นฐาน */}
                          {this.state.selectData.toString() === '1' && this.state.dataType.toString() === '1' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectNationalStrategyList &&
                                      this.state.projectNationalStrategyList
                                        .filter(type => parseInt(type.national_strategy_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_national_strategy=' + type.national_strategy_id} key={'project_national_strategy' + no}>
                                            {type.national_strategy_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '1' && this.state.dataType.toString() === '2' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectMasterplanList &&
                                      this.state.projectMasterplanList
                                        .filter(type => parseInt(type.master_plan_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_master_plan=' + type.master_plan_id} key={'project_master_plan' + no}>
                                            {type.master_plan_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '1' && this.state.dataType.toString() === '3' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectDevelopmentPlanList &&
                                      this.state.projectDevelopmentPlanList
                                        .filter(type => parseInt(type.development_plan_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_development_plan=' + type.development_plan_id} key={'project_development_plan' + no}>
                                            {type.development_plan_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '1' && this.state.dataType.toString() === '4' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectDevelopmentGoalList &&
                                      this.state.projectDevelopmentGoalList
                                        .filter(type => parseInt(type.development_goal_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_development_goal=' + type.development_goal_id} key={'project_development_goal' + no}>
                                            {type.development_goal_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '1' && this.state.dataType.toString() === '5' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectProvinceStrategyList &&
                                      this.state.projectProvinceStrategyList
                                        .filter(type => parseInt(type.province_strategy_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_province_strategy=' + type.province_strategy_id} key={'project_province_strategy' + no}>
                                            {type.province_strategy_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '1' && this.state.dataType.toString() === '6' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectLocalStrategyList &&
                                      this.state.projectLocalStrategyList
                                        .filter(type => parseInt(type.local_strategy_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_local_strategy=' + type.local_strategy_id} key={'project_local_strategy' + no}>
                                            {type.local_strategy_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '1' && this.state.dataType.toString() === '7' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectMunicipalityStrategyList &&
                                      this.state.projectMunicipalityStrategyList
                                        .filter(type => parseInt(type.municipality_strategy_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_municipality_strategy=' + type.municipality_strategy_id} key={'project_municipality_strategy' + no}>
                                            {type.municipality_strategy_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '1' && this.state.dataType.toString() === '7' && this.state.selectBasicData ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>กลยุทธ์</span>
                                  <Input type="select" name="subStrategy" onChange={this.handleInputChange} value={this.state.subStrategy}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.subStrategyList &&
                                      this.state.subStrategyList
                                        .filter(type => parseInt(type.sub_strategy_status) === 1)
                                        .map((type, no) => (
                                          <option value={type.sub_strategy_id} key={'optionSubStrategy' + no}>
                                            {type.sub_strategy_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '1' && this.state.dataType.toString() === '8' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectNonLivableList &&
                                      this.state.projectNonLivableList
                                        .filter(type => parseInt(type.non_livable_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_non_livable=' + type.non_livable_id} key={'project_non_livable' + no}>
                                            {type.non_livable_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '1' && this.state.dataType.toString() === '9' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectITMasterPlanList &&
                                      this.state.projectITMasterPlanList
                                        .filter(type => parseInt(type.it_master_plan_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_it_master_plan=' + type.it_master_plan_id} key={'project_it_master_plan' + no}>
                                            {type.it_master_plan_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '1' && this.state.dataType.toString() === '10' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectSmartCityList &&
                                      this.state.projectSmartCityList
                                        .filter(type => parseInt(type.smart_city_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_smart_city=' + type.smart_city_id} key={'project_smart_city' + no}>
                                            {type.smart_city_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '2' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>ด้าน</span>
                                  <Input type="select" name="dataType" value={this.state.dataType} onChange={this.handleInputChange}>
                                    <option value={''}>ทั้งหมด</option>
                                    <option value={1}>ด้านบริหารทั่วไป</option>
                                    <option value={2}>ด้านบริการชุมชนและสังคม</option>
                                    <option value={3}>ด้านการเศรษฐกิจ</option>
                                    <option value={4}>ด้านการดำเนินงานอื่น</option>
                                  </Input>

                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.dataType !== ''
                                      ? this.state.projectPlanList &&
                                        this.state.projectPlanList
                                          .filter(type => parseInt(type.plan_status) === 1 && type.plan_type === this.state.dataType)
                                          .map((type, no) => (
                                            <option value={'project_plan=' + type.plan_id} key={'project_plan' + no}>
                                              {type.plan_name}
                                            </option>
                                          ))
                                      : this.state.projectPlanList &&
                                        this.state.projectPlanList
                                          .filter(type => parseInt(type.plan_status) === 1)

                                          .map((type, no) => (
                                            <option value={'project_plan=' + type.plan_id} key={'project_plan' + no}>
                                              {type.plan_name}
                                            </option>
                                          ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '3' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectPolicyList &&
                                      this.state.projectPolicyList
                                        .filter(type => parseInt(type.policy_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_policy=' + type.policy_id} key={'project_policy' + no}>
                                            {type.policy_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '4' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectRevenueBudgetTypeList &&
                                      this.state.projectRevenueBudgetTypeList
                                        .filter(type => parseInt(type.revenue_type_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_revenue_budget_type=' + type.revenue_type_id} key={'project_revenue_budget_type' + no}>
                                            {type.revenue_type_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '5' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectExpenditureBudgetTypeList &&
                                      this.state.projectExpenditureBudgetTypeList
                                        .filter(type => parseInt(type.expenditure_type_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_expenditure_budget_type=' + type.expenditure_type_id} key={'project_expenditure_budget_type' + no}>
                                            {type.expenditure_type_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          {this.state.selectData.toString() === '6' ? (
                            <tr style={{ height: '50px' }}>
                              <td style={{ width: '100%' }}>
                                <div className="flex">
                                  <span style={{ width: '30%' }}>แผน</span>
                                  <Input type="select" name="selectBasicData" value={this.state.selectBasicData} onChange={this.handleInputChange}>
                                    <option value={''}>กรุณาเลือก</option>
                                    {this.state.projectTypeList &&
                                      this.state.projectTypeList
                                        .filter(type => parseInt(type.project_type_status) === 1)
                                        .map((type, no) => (
                                          <option value={'project_type=' + type.project_type_id} key={'project_type' + no}>
                                            {type.project_type_name}
                                          </option>
                                        ))}
                                  </Input>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                          <tr style={{ height: '50px' }}>
                            <td style={{ width: '100%' }}>
                              <div className="flex">
                                <span style={{ width: '30%' }}>สถานะ</span>
                                <Input type="select" name="projectStatus" value={this.state.projectStatus} onChange={this.headleSelectStatus}>
                                  <option value={''}>ทั้งหมด</option>
                                  {/* <option value={0}>บันทึกข้อมูลโครงการ</option>
                                  <option value={1}>ยังไม่ดำเนินการ</option>
                                  <option value={2}>
                                    อยู่ระหว่างดำเนินการ
                                  </option>
                                  <option value={3}>ดำเนินการแล้ว</option>
                                  <option value={4}>ยกเลิกการดำเนินการ</option> */}
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
                  </Grid>
                </div>
              </div>
            </div>
            {/* <div className="box-13 mb-2">ข้อมูลแผนงาน</div> */}
          </Col>
          <Col>
            {/* <Card className="mb-12">
            <CardBody> */}
            <Table responsive borderless hover id="table1">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  {/* <th>BudgetSouceID</th> */}
                  <th style={{ textAlign: 'center' }}>ชื่อโครงการ</th>
                  <th style={{ textAlign: 'left' }}>งบประมาณ</th>
                  <th style={{ textAlign: 'center', width: '15%' }}>การเบิกจ่ายงบประมาณ</th>
                  <th style={{ textAlign: 'center', width: '15%' }}>ความก้าวหน้าโครงการ</th>
                  <th style={{ textAlign: 'center' }}>วันเริ่มต้นโครงการ</th>
                  <th style={{ textAlign: 'center' }}>วันสิ้นสุดโครงการ</th>
                  <th style={{ textAlign: 'center' }}>สถานะ</th>
                  <th style={{ textAlign: 'center' }}>รายงาน</th>
                  <th style={{ textAlign: 'center' }}>ความเสี่ยง</th>
                  <th style={{ textAlign: 'center' }}>จัดการข้อมูล</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.length == 0 ? (
                  <tr>
                    <td colSpan="10" align="center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  this.state.data
                    .sort((a, b) => (a.project_total_budget > b.project_total_budget ? -1 : 1))
                    .map((id, i) => (
                      <CustomTooltip
                        key={id.project_id}
                        title={this.state.hoverRowId === id.project_id && this.state.tooltipContent ? <div dangerouslySetInnerHTML={{ __html: this.state.tooltipContent }} /> : ''}
                        arrow
                        placement="top"
                      >
                        <tr onMouseEnter={() => this.handleMouseEnter(id.project_id)} onMouseLeave={this.handleMouseLeave}>
                          <td style={{ textAlign: 'center' }}>{(parseInt(this.state.selected) - 1) * 10 + (i + 1)}</td>
                          <td>
                            {id.project_name} {`(${id.project_department_name})`}
                          </td>
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
                          <td style={{ textAlign: 'center' }}>{this.projectProgressStatus(id.project_status)}</td>
                          {/* <td style={{ textAlign: 'center' }}>
                          <Grid container spacing={1} className="flex">
                            <Grid item sm={12} md={12}>
                              <Link
                                to={`/ReportActivities/ReportDetail2/${id.project_id}`}
                              >
                                <Tooltip title="ดูรายงาน">
                                <span className="eye-view-button">
                                  <Icon>difference</Icon>
                                  </span>
                                </Tooltip>
                              </Link>
                            </Grid>
                          </Grid>
                        </td> */}
                          <td style={{ textAlign: 'center' }}>
                            {id.project_executive > 0 ? (
                              <span className="Report-button">
                                <CheckIcon style={{ color: 'green' }} />
                              </span>
                            ) : (
                              <span className="Report-button">
                                <ClearIcon style={{ color: 'red' }} />
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <Grid container spacing={1} className="flex">
                              <Grid item sm={12} md={12}>
                                <Link to={`/ReportActivities/ReportDetail4/${id.project_id}`}>
                                  <Tooltip title="ดูความเสี่ยง">
                                    <span className="eye-view-button">
                                      <VisibilityIcon />
                                    </span>
                                  </Tooltip>
                                </Link>
                              </Grid>
                            </Grid>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <Grid container spacing={1} className="flex">
                              <Grid item sm={12} md={12}>
                                <Tooltip title="ดูข้อมูล">
                                  <Link to={`/ReportActivities/ReportDetail1/${id.project_id}`}>
                                    <span className="view-button">
                                      <GridViewIcon style={{ fontSize: '14px' }} />
                                    </span>
                                  </Link>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </td>
                        </tr>
                      </CustomTooltip>
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
