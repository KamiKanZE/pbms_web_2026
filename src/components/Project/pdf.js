import React from 'react';
// import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Card, CardBody, Col, Row, FormGroup, Label } from 'reactstrap';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

//ต้องระบุตามชื่อของ ไฟล์ font
pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew-Bold.ttf',
    italics: 'THSarabunNew-Italic.ttf',
    bolditalics: 'THSarabunNew-BoldItalic.ttf',
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};

// import './styles.css';
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
      allData: '',
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
          allData: {
            budget_source_name: res.data.project_reason,
            project_name: res.data.project_name,
            project_objective: res.data.project_objective,
            project_used_budget: project_used_budget + ' บาท',
            project_total_budget: project_total_budget + ' บาท',
            project_status: res.data.project_status,
            project_note: res.data.project_note,
            project_target: res.data.project_target,
            project_current_amount: project_current_amount + ' บาท',
          },
        });

      })
      .catch(error => {
        console.log(error);
      });
  }
  printPDF = ({
    project_name,
    budget_source_name,
    project_objective,
    project_target,
    project_total_budget,
    project_used_budget,
    project_current_amount,
    project_status,
    project_note,
  }) => {
    var docDefinition = {
      content: [
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: '25%',
              text: 'ชื่อโครงการ :',
              fontSize: 17,
              bold: true,
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '75%',
              text: project_name,
              fontSize: 17,
              bold: true,
            },
          ],
          // optional space between columns
          // columnGap: 5,
        },
        {
          columns: [
            {
              text: 'ความสำคัญของโครงการ/หลักการและเหตุผล :',
              fontSize: 15,
              // auto-sized columns have their widths based on their content
              width: '25%',
              bold: true,
            },
            {
              text: budget_source_name,
              fontSize: 15,
              width: '75%',
            },
          ],
          // optional space between columns
          // columnGap: 5,
        },
        'This paragraph goes below all columns and has full width',
      ],
      defaultStyle: { font: 'THSarabunNew' },
    };
    pdfMake.createPdf(docDefinition).open();
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 841.9 595.3"
            className="App-logo"
            alt="logo"
          >
            <g fill="#61DAFB">
              <path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z" />
              <circle cx="420.9" cy="296.5" r="45.7" />
              <path d="M520.5 78.1z" />
            </g>
          </svg>
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <input
          type="button"
          value="print PDF"
          onClick={() => this.printPDF(this.state.allData)}
        />
      </div>
    );
  }
}
