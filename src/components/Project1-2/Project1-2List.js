import Page from 'components/Page';
import axios from 'axios';
import React from 'react';
// import DatePicker from 'react-datepicker';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-datepicker/dist/react-datepicker.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import { confirmAlert } from 'react-confirm-alert';
import { red } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

import 'moment/locale/th';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Progress,
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Input,
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  Label,
  FormText,
} from 'reactstrap';
// import { Link } from '@material-ui/core';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import th from 'date-fns/locale/es';

function commaSeparateNumber(val) {
  while (/(\d+)(\d{3})/.test(val.toString())) {
    val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
  }
  return val;
}
const projectStatusLabel = status => {
  let statusText = 'ตรงตามเวลาที่กำหนด';
  switch (Number(status)) {
    case 3:
      statusText = 'เร็วกว่าที่กำหนด';
      break;
    case 2:
      statusText = 'ช้ากว่าที่กำหนด';
      break;
    case 1:
      statusText = 'ตรงตามเวลาที่กำหนด';
      break;
    case 0:
      statusText = 'ยังไม่ได้รายงาน';
      break;
  }
  return statusText;
};
export default class Project1_2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      monthOptions: [
        {
          id: 1,
          label: 'มกราคม',
        },
        {
          id: 2,
          label: 'กุมภาพันธ์',
        },
        {
          id: 3,
          label: 'มีนาคม',
        },
        {
          id: 4,
          label: 'เมษายน',
        },
        {
          id: 5,
          label: 'พฤษภาคม',
        },
        {
          id: 6,
          label: 'มิถุนายน',
        },
        {
          id: 7,
          label: 'กรกฏาคม',
        },
        {
          id: 8,
          label: 'สิงหาคม',
        },
        {
          id: 9,
          label: 'กันยายน',
        },
        {
          id: 10,
          label: 'ตุลาคม',
        },
        {
          id: 11,
          label: 'พฤศจิกายน',
        },
        {
          id: 12,
          label: 'ธันวาคม',
        },
      ],
      selectedmonthOptions: [],
      modal: false,
      activity_id: '',
      activity_detail: '',
      activitesError: '',
      // init_date: new Date(),
      initError: '',
      // to_date: new Date(),
      toError: '',
      month_report: [],
      month_reportError: '',
      weight: '',
      weightError: '',
      cost: '',
      costError: '',
      project_id: this.props.project_id,
      list: [],
      isForm: '',
      date: '',
      project_used_budget: '',
      project_total_budget: '',
      project_status: '',
      project_note: '',
      project_current_amount: '',
      project_target: '',
      // startDate: new Date(),
      // total_weight: '',
      // project_total_budget: '',
    };
  }
  validate = () => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let emptyText = 'กรุณากรอกข้อมูลให้ครบถ้วน';
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    let texterror = 'ค่าน้ำหนักเกิน 100';

    const errors = {
      activitesError: '',
      initError: '',
      toError: '',
      month_reportError: '',
      weightError: '',
      costError: '',
    };
    if (this.state.activity_detail.length <= 0) {
      isError = true;
      errors.activitesError = emptyText;
    }

    if (this.state.init_date.length <= 0) {
      isError = true;
      errors.initError = emptyText;
    }

    if (this.state.to_date.length <= 0) {
      isError = true;
      errors.toError = emptyText;
    }

    if (this.state.month_report.length <= 0) {
      isError = true;
      errors.month_reportError = emptyText;
    }

    if (this.state.weight.length <= 0) {
      isError = true;
      errors.weightError = emptyText;
    } else if (!String(this.state.weight).match(regexp)) {
      isError = true;
      errors.weightError = numberText;
      // } else if (this.state.total_weight == 'เกิน') {
      //   isError = true;
      //   errors.weightError = texterror;
    } else if (parseInt(this.state.weight) > 100) {
      isError = true;
      errors.weightError = texterror;
    }

    if (this.state.cost.length <= 0) {
      isError = true;
      errors.costError = emptyText;
      // } else if (!String(this.state.cost).match(regexp)) {
      //   isError = true;
      //   errors.costError = numberText;
      // } else if (this.state.project_total_budget == 'เกิน') {
      //   isError = true;
      //   errors.costError = textbudget;
    }
    const ms = this.state.to_date.split('-');
    const mstart = parseInt(ms[0]);
    if (mstart.toString().length != 4) {
      isError = true;
      errors.toError = 'กรุณาวันที่ให้ถูกต้อง';
    }
    this.setState({
      ...this.state,
      ...errors,
    });

    return isError;
  };
  fetchData() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/projects/activities/' +
          this.props.project_id,
      )
      .then(res => {
        this.setState({ list: res.data });
      })
      .catch(error => {
        console.log(error);
      });
  }
  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        selectedmonthOptions: [],
        activity_detail: '',
        // init_date: '',
        // to_date: '',
        month_report: [],
        weight: '',
        cost: '',
        idForm: '',
        activitesError: '',
        initError: '',
        toError: '',
        month_reportError: '',
        weightError: '',
        costError: '',
      });
      // this.day();
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
  day() {
    var date = ('0' + new Date().getDate()).slice(-2); //Current Date
    var month = ('0' + (new Date().getMonth() + 1)).slice(-2); //Current Month
    var year = new Date().getFullYear() + 543; //Current Year

    this.setState({
      //Setting the value of the date time
      // date: year + '-' + month + '-' + date,
      init_date: year + '-' + month + '-' + date,
      to_date: year + '-' + month + '-' + date,
    });
  }
  componentDidMount() {
    this.fetchData();
    this.fetchProjectData();
    this.day();
  }

  handleInputChange1 = e => {
    //$('#ss').val(commaSeparateNumber(e.target.value));
    // let ss = e.target.value.toString()
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      costError: '',
    };
    const newvalue = e.target.value.replace(/,/g, '');
    if (!String(newvalue).match(regexp)) {
      isError = true;
      errors.costError = numberText;
      const valuewithcomma = '';
      this.setState({
        ...errors,
        [e.target.name]: valuewithcomma,
      });
    } else {
      // isError = false;
      const valuewithcomma = Number(newvalue).toLocaleString('en');
      this.setState({
        ...errors,
        [e.target.name]: valuewithcomma,
      });
    }
    //let ss = commaSeparateNumber(e.target.value);
    //let numz = Number(ss).toLocaleString('en'); // "10,000"

    return isError;
  };
  handleInputChange2 = e => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      weightError: '',
    };
    const newvalue = e.target.value.replace(/,/g, '');
    if (!String(newvalue).match(regexp)) {
      isError = true;
      errors.weightError = numberText;
      const valuewithcomma = '';
      this.setState({
        ...errors,
        [e.target.name]: valuewithcomma,
      });
    } else if (newvalue > 100) {
      isError = true;
      errors.weightError = 'ห้ามกรอมข้อมูลเกิน 100';
      const valuewithcomma = '';
      this.setState({
        ...errors,
        [e.target.name]: valuewithcomma,
      });
    } else {
      // isError = false;
      const valuewithcomma = Number(newvalue).toLocaleString('en');
      this.setState({
        ...errors,
        [e.target.name]: valuewithcomma,
      });
    }
    //let ss = commaSeparateNumber(e.target.value);
    //let numz = Number(ss).toLocaleString('en'); // "10,000"

    return isError;
  };
  handleMultiSelectChange(e) {
    const selected = e.map(data => {
      return data.id;
    });
    this.setState({ month_report: [] });
    this.setState(prevState => ({
      month_report: prevState.month_report.concat(selected),
    }));
  }

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
          _id,
          activity_detail,
          init_date,
          to_date,
          weight,
          month_report,
          cost,
        } = res.data;
        const weight1 = parseInt(weight);
        const cost1 = Number(cost).toLocaleString('en');
        //const cost1 = parseInt(cost);
        let result = [];
        for (let i = 0; i < month_report.length; i++) {
          result = this.state.monthOptions.filter(member => {
            return member.id == month_report[i];
          });

          // this.setState({ selectedmonthOptions: [] });
          this.setState(prevState => ({
            selectedmonthOptions: prevState.selectedmonthOptions.concat(result),
          }));
        }

        this.setState({
          activity_detail: activity_detail,
          init_date: init_date,
          to_date: to_date,
          month_report: month_report,
          weight: weight1,
          cost: cost1,
          modal: true,
          activity_id: _id,
          isForm: 'edit',
        });
      });
  };
  onAdd() {
    this.setState({
      modal: true,
      activity_detail: '',
      month_report: [],
      weight: '',
      cost: '',
      isForm: '',
    });
    this.day();
  }
  handleSubmit = e => {
    e.preventDefault();
    const err = this.validate();
    if (!err) {
      if (this.state.isForm == 'edit') {
        this.Update(e);
      } else {
        this.Insert(e);
      }
    }
  };
  handleInputChange = e => {
    if (e.target.name == 'init_date') {
      const ms = e.target.value.split('-');

      const mstart = parseInt(ms[0]);
      if (mstart.toString().length > 4) {
        this.setState({
          initError: 'กรุณาระบุวันที่ให้ถูกต้อง',
          [e.target.name]: this.state.init_date,
        });
      } else {
        this.setState({
          initError: '',
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == 'to_date') {
      const ms = e.target.value.split('-');
      const mstart = parseInt(ms[0]);
      if (mstart.toString().length < 4) {
        this.setState({
          toError: 'กรุณาระบุวันที่ให้ถูกต้อง',
          [e.target.name]: e.target.value,
        });
        // this.setState({
        //   [e.target.name]: e.target.value,
        // });
      } else if (mstart.toString().length < 4) {
        this.setState({
          toError: 'กรุณาระบุวันที่ให้ถูกต้อง',
          [e.target.name]: e.target.value,
        });
      } else if (mstart.toString().length == 4) {
        if (e.target.value < this.state.init_date) {
          this.setState({
            toError: 'ไม่สามารถระบุวันสิ้นสุดน้อยกว่าวันเริ่มต้นได้',
            [e.target.name]: this.state.init_date,
          });
        } else {
          this.setState({
            toError: '',
            [e.target.name]: e.target.value,
          });
        }
      }
    } else {
      this.setState({
        toError: '',
        [e.target.name]: e.target.value,
      });
    }
  };
  handleChange = date => {
    this.setState({
      startDate: date,
    });
  };
  Insert = e => {
    e.preventDefault();

    const token_id = localStorage.getItem('token');
    let weight = parseInt(this.state.weight);
    //let cost = parseInt(this.state.cost);
    const cost = this.state.cost.replace(/,/g, '');
    let newvalue = parseInt(cost);
    axios
      .post(
        process.env.REACT_APP_SOURCE_URL +
          '/projects/activities/' +
          this.props.project_id,
        {
          activity_detail: this.state.activity_detail.trim(),
          init_date: this.state.init_date.trim(),
          to_date: this.state.to_date.trim(),
          month_report: this.state.month_report,
          weight: weight,
          cost: newvalue,
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        this.day();
        // confirmAlert({
        //   //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
        //   message: 'บันทึกข้อมูลสำเร็จ',
        //   buttons: [
        //     {
        //       label: 'ยืนยัน',
        //       onClick: () => this.fetchData(),
        //     },
        //   ],
        // });
        confirmAlert({
          message: 'บันทึกข้อมูลสำเร็จ',
          buttons: [],
        });
        setTimeout(
          () => (window.location.href = '/project1-2/' + this.props.project_id),
          1000,
        );
        this.setState({
          modal: false,
          activity_detail: '',
          // init_date: '',
          // to_date: '',
          month_report: [],
          weight: '',
          cost: '',
          isForm: '',
        });
      })
      .catch(err => {
        // this.setState({
        //   total_weight: err.total_weight,
        //   project_total_budget: err.project_total_budget,
        // });
        let texterror = 'ค่าน้ำหนักเกิน 100';
        let textbudget = 'ค่าใช้จ่ายเกินงบประมาณที่ได้รับ ใช้ไปแล้ว ';
        if (err.response.data.message == 'total_weight Over 100') {
          this.setState({
            // total_weight: 'เกิน',
            isError: true,
            weightError: texterror,
          });
        }
        if (err.response.data.message == 'project_total_budget Over') {
          this.setState({
            costError:
              textbudget + err.response.data.project_used_budget + ' บาท',
            isError: true,
          });
        }
      });
  };

  Update = e => {
    e.preventDefault();
    const ID = this.state.activity_id;
    const token_id = localStorage.getItem('token');
    let weight = parseInt(this.state.weight);
    //let cost = parseInt(this.state.cost)
    const cost = this.state.cost.replace(/,/g, '');
    let newvalue = parseInt(cost);
    axios
      .patch(
        process.env.REACT_APP_SOURCE_URL + '/projects/activities/' + ID,
        {
          activity_detail: this.state.activity_detail.trim(),
          init_date: this.state.init_date.trim(),
          to_date: this.state.to_date.trim(),
          month_report: this.state.month_report,
          weight: weight,
          cost: newvalue,
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        this.day();
        // confirmAlert({
        //   //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
        //   message: 'แก้ไขข้อมูลสำเร็จ',
        //   buttons: [
        //     {
        //       label: 'ยืนยัน',
        //       onClick: () => this.fetchData(),
        //     },
        //   ],
        // });
        confirmAlert({
          message: 'แก้ไขข้อมูลสำเร็จ',
          buttons: [],
        });
        setTimeout(
          () => (window.location.href = '/project1-2/' + this.props.project_id),
          1000,
        );
        this.setState({
          modal: false,
          activity_detail: '',
          // init_date: '',
          // to_date: '',
          month_report: [],
          weight: '',
          cost: '',
          isForm: '',
        });
      })
      .catch(err => {
        let texterror = 'ค่าน้ำหนักเกิน 100';
        let textbudget = 'ค่าใช้จ่ายเกินงบประมาณที่ได้รับ ใช้ไปแล้ว ';
        if (err.response.data.message == 'total_weight Over 100') {
          this.setState({
            // total_weight: 'เกิน',
            isError: true,
            weightError: texterror,
          });
        } else if (err.response.data.message == 'project_total_budget Over') {
          this.setState({
            costError:
              textbudget + err.response.data.project_used_budget + ' บาท',
            isError: true,
          });
        }
      });
  };
  fetchProjectData() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL + '/projects/' + this.props.project_id,
      )
      .then(res => {
        if (res.data.project_name == '') {
          res.data.project_name = '-';
        } else {
          res.data.project_name = res.data.project_name;
        }
        if (res.data.project_reason == '') {
          res.data.project_reason = '-';
        } else {
          res.data.project_reason = res.data.project_reason;
        }
        if (res.data.project_objective == '') {
          res.data.project_objective = '-';
        } else {
          res.data.project_objective = res.data.project_objective;
        }
        const project_used_budget = Number(
          res.data.project_used_budget,
        ).toLocaleString('en');
        const project_total_budget = Number(
          res.data.project_total_budget,
        ).toLocaleString('en');
        // if (res.data.project_status == '' || res.data.project_status == null) {
        //   res.data.project_status = '-';
        // } else {
        //   res.data.project_status = res.data.project_status;
        // }
        if (res.data.project_target == '' || res.data.project_target == null) {
          res.data.project_target = '-';
        } else {
          res.data.project_target = res.data.project_target;
        }
        if (
          res.data.project_current_amount == '' ||
          res.data.project_current_amount == undefined
        ) {
          res.data.project_current_amount = '0';
        } else {
          res.data.project_current_amount = res.data.project_current_amount;
        }
        const project_current_amount = Number(
          res.data.project_current_amount,
        ).toLocaleString('en');
        this.setState({
          budget_source_name: res.data.project_reason,
          project_name: res.data.project_name,
          project_objective: res.data.project_objective,
          project_used_budget: project_used_budget + ' บาท',
          project_total_budget: project_total_budget + ' บาท',
          project_status: res.data.project_status,
          project_note: res.data.project_note,
          project_target: res.data.project_target,
          project_current_amount: project_current_amount + ' บาท',
        });

      })
      .catch(error => {
        console.log(error);
      });
  }
  ConfirmDelete = id => {
    confirmAlert({
      //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
      message: 'คุณต้องการจะลบข้อมูลนี้',
      buttons: [
        {
          label: 'ยืนยัน',
          onClick: () => this.DELETE(id),
        },
        {
          label: 'ยกเลิก',
        },
      ],
    });
  };

  DELETE = id => {
    axios
      .delete(
        process.env.REACT_APP_SOURCE_URL +
          '/projects/activities/activities/' +
          id,
      )
      .then(res => {
        this.fetchData();
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <Row>
          <Col md={12} style={{ textAlign: 'right' }}>
            <Tooltip title="Add">
              <Fab
                className="btn_not_focus"
                color="primary"
                onClick={() => this.onAdd()}
              >
                <Icon>add</Icon>
              </Fab>
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="mb-3">
              <CardBody>
                <FormGroup inline>
                  <Row>
                    <Col sm={12}>
                      <Label
                        for="ProjectID"
                        sm={5}
                        style={{ verticalAlign: 'top' }}
                      >
                        <b>ชื่อโครงการ :</b>
                      </Label>

                      <Label sm={7}>{this.state.project_name}</Label>
                    </Col>
                    <Col sm={12}>
                      <Label
                        for="Project"
                        sm={5}
                        style={{ verticalAlign: 'top' }}
                      >
                        <b>ความสำคัญของโครงการ/หลักการและเหตุผล :</b>
                      </Label>

                      <Label sm={7}>{this.state.budget_source_name}</Label>
                    </Col>

                    <Col sm={12}>
                      <Label
                        for="Select"
                        sm={5}
                        style={{ verticalAlign: 'top' }}
                      >
                        <b>วัตถุประสงค์ :</b>
                      </Label>

                      <Label sm={7}>{this.state.project_objective}</Label>
                    </Col>
                    <Col sm={12}>
                      <Label
                        for="Select"
                        sm={5}
                        style={{ verticalAlign: 'top' }}
                      >
                        <b>ขอบเขตของโครงการ/พื้นที่เป้าหมาย/กลุ่มเป้าหมาย :</b>
                      </Label>

                      <Label sm={7}>{this.state.project_target}</Label>
                    </Col>

                    <Col sm={12}>
                      <Label
                        for="Select"
                        sm={5}
                        style={{ verticalAlign: 'top' }}
                      >
                        <b>งบประมาณรวมทั้งโครงการ :</b>
                      </Label>

                      <Label sm={7}>{this.state.project_total_budget}</Label>
                    </Col>
                    <Col sm={12}>
                      <Label
                        for="Select"
                        sm={5}
                        style={{ verticalAlign: 'top' }}
                      >
                        <b>ค่าใช้จ่ายรวมทุกกิจกรรม :</b>
                      </Label>

                      <Label sm={7}>{this.state.project_used_budget}</Label>
                    </Col>
                    <Col sm={12}>
                      <Label
                        for="Select"
                        sm={5}
                        style={{ verticalAlign: 'top' }}
                      >
                        <b>ค่าใช้จ่ายจริง :</b>
                      </Label>

                      <Label sm={7}>{this.state.project_current_amount}</Label>
                    </Col>
                    <Col sm={12}>
                      <Label
                        for="Select"
                        sm={5}
                        style={{ verticalAlign: 'top' }}
                      >
                        <b>สถานะของโครงการ :</b>
                      </Label>

                      <Label sm={7}>
                        {projectStatusLabel(this.state.project_status)}
                      </Label>
                    </Col>
                    <Col
                      sm={12}
                      style={
                        this.state.project_status == 2
                          ? { display: 'block' }
                          : { display: 'none' }
                      }
                    >
                      <Label
                        for="Select"
                        sm={5}
                        style={{ verticalAlign: 'top' }}
                      >
                        <b>เนื่องจาก :</b>
                      </Label>

                      <Label sm={7}>{this.state.project_note}</Label>
                    </Col>
                    {/* <SubProject
                      project_status={this.state.project_status}
                      project_note={this.state.project_note}
                    /> */}
                  </Row>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="mb-3">
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      {/* <th>No.</th> */}
                      <th style={{ width: '60%' }}>ขั้นตอน/กิจกรรม</th>
                      <th style={{ width: '30%' }}>ความก้าวหน้ากิจกรรม</th>
                      {/* <th /> */}
                      <th colSpan="2" style={{ width: '10%' }} />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.list.length == 0 ? (
                      <tr>
                        <td colSpan="4" align="center">
                          ไม่มีข้อมูลโครงการ
                        </td>
                      </tr>
                    ) : (
                      this.state.list.map(data => (
                        <tr>
                          {/* <td /> */}
                          <td>{data.activity_detail}</td>
                          <td
                            style={{
                              width: '30%',
                            }}
                          >
                            <Progress
                              color={'success'}
                              value={data.activity_progress}
                              className="mt-2"
                              style={{
                                backgroundColor: 'rgba(106, 130, 251, 0.25)',
                              }}
                            >
                              <Label
                                style={{ marginBottom: '0px', color: 'black' }}
                              >
                                <img
                                  src="https://img.icons8.com/material-outlined/24/000000/submit-progress.png"
                                  width="18"
                                  height="18"
                                />
                                {data.activity_progress}%
                              </Label>
                              {/* {data.activity_progress}% */}
                            </Progress>
                          </td>
                          <td
                            style={{
                              width: '2%',
                            }}
                          >
                            <Tooltip title="แก้ไข">
                              <IconButton
                                className="btn_not_focus"
                                color="inherit"
                                aria-label="แก้ไข"
                                size="small"
                                onClick={() => this.onEdit(data._id)}
                              >
                                <Icon>edit</Icon>
                              </IconButton>
                            </Tooltip>
                          </td>
                          <td
                            style={{
                              width: '2%',
                            }}
                          >
                            <Tooltip title="ลบ">
                              <IconButton
                                className="btn_not_focus"
                                color="secondary"
                                aria-label="ลบ"
                                size="small"
                                onClick={() => this.ConfirmDelete(data._id)}
                              >
                                <Icon>delete</Icon>
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle()}
          className={this.props.className}
          size="lg"
        >
          <ModalHeader toggle={this.toggle()} style={{ textAlign: 'center' }}>
            ข้อมูลกิจกรรมภายใต้โครงการ
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label sm={12}>
                  ขั้นตอน/กิจกรรม <font color={'red'}>*</font>
                </Label>
                <Col sm={12}>
                  <Input
                    type="textarea"
                    name="activity_detail"
                    placeholder="ขั้นตอน/กิจกรรม"
                    onChange={this.handleInputChange}
                    value={this.state.activity_detail}
                  />
                  <FormText>
                    <span class="error">{this.state.activitesError}</span>
                  </FormText>
                </Col>
              </FormGroup>
              <Row>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      เริ่มต้น <font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        {/* <Input
                          type="date"
                          name="init_date"
                          id="startDate"
                          placeholder=""
                          onChange={this.handleInputChange}
                          value={this.state.init_date}
                          // defaultValue="2562-05-24"
                        /> */}
                        <div className="input-group">
                          <Input
                            type="date"
                            name="init_date"
                            id="startDate"
                            // placeholder=""
                            onChange={this.handleInputChange}
                            value={this.state.init_date}
                            size="8"
                            // defaultValue="2562-05-24"
                          />
                          {/* <MuiPickersUtilsProvider utils={MomentUtils} locale={'th'}>
                            <DatePicker
                              label="with B.E. yearOffset"
                              name="init_date"
                              format="D/MM/YYYY"
                              pickerHeaderFormat="dd D MMM"
                              yearOffset={543}
                              onChange={this.handleInputChange}
                            // value={this.state.init_date}
                            /> */}
                          {/* </MuiPickersUtilsProvider> */}
                          <div class="input-group-btn">
                            <button
                              type="button"
                              class="btn btn-defualt"
                              style={{ paddingTop: '3px', paddingBottom: '0' }}
                            >
                              <Tooltip title="เริ่มต้น">
                                <IconButton
                                  className="btn_not_focus"
                                  color="secondary"
                                  aria-label="เริ่มต้น"
                                  size="small"
                                >
                                  <Icon>date_range</Icon>
                                </IconButton>
                              </Tooltip>
                            </button>
                          </div>
                        </div>
                        {/* <TextField
                          name="init_date"
                          id="startDate"
                          // label="เริ่มต้น"
                          type="date"
                          defaultValue={this.state.init_date}
                          onChange={this.handleInputChange}
                          value={this.state.init_date}
                          // "2562-05-24"
                          // className={classes.textField}
                          // InputLabelProps={{
                          //   shrink: true,
                          // }}
                        /> */}
                        <FormText>
                          <span class="error">{this.state.initError}</span>
                        </FormText>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      สิ้นสุด <font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        {/* {this.state.date} */}
                        <div className="input-group">
                          <Input
                            type="date"
                            name="to_date"
                            id="endDate"
                            // placeholder={this.state.date}
                            onChange={this.handleInputChange}
                            value={this.state.to_date}
                          />
                          {/* <MuiPickersUtilsProvider utils={MomentUtils} locale={'th'}>
                            <DatePicker
                              label="with B.E. yearOffset"
                              name="to_date"
                              format="D/MM/YYYY"
                              pickerHeaderFormat="dd D MMM"
                              onChange={this.handleInputChange}
                              yearOffset={543}
                              // value={this.state.to_date}
                            />
                          </MuiPickersUtilsProvider> */}
                          <div class="input-group-btn">
                            <button
                              type="button"
                              class="btn btn-defualt"
                              style={{ paddingTop: '3px', paddingBottom: '0' }}
                            >
                              <Tooltip title="สิ้นสุด">
                                <IconButton
                                  className="btn_not_focus"
                                  color="secondary"
                                  aria-label="สิ้นสุด"
                                  size="small"
                                >
                                  <Icon>date_range</Icon>
                                </IconButton>
                              </Tooltip>
                            </button>
                          </div>
                        </div>
                        {/* <TextField
                          name="to_date"
                          id="endDate"
                          // label="สิ้นสุด"
                          type="date"
                          defaultValue={this.state.to_date}
                          // className={classes.textField}
                          onChange={this.handleInputChange}
                          value={this.state.to_date}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        /> */}
                        <FormText>
                          <span class="error">{this.state.toError}</span>
                        </FormText>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <FormGroup>
                    <Label sm={12}>
                      เดือนสำหรับรายงานผล{' '}
                      <font color={'red'} size={2}>
                        * เลือกได้มากกว่า 1 รายการ
                      </font>
                    </Label>
                    <Col sm={12}>
                      <Typeahead
                        clearButton
                        multiple
                        labelKey="label"
                        id="report_month"
                        name="report_month"
                        placeholder="เลือกเดือนสำหรับรายงานผล"
                        options={this.state.monthOptions}
                        onChange={e => this.handleMultiSelectChange(e)}
                        defaultSelected={this.state.selectedmonthOptions}
                      />
                      <FormText>
                        <span class="error">
                          {this.state.month_reportError}
                        </span>
                      </FormText>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      ค่าน้ำหนัก <font color={'red'}>* (ไม่เกิน 100)</font>
                    </Label>
                    <Col sm={12}>
                      <Input
                        name="weight"
                        type="text"
                        onChange={e => this.handleInputChange2(e)}
                        value={this.state.weight}
                        maxlength="3"
                      />
                      <FormText>
                        <span class="error">{this.state.weightError}</span>
                      </FormText>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      ค่าใช้จ่าย <font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      <InputGroup>
                        <Input
                          name="cost"
                          id="ss"
                          type="text"
                          onChange={e => this.handleInputChange1(e)}
                          value={this.state.cost}
                        />
                        <InputGroupAddon addonType="append">
                          บาท
                        </InputGroupAddon>
                      </InputGroup>
                      <FormText>
                        <span class="error">{this.state.costError}</span>
                      </FormText>
                    </Col>{' '}
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e => this.handleSubmit(e)}>
              บันทึก
            </Button>
            <Button color="secondary" onClick={this.toggle()}>
              ยกเลิก
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
