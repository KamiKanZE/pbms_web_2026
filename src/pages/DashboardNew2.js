import { AnnouncementCard, TodosCard } from 'components/Card';
import HorizontalAvatarList from 'components/HorizontalAvatarList';
import MapWithBubbles from 'components/MapWithBubbles';
import Page from 'components/Page';
import ProductMedia from 'components/ProductMedia';
import SupportTicket from 'components/SupportTicket';
import UserProgressTable from 'components/UserProgressTable';
import { IconWidget, NumberWidget } from 'components/Widget';
import TableDetail from 'components/Dashboard/TableDetail';
import TableProjectDetail from 'components/Dashboard/TableProjectDetail';
import TableKpiDetail from 'components/Dashboard/TableKpiDetail';
import { getStackLineChart, stackLineChartOptions } from 'demos/chartjs';
import $ from 'jquery';
import {
  avatarsData,
  chartjs,
  productsData,
  supportTicketsData,
  todosData,
  userProgressTableData,
} from 'demos/dashboardPage';
import { Link, NavLink as BsLink } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import { Bar, Line, Pie, HorizontalBar, Doughnut } from 'react-chartjs-2';
import {
  MdBubbleChart,
  MdInsertChart,
  MdPersonPin,
  MdPieChart,
  MdRateReview,
  MdShare,
  MdShowChart,
  MdThumbUp,
} from 'react-icons/md';
import { TiStarFullOutline } from 'react-icons/ti';
import { IoMdCheckbox, IoIosAlarm } from 'react-icons/io';
import { AiFillEdit, AiFillFileAdd, AiFillFolderAdd } from 'react-icons/ai';
import { GoCircleSlash } from 'react-icons/go';
import InfiniteCalendar from 'react-infinite-calendar';
import {
  Badge,
  Button,
  Table,
  Card,
  CardBody,
  CardDeck,
  CardGroup,
  CardHeader,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
  Progress,
  Row,
  Label,
  Input,
  Navbar,
  NavLink,
  Nav,
  NavItem,
} from 'reactstrap';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { getColor } from 'utils/colors';
import { randomNum } from 'utils/demos';
import moment from 'moment';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import { textAlign, width } from '@material-ui/system';
import { Grid } from '@material-ui/core';
import DashboardReportProjectList from '../components/Dashboard/DashboardReportProjectList';
import DashboardBudgetList from '../components/Dashboard/DashboardBudgetList';
import DashboardBudgetPlanList from '../components/Dashboard/DashboardBudgetPlanList';
import bn from 'utils/bemnames';
import { BsPersonFill } from 'react-icons/bs';
import Logo from 'assets/img/logo/logo_pbms_non.png';
import DashboardBudgetDepartmantList from '../components/Dashboard/DashboardBudgetDepartmantList';

//localStorage.clear();
const bem = bn.create('header');
// const userDepartmentID = localStorage.getItem('userDepartmentID');
// const userEmail = 'super_admin@mybizthailand.com';
// localStorage.setItem('userEmail', 'super_admin@mybizthailand.com');

const today = new Date();
const lastWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7,
);
////////////////////////
const groupArrayByDistinctValue = (array, keyName = false) => {
  let distinctValues = [];
  let newObject = [];
  array.forEach(obj => {
    if (!!keyName) {
      if (!distinctValues.includes(obj[keyName])) {
        distinctValues.push(obj[keyName]);
        newObject.push({ value: obj[keyName], dataSet: [obj] });
      } else {
        let index = newObject.findIndex(e => e.value == obj[keyName]);
        newObject[index].dataSet = [...newObject[index].dataSet, obj];
      }
    } else {
      if (distinctValues.includes(obj)) {
        let index = newObject.findIndex(e => e.value == obj);
        newObject[index].count = newObject[index].count + 1;
      } else {
        distinctValues.push(obj);
        newObject.push({ value: obj, count: 1 });
      }
    }
  });
  return newObject;
};
function ProgressBar({ dataprogress, datapic }) {
  let color;
  if (dataprogress <= 30) {
    color = 'danger';
  } else if (dataprogress <= 60) {
    color = 'warning';
  } else {
    color = 'success';
  }
  let title;
  if (datapic == '1') {
    title = 'เปอร์เซ็นการเบิกจ่ายงบประมาณ';
  } else {
    title = 'เปอร์เซ็นการทำงานของโครงการ';
  }

  return (
    <Progress
      color={color}
      value={dataprogress}
      className="mt-2"
      title={title}
      style={{ backgroundColor: 'rgba(106, 130, 251, 0.25)' }}
    >
      {datapic == '1' ? (
        <Label style={{ marginBottom: '0px', color: 'black' }}>
          <img
            src="https://img.icons8.com/material-rounded/48/000000/thai-baht.png"
            width="14"
            height="14"
          />
          {dataprogress}%
        </Label>
      ) : (
        <Label style={{ marginBottom: '0px', color: 'black' }}>
          <img
            src="https://img.icons8.com/material-rounded/24/000000/in-progress.png"
            width="18"
            height="18"
          />
          {dataprogress}%
        </Label>
      )}
    </Progress>
  );
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
const colorChart = [
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC',
];
//////////////////
function SubProject({ project_id, department_id }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }
  return (
    <div>
      <Tooltip title="จัดการข้อมูลโครงการ">
        <IconButton
          className="btn_not_focus"
          aria-controls="fade-menu"
          size="small"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Icon>list</Icon>
        </IconButton>
      </Tooltip>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem component={Link} to={'/view/' + project_id}>
          กิจกรรมภายใต้โครงการ
        </MenuItem>
        <MenuItem component={Link} to={'/project1-3/' + project_id}>
          ตัวชี้วัดภายใต้โครงการ
        </MenuItem>
        <MenuItem component={Link} to={'/project1-4/' + project_id}>
          ความเสี่ยงภายใต้โครงการ
        </MenuItem>
        {/* <MenuItem
          component={Link}
          to={'/progress1/' + project_id}
          style={
            department_id == userDepartmentID
              ? { display: 'block' }
              : { display: 'none' }
          }
        >
          รายงานผลการปฎิบัติงาน
        </MenuItem> */}
      </Menu>
    </div>
  );
}
class DashboardNew2 extends React.Component {
  state = {
    list: [],
    list_kpi: [],
    modalShow: false,
    data: [],
    selected: 0,
    offset: 0,
    perPage: 0,
    url: process.env.REACT_APP_SOURCE_URL + '/projects/list',
    result: [],
    result1: [],
    peiType: 0,
    budgetDis: 'none',
    projectDis: 'none',
    kpiDis: 'none',
    showlist: 'none',
    projectTitle: '',
    backgroundColor: '',
    revenueBudgets_list: [],
    expenditureBudgets_list: [],
    revenueBudgets_sum: '',
    expenditureBudgets_sum: '',
    report_kpi_list: [],
    departments_list: [],
    department: '',
    yearList: [],
    period: '2',
    year: moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543,
  };
  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
    this.loadCommentsFromServer();
    //this.fetchDataKPI();
    this.fetchDatarRevenueBudgets();
    this.fetchDatarExpenditureBudgets();
    this.fetchDataReportKPI();
    this.yearLoop();
    this.fetchDataDepartments();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.department !== this.state.department) {
      // console.log('department state has changed.');
      this.loadCommentsFromServer();
    }
    if (prevState.period !== this.state.period) {
      // console.log('period state has changed.');
      this.loadCommentsFromServer();
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
        (this.state.department &&
          '&project_department=' + this.state.department),
      //data: { totalPage: this.state.perPage, offset: this.state.offset },
      dataType: 'json',
      type: 'GET',
      success: data => {
        let resultz = [];
        if (this.state.period === '') {
          resultz = data.result.result;
        }
        if (parseInt(this.state.period) === 0) {
          resultz = data.result.result.filter(
            results =>
              moment(results.project_start) >=
                moment(this.state.year - 543 - 1 + '-10-01') &&
              moment(results.project_start) <=
                moment(this.state.year - 543 + '-09-30'),
          );
        }
        if (parseInt(this.state.period) === 1) {
          resultz = data.result.result.filter(
            results =>
              moment(results.project_start) >=
                moment(this.state.year - 543 - 1 + '-10-01') &&
              moment(results.project_start) <=
                moment(this.state.year - 543 + '-04-30'),
          );
        }
        let result = resultz.filter(results => results.project_progress == 0);
        let result1 = resultz.filter(
          results1 => results1.project_progress != 0,
        );
        this.setState({
          data: resultz,
          result: result,
          result1: result1,
          //pageCount: Math.ceil(data.pagination.itemTotal / this.state.perPage),
        });
      },

      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString()); // eslint-disable-line
      },
    });
  }

  fetchDataKPI() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/kpis?page=0&size=0')
      .then(res => {
        const year = new Date().getFullYear();
        let resultc = res.data.result.filter(
          results =>
            new Date().getFullYear(results.create_date) === this.state.year,
        );
        this.setState({ list_kpi: resultc });
      })
      .catch(error => {
        console.log(error);
      });
  }
  fetchDataDepartments() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataDepartments/list?page=0&size=0',
      )
      .then(res => {
        this.setState({ departments_list: res.data.result });
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchDatarRevenueBudgets() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/revenueBudgets/list')
      .then(res => {
        this.setState({
          revenueBudgets_list: res.data.result.filter(
            a => a.revenue_budget_year === this.state.year,
          ),
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  revenueSum() {
    let sum = 0;
    this.state.revenueBudgets_list.map(rb => {
      sum = sum + parseFloat(rb.revenue_budget_estimate);
    });
    //this.setState({ revenueBudgets_sum: sum });
    return sum;
  }
  revenueSum2 = data => {
    let sum = 0;
    data.map(rb => {
      sum = sum + parseFloat(rb.revenue_budget_estimate);
    });
    //this.setState({ revenueBudgets_sum: sum });
    return sum;
  };
  expenditureSum() {
    let sum = 0;
    this.state.expenditureBudgets_list.map(eb => {
      sum = sum + parseFloat(eb.expenditure_budget_estimate);
    });
    //this.setState({ expenditureBudgets_sum: sum });
    return sum;
  }
  moneyFormat = e => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e);
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: parseInt(e.target.value),
      revenueBudgets_list: [],
      expenditureBudgets_list: [],
      result: [],
      result1: [],
    });
    setTimeout(() => {
      this.loadCommentsFromServer();
      this.fetchDatarRevenueBudgets();
      this.fetchDatarExpenditureBudgets();
      this.fetchDataReportKPI();
      this.revenueSum();
      //this.revenueSum2();
      this.expenditureSum();
    }, 1000);
  };
  handleInputChange2 = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  fetchDatarExpenditureBudgets() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/expenditureBudgets/list?page=0&size=0',
      )
      .then(res => {
        this.setState({
          expenditureBudgets_list: res.data.result.filter(
            a => a.expenditure_budget_year === this.state.year,
          ),
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchDataReportKPI() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi?page=0&size=0')
      .then(res => {
        this.setState({
          report_kpi_list: res.data.result.filter(
            a => a.kpi_year === this.state.year,
          ),
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleClick1() {
    window.scrollTo({ top: 740, behavior: 'smooth' });
  }

   yearLoop() {
    let yl = [];
    // for (let index = y; index < (parseInt(maxYearEnd) + 543 + 5); index++) {
    //   yl = yl.concat([{ value: index, label: index }]);
    // }

    const year = new Date().getFullYear();
    for (let index = 2560; index < year + 543 + 5; index++) {
      yl = yl.concat([{ value: index, label: index }]);
    }
    this.setState({
      yearList: yl,
    });
  }

  render() {
    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary');
    const MONTHS = [
      'January',
      'February',
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
    // 1 = ตรง , 2 = ช้า , 3 = เร็ว
    let labelProjStatus = value => {
      let result;
      switch (value) {
        case '1':
          result = 'ตรงตามเวลาที่กำหนด';
          break;
        case '2':
          result = 'ช้ากว่าที่กำหนด';
          break;
        case '3':
          result = 'เร็วกว่าที่กำหนด';
          break;
        default:
          result = 'ยังไม่ได้รายงานผล';
          break;
      }
      return result;
    };

    let labelKPIStatus = value => {
      let result;
      switch (value) {
        case 1:
          result = 'ตรงตามเกณฑ์ที่กำหนด';
          break;
        case 2:
          result = 'ต่ำกว่าเกณฑ์ที่กำหนด';
          break;
        case 3:
          result = 'เร็วกว่าเกณฑ์ที่กำหนด';
          break;
        default:
          result = 'ยังไม่ได้รายงานผล';
          break;
      }
      return result;
    };

    const budgetStatusDataset = [
      {
        value: 0,
        color: '#6a82fc',
        label: 'เป็นไปตามแผนฯ',
        data: [],
      },
      {
        value: 0,
        color: '#45b649',
        label: 'เบิกจ่ายต่ำกว่าแผนฯ',
        data: [],
      },
      {
        value: 0,
        color: '#fc5b7c',
        label: 'เบิกจ่ายเกินแผนฯ',
        data: [],
      },
      {
        value: 0,
        color: '#ccc',
        label: 'ยังไม่มีการรายงาน',
        data: [],
      },
    ];

    const projectStatusDataset = [
      {
        value: 0,
        color: '#6a82fc',
        label: 'ตรงตามเวลาที่กำหนด',
        data: [],
      },
      {
        value: 0,
        color: '#fc5b7c',
        label: 'ช้ากว่าที่กำหนด',
        data: [],
      },
      {
        value: 0,
        color: '#45b649',
        label: 'เร็วกว่าที่กำหนด',
        data: [],
      },
      {
        value: 0,
        color: '#ccc',
        label: 'ยังไม่มีการรายงาน',
        data: [],
      },
    ];

    const kpiStatusDataset = [
      {
        value: 0,
        color: '#6a82fc',
        label: 'ตรงตามเกณฑ์ที่กำหนด',
        data: [],
      },
      {
        value: 0,
        color: '#fc5b7c',
        label: 'ต่ำกว่าเกณฑ์ที่กำหนด',
        data: [],
      },
      {
        value: 0,
        color: '#45b649',
        label: 'เร็วกว่าเกณฑ์ที่กำหนด',
        data: [],
      },
      {
        value: 0,
        color: '#ccc',
        label: 'ยังไม่มีการรายงาน',
        data: [],
      },
    ];

    this.state.data.forEach((item, index) => {
      let {
        project_status,
        budget_status,
        project_progress,
        budget_progress,
        budget_type_name,
        start_date,
        finish_date,
        update_date,
      } = item;
      if (project_status == 3) {
        projectStatusDataset[2].value += 1;
        projectStatusDataset[2].data = [...projectStatusDataset[2].data, item];
      } else if (project_status == 2) {
        projectStatusDataset[1].value += 1;
        projectStatusDataset[1].data = [...projectStatusDataset[1].data, item];
      } else if (project_status == 1) {
        projectStatusDataset[0].value += 1;
        projectStatusDataset[0].data = [...projectStatusDataset[0].data, item];
      } else {
        projectStatusDataset[3].value += 1;
        projectStatusDataset[3].data = [...projectStatusDataset[3].data, item];
      }

      if (budget_status == 3) {
        budgetStatusDataset[2].value += 1;
        budgetStatusDataset[2].data = [...budgetStatusDataset[2].data, item];
      } else if (budget_status == 2) {
        budgetStatusDataset[1].value += 1;
        budgetStatusDataset[1].data = [...budgetStatusDataset[1].data, item];
      } else if (budget_status == 1) {
        budgetStatusDataset[0].value += 1;
        budgetStatusDataset[0].data = [...budgetStatusDataset[0].data, item];
      } else {
        budgetStatusDataset[3].value += 1;
        budgetStatusDataset[3].data = [...budgetStatusDataset[3].data, item];
      }
    });

    this.state.list_kpi.forEach((item, index) => {
      let { kpi_status } = item;

      if (kpi_status == 3) {
        kpiStatusDataset[2].value += 1;
        kpiStatusDataset[2].data = [...kpiStatusDataset[2].data, item];
      } else if (kpi_status == 2) {
        kpiStatusDataset[1].value += 1;
        kpiStatusDataset[1].data = [...kpiStatusDataset[1].data, item];
      } else if (kpi_status == 1) {
        kpiStatusDataset[0].value += 1;
        kpiStatusDataset[0].data = [...kpiStatusDataset[0].data, item];
      } else {
        kpiStatusDataset[3].value += 1;
        kpiStatusDataset[3].data = [...kpiStatusDataset[3].data, item];
      }
    });
    // const genPieData = () => {
    //   const { data } = this.state;
    //   // console.log(data.map(el => moment(el.create_date).format('M')));
    //   let pieDataSet = groupArrayByDistinctValue(
    //     this.state.data,
    //     'project_status',
    //   );
    //   return {
    //     datasets: [
    //       {
    //         data: pieDataSet.map(e => e.dataSet.length),
    //         // backgroundColor: colorChart,
    //         backgroundColor: ['#fc5b7c', '#45b649', '#ccc', '#6a82fc'], //blue,gray,pink
    //         label: 'Dataset 1',
    //       },
    //     ],
    //     labels: pieDataSet.map(e => labelProjStatus(e.value)),
    //   };
    // };
    let budgetStatusPieData = {
      datasets: [
        {
          data: budgetStatusDataset.map(e => e.value),
          // backgroundColor: colorChart,
          backgroundColor: budgetStatusDataset.map(e => e.color), //blue,gray,pink
          label: 'สถานะการเบิกจ่ายงบประมาณ',
        },
      ],
      labels: budgetStatusDataset.map(e => e.label),
    };
    let projectStatusPieData = {
      datasets: [
        {
          data: projectStatusDataset.map(e => e.value),
          // backgroundColor: colorChart,
          backgroundColor: projectStatusDataset.map(e => e.color), //blue,gray,pink
          label: 'สถานะการเบิกจ่ายงบประมาณ',
        },
      ],
      labels: projectStatusDataset.map(e => e.label),
    };
    let kpiStatusPieData = {
      datasets: [
        {
          data: kpiStatusDataset.map(e => e.value),
          // backgroundColor: colorChart,
          backgroundColor: kpiStatusDataset.map(e => e.color), //blue,gray,pink
          label: 'ผลการดำเนินงานตาม KPI',
        },
      ],
      labels: kpiStatusDataset.map(e => e.label),
    };
    // const genDataProject = () => {
    //   const { data } = this.state;
    //   let pieDataSet = groupArrayByDistinctValue(
    //     this.state.data,
    //     'project_status',
    //   );
    //   return {
    //     datasets: [
    //       {
    //         data: pieDataSet.map(e => e.dataSet.length),
    //         // backgroundColor: colorChart,
    //         backgroundColor: ['#fc5b7c', '#45b649', '#ccc', '#6a82fc'], //blue,gray,pink
    //         label: 'Dataset 1',
    //       },
    //     ],
    //     labels: pieDataSet.map(e => labelProjStatus(e.value)),
    //   };
    // };

    const genDataKpi = () => {
      const { data } = this.state;
      // console.log(data.map(el => moment(el.create_date).format('M')));
      let pieDataSet = groupArrayByDistinctValue(
        this.state.list_kpi,
        'kpi_status',
      );
      return {
        datasets: [
          {
            data: pieDataSet.map(e => e.dataSet.length),
            backgroundColor: ['#fc5b7c', '#45b649', '#ccc', '#6a82fc'],
          },
        ],
        labels: pieDataSet.map(e => labelKPIStatus(e.value)),
      };
    };
    // console.log(groupArrayByDistinctValue(this.state.data, 'project_status'));
    let pieDataSet = groupArrayByDistinctValue(
      this.state.data,
      'project_status',
    );
    let BpieDataSet = groupArrayByDistinctValue(
      this.state.data,
      'budget_status',
    );
    let pieKPIDataSet = groupArrayByDistinctValue(
      this.state.list_kpi,
      'kpi_status',
    );

    return (
      <>
        <Navbar
          light
          expand
          className={bem.b('bg-white')}
          style={{ position: 'fixed', width: '100%', zIndex: '10' }}
        >
          <Nav navbar className="mr-2">
            <Link to="/login">
              <img src={Logo} style={{ width: '50px', height: 'auto' }} />
            </Link>
          </Nav>

          <Nav navbar className="mr-2">
            <div className="ml-2" style={{ textAlign: 'center' }}>
              <div className="text-main-1">เทศบาลนครนนทบุรี</div>
              <div className="text-main-2">ระบบติดตามโครงการและงบประมาณ</div>
            </div>
          </Nav>

          <Nav navbar className={bem.e('nav-right')}>
            <NavItem>
              <NavLink
                id="editUser"
                className="text-uppercase"
                tag={BsLink}
                to="/login"
                activeClassName="active"
                exact={true}
                // title={userDepartmentName}
              >
                <BsPersonFill className="ml-2 mr-2 text-icon-1" />
                <span className="text-main-3">Login</span>
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
        <div className="ml-2 mr-2" style={{ marginTop: '5rem' }}>
          <div className="box-1 mb-2">หน้าหลัก</div>

          <div className="box-2 mb-2">
            <Grid container spacing={1} className="flex mb-2">
              <Grid item xs={12} md={2}>
                <div className="box-6">รายละเอียดโครงการ</div>
              </Grid>
              <Grid item xs={12} md={1}>
                <div className="box-6">{this.state.year}</div>
              </Grid>
              <Grid item xs={false} md={3}></Grid>
              <Grid item xs={12} md={2}>
                <div className=" flex">
                  <div
                    className="mb-0"
                    style={{ whiteSpace: 'nowrap', width: '100px' }}
                  >
                    เลือกปีโครงการ
                  </div>
                  <div className="mb-0 ml-1">
                    <select
                      name="year"
                      id="year"
                      value={this.state.year}
                      onChange={this.handleInputChange}
                      className="form-control"
                      style={{ width: '100%' }}
                    >
                      {this.state.yearList.map(item => (
                        <option value={item.value}>ปี {item.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={2}>
                <div className=" flex">
                  <div
                    className="mb-0"
                    style={{ whiteSpace: 'nowrap', width: '100px' }}
                  >
                    ช่วงเวลา
                  </div>
                  <div className="mb-0 ml-1">
                    <select
                      name="period"
                      id="period"
                      value={this.state.period}
                      onChange={this.handleInputChange2}
                      className="form-control"
                      style={{ width: '100%' }}
                    >
                      {/* <option value="">ทั้งหมด</option> */}
                      <option value="2">12 เดือน</option>
                      <option value="1">6 เดือน</option>
                    </select>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={2}>
                <div className=" flex">
                  <div
                    className="mb-0"
                    style={{ whiteSpace: 'nowrap', width: '100px' }}
                  >
                    หน่วยงาน
                  </div>
                  <div className="mb-0 ml-1">
                    <select
                      name="department"
                      id="department"
                      value={this.state.department}
                      onChange={this.handleInputChange2}
                      className="form-control"
                      style={{ width: '100%' }}
                    >
                      <option value="">ทั้งหมด</option>
                      {this.state.departments_list.map(item => (
                        <option value={item.department_id}>
                          {item.department_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Grid>
            </Grid>
            <hr className="mb-3" />
            <div>
              <Grid
                container
                spacing={1}
                className="flex mb-3"
                style={{ textAlign: 'center', justifyContent: 'center' }}
              >
                <Grid item xs={12} md={4}>
                  <div className="box-card">
                    <div className="box-card-header-1">การดำเนินโครงการ</div>
                    <div className="box-card-body ">
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={5}>
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              alignItems: 'center',
                              display: 'flex',
                            }}
                          >
                            <Doughnut
                              options={{
                                legend: {
                                  display: false,
                                  position: 'bottom',
                                },
                                cutoutPercentage: 80,
                              }}
                              data={{
                                labels: [
                                  'วางแผน',
                                  'ดำเนินงาน',
                                  'ดำเนินการเรียบร้อย',
                                  'ยังไม่ดำเนินงาน',
                                ],
                                datasets: [
                                  {
                                    data: [
                                      (
                                        (this.state.data.filter(
                                          a =>
                                            parseFloat(a.project_progress) >=
                                              20 &&
                                            parseFloat(a.project_progress) < 60,
                                        ).length /
                                          this.state.data.length) *
                                        100
                                      ).toFixed(0),
                                      (
                                        (this.state.data.filter(
                                          a =>
                                            parseFloat(a.project_progress) >=
                                              60 &&
                                            parseFloat(a.project_progress) <
                                              100,
                                        ).length /
                                          this.state.data.length) *
                                        100
                                      ).toFixed(0),
                                      (
                                        (this.state.data.filter(
                                          a =>
                                            parseInt(a.project_progress) ===
                                            100,
                                        ).length /
                                          this.state.data.length) *
                                        100
                                      ).toFixed(0),
                                      (
                                        (this.state.data.filter(
                                          a =>
                                            parseFloat(a.project_progress) <=
                                            19,
                                        ).length /
                                          this.state.data.length) *
                                        100
                                      ).toFixed(0),
                                    ],
                                    backgroundColor: [
                                      '#FFAA22',
                                      '#9A9CE9',
                                      '#78DAB6',
                                      '#EE4444',
                                    ],
                                    borderWidth: 1,
                                  },
                                ],
                              }}
                            />
                          </div>
                          <div className="col-12 ">
                            <span className="text-dashboard-7">
                              โครงการทั้งหมด
                            </span>{' '}
                            <span className="text-dashboard-9">
                              {this.state.data.length}
                            </span>
                          </div>
                        </Grid>
                        <Grid item xs={12} md={7}>
                          <div>
                            <div className="flex mb-2">
                              <span className="text-dashboard-7">
                                {' '}
                                {parseInt(
                                  (this.state.data.filter(
                                    a =>
                                      parseFloat(a.project_progress) >= 20 &&
                                      parseFloat(a.project_progress) < 60,
                                  ).length /
                                    this.state.data.length) *
                                    100,
                                )
                                  .toFixed(0)
                                  .toString() === 'NaN'
                                  ? 0
                                  : parseInt(
                                      (this.state.data.filter(
                                        a =>
                                          parseFloat(a.project_progress) >=
                                            20 &&
                                          parseFloat(a.project_progress) < 60,
                                      ).length /
                                        this.state.data.length) *
                                        100,
                                    )}
                                %
                              </span>
                              <div className="dot-dashboard-1 mr-2 ml-2"></div>
                              <span className="text-dashboard-6">วางแผน</span>
                            </div>
                            <div className="flex  mb-2">
                              <span className="text-dashboard-7">
                                {parseFloat(
                                  (this.state.data.filter(
                                    a =>
                                      parseFloat(a.project_progress) >= 60 &&
                                      parseFloat(a.project_progress) < 100,
                                  ).length /
                                    this.state.data.length) *
                                    100,
                                )
                                  .toFixed(0)
                                  .toString() === 'NaN'
                                  ? 0
                                  : parseFloat(
                                      (this.state.data.filter(
                                        a =>
                                          parseFloat(a.project_progress) >=
                                            60 &&
                                          parseFloat(a.project_progress) < 100,
                                      ).length /
                                        this.state.data.length) *
                                        100,
                                    ).toFixed(0)}
                                %
                              </span>
                              <div className="dot-dashboard-2 mr-2 ml-2"></div>
                              <span className="text-dashboard-6">
                                ดำเนินงาน
                              </span>
                            </div>
                            <div className="flex  mb-2">
                              <span className="text-dashboard-7">
                                {parseFloat(
                                  (this.state.data.filter(
                                    a => parseInt(a.project_progress) === 100,
                                  ).length /
                                    this.state.data.length) *
                                    100,
                                )
                                  .toFixed(0)
                                  .toString() === 'NaN'
                                  ? 0
                                  : parseFloat(
                                      (this.state.data.filter(
                                        a =>
                                          parseInt(a.project_progress) === 100,
                                      ).length /
                                        this.state.data.length) *
                                        100,
                                    ).toFixed(0)}
                                %
                              </span>
                              <div className="dot-dashboard-3 mr-2 ml-2"></div>
                              <span className="text-dashboard-6">
                                ดำเนินการเรียบร้อย
                              </span>
                            </div>
                            <div className="flex  mb-2">
                              <span className="text-dashboard-7">
                                {parseFloat(
                                  (this.state.data.filter(
                                    a =>
                                      (a.project_progress.toString() !== 'NaN'
                                        ? parseFloat(a.project_progress)
                                        : 0) <= 19,
                                  ).length /
                                    this.state.data.length) *
                                    100,
                                )
                                  .toFixed(0)
                                  .toString() === 'NaN'
                                  ? 0
                                  : parseFloat(
                                      (this.state.data.filter(
                                        a =>
                                          (a.project_progress.toString() !==
                                          'NaN'
                                            ? parseFloat(a.project_progress)
                                            : 0) <= 19,
                                      ).length /
                                        this.state.data.length) *
                                        100,
                                    ).toFixed(0)}
                                %
                              </span>
                              <div className="dot-dashboard-4 mr-2 ml-2"></div>
                              <span className="text-dashboard-6">
                                ยังไม่ดำเนินงาน
                              </span>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={4}>
                  {' '}
                  <div className="box-card">
                    <div className="box-card-header-2">การเบิกจ่ายงบประมาณ</div>
                    <div className="box-card-body">
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={5}>
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              alignItems: 'center',
                              display: 'flex',
                            }}
                          >
                            <Doughnut
                              options={{
                                legend: {
                                  display: false,
                                  position: 'bottom',
                                },
                                cutoutPercentage: 80,
                              }}
                              data={{
                                labels: [
                                  'ยังไม่มีการรายงาน',
                                  'เป็นไปตามแผน',
                                  'เบิกจ่ายต่ำกว่าแผน',
                                  'เบิกจ่ายเกินแผน',
                                ],
                                datasets: [
                                  {
                                    data: [
                                      (
                                        (this.state.data.filter(
                                          a =>
                                            parseFloat(a.budget_progress) === 0,
                                        ).length /
                                          this.state.data.length) *
                                        100
                                      ).toFixed(0),
                                      (
                                        (this.state.data.filter(
                                          a =>
                                            parseFloat(a.budget_progress) ===
                                            100,
                                        ).length /
                                          this.state.data.length) *
                                        100
                                      ).toFixed(0),
                                      (
                                        (this.state.data.filter(
                                          a =>
                                            parseFloat(a.budget_progress) > 0 &&
                                            parseFloat(a.budget_progress) <= 99,
                                        ).length /
                                          this.state.data.length) *
                                        100
                                      ).toFixed(0),
                                      (
                                        (this.state.data.filter(
                                          a =>
                                            parseFloat(a.budget_progress) > 100,
                                        ).length /
                                          this.state.data.length) *
                                        100
                                      ).toFixed(0),
                                    ],
                                    backgroundColor: [
                                      '#FFAA22',
                                      '#9A9CE9',
                                      '#78DAB6',
                                      '#EE4444',
                                    ],
                                    borderWidth: 1,
                                  },
                                ],
                              }}
                            />
                          </div>
                          <div className="col-12 ">
                            <span className="text-dashboard-7">
                              โครงการทั้งหมด
                            </span>{' '}
                            <span className="text-dashboard-9">
                              {this.state.data.length}
                            </span>
                          </div>
                        </Grid>
                        <Grid item xs={12} md={7}>
                          <div>
                            <div className="flex mb-2">
                              <span className="text-dashboard-7">
                                {' '}
                                {parseFloat(
                                  (this.state.data.filter(
                                    a => parseFloat(a.budget_progress) === 0,
                                  ).length /
                                    this.state.data.length) *
                                    100,
                                )
                                  .toFixed(0)
                                  .replace('NaN', 0)}
                                %
                              </span>
                              <div className="dot-dashboard-1 mr-2 ml-2"></div>
                              <span className="text-dashboard-6">
                                ยังไม่มีการรายงาน
                              </span>
                            </div>
                            <div className="flex  mb-2">
                              <span className="text-dashboard-7">
                                {parseFloat(
                                  (this.state.data.filter(
                                    a => parseFloat(a.budget_progress) === 100,
                                  ).length /
                                    this.state.data.length) *
                                    100,
                                )
                                  .toFixed(0)
                                  .replace('NaN', 0)}
                                %
                              </span>
                              <div className="dot-dashboard-2 mr-2 ml-2"></div>
                              <span className="text-dashboard-6">
                                เป็นไปตามแผน
                              </span>
                            </div>
                            <div className="flex  mb-2">
                              <span className="text-dashboard-7">
                                {parseFloat(
                                  (this.state.data.filter(
                                    a =>
                                      parseFloat(a.budget_progress) > 0 &&
                                      parseFloat(a.budget_progress) <= 99,
                                  ).length /
                                    this.state.data.length) *
                                    100,
                                )
                                  .toFixed(0)
                                  .replace('NaN', 0)}
                                %
                              </span>
                              <div className="dot-dashboard-3 mr-2 ml-2"></div>
                              <span className="text-dashboard-6">
                                เบิกจ่ายต่ำกว่าแผน
                              </span>
                            </div>
                            <div className="flex  mb-2">
                              <span className="text-dashboard-7">
                                {parseFloat(
                                  (this.state.data.filter(
                                    a => parseFloat(a.budget_progress) > 100,
                                  ).length /
                                    this.state.data.length) *
                                    100,
                                )
                                  .toFixed(0)
                                  .replace('NaN', 0)}
                                %
                              </span>
                              <div className="dot-dashboard-4 mr-2 ml-2"></div>
                              <span className="text-dashboard-6">
                                เบิกจ่ายเกินแผน
                              </span>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={4}>
                  {' '}
                  <div className="box-card">
                    <div className="box-card-header-3">
                      ผลการดำเนินงานตาม KPI
                    </div>
                    <div className="box-card-body">
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={5}>
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              alignItems: 'center',
                              display: 'flex',
                            }}
                          >
                            <Doughnut
                              style={{ width: '100%' }}
                              options={{
                                legend: {
                                  display: false,
                                  position: 'bottom',
                                },
                                cutoutPercentage: 80,
                              }}
                              data={{
                                labels: [
                                  'ยังไม่มีการรายงาน',
                                  'ดีมาก',
                                  'ดี',
                                  'พอใช้',
                                  'ปรับปรุง',
                                  'ไม่ผ่าน',
                                ],
                                datasets: [
                                  {
                                    data: [
                                      (
                                        (this.state.report_kpi_list.filter(
                                          a =>
                                            parseInt(a.kpi_score_target) ===
                                              0 ||
                                            a.kpi_score_target === undefined,
                                        ).length /
                                          this.state.report_kpi_list.length) *
                                        100
                                      ).toFixed(0),
                                      (
                                        (this.state.report_kpi_list.filter(
                                          a =>
                                            parseInt(a.kpi_score_target) === 5,
                                        ).length /
                                          this.state.report_kpi_list.length) *
                                        100
                                      ).toFixed(0),
                                      (
                                        (this.state.report_kpi_list.filter(
                                          a =>
                                            parseInt(a.kpi_score_target) === 4,
                                        ).length /
                                          this.state.report_kpi_list.length) *
                                        100
                                      ).toFixed(0),
                                      (
                                        (this.state.report_kpi_list.filter(
                                          a =>
                                            parseInt(a.kpi_score_target) === 3,
                                        ).length /
                                          this.state.report_kpi_list.length) *
                                        100
                                      ).toFixed(0),
                                      (
                                        (this.state.report_kpi_list.filter(
                                          a =>
                                            parseInt(a.kpi_score_target) === 2,
                                        ).length /
                                          this.state.report_kpi_list.length) *
                                        100
                                      ).toFixed(0),
                                      (
                                        (this.state.report_kpi_list.filter(
                                          a =>
                                            parseInt(a.kpi_score_target) === 1,
                                        ).length /
                                          this.state.report_kpi_list.length) *
                                        100
                                      ).toFixed(0),
                                    ],
                                    backgroundColor: [
                                      '#BBBBBB',
                                      '#008000',
                                      '#00FF00',
                                      '#ffff00',
                                      '#FF00FF',
                                      '#FF0000',
                                    ],
                                    borderWidth: 1,
                                  },
                                ],
                              }}
                            />
                          </div>
                          <div className="col-12 ">
                            <span className="text-dashboard-7">
                              ตัวชี้วัด KPI ทั้งหมด
                            </span>{' '}
                            <span className="text-dashboard-9">
                              {this.state.report_kpi_list.length}
                            </span>
                          </div>
                        </Grid>
                        <Grid item xs={12} md={7}>
                          <div>
                            <div className="flex mb-2">
                              <span className="text-dashboard-7">
                                {(
                                  (this.state.report_kpi_list.filter(
                                    a =>
                                      parseInt(a.kpi_score_target) === 0 ||
                                      a.kpi_score_target === undefined,
                                  ).length /
                                    this.state.report_kpi_list.length) *
                                  100
                                )
                                  .toFixed(0)
                                  .replace('NaN', 0)}
                                %
                              </span>
                              <div
                                className="dot-dashboard-1 mr-2 ml-2"
                                style={{ backgroundColor: '#BBBBBB' }}
                              ></div>
                              <span className="text-dashboard-6">
                                ยังไม่มีการรายงาน
                              </span>
                            </div>
                            <div className="flex  mb-2">
                              <span className="text-dashboard-7">
                                {(
                                  (this.state.report_kpi_list.filter(
                                    a => parseInt(a.kpi_score_target) === 5,
                                  ).length /
                                    this.state.report_kpi_list.length) *
                                  100
                                )
                                  .toFixed(0)
                                  .replace('NaN', 0)}
                                %
                              </span>
                              <div
                                className="dot-dashboard-2 mr-2 ml-2"
                                style={{ backgroundColor: '#008000' }}
                              ></div>
                              <span className="text-dashboard-6">ดีมาก</span>
                            </div>
                            <div className="flex  mb-2">
                              <span className="text-dashboard-7">
                                {(
                                  (this.state.report_kpi_list.filter(
                                    a => parseInt(a.kpi_score_target) === 4,
                                  ).length /
                                    this.state.report_kpi_list.length) *
                                  100
                                )
                                  .toFixed(0)
                                  .replace('NaN', 0)}
                                %
                              </span>
                              <div
                                className="dot-dashboard-3 mr-2 ml-2"
                                style={{ backgroundColor: '#00FF00' }}
                              ></div>
                              <span className="text-dashboard-6">ดี</span>
                            </div>
                            <div className="flex  mb-2">
                              <span className="text-dashboard-7">
                                {(
                                  (this.state.report_kpi_list.filter(
                                    a => parseInt(a.kpi_score_target) === 3,
                                  ).length /
                                    this.state.report_kpi_list.length) *
                                  100
                                )
                                  .toFixed(0)
                                  .replace('NaN', 0)}
                                %
                              </span>
                              <div
                                className="dot-dashboard-4 mr-2 ml-2"
                                style={{ backgroundColor: '#ffff00' }}
                              ></div>
                              <span className="text-dashboard-6">พอใช้</span>
                            </div>
                            <div className="flex  mb-2">
                              <span className="text-dashboard-7">
                                {(
                                  (this.state.report_kpi_list.filter(
                                    a => parseInt(a.kpi_score_target) === 2,
                                  ).length /
                                    this.state.report_kpi_list.length) *
                                  100
                                )
                                  .toFixed(0)
                                  .replace('NaN', 0)}
                                %
                              </span>
                              <div
                                className="dot-dashboard-4 mr-2 ml-2"
                                style={{ backgroundColor: '#FF00FF' }}
                              ></div>
                              <span className="text-dashboard-6">ปรับปรุง</span>
                            </div>
                            <div className="flex  mb-2">
                              <span className="text-dashboard-7">
                                {(
                                  (this.state.report_kpi_list.filter(
                                    a => parseInt(a.kpi_score_target) === 1,
                                  ).length /
                                    this.state.report_kpi_list.length) *
                                  100
                                )
                                  .toFixed(0)
                                  .replace('NaN', 0)}
                                %
                              </span>
                              <div
                                className="dot-dashboard-4 mr-2 ml-2"
                                style={{ backgroundColor: '#FF0000' }}
                              ></div>
                              <span className="text-dashboard-6">ไม่ผ่าน</span>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={1}
                className="flex mb-2"
                style={{ textAlign: 'center', justifyContent: 'center' }}
              >
                <Grid item xs={6} md={2}>
                  <div className="box-dashboard-1">
                    <div className="row">
                      <div
                        className="col-6 flex pr-0"
                        style={{ justifyContent: 'center' }}
                      >
                        <div className="circle-dashboard-1">
                          <TiStarFullOutline style={{ fontSize: '40px' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div>โครงการทั้งหมด</div>{' '}
                        <div className="text-dashboard-1">
                          {this.state.data.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6} md={2}>
                  <div className="box-dashboard-2 ">
                    <div className="row">
                      <div
                        className="col-6 flex pr-0"
                        style={{ justifyContent: 'center' }}
                      >
                        <div className="circle-dashboard-2">
                          <IoMdCheckbox style={{ fontSize: '40px' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div>โครงการที่</div> <div>ดำเนินการแล้ว</div>
                        <div className="text-dashboard-2">
                          {
                            this.state.data.filter(
                              a => parseInt(a.project_status) === 3,
                            ).length
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6} md={2}>
                  <div className="box-dashboard-3">
                    <div className="row">
                      <div
                        className="col-6 flex pr-0"
                        style={{ justifyContent: 'center' }}
                      >
                        <div className="circle-dashboard-3">
                          <AiFillEdit style={{ fontSize: '40px' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div>โครงการที่อยู่ระหว่าง</div> <div>ดำเนินการ</div>
                        <div className="text-dashboard-3">
                          {
                            this.state.data.filter(
                              a => parseInt(a.project_status) === 2,
                            ).length
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6} md={2}>
                  <div className="box-dashboard-4">
                    <div className="row">
                      <div
                        className="col-6 flex pr-0"
                        style={{ justifyContent: 'center' }}
                      >
                        <div className="circle-dashboard-4">
                          <IoIosAlarm style={{ fontSize: '40px' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div>โครงการที่ </div>
                        <div>ยังไม่ดำเนินการ</div>
                        <div className="text-dashboard-4">
                          {
                            this.state.data.filter(
                              a => parseInt(a.project_status) === 1,
                            ).length
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6} md={2}>
                  <div className="box-dashboard-5">
                    <div className="row">
                      <div
                        className="col-6 flex pr-0"
                        style={{ justifyContent: 'center' }}
                      >
                        <div className="circle-dashboard-5">
                          <GoCircleSlash style={{ fontSize: '40px' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div>โครงการที่ยกเลิก</div> <div>การดำเนินการ</div>
                        <div className="text-dashboard-5">
                          {' '}
                          {
                            this.state.data.filter(
                              a => parseInt(a.project_status) === 4,
                            ).length
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6} md={2}>
                  <div className="box-dashboard-6">
                    <div className="row">
                      <div
                        className="col-6 flex pr-0"
                        style={{ justifyContent: 'center' }}
                      >
                        <div className="circle-dashboard-6">
                          <AiFillFolderAdd style={{ fontSize: '40px' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div>โครงการที่เพิ่มใหม่</div>
                        <div className="text-dashboard-10">
                          {' '}
                          {
                            this.state.data.filter(
                              a => parseInt(a.project_status) === 0,
                            ).length
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div>
              <div className="box-13 mb-2">ข้อมูลงบประมาณทั้งหมด</div>
              <div>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td
                        rowSpan="2"
                        style={{ width: '33%', textAlign: 'center' }}
                      >
                        {' '}
                        <Doughnut
                          options={{
                            legend: {
                              display: false,
                              position: 'bottom',
                            },
                            cutoutPercentage: 80,
                          }}
                          data={{
                            labels: ['รายรับรวม', 'รายจ่ายรวม'],
                            datasets: [
                              {
                                data: [
                                  this.revenueSum(),
                                  this.expenditureSum(),
                                ],
                                backgroundColor: ['#AEEEE0', '#9A9CE9'],
                                borderWidth: 1,
                              },
                            ],
                          }}
                        />
                        <div className="mt-5">
                          <div className="text-dashboard-7-1">
                            ข้อมูลงบประมาณรวม
                          </div>
                          <div>
                            <span className="text-dashboard-8">
                              งบประมาณคงเหลือ :{' '}
                              {this.moneyFormat(
                                this.revenueSum() - this.expenditureSum(),
                              )}{' '}
                              บาท
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <table>
                            <tbody>
                              <tr>
                                <td>
                                  <div className="dot-dashboard-3 mr-2 ml-2"></div>
                                </td>
                                <td>
                                  <span className="text-dashboard-7">
                                    รายรับรวม{' '}
                                    {this.moneyFormat(this.revenueSum())} บาท
                                  </span>
                                </td>
                                <td>
                                  <div className="dot-dashboard-2 mr-2 ml-2"></div>
                                </td>
                                <td>
                                  <span className="text-dashboard-7">
                                    รายจ่ายรวม{' '}
                                    {this.moneyFormat(this.expenditureSum())}{' '}
                                    บาท
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                      <td style={{ width: '33%' }}>
                        {' '}
                        <Doughnut
                          options={{
                            legend: {
                              display: false,
                              position: 'bottom',
                            },
                            cutoutPercentage: 80,
                          }}
                          data={{
                            labels: [
                              'รายได้จัดเก็บเอง',
                              'รายได้ที่รัฐบาลเก็บแล้วจัดสรรให้องค์กรปกครองส่วนท้องถิ่น',
                              'รายได้ที่รัฐบาลอุดหนุนให้องค์กรปกครองส่วนท้องถิ่น',
                            ],
                            datasets: [
                              {
                                data: [
                                  this.revenueSum2(
                                    this.state.revenueBudgets_list.filter(
                                      a =>
                                        parseInt(a.revenue_type_category) ===
                                        parseInt(1),
                                    ),
                                  ),
                                  this.revenueSum2(
                                    this.state.revenueBudgets_list.filter(
                                      a =>
                                        parseInt(a.revenue_type_category) ===
                                        parseInt(2),
                                    ),
                                  ),
                                  this.revenueSum2(
                                    this.state.revenueBudgets_list.filter(
                                      a =>
                                        parseInt(a.revenue_type_category) ===
                                        parseInt(3),
                                    ),
                                  ),
                                ],
                                backgroundColor: [
                                  '#00EAFF',
                                  '#1199EE',
                                  '#AEEEE0',
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }}
                        />
                        <div
                          style={{ textAlign: 'center' }}
                          className="text-dashboard-7-1"
                        >
                          งบประมาณรายรับ{' '}
                          <span className="text-dashboard-9">
                            {this.moneyFormat(this.revenueSum())} บาท
                          </span>
                        </div>
                      </td>
                      <td style={{ width: '35%' }}>
                        <div>
                          <table>
                            <tbody>
                              <tr>
                                <td style={{ textAlign: 'right' }}>
                                  <span className="text-dashboard-7">
                                    {this.moneyFormat(
                                      this.revenueSum2(
                                        this.state.revenueBudgets_list.filter(
                                          a =>
                                            parseInt(
                                              a.revenue_type_category,
                                            ) === parseInt(1),
                                        ),
                                      ),
                                    )}{' '}
                                    บาท
                                  </span>
                                </td>
                                <td>
                                  <div className="dot-dashboard-11 mr-2 ml-2"></div>
                                </td>
                                <td>
                                  <span className="text-dashboard-6">
                                    ประเภท รายได้จัดเก็บเอง
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ textAlign: 'right' }}>
                                  <span className="text-dashboard-7">
                                    {this.moneyFormat(
                                      this.revenueSum2(
                                        this.state.revenueBudgets_list.filter(
                                          a =>
                                            parseInt(
                                              a.revenue_type_category,
                                            ) === parseInt(2),
                                        ),
                                      ),
                                    )}{' '}
                                    บาท
                                  </span>
                                </td>
                                <td>
                                  <div className="dot-dashboard-12 mr-2 ml-2"></div>
                                </td>
                                <td>
                                  <span className="text-dashboard-6">
                                    ประเภท
                                    รายได้ที่รัฐบาลเก็บแล้วจัดสรรให้องค์กรปกครองส่วนท้องถิ่น
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ textAlign: 'right' }}>
                                  <span className="text-dashboard-7">
                                    {this.moneyFormat(
                                      this.revenueSum2(
                                        this.state.revenueBudgets_list.filter(
                                          a =>
                                            parseInt(
                                              a.revenue_type_category,
                                            ) === parseInt(3),
                                        ),
                                      ),
                                    )}{' '}
                                    บาท
                                  </span>
                                </td>
                                <td>
                                  <div className="dot-dashboard-3 mr-2 ml-2"></div>
                                </td>
                                <td>
                                  <span className="text-dashboard-6">
                                    ประเภท
                                    รายได้ที่รัฐบาลอุดหนุนให้องค์กรปกครองส่วนท้องถิ่น
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: '33%' }}>
                        {' '}
                        <Doughnut
                          options={{
                            legend: {
                              display: false,
                              position: 'bottom',
                            },
                            cutoutPercentage: 80,
                          }}
                          data={{
                            labels: this.state.expenditureBudgets_list.map(
                              id => id.expenditure_budget_type_name,
                            ),

                            datasets: [
                              {
                                data: this.state.expenditureBudgets_list.map(
                                  id =>
                                    parseFloat(id.expenditure_budget_estimate),
                                ),
                                backgroundColor: [
                                  '#EE4444',
                                  '#7755CC',
                                  '#9A9CE9',
                                  '#BB66CC',
                                  '#FF88AA',
                                  '#FFAA22',
                                  '#F7D1FF',
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }}
                        />
                        <div
                          style={{ textAlign: 'center' }}
                          className="text-dashboard-7-1"
                        >
                          งบประมาณรายจ่าย{' '}
                          <span className="text-dashboard-9">
                            {this.moneyFormat(this.expenditureSum())} บาท
                          </span>
                        </div>
                      </td>
                      <td style={{ width: '33%' }}>
                        <div>
                          <table>
                            <tbody>
                              {this.state.expenditureBudgets_list.map(
                                (id, i) => (
                                  <tr key={'expenditureBudgets_list' + i}>
                                    <td style={{ textAlign: 'right' }}>
                                      <span className="text-dashboard-7">
                                        {this.moneyFormat(
                                          id.expenditure_budget_estimate,
                                        )}{' '}
                                        บาท
                                      </span>
                                    </td>
                                    <td>
                                      <div
                                        className={`dot-dashboard-${
                                          4 + i
                                        } mr-2 ml-2`}
                                      ></div>
                                    </td>
                                    <td>
                                      <span className="text-dashboard-6">
                                        {' '}
                                        {id.expenditure_budget_type_name}
                                      </span>
                                    </td>
                                  </tr>
                                ),
                              )}
                              {/* <tr>
                              <td>
                                <span className="text-dashboard-7">
                                  10,000,000 บาท
                                </span>
                              </td>
                              <td>
                                <div className="dot-dashboard-6 mr-2 ml-2"></div>
                              </td>
                              <td>
                                <span className="text-dashboard-6">
                                  งบบุคลากร
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="text-dashboard-7">
                                  10,000,000 บาท
                                </span>
                              </td>
                              <td>
                                <div className="dot-dashboard-7 mr-2 ml-2"></div>
                              </td>
                              <td>
                                <span className="text-dashboard-6">
                                  งบดำเนินการ
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="text-dashboard-7">
                                  10,000,000 บาท
                                </span>
                              </td>
                              <td>
                                <div className="dot-dashboard-8 mr-2 ml-2"></div>
                              </td>
                              <td>
                                <span className="text-dashboard-6">
                                  งบลงทุน
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="text-dashboard-7">
                                  5,000,000 บาท
                                </span>
                              </td>
                              <td>
                                <div className="dot-dashboard-9 mr-2 ml-2"></div>
                              </td>
                              <td>
                                <span className="text-dashboard-6">
                                  งบเงินอุดหนุน
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="text-dashboard-7">
                                  5,000,000 บาท
                                </span>
                              </td>
                              <td>
                                <div className="dot-dashboard-10 mr-2 ml-2"></div>
                              </td>
                              <td>
                                <span className="text-dashboard-6">
                                  งบรายจ่ายอื่น
                                </span>
                              </td>
                            </tr> */}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <hr />
              <div className="box-13 mb-2">รายการงบประมาณ</div>

              <div className="mb-2">
                <div className="mt-2">
                  <DashboardBudgetList
                    page={null}
                    year={this.state.year}
                    title="รายการงบประมาณ"
                  />
                </div>
              </div>
              <hr />
              <div className="box-13 mb-2">รายการงบประมาณรายจ่ายตามแผนงาน</div>
              <div className="mb-2">
                <div className="mt-2">
                  <DashboardBudgetPlanList
                    page={null}
                    year={this.state.year}
                    title="รายการงบประมาณรายจ่ายตามแผนงาน"
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className="box-13 mb-2">รายการงบประมาณรายจ่ายตามหน่วยงาน</div>
            <div className="mb-2">
              <div className="mt-2">
                <DashboardBudgetDepartmantList
                  page={null}
                  year={this.state.year}
                  title="รายการงบประมาณรายจ่ายตามหน่วยงาน"
                />
              </div>
            </div>
            <hr />
            <div>
              <div>
                <DashboardReportProjectList
                  page={null}
                  year={this.state.year}
                  period={this.state.period}
                  select_depaetment={this.state.department}
                  title="โครงการ"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default DashboardNew2;
