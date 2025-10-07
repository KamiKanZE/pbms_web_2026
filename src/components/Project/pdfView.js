import React from 'react';
// import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import Pdf from 'react-to-pdf';
import { Card, CardBody, Col, Row, FormGroup, Label } from 'reactstrap';
import './styles.css';
const ref = React.createRef();

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'row',
//     backgroundColor: '#E4E4E4',
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
// });
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
export default class pdf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  // fetchData = () => {
  //   const userID = localStorage.getItem('userID');
  //   axios.get(this.state.url + userID).then(res => {
  //     this.setState({ list: res.data.result });
  //   });
  // };
  componentDidMount() {
    this.fetchProjectData();
  }
  fetchProjectData() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/projects/' +
          this.props.match.params.id,
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
  render() {
    return (
      <div>
        <Pdf targetRef={ref} filename={this.state.project_name + '.pdf'}>
          {({ toPdf }) => <button onClick={toPdf}>พิมพ์</button>}
        </Pdf>

        <div ref={ref}>
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
                          <b>
                            ขอบเขตของโครงการ/พื้นที่เป้าหมาย/กลุ่มเป้าหมาย :
                          </b>
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

                        <Label sm={7}>
                          {this.state.project_current_amount}
                        </Label>
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
        </div>
      </div>
    );
  }
}
