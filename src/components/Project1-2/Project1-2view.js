import Page from 'components/Page';
import axios from 'axios';
import React from 'react';
import DatePicker from 'react-datepicker';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-datepicker/dist/react-datepicker.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import { confirmAlert } from 'react-confirm-alert';
import { red } from '@material-ui/core/colors';
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
import moment from 'moment';
// import { Link } from '@material-ui/core';
import { Link } from 'react-router-dom';
// function SubProject({ id, item_id }) {
//   let used_cost;
//   axios
//     .get(
//       process.env.REACT_APP_SOURCE_URL +
//         '/projectsProgress/progress/' +
//         item_id,
//     )
//     .then(listProgress => {
//       if (listProgress.data.length != 0) {
//         for (let i = 0; i < listProgress.data.length; i++) {
//           if (listProgress.data[i].month_report == id) {
//             if (
//               listProgress.data[i].used_cost == '' ||
//               listProgress.data[i].used_cost == undefined
//             ) {
//               listProgress.data[i].used_cost = '0';
//             } else {
//               listProgress.data[i].used_cost = listProgress.data[i].used_cost;
//             }
//             used_cost = Number(listProgress.data[i].used_cost).toLocaleString(
//               'en',
//             );

//             // return <div>{used_cost}</div>;
//             return <Label>{used_cost}</Label>;
//           }
//         }
//       }
//     });
// }
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
function MonthName({ month_name }) {
  let name;
  switch (month_name) {
    case 1:
      name = 'มกราคม';
      break;
    case 2:
      name = 'กุมภาพันธ์';
      break;
    case 3:
      name = 'มีนาคม';
      break;
    case 4:
      name = 'เมษายน';
      break;
    case 5:
      name = 'พฤษภาคม';
      break;
    case 6:
      name = 'มิถุนายน';
      break;
    case 7:
      name = 'กรกฏาคม';
      break;
    case 8:
      name = 'สิงหาคม';
      break;
    case 9:
      name = 'กันยายน';
      break;
    case 10:
      name = 'ตุลาคม';
      break;
    case 11:
      name = 'พฤศจิกายน';
      break;
    case 12:
      name = 'ธันวาคม';
      break;
  }
  return <div>{name}</div>;
}
export const monthNameEN = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const monthShortNameEN = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];
export const monthNameTH = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];
export const monthShortNameTH = [
  'ม.ค',
  'ก.พ',
  'มี.ค',
  'เม.ย',
  'พ.ค',
  'มิ.ย',
  'ก.ค',
  'ส.ค',
  'ก.ย',
  'ต.ค',
  'พ.ย',
  'ธ.ค',
];
export const dateToString = (date, language = 'EN') => {
  const monthNameArray = language == 'EN' ? monthNameEN : monthNameTH;
  return date != undefined
    ? `${moment(date).format('D')} ${
        monthNameArray[Number(moment(date).format('M')) - 1]
      } ${Number(moment(date).format('YYYY')) + 543}`
    : '';
};
export const dateToShortString = (date, language = 'EN') => {
  const monthNameArray = language == 'EN' ? monthShortNameEN : monthShortNameTH;
  return date != undefined
    ? `${moment(date).format('D')} ${
        monthNameArray[Number(moment(date).format('M')) - 1]
      } ${Number(moment(date).format('YYYY'))}`
    : '';
};
export default class Project1_2view extends React.Component {
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
      init_date: '',
      initError: '',
      to_date: '',
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
      project_used_budget: '',
      project_total_budget: '',
      project_status: '',
      project_note: '',
      project_current_amount: '',
      listProgress: [],
      listProgress1: [],
      used_cost: '',
      list1: [],
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
    } else if (!String(this.state.cost).match(regexp)) {
      isError = true;
      errors.costError = numberText;
      // } else if (this.state.project_total_budget == 'เกิน') {
      //   isError = true;
      //   errors.costError = textbudget;
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
        init_date: '',
        to_date: '',
        month_report: [],
        weight: '',
        cost: '',
        idForm: '',
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
  componentDidMount() {
    this.fetchData();
    this.fetchProjectData();
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
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
        let result = [];
        for (let i = 0; i < month_report.length; i++) {
          result = this.state.monthOptions.filter(member => {
            return member.id == month_report[i];
          });
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
        this.fetchProgress(month_report);
        // this.fetchData1(_id);
      });
  };
  // fetchData1(id) {
  //   axios
  //     .get(
  //       process.env.REACT_APP_SOURCE_URL + '/projectsProgress/progress/' + id,
  //     )
  //     .then(res => {
  //       if (res.data.length != 0) {
  //         for (let i = 0; i < res.data.length; i++) {
  //           this.setState({ list1: res.data[i] });
  //         }
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }
  onAdd() {
    this.setState({
      modal: true,
      activity_detail: '',
      init_date: '',
      to_date: '',
      month_report: [],
      weight: '',
      cost: '',
      isForm: '',
    });
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

  Insert = e => {
    e.preventDefault();
    const token_id = localStorage.getItem('token');
    let weight = parseInt(this.state.weight);
    let cost = parseInt(this.state.cost);
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
          cost: cost,
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        confirmAlert({
          //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
          message: 'บันทึกข้อมูลสำเร็จ',
          buttons: [
            {
              label: 'ยืนยัน',
              onClick: () => this.fetchData(),
            },
          ],
        });
        this.setState({
          modal: false,
          activity_detail: '',
          init_date: '',
          to_date: '',
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
    let cost = parseInt(this.state.cost);
    axios
      .patch(
        process.env.REACT_APP_SOURCE_URL + '/projects/activities/' + ID,
        {
          activity_detail: this.state.activity_detail.trim(),
          init_date: this.state.init_date.trim(),
          to_date: this.state.to_date.trim(),
          month_report: this.state.month_report,
          weight: weight,
          cost: cost,
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        confirmAlert({
          //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
          message: 'แก้ไขข้อมูลสำเร็จ',
          buttons: [
            {
              label: 'ยืนยัน',
              onClick: () => this.fetchData(),
            },
          ],
        });
        this.setState({
          modal: false,
          activity_detail: '',
          init_date: '',
          to_date: '',
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
  fetchProgress(id) {
    const item_id = this.state.activity_id;
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/projectsProgress/progress/' +
          item_id,
      )
      .then(
        listProgress => {
          const listProgress1 = listProgress.data.map((e, i) => {
            let result = e;
            if (e.month_report == id[i]) {
              if (e.used_cost == '' || e.used_cost == undefined) {
                result.used_cost = '0';
              } else {
                result.used_cost = e.used_cost;
              }
              result.used_cost = Number(e.used_cost).toLocaleString('en');
            }
            return result;
          });
          this.setState({
            listProgress1: listProgress1,
          });
        },
        // if (listProgress.data.length != 0) {
        //   for (let i = 0; i < listProgress.data.length; i++) {
        //     console.log(
        //       i,
        //       listProgress.data[i],
        //       listProgress.data[i].month_report,
        //       id[i],
        //       listProgress.data[i].month_report == id[i],
        //     );
        //     if (listProgress.data[i].month_report == id[i]) {
        //       if (
        //         listProgress.data[i].used_cost == '' ||
        //         listProgress.data[i].used_cost == undefined
        //       ) {
        //         listProgress.data[i].used_cost = '0';
        //       } else {
        //         listProgress.data[i].used_cost = listProgress.data[i].used_cost;
        //       }
        //       listProgress.data[i].used_cost = Number(
        //         listProgress.data[i].used_cost,
        //       ).toLocaleString('en');
        //       this.setState(prevState => ({
        //         used_cost1: [
        //           ...prevState.used_cost1,
        //           listProgress.data[i].used_cost,
        //         ],
        //         listProgress1: [
        //           ...prevState.listProgress1,
        //           listProgress.data[i],
        //         ],
        //         // used_cost1: listProgress.data[i].used_cost,
        //         // listProgress1: listProgress.data[i],
        //       }));
        //     }
        //     const cost1 = Number(listProgress.data[i].used_cost).toLocaleString(
        //       'en',
        //     );
        //     // this.setState({
        //     //   used_cost: cost1,
        //     //   // listProgress: listProgress.data[i],
        //     // });
        //   }
        // }
      );
  }
  render() {
    return (
      <div>
        <Row>
          <Col md={12} style={{ textAlign: 'right' }}>
            {/* <Tooltip title="Add">
              <Fab
                className="btn_not_focus"
                color="primary"
                onClick={() => this.onAdd()}
              >
                <Icon>add</Icon>
              </Fab>
            </Tooltip> */}
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

                      <Label sm={7} id="p_wrap">
                        {this.state.budget_source_name}
                      </Label>
                    </Col>

                    <Col sm={12}>
                      <Label
                        for="Select"
                        sm={5}
                        style={{ verticalAlign: 'top' }}
                      >
                        <b>วัตถุประสงค์ :</b>
                      </Label>

                      <Label sm={7} id="p_wrap">
                        {this.state.project_objective}
                      </Label>
                    </Col>
                    <Col sm={12}>
                      <Label
                        for="Select"
                        sm={5}
                        style={{ verticalAlign: 'top' }}
                      >
                        <b>ขอบเขตของโครงการ/พื้นที่เป้าหมาย/กลุ่มเป้าหมาย :</b>
                      </Label>

                      <Label sm={7} id="p_wrap">
                        {this.state.project_target}
                      </Label>
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
                        this.state.project_status != 1
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
                            <Tooltip title="ดูรายละเอียด">
                              <IconButton
                                className="btn_not_focus"
                                color="inherit"
                                aria-label="แก้ไข"
                                size="small"
                                onClick={() => this.onEdit(data._id)}
                              >
                                <Icon>visibility</Icon>
                              </IconButton>
                            </Tooltip>
                          </td>
                          <td
                            style={{
                              width: '2%',
                            }}
                          >
                            {/* <Tooltip title="ลบ">
                            <IconButton
                              className="btn_not_focus"
                              color="secondary"
                              aria-label="ลบ"
                              size="small"
                              onClick={() => this.ConfirmDelete(data._id)}
                            >
                              <Icon>delete</Icon>
                            </IconButton>
                          </Tooltip> */}
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
                  ขั้นตอน/กิจกรรม <font color={'red'} />
                </Label>
                <Col sm={12}>
                  <Label style={{ color: 'blue' }}>
                    {this.state.activity_detail}
                  </Label>

                  <FormText>
                    <span class="error">{this.state.activitesError}</span>
                  </FormText>
                </Col>
              </FormGroup>
              <Row>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      เริ่มต้น <font color={'red'} />
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Label style={{ color: 'blue' }}>
                          {dateToShortString(this.state.init_date, 'TH')}
                        </Label>

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
                      สิ้นสุด <font color={'red'} />
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Label style={{ color: 'blue' }}>
                          {dateToShortString(this.state.to_date, 'TH')}
                        </Label>

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
                        {/* * เลือกได้มากกว่า 1 รายการ */}
                      </font>
                    </Label>
                    <Col sm={12}>
                      {this.state.selectedmonthOptions.map(month => (
                        <Label style={{ color: 'blue' }}>
                          {month.label} &nbsp;
                        </Label>
                      ))}

                      {/* <Typeahead
                        clearButton
                        multiple
                        labelKey="label"
                        id="report_month"
                        name="report_month"
                        placeholder="เลือกเดือนสำหรับรายงานผล"
                        options={this.state.monthOptions}
                        onChange={e => this.handleMultiSelectChange(e)}
                        defaultSelected={this.state.selectedmonthOptions}
                      /> */}
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
                      ค่าน้ำหนัก <font color={'red'}>(ไม่เกิน 100)</font>
                    </Label>
                    <Col sm={12}>
                      <Label style={{ color: 'blue' }}>
                        {this.state.weight}
                      </Label>

                      <FormText>
                        <span class="error">{this.state.weightError}</span>
                      </FormText>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      ค่าใช้จ่ายในกิจกรรม <font color={'red'} />
                    </Label>
                    <Col sm={12}>
                      <InputGroup>
                        <Label style={{ color: 'blue' }}>
                          {this.state.cost} บาท
                        </Label>

                        {/* <InputGroupAddon addonType="append">
                          
                        </InputGroupAddon> */}
                      </InputGroup>
                      <FormText>
                        <span class="error">{this.state.costError}</span>
                      </FormText>
                    </Col>{' '}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Table responsive>
                    <thead>
                      <tr>
                        {/* <th>No.</th> */}
                        <th style={{ width: '60%' }}>เดือนที่รายงาน</th>
                        <th style={{ width: '30%' }}>ค่าใช้จ่ายจริง</th>
                        {/* <th /> */}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.listProgress1.length == 0 ? (
                        <tr>
                          <td colSpan="4" align="center">
                            ไม่มีข้อมูลรายงานผล
                          </td>
                        </tr>
                      ) : (
                        this.state.listProgress1.map((e, i) => {
                          return (
                            <tr>
                              <td>
                                <MonthName month_name={e.month_report} />
                              </td>
                              <td
                                style={{
                                  width: '30%',
                                }}
                              >
                                {e.used_cost}
                              </td>
                            </tr>
                          );
                        })
                      )}
                      {/* {this.state.list1[index].used_cost} */}
                      {/* {this.state.listProgress1[index].used_cost} */}
                      {/* {this.state.listProgress1.filter(dd =>
                              dd.month_report == month.id ? dd.used_cost : '0',
                            )} */}
                      {/* <SubProject
                              id={month.id}
                              item_id={this.state.activity_id}
                            /> */}
                      {/* {month.id} */}
                      {/* {() =>
                              this.fetchProgress(
                                month.id,
                                // this.state.activity_id,
                              )
                            } */}
                      {/* </td>
                        </tr>
                      ))} */}
                      {/* {this.state.list1.map(data1 => (
                        <tr>
                          <td></td>
                        </tr>
                      ))} */}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            {/* <Button color="primary" onClick={e => this.handleSubmit(e)}>
              บันทึก
            </Button> */}
            <Button color="secondary" onClick={this.toggle()}>
              ปิด
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
