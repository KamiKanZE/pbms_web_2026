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
import { MdEvent } from 'react-icons/md';
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
const token_id = localStorage.getItem('token');
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
  state = {
    performanceOptions: [
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
    ],
    durationOptions: [
      {
        id: '1',
        label: 'ตรงตามเวลาที่กำหนด',
      },
      { id: '2', label: 'ช้ากว่าที่กำหนด' },
      {
        id: '3',
        label: 'เร็วกว่าที่กำหนด',
      },
    ],
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
    modal1: false,
    activity_id: '',
    activity_detail: '',
    project_id: this.props.project_id,
    list: [],
    list_act: [],
    isForm: '',
    duration: '',
    performance: '',
    result_detail: '',
    problem: '',
    durationError: '',
    performanceError: '',
    result_detailError: '',
    problemError: '',
    used_cost: '',
    result: '1',
    project_status: '',
    project_noteError: '',
    user_costError: '',
    project_target: '',
    activity_progress1: '',
    point: '',
    month1: '',
  };
  validate = () => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let emptyText = 'กรุณากรอกข้อมูลให้ครบถ้วน';
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      durationError: '',
      result_detailError: '',
      problemError: '',
      performanceError: '',
    };
    if (this.state.duration.length <= 0) {
      isError = true;
      errors.durationError = emptyText;
    }

    // if (this.state.result_detail.length <= 0) {
    //   isError = true;
    //   errors.result_detailError = emptyText;
    // }
    if (this.state.duration == 2) {
      if (this.state.problem.length <= 0) {
        isError = true;
        errors.problemError = emptyText;
      }
    }
    if (this.state.performance.length <= 0) {
      isError = true;
      errors.performanceError = emptyText;
    }
    this.setState({
      ...this.state,
      ...errors,
    });

    return isError;
  };
  validate1 = () => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let emptyText = 'กรุณากรอกข้อมูลให้ครบถ้วน';
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      durationError: '',
      result_detailError: '',
      problemError: '',
      performanceError: '',
      project_noteError: '',
    };
    if (this.state.project_status == 2) {
      if (this.state.project_note == null || this.state.project_note <= 0) {
        isError = true;
        errors.project_noteError = emptyText;
      }
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
          '/projectsProgress/activities/' +
          this.props.project_id,
      )
      .then(res => {
        this.setState({
          list: res.data,
        });
      })
      .catch(error => {
        console.log(error);
      });
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

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        duration: '',
        result_detail: '',
        problem: '',
        result: 1,
        month_report: '',
        performance: '',
        used_cost: '',
        durationError: '',
        result_detailError: '',
        problemError: '',
        performanceError: '',
        project_noteError: '',
        isForm: '',
        user_costError: '',
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
  toggle1 = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal1,
      });
    }
    this.setState({
      [`modal1_${modalType}`]: !this.state[`modal1_${modalType}`],
    });
  };
  componentDidMount() {
    this.fetchProjectData();
    this.fetchData();
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSelectChange(id, name, e) {
    // this.props.onChange({ [e.target.name]: e.target.value });
    if (e[0]) {
      this.setState({
        [id]: e[0].id,
      });
    }
  }

  onEdit(id, item_id, activities_name, activity_progress) {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/projectsProgress/progress/' +
          item_id,
      )
      .then(res => {
        if (res.data.length != 0) {
          this.setState({
            point: res.data.length,
          });
          let x = '';
          if (res.data.length >= 2) {
            x = res.data.length - 2;
          } else {
            x = 0;
          }
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].month_report == id) {
              let isForm1 = '';
              if (
                res.data[i].performance == '' ||
                res.data[i].performance == null ||
                res.data[i].performance == undefined
              ) {
                isForm1 = '';
                this.setState({
                  performance: '',
                  isForm: isForm1,
                });
              } else {
                isForm1 = 'edit';
                this.setState({
                  performance: res.data[i].performance,
                  isForm: isForm1,
                });
              }
              let used_cost = '';
              if (
                res.data[i].used_cost == '' ||
                res.data[i].used_cost == undefined
              ) {
                used_cost = '';
              } else {
                // res.data[i].used_cost = res.data[i].used_cost;
                used_cost = Number(res.data[i].used_cost).toLocaleString('en');
              }

              this.setState({
                modal: true,
                activity_detail: activities_name,
                // selectedPerformance: [
                //   {
                //     id: res.data[i].performance,
                //     label: res.data[i].performance + '%',
                //   },
                // ],
                month1: res.data[x].performance,
                selectedDuration: [
                  { id: res.data[i].duration, label: res.data[i].duration },
                ],
                duration: res.data[i].duration,
                result_detail: res.data[i].result_detail,
                problem: res.data[i].problem,
                // result: res.data[i].result,
                month_report: res.data[i].month_report,
                Progress_id: res.data[i]._id,
                durationError: '',
                result_detailError: '',
                problemError: '',
                performanceError: '',
                used_cost: used_cost,
                activity_progress1: activity_progress,
              });
            } else {
              if (
                res.data.performance != '' &&
                res.data[i].performance != null
              ) {
                this.state.performance1 = res.data[i].performance;
                // this.setState({
                //   isForm: 'edit',
                // });
              } else {
                this.state.performance1 = '';
                // this.setState({
                //   isForm: '',
                // });
              }

              this.setState({
                month_report: id,
                // selectedPerformance: [
                //   {
                //     id: res.data[i].performance,
                //     label: กรุณาเลือกความก้าวหน้ากิจกรรม + '%',
                //   },
                // ],
                // performance: this.state.performance1,
                month1: res.data[x].performance,
                modal: true,
                activity_id: item_id,
                activity_detail: activities_name,
                selectedPerformance: [],
                selectedDuration: [],
                durationError: '',
                //isForm: this.state.isForm,
                activity_progress1: activity_progress,
                performanceError: '',
              });
            }
          }
        } else {
          this.setState({
            month_report: id,
            modal: true,
            activity_id: item_id,
            activity_detail: activities_name,
            selectedPerformance: [],
            selectedDuration: [],
            isForm: '',
            durationError: '',
            result_detailError: '',
            problemError: '',
            performanceError: '',
            used_cost: '',
            activity_progress1: activity_progress,
            month1: '',
          });
        }
      })
      .catch(error => {
        console.log(error);
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
    if (this.state.used_cost == '') {
      this.state.used_cost = '0';
    }
    const cost = this.state.used_cost.replace(/,/g, '');
    let newvalue = parseInt(cost);
    //this.state.used_cost
    const ID = this.state.activity_id;
    axios
      .post(
        process.env.REACT_APP_SOURCE_URL + '/projectsProgress/' + ID,
        {
          performance: this.state.performance,
          duration: this.state.duration,
          result_detail: this.state.result_detail,
          problem: this.state.problem,
          month_report: this.state.month_report,
          used_cost: newvalue,
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        if (this.state.project_status == 0) {
          axios
            .patch(
              process.env.REACT_APP_SOURCE_URL +
                '/projects/' +
                this.props.project_id,
              {
                project_status: this.state.duration,
                project_note: this.state.project_note,
                //  this.state
              },
              { headers: { Authorization: `Bearer ${token_id}` } },
            )
            .then(res => {});
        }
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
        this.setState({
          modal: false,
          // performance: '',
          // //duration: '',
          // result_detail: '',
          // problem: '',
          // // rerult: '',
          // selectedPerformance: [],
          // selectedDuration: [],
          // isForm: '',
        });
        // this.fetchProjectData();
        if (this.state.duration != 1) {
          this.setState({
            modal1: true,
            project_status: this.state.duration,
          });
        } else {
          confirmAlert({
            message: 'บันทึกข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(
            () =>
              (window.location.href = ' /progress1/' + this.props.project_id),
            1000,
          );
        }
      })

      .catch(err => {
        if (err.response.data.message == 'Please Check your performance!') {
          const performanceError =
            'ระดับความก้าวหน้าของกิจกรรมขณะนี้คือ ' +
            err.response.data.performance +
            '%';
          this.setState({
            performanceError: performanceError,
          });
        }

        if (err.response.data.message == 'used cost Over!') {
          const user_costError =
            'จำนวนเงินเกินค่าใช้จ่ายรวมของกิจกรรม ใช้ไปแล้ว ' +
            err.response.data.current_amount +
            ' บาท จาก ' +
            err.response.data.cost +
            ' บาท';
          this.setState({
            user_costError: user_costError,
          });
        }
      });
  };
  handleSubmit1 = e => {
    const err = this.validate1();
    if (!err) {
      e.preventDefault();
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL +
            '/projects/' +
            this.props.project_id,
          {
            project_status: this.state.project_status,
            project_note: this.state.project_note,
            //  this.state
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(response => {
          // confirmAlert({
          //   //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
          //   message: 'แก้ไขข้อมูลสำเร็จ',
          //   buttons: [
          //     {
          //       label: 'ยืนยัน',
          //     },
          //   ],
          // });
          this.setState({
            modal1: false,
          });
          confirmAlert({
            message: 'บันทึกข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(
            () =>
              (window.location.href = ' /progress1/' + this.props.project_id),
            1000,
          );
        })
        .catch(error => {
          throw error;
        });
      // this.props.onSubmit(this.state);

      // clear form

      // this.setState({
      //   ProjectName: '',
      //   ProjectNameError: '',
      //   ProjectReason: '',
      //   ProjectReasonError: '',
      // });
    }
  };
  handleInputChange1 = e => {
    //$('#ss').val(commaSeparateNumber(e.target.value));
    // let ss = e.target.value.toString()
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      user_costError: '',
    };
    const newvalue = e.target.value.replace(/,/g, '');
    if (!String(newvalue).match(regexp)) {
      isError = true;
      errors.user_costError = numberText;
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
  Update = e => {
    if (this.state.point > 1) {
      if (this.state.performance >= this.state.month1) {
        e.preventDefault();
        const cost = this.state.used_cost.replace(/,/g, '');
        let newvalue = parseInt(cost);
        const ID = this.state.Progress_id;
        axios
          .patch(
            process.env.REACT_APP_SOURCE_URL + '/projectsProgress/' + ID,
            {
              performance: this.state.performance,
              duration: this.state.duration,
              result_detail: this.state.result_detail,
              problem: this.state.problem,
              // result: this.state.result,
              month_report: this.state.month_report,
              used_cost: newvalue,
            },
            { headers: { Authorization: `Bearer ${token_id}` } },
          )
          .then(res => {
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
            // this.fetchProjectData();
            this.setState({
              modal: false,
              // performance: '',
              // // duration: '',
              // result_detail: '',
              // problem: '',
              // // result: '',
              // month_report: '',
              // isForm: '',
              // selectedPerformance: [],
              // selectedDuration: [],
            });
            if (this.state.duration != 1) {
              this.setState({
                modal1: true,
                project_status: this.state.duration,
              });
            } else {
              confirmAlert({
                message: 'แก้ไขข้อมูลสำเร็จ',
                buttons: [],
              });
              setTimeout(
                () =>
                  (window.location.href =
                    ' /progress1/' + this.props.project_id),
                1000,
              );
            }
          })
          .catch(error => {
            if (error.response.data.message == 'used cost Over!') {
              let current_amount = Number(
                error.response.data.current_amount,
              ).toLocaleString('en');
              let cost = Number(error.response.data.cost).toLocaleString('en');
              const user_costError =
                'จำนวนเงินเกินค่าใช้จ่ายรวมของกิจกรรม ใช้ไปแล้ว ' +
                current_amount +
                ' บาท จาก ' +
                cost +
                ' บาท';
              this.setState({
                user_costError: user_costError,
              });
            }
          });
      } else {
        this.setState({
          performanceError:
            'ระดับความก้าวหน้าของกิจกรรมเดือนแรกคือ ' + this.state.month1 + '%',
        });
      }
    } else {
      e.preventDefault();
      const cost = this.state.used_cost.replace(/,/g, '');
      let newvalue = parseInt(cost);
      const ID = this.state.Progress_id;
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/projectsProgress/' + ID,
          {
            performance: this.state.performance,
            duration: this.state.duration,
            result_detail: this.state.result_detail,
            problem: this.state.problem,
            // result: this.state.result,
            month_report: this.state.month_report,
            used_cost: newvalue,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
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
          // this.fetchProjectData();
          this.setState({
            modal: false,
            // performance: '',
            // // duration: '',
            // result_detail: '',
            // problem: '',
            // // result: '',
            // month_report: '',
            // isForm: '',
            // selectedPerformance: [],
            // selectedDuration: [],
          });
          if (this.state.duration != 1) {
            this.setState({
              modal1: true,
              project_status: this.state.duration,
            });
          } else {
            confirmAlert({
              message: 'แก้ไขข้อมูลสำเร็จ',
              buttons: [],
            });
            setTimeout(
              () =>
                (window.location.href = ' /progress1/' + this.props.project_id),
              1000,
            );
          }
        })
        .catch(error => {
          if (error.response.data.message == 'used cost Over!') {
            let current_amount = Number(
              error.response.data.current_amount,
            ).toLocaleString('en');
            let cost = Number(error.response.data.cost).toLocaleString('en');
            const user_costError =
              'จำนวนเงินเกินค่าใช้จ่ายรวมของกิจกรรม ใช้ไปแล้ว ' +
              current_amount +
              ' บาท จาก ' +
              cost +
              ' บาท';
            this.setState({
              user_costError: user_costError,
            });
          }
        });
    }
  };

  render() {
    return (
      <div>
        <Row>
          <Col>
            <Card className="mb-3">
              <CardBody>
                <FormGroup inline>
                  <Row>
                    <Col sm={12}>
                      <Label for="ProjectID" sm={4}>
                        <b>ชื่อโครงการ :</b>
                      </Label>

                      <Label sm={8}>{this.state.project_name}</Label>
                    </Col>
                    <Col sm={12}>
                      <Label for="Project" sm={4}>
                        <b>ความสำคัญของโครงการ/หลักการและเหตุผล :</b>
                      </Label>

                      <Label sm={8} id="p_wrap">
                        {this.state.budget_source_name}
                      </Label>
                    </Col>
                    <Col sm={12}>
                      <Label for="Select" sm={4}>
                        <b>ขอบเขตของโครงการ/พื้นที่เป้าหมาย/กลุ่มเป้าหมาย :</b>
                      </Label>

                      <Label sm={8} id="p_wrap">
                        {this.state.project_target}
                      </Label>
                    </Col>
                    <Col sm={12}>
                      <Label for="Select" sm={4}>
                        <b>วัตถุประสงค์ :</b>
                      </Label>

                      <Label sm={8} id="p_wrap">
                        {this.state.project_objective}
                      </Label>
                    </Col>
                    <Col sm={12}>
                      <Label for="Select" sm={4}>
                        <b>งบประมาณรวมทั้งโครงการ :</b>
                      </Label>

                      <Label sm={8}>{this.state.project_total_budget}</Label>
                    </Col>
                    <Col sm={12}>
                      <Label for="Select" sm={4}>
                        <b>ค่าใช้จ่ายรวมทุกกิจกรรม :</b>
                      </Label>

                      <Label sm={8}>{this.state.project_used_budget}</Label>
                    </Col>
                    <Col sm={12}>
                      <Label for="Select" sm={4}>
                        <b>ค่าใช้จ่ายจริง :</b>
                      </Label>

                      <Label sm={8}>{this.state.project_current_amount}</Label>
                    </Col>
                    <Col sm={12}>
                      <Label for="Select" sm={4}>
                        <b>สถานะของโครงการ :</b>
                      </Label>

                      <Label sm={8}>
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
                      <Label for="Select" sm={4}>
                        <b>เนื่องจาก :</b>
                      </Label>

                      <Label sm={8}>{this.state.project_note}</Label>
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
                <Table>
                  <thead>
                    <tr>
                      {/* <th>No.</th> */}
                      <th style={{ width: '50%' }}>ขั้นตอน/กิจกรรม</th>
                      <th style={{ width: '30%', textAlign: 'center' }}>
                        ความก้าวหน้ากิจกรรม
                      </th>
                      <th style={{ width: '15%', textAlign: 'center' }}>
                        การรายงานผล
                      </th>
                      {/* <th /> */}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.list.length == 0 ? (
                      <tr>
                        <td colSpan="4" align="center">
                          ไม่มีข้อมูลกิจกรรม
                        </td>
                      </tr>
                    ) : (
                      this.state.list.map(data => (
                        <tr>
                          {/* <td /> */}
                          <td>{data.activity_detail}</td>
                          <td>
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
                              width: '15%',
                              textAlign: 'center',
                            }}
                          >
                            <UncontrolledButtonDropdown direction="down">
                              <DropdownToggle caret>
                                <MdEvent size="1em" />
                              </DropdownToggle>
                              <DropdownMenu right>
                                {data.month_report.map(data1 => (
                                  <DropdownItem
                                    onClick={() =>
                                      this.onEdit(
                                        data1,
                                        data._id,
                                        data.activity_detail,
                                        data.activity_progress,
                                      )
                                    }
                                  >
                                    <MonthName month_name={data1} />
                                  </DropdownItem>
                                ))}
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
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
          isOpen={this.state.modal1}
          toggle={this.toggle1()}
          className={this.props.className}
          size="lg"
        >
          <ModalBody toggle={this.toggle1()} style={{ textAlign: 'center' }}>
            <h1>การรายงานผลมีผลกระทบกับโครงการอย่างไร</h1>
          </ModalBody>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="Select" sm={12}>
                  ความก้าวหน้าโครงการ{' '}
                  <font color={'red'} size="2">
                    *
                  </font>
                </Label>
                <Col lg={12} md={12} sm={12}>
                  <Input
                    type="select"
                    name="project_status"
                    onChange={this.handleInputChange}
                    value={this.state.project_status}
                    required
                  >
                    {this.state.durationOptions.map(id => (
                      <option key={id.id} value={id.id}>
                        {id.label}
                      </option>
                    ))}
                  </Input>
                  <FormText style={{ color: red }}>
                    <span class="error">{this.state.projectStatusError}</span>
                  </FormText>
                </Col>
                {/* {this.state.project_status} */}
                {this.state.project_status == 2 ? (
                  <div sm={12}>
                    <Label for="Select" sm={12}>
                      ปัญหาและอุปสรรค{' '}
                      <font color={'red'} size="2">
                        *
                      </font>
                    </Label>
                    <Col lg={12} md={12} sm={12}>
                      <Input
                        type="textarea"
                        name="project_note"
                        placeholder="ปัญหาและอุปสรรค"
                        onChange={this.handleInputChange}
                        value={this.state.project_note}
                      />
                      <FormText style={{ color: red }}>
                        <span class="error">
                          {this.state.project_noteError}
                        </span>
                      </FormText>
                    </Col>
                  </div>
                ) : (
                  ''
                )}
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e => this.handleSubmit1(e)}>
              บันทึก
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle()}
          className={this.props.className}
          size="lg"
        >
          <ModalHeader toggle={this.toggle()} style={{ textAlign: 'center' }}>
            แบบฟอร์มรายงานการปฏิบัติงาน
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label sm={12}>
                  <b>ขั้นตอน/กิจกรรม :</b>&nbsp; {this.state.activity_detail}
                </Label>
                <hr />
              </FormGroup>
              <Row>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      ความก้าวหน้ากิจกรรม <font color={'red'}>*</font>
                    </Label>

                    <Col sm={12}>
                      <Input
                        type="select"
                        name="performance"
                        onChange={this.handleInputChange}
                        value={this.state.performance}
                        required
                      >
                        <option key="" value="" disabled checked>
                          เลือกระดับความก้าวหน้ากิจกรรม
                        </option>
                        {this.state.performanceOptions.map(id => (
                          <option key={id.id} value={id.id}>
                            {id.label}
                          </option>
                        ))}
                      </Input>
                      {/* <Typeahead
                        clearButton
                        labelKey="label"
                        id="performance"
                        name="performance"
                        placeholder="เลือกความก้าวหน้ากิจกรรม"
                        options={this.state.performanceOptions}
                        onChange={e =>
                          this.handleSelectChange(
                            'performance',
                            'performance',
                            e,
                          )
                        }
                        defaultSelected={this.state.selectedPerformance}
                      /> */}
                    </Col>
                    <Col>
                      <FormText>
                        <span className="error">
                          {this.state.performanceError}
                        </span>
                      </FormText>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      ระยะเวลาดำเนินตามแผนที่กำหนด <font color={'red'}>*</font>
                    </Label>

                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="select"
                          name="duration"
                          onChange={this.handleInputChange}
                          value={this.state.duration}
                          required
                        >
                          <option key="" value="" disabled checked>
                            เลือกระยะเวลาดำเนินงาน
                          </option>
                          {this.state.durationOptions.map(id => (
                            <option key={id.id} value={id.id}>
                              {id.label}
                            </option>
                          ))}
                        </Input>
                        {/* <Typeahead
                          clearButton
                          labelKey="label"
                          id="duration"
                          name="duration"
                          placeholder="เลือกระยะเวลาดำเนินตามแผนที่กำหนด"
                          options={[
                            {
                              id: 'ตรงตามเวลาที่กำหนด',
                              label: 'ตรงตามเวลาที่กำหนด',
                            },
                            {
                              id: 'เร็วกว่าที่กำหนด',
                              label: 'เร็วกว่าที่กำหนด',
                            },
                            { id: 'ช้ากว่าที่กำหนด', label: 'ช้ากว่าที่กำหนด' },
                          ]}
                          onChange={e =>
                            this.handleSelectChange('duration', 'duration', e)
                          }
                          defaultSelected={this.state.selectedDuration}
                        /> */}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormText>
                        <span className="error">
                          {this.state.durationError}
                        </span>
                      </FormText>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <FormGroup>
                    <Label sm={12}>ผลการดำเนินงานสะสม</Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="textarea"
                          name="result_detail"
                          id="result_detail"
                          placeholder="ผลการดำเนินงานสะสม"
                          onChange={this.handleInputChange}
                          value={this.state.result_detail}
                        />
                      </FormGroup>
                    </Col>{' '}
                    <Col>
                      <FormText>
                        <span className="error">
                          {this.state.result_detailError}
                        </span>
                      </FormText>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <FormGroup>
                    <Label sm={12}>
                      ปัญหาอุปสรรค{' '}
                      {this.state.duration == 2 ? (
                        <font color={'red'}>*</font>
                      ) : (
                        ''
                      )}
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="textarea"
                        name="problem"
                        id="problem"
                        placeholder="ปัญหาอุปสรรค"
                        onChange={this.handleInputChange}
                        value={this.state.problem}
                      />
                    </Col>
                    <Col>
                      <FormText>
                        <span className="error">{this.state.problemError}</span>
                      </FormText>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <FormGroup>
                    <Label sm={12}>ค่าใช้จ่ายในกิจกรรม</Label>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="used_cost"
                        id="used_cost"
                        placeholder="ค่าใช้จ่ายในกิจกรรม"
                        onChange={this.handleInputChange1}
                        value={this.state.used_cost}
                      />
                    </Col>
                    <Col>
                      <FormText>
                        <span className="error">
                          {this.state.user_costError}
                        </span>
                      </FormText>
                    </Col>
                  </FormGroup>
                </Col>
                {/* <Col xl={6} lg={6} md={6}>
                  <Col sm={12}>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="result"
                          value={this.state.result}
                        />
                        โครงการเสร็จสิ้นแล้ว
                      </Label>
                    </FormGroup>
                  </Col>
                </Col> */}
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e => this.handleSubmit(e)}>
              บันทึก
            </Button>
            <Button Color="secondary" onClick={this.toggle()}>
              ยกเลิก
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
