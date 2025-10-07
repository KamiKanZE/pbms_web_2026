import React from 'react';
import axios from 'axios';
import Page from 'components/Page';
import { Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormFeedback, FormText, Input, Label, Button, FormGroup, keyword } from 'reactstrap';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import { Fab, Grid } from '@material-ui/core';
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
import { Typeahead } from 'react-bootstrap-typeahead';

const MySwal = withReactContent(Swal);
const token_id = localStorage.getItem('token');
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
export default class KPIDataDetailList extends React.Component {
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
      PlanID: '',
      PlanName: '',
      ID: '',
      isForm: '',
      data: [],
      data1: [{}, {}, {}],
      selected: 1,
      currenpage: id - 1,
      offset: 0,
      perPage: 10,
      keyword: '',
      url: process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi',

      kpi_id: '',
      kpi_type: '',
      kpi_type_name: '',
      kpi_code: id,
      kpi_year: moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543,
      kpi_no: '',
      kpi_name: '',
      kpi_unit: '',
      kpi_unit_name: '',
      kpi_target: '',
      kpi_report: [],
      kpi_department: [],

      unitList: [],
      departmentList: [],
      departmentList1: [],
      departmentAll: false,

      validationError: '',
      validationError1: '',
      validationError2: '',
      validationError3: '',
      validationError4: '',
      validationError5: '',
      validationError6: '',

      criteria: [
        {
          criteria_result: '',
          criteria_score: '',
        },
        {
          criteria_result: '',
          criteria_score: '',
        },
        {
          criteria_result: '',
          criteria_score: '',
        },
        {
          criteria_result: '',
          criteria_score: '',
        },
        {
          criteria_result: '',
          criteria_score: '',
        },
      ],
      criteria_result1: '',
      criteria_score1: '',
      criteria_result2: '',
      criteria_score2: '',
      criteria_result3: '',
      criteria_score3: '',
      criteria_result4: '',
      criteria_score4: '',
      criteria_result5: '',
      criteria_score5: '',
      criteria_id: '',
      kpi_id2: '',
      kpi_name2: '',
      criteria_status: '',
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

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadCommentsFromServer().then(() => {
      this.setState({ refreshing: false });
    });
  };
  getDataUnits() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataUnits/list?size=100').then(res => {
      
      this.setState({
        unitList: res.data.result,
      });
    });
  }
  getDepartmentList() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataDepartments/list?size=100').then(res => {
      this.setState({
        departmentList: res.data.result,
        departmentList1: res.data.result,
      });
    });
  }
  getKpiType = e => {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataKpiTypes/' + this.props.kpi_id).then(res => {
      const { _id, kpi_type_id, kpi_type_code, kpi_type_name } = res.data;
      this.setState({
        kpi_code: kpi_type_code,
        kpi_type_name: kpi_type_name,
        kpi_type: kpi_type_id,
      });
    });
  };
  getCriteriaByKpi = id => {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi/criteria/' + id).then(res => {
      if (res.data.result !== null) {
        const { criteria_id, kpi_id, kpi_name, criteria, criteria_status } = res.data.result;
        this.setState({
          criteria_id: criteria_id,
          kpi_id2: kpi_id,
          kpi_name2: kpi_name,
          criteria: criteria,
          criteria_result1: criteria[0].criteria_result,
          criteria_score1: criteria[0].criteria_score,
          criteria_result2: criteria[1].criteria_result,
          criteria_score2: criteria[1].criteria_score,
          criteria_result3: criteria[2].criteria_result,
          criteria_score3: criteria[2].criteria_score,
          criteria_result4: criteria[3].criteria_result,
          criteria_score4: criteria[3].criteria_score,
          criteria_result5: criteria[4].criteria_result,
          criteria_score5: criteria[4].criteria_score,
          criteria_status: criteria_status,
        });
      } else {
        this.setState({
          criteria: [
            {
              criteria_result: '',
              criteria_score: '',
            },
            {
              criteria_result: '',
              criteria_score: '',
            },
            {
              criteria_result: '',
              criteria_score: '',
            },
            {
              criteria_result: '',
              criteria_score: '',
            },
            {
              criteria_result: '',
              criteria_score: '',
            },
          ],
          criteria_result1: '',
          criteria_score1: '',
          criteria_result2: '',
          criteria_score2: '',
          criteria_result3: '',
          criteria_score3: '',
          criteria_result4: '',
          criteria_score4: '',
          criteria_result5: '',
          criteria_score5: '',
          criteria_id: '',
          criteria_status: '',
        });
      }
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi/' + id)
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
  };
  onEdit = id => {
    this.getDataUnits();
    this.getDepartmentList();
    axios.get(process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi/' + id).then(res => {
      const { kpi_id, kpi_type, kpi_type_name, kpi_code, kpi_year, kpi_no, kpi_name, kpi_unit, kpi_unit_name, kpi_target, kpi_report, kpi_department } = res.data.result[0];

      this.setState({
        modal: true,
        ID: '',
        isForm: 'edit',
        header: 'แก้ไข' + this.props.title,
        kpi_id: kpi_id,
        kpi_type: kpi_type,
        kpi_type_name: kpi_type_name,
        kpi_code: kpi_code,
        kpi_year: kpi_year,
        kpi_no: kpi_no,
        kpi_name: kpi_name,
        kpi_unit: kpi_unit,
        kpi_unit_name: kpi_unit_name,
        kpi_target: kpi_target,
        kpi_report: kpi_report,
        kpi_department: kpi_department,
        departmentAll: false,
        validationError1: '',
        validationError2: '',
        validationError3: '',
        validationError4: '',
        validationError5: '',
        validationError6: '',
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
    this.getKpiType();
    this.getDataUnits();
    this.getDepartmentList();
    this.setState({
      modal: true,
      isForm: '',
      header: 'เพิ่มข้อมูล' + this.props.title,
      kpi_id: '',
      // kpi_type: '',
      // kpi_type_name: '',
      //kpi_code: '',
      kpi_year: moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543,
      kpi_no: '',
      kpi_name: '',
      kpi_unit: '',
      kpi_unit_name: '',
      kpi_target: '',
      kpi_report: [],
      kpi_department: [],
      departmentAll: false,
      validationError1: '',
      validationError2: '',
      validationError3: '',
      validationError4: '',
      validationError5: '',
      validationError6: '',
    });
  }
  onScroe = (id, name) => {
    this.getCriteriaByKpi(id);
    this.setState({
      modal1: true,
      isForm: '',
      header: 'เพิ่มข้อมูล' + this.props.title,
      kpi_id2: id,
      kpi_name2: name,
    });
  };
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
      this.state.kpi_name.trim() &&
      this.state.kpi_unit &&
      this.state.kpi_target &&
      parseInt(this.state.kpi_target).toString() !== 'NaN' &&
      this.state.kpi_report.length > 0 &&
      this.state.kpi_year &&
      parseInt(this.state.kpi_year).toString() !== 'NaN' &&
      this.state.kpi_department.length > 0
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi',
          {
            kpi_type: this.state.kpi_type,
            kpi_type_name: this.state.kpi_type_name,
            kpi_code: this.state.kpi_code,
            kpi_year: this.state.kpi_year,
            kpi_no: this.state.data.length + 1,
            kpi_name: this.state.kpi_name,
            kpi_unit: this.state.kpi_unit,
            kpi_unit_name: this.state.unitList.filter(type => type.unit_id === this.state.kpi_unit)[0].unit_name,
            kpi_target: this.state.kpi_target,
            kpi_report: this.state.kpi_report,
            kpi_department: this.state.kpi_department,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            validationError1: '',
            validationError2: '',
            validationError3: '',
            validationError4: '',
            validationError5: '',
            validationError6: '',
          });

          MySwal.fire({
            title: <strong>บันทึกข้อมูลสำเร็จ</strong>,
            // html: <i>You clicked the button!</i>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          //setTimeout(() => (window.location.href = '/plan1/'), 1000);
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
      const validationError1 = this.state.kpi_name.trim() ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.kpi_unit ? '' : 'กรุณาเลือกข้อมูล';
      const validationError3 = this.state.kpi_target && parseInt(this.state.kpi_target).toString() !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError4 = this.state.kpi_report.length > 0 ? '' : 'กรุณาเลือกข้อมูล';
      const validationError5 = this.state.kpi_year && parseInt(this.state.kpi_year).toString() !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError6 = this.state.kpi_department.length > 0 ? '' : 'กรุณาเลือกข้อมูล';

      this.setState({
        validationError1: validationError1,
        validationError2: validationError2,
        validationError3: validationError3,
        validationError4: validationError4,
        validationError5: validationError5,
        validationError6: validationError6,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.kpi_id;
    if (
      this.state.kpi_name.trim() &&
      this.state.kpi_unit &&
      this.state.kpi_target &&
      parseInt(this.state.kpi_target).toString() !== 'NaN' &&
      this.state.kpi_report.length > 0 &&
      this.state.kpi_year &&
      parseInt(this.state.kpi_year).toString() !== 'NaN' &&
      this.state.kpi_department.length > 0
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi/' + ID,
          {
            kpi_type: this.state.kpi_type,
            kpi_type_name: this.state.kpi_type_name,
            kpi_code: this.state.kpi_code,
            kpi_year: this.state.kpi_year,
            kpi_no: this.state.kpi_no.toString(),
            kpi_name: this.state.kpi_name,
            kpi_unit: this.state.kpi_unit,
            kpi_unit_name: this.state.unitList.filter(type => type.unit_id === this.state.kpi_unit)[0].unit_name,
            kpi_target: this.state.kpi_target,
            kpi_report: this.state.kpi_report,
            kpi_department: this.state.kpi_department,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            validationError1: '',
            validationError2: '',
            validationError3: '',
            validationError4: '',
            validationError5: '',
            validationError6: '',
          });

          MySwal.fire({
            title: <strong>แก้ไขข้อมูลสำเร็จ</strong>,
            // html: <i>You clicked the button!</i>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
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
      const validationError1 = this.state.kpi_name.trim() ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.kpi_unit ? '' : 'กรุณาเลือกข้อมูล';
      const validationError3 = this.state.kpi_target && parseInt(this.state.kpi_target).toString() !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError4 = this.state.kpi_report.length > 0 ? '' : 'กรุณาเลือกข้อมูล';
      const validationError5 = this.state.kpi_year && parseInt(this.state.kpi_year).toString() !== 'NaN' ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError6 = this.state.kpi_department.length > 0 ? '' : 'กรุณาเลือกข้อมูล';

      this.setState({
        validationError1: validationError1,
        validationError2: validationError2,
        validationError3: validationError3,
        validationError4: validationError4,
        validationError5: validationError5,
        validationError6: validationError6,
      });
    }
  };

  handleSubmit3 = e => {
    e.preventDefault();

    if (this.state.criteria_id !== '' && this.state.criteria_id !== null && this.state.criteria_id !== undefined) {
      this.handleUpdateScore(e);
    } else {
      this.handlePostScore(e);
    }
  };

  handlePostScore = e => {
    e.preventDefault();
    const ID = this.state.kpi_id2;
    if (this.state.criteria.length > 0) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi/criteria/' + ID,
          {
            kpi_name: this.state.kpi_name2,
            criteria: [
              {
                criteria_result: this.state.criteria_result1,
                criteria_score: this.state.criteria_score1,
              },
              {
                criteria_result: this.state.criteria_result2,
                criteria_score: this.state.criteria_score2,
              },
              {
                criteria_result: this.state.criteria_result3,
                criteria_score: this.state.criteria_score3,
              },
              {
                criteria_result: this.state.criteria_result4,
                criteria_score: this.state.criteria_score4,
              },
              {
                criteria_result: this.state.criteria_result5,
                criteria_score: this.state.criteria_score5,
              },
            ],
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal1: false,
          });

          MySwal.fire({
            title: <strong>บันทึกข้อมูลสำเร็จ</strong>,
            // html: <i>You clicked the button!</i>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          //setTimeout(() => (window.location.href = '/plan1/'), 1000);
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
      const validationError6 = this.state.criteria.length > 0 ? '' : 'กรุณาใส่ข้อมูล';
    }
  };
  handleUpdateScore = e => {
    e.preventDefault();
    const ID = this.state.criteria_id;
    if (this.state.criteria.length > 0) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi/criteria/' + ID,
          {
            kpi_name: this.state.kpi_name2,
            criteria: [
              {
                criteria_result: this.state.criteria_result1,
                criteria_score: this.state.criteria_score1,
              },
              {
                criteria_result: this.state.criteria_result2,
                criteria_score: this.state.criteria_score2,
              },
              {
                criteria_result: this.state.criteria_result3,
                criteria_score: this.state.criteria_score3,
              },
              {
                criteria_result: this.state.criteria_result4,
                criteria_score: this.state.criteria_score4,
              },
              {
                criteria_result: this.state.criteria_result5,
                criteria_score: this.state.criteria_score5,
              },
            ],
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal1: false,
          });

          MySwal.fire({
            title: <strong>แก้ไขข้อมูลสำเร็จ</strong>,
            // html: <i>You clicked the button!</i>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
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
      const validationError6 = this.state.criteria.length > 0 ? '' : 'กรุณาใส่ข้อมูล';
    }
  };
  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
    this.getKpiType();
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
      url: this.state.url + '?page=' + this.state.selected + '&size=' + this.state.perPage + '&search=' + this.state.keyword,

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
  handleMultiSelectChange(e) {
    const selected = e.map(data => {
      // return data.no + 1;
      return {
        no: data.no,
        name: data.name,
      };
    });
    this.setState({ kpi_report: [] });
    this.setState(prevState => ({
      kpi_report: prevState.kpi_report.concat(selected),
    }));
  }
  handleMultiSelectChangeDepartment(e) {
    const selected = e.map(data => {
      // return data.no + 1;
      return {
        // no: data.no,
        // name: data.name,
        department_id: data.department_id,
        department_name: data.department_name,
      };
    });
    this.setState({ kpi_department: [] });
    this.setState(prevState => ({
      kpi_department: prevState.kpi_department.concat(selected),
    }));
  }
  handleMultiSelectDepartmentAll(e) {
    const selected = e.map(data => {
      return {
        department_id: data.department_id,
        department_name: data.department_name,
      };
    });
    this.setState({ kpi_department: [] });
    this.setState({
      kpi_department: selected,
      modal: false,
    });
    setTimeout(() => {
      this.setState({
        modal: true,
      });
    }, 500);
  }
  handleInputChangeCheck = e => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
    if (e.target.checked === true) {
      this.handleMultiSelectDepartmentAll(this.state.departmentList);
    } else {
      this.handleMultiSelectDepartmentAll([]);
    }
  };
  handleInputChangeNumber = e => {
    var value = NaN;
    if (parseInt(e.target.value) >= 0 && parseInt(e.target.value).toString() !== 'NaN') {
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
                      <Input type="text" name="keyword" placeholder={'ค้นหา'} onChange={this.handleInputChange} value={this.state.keyword} style={{ width: '100%' }}></Input>
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
                  <th style={{ textAlign: 'left' }}>ชื่อข้อมูล</th>
                  {userPermission[0].manageKPIData === true ? <th style={{ textAlign: 'center' }}>เกณฑ์การให้คะแนน</th> : ''}
                  {userPermission[0].manageKPIData === true ? <th style={{ textAlign: 'center' }}>จัดการข้อมูล</th> : ''}
                </tr>
              </thead>
              <tbody>
                {this.state.data.length === 0 ? (
                  <tr>
                    <td colSpan="4" align="center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  this.state.data.map((id, i) => (
                    <tr key={'table' + i}>
                      <td style={{ textAlign: 'center' }}>{(parseInt(this.state.selected) - 1) * 10 + (i + 1)}</td>
                      <td style={{ textAlign: 'left' }}>{id.kpi_name}</td>
                      {userPermission[0].manageKPIData === true ? (
                        <td style={{ textAlign: 'center' }}>
                          <Grid item sm={12} md={12}>
                            <Tooltip title="เกฑณ์">
                              <span className="view-button" onClick={() => this.onScroe(id.kpi_id, id.kpi_name)}>
                                <Icon style={{ fontSize: '14px' }}>pie_chart_outline</Icon>
                              </span>
                            </Tooltip>
                          </Grid>
                        </td>
                      ) : (
                        ''
                      )}
                      {userPermission[0].manageKPIData === true ? (
                        <td style={{ textAlign: 'center' }}>
                          {/* <div className="row" style={{ textAlign: 'center' }}> */}
                          <Tooltip title="แก้ไข">
                            <span className="edit-button" onClick={() => this.onEdit(id.kpi_id)}>
                              <Icon style={{ fontSize: '14px' }}>edit</Icon>
                            </span>
                          </Tooltip>
                          &nbsp;
                          <Tooltip title="ลบ">
                            <span className="delete-button" onClick={() => this.testAxiosDELETE(id.kpi_id)}>
                              <Icon style={{ fontSize: '14px' }}>delete_outline</Icon>
                            </span>
                          </Tooltip>
                          {/* </div> */}
                        </td>
                      ) : (
                        ''
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {this.state.data.length !== 0 ? (
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
                      ประเภทตัวชี้วัด <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input type="text" name="kpi_type_name" onChange={this.handleInputChange} value={this.state.kpi_type_name} disabled />
                    </Col>

                    <Label for="PlanName" sm={12}>
                      รหัสตัวชี้วัด <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input type="text" name="kpi_code" onChange={this.handleInputChange} value={this.state.kpi_code} disabled />
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ชื่อตัวชี้วัด <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input type="textarea" name="kpi_name" onChange={this.handleInputChange} value={this.state.kpi_name} />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>

                    <Grid container spacing={1}>
                      <Grid item sm={12} md={6}>
                        <Label for="PlanName" sm={12}>
                          หน่วยนับ <font color="red">*</font> :
                        </Label>
                        <Col sm={12}>
                          <Input type="select" name="kpi_unit" onChange={this.handleInputChange} value={this.state.kpi_unit}>
                            <option value={''}>กรุณาเลือก</option>
                            {this.state.unitList &&
                              this.state.unitList
                                .filter(type => parseInt(type.unit_status) === 1)
                                .map((type, no) => (
                                  <option value={type.unit_id} key={'optionUnit' + no}>
                                    {type.unit_name}
                                  </option>
                                ))}
                          </Input>
                        </Col>
                        <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                          {this.state.validationError2}
                        </Col>
                      </Grid>
                      <Grid item sm={12} md={6}>
                        <Label for="PlanName" sm={12}>
                          ค่าเป้าหมาย <font color="red">*</font> :
                        </Label>
                        <Col sm={12}>
                          <Input type="number" name="kpi_target" onChange={this.handleInputChangeNumber} value={this.state.kpi_target} />
                        </Col>
                        <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                          {this.state.validationError3}
                        </Col>
                      </Grid>
                    </Grid>
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
                        id="kpi_report"
                        name="kpi_report"
                        options={monthList}
                        onChange={e => this.handleMultiSelectChange(e)}
                        defaultSelected={this.state.kpi_report}
                        // value={this.state.UserType}
                        multiple
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError4}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ปีงบประมาณ <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input type="number" name="kpi_year" onChange={this.handleInputChangeNumber} value={this.state.kpi_year} />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError5}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ผู้รายงานตัวชี้วัด <font color="red">( สามารถเลือกได้มากกว่า 1 รายการ ) *</font> :
                    </Label>
                    <FormGroup>
                      <Col sm={12}>
                        <FormGroup check inline>
                          <Input type="checkbox" name="departmentAll" checked={this.state.departmentAll} onChange={this.handleInputChangeCheck} />
                          <Label check>เลือกทั้งหมด</Label>
                        </FormGroup>
                      </Col>
                    </FormGroup>

                    <Col sm={12}>
                      <Typeahead
                        clearButton
                        labelKey="department_name"
                        id="kpi_department"
                        name="kpi_department"
                        options={this.state.departmentList}
                        onChange={e => this.handleMultiSelectChangeDepartment(e)}
                        defaultSelected={this.state.kpi_department}
                        multiple
                        disabled={this.state.departmentAll}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError6}
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

            <Modal isOpen={this.state.modal1} toggle={this.toggle1()} className={this.props.className}>
              <ModalHeader
                toggle={this.toggle1()}
                style={{
                  backgroundColor: '#e0ecfa',
                  borderTopLeftRadius: '1.5rem',
                  borderTopRightRadius: '1.5rem',
                }}
              >
                {/* {this.state.header} */}
                ข้อมูลเกณฑ์การให้คะแนนตัวชี้วัด
              </ModalHeader>
              <ModalBody
                style={{
                  borderRadius: '1.5rem',
                }}
              >
                <Form onSubmit={this.handleSubmit3}>
                  <FormGroup>
                    <Label for="PlanName" sm={12}>
                      {this.state.kpi_name2}
                    </Label>

                    <Col sm={12} className="mb-2">
                      <Grid container className="flex" spacing={1}>
                        <Grid item sm={6} md={2}>
                          <span style={{ whiteSpace: 'nowrap' }}>1 :</span>
                        </Grid>
                        <Grid item sm={6} md={3}>
                          <Input type="text" name={`criteria_result1`} placeholder="ค่าเป้าหมาย" onChange={this.handleInputChange} value={this.state.criteria_result1} />
                        </Grid>
                        <Grid item sm={6} md={2}>
                          ได้ :
                        </Grid>
                        <Grid item sm={6} md={3}>
                          <Input type="number" name={`criteria_score1`} onChange={this.handleInputChangeNumber} value={this.state.criteria_score1} />
                        </Grid>
                        <Grid item sm={6} md={2}>
                          คะแนน
                        </Grid>
                      </Grid>
                    </Col>
                    <Col sm={12} className="mb-2">
                      <Grid container className="flex" spacing={1}>
                        <Grid item sm={6} md={2}>
                          <span style={{ whiteSpace: 'nowrap' }}>2 :</span>
                        </Grid>
                        <Grid item sm={6} md={3}>
                          <Input type="text" name={`criteria_result2`} placeholder="ค่าเป้าหมาย" onChange={this.handleInputChange} value={this.state.criteria_result2} />
                        </Grid>
                        <Grid item sm={6} md={2}>
                          ได้ :
                        </Grid>
                        <Grid item sm={6} md={3}>
                          <Input type="number" name={`criteria_score2`} onChange={this.handleInputChangeNumber} value={this.state.criteria_score2} />
                        </Grid>
                        <Grid item sm={6} md={2}>
                          คะแนน
                        </Grid>
                      </Grid>
                    </Col>
                    <Col sm={12} className="mb-2">
                      <Grid container className="flex" spacing={1}>
                        <Grid item sm={6} md={2}>
                          <span style={{ whiteSpace: 'nowrap' }}>3 :</span>
                        </Grid>
                        <Grid item sm={6} md={3}>
                          <Input type="text" name={`criteria_result3`} placeholder="ค่าเป้าหมาย" onChange={this.handleInputChange} value={this.state.criteria_result3} />
                        </Grid>
                        <Grid item sm={6} md={2}>
                          ได้ :
                        </Grid>
                        <Grid item sm={6} md={3}>
                          <Input type="number" name={`criteria_score3`} onChange={this.handleInputChangeNumber} value={this.state.criteria_score3} />
                        </Grid>
                        <Grid item sm={6} md={2}>
                          คะแนน
                        </Grid>
                      </Grid>
                    </Col>
                    <Col sm={12} className="mb-2">
                      <Grid container className="flex" spacing={1}>
                        <Grid item sm={6} md={2}>
                          <span style={{ whiteSpace: 'nowrap' }}>4 :</span>
                        </Grid>
                        <Grid item sm={6} md={3}>
                          <Input type="text" name={`criteria_result4`} placeholder="ค่าเป้าหมาย" onChange={this.handleInputChange} value={this.state.criteria_result4} />
                        </Grid>
                        <Grid item sm={6} md={2}>
                          ได้ :
                        </Grid>
                        <Grid item sm={6} md={3}>
                          <Input type="number" name={`criteria_score4`} onChange={this.handleInputChangeNumber} value={this.state.criteria_score4} />
                        </Grid>
                        <Grid item sm={6} md={2}>
                          คะแนน
                        </Grid>
                      </Grid>
                    </Col>
                    <Col sm={12} className="mb-2">
                      <Grid container className="flex" spacing={1}>
                        <Grid item sm={6} md={2}>
                          <span style={{ whiteSpace: 'nowrap' }}>5 :</span>
                        </Grid>
                        <Grid item sm={6} md={3}>
                          <Input type="text" name={`criteria_result5`} placeholder="ค่าเป้าหมาย" onChange={this.handleInputChange} value={this.state.criteria_result5} />
                        </Grid>
                        <Grid item sm={6} md={2}>
                          ได้ :
                        </Grid>
                        <Grid item sm={6} md={3}>
                          <Input type="number" name={`criteria_score5`} onChange={this.handleInputChangeNumber} value={this.state.criteria_score5} />
                        </Grid>
                        <Grid item sm={6} md={2}>
                          คะแนน
                        </Grid>
                      </Grid>
                    </Col>
                  </FormGroup>
                  <FormGroup style={{ textAlign: 'center' }}>
                    <Button color="success">บันทึก</Button>&nbsp;
                    <Button color="danger" onClick={this.toggle1()}>
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
        {userPermission[0].manageKPIData === true ? (
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
        ) : (
          ''
        )}
      </>
    );
  }
}
