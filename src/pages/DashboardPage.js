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
import { Link } from 'react-router-dom';
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
class DashboardPage extends React.Component {
  state = {
    list: [],
    list_kpi: [],
    modalShow: false,
    data: [],
    selected: 0,
    offset: 0,
    perPage: 0,
    url: process.env.REACT_APP_SOURCE_URL + '/Projects/',
    result: [],
    result1: [],
    peiType: 0,
    budgetDis: 'none',
    projectDis: 'none',
    kpiDis: 'none',
    showlist: 'none',
    projectTitle: '',
    backgroundColor: '',
  };
  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
    this.loadCommentsFromServer();
    this.fetchDataKPI();
  }

  loadCommentsFromServer() {
    $.ajax({
      url:
        this.state.url +
        '?page=' +
        this.state.selected +
        '&size=' +
        this.state.perPage,
      //data: { totalPage: this.state.perPage, offset: this.state.offset },
      dataType: 'json',
      type: 'GET',
      success: data => {
        const year = new Date().getFullYear();
        let resultx = data.result.filter(
          results => new Date().getFullYear(results.create_date) == year,
        );
        let result = resultx.filter(results => results.project_progress == 0);
        let result1 = resultx.filter(
          results1 => results1.project_progress != 0,
        );
        this.setState({
          data: data.result,
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
          results => new Date().getFullYear(results.create_date) == year,
        );
        this.setState({ list_kpi: resultc });
      })
      .catch(error => {
        console.log(error);
      });
  }
  // handleClick() {
  //   window.scrollTo({
  //     top: 100,
  //     left: 100,
  //     behavior: 'smooth'
  //   });
  //   // <Link component={Link} to="#viewProjectDetail"></Link>
  // }
  handleClick1() {
    window.scrollTo({ top: 740, behavior: 'smooth' });
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
    // console.log(this.state.list_kpi);
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
    // console.log(pieKPIDataSet);

    return (
      <Page
        className="DashboardPage"
        title="Dashboard"
        breadcrumbs={[{ name: 'Dashboard', active: true }]}
      >
        <Row>
          <Col lg="4" md="4" sm="12" xs="12">
            <Card style={{ width: '99.9%' }}>
              <CardBody>
                <Pie
                  options={{
                    title: {
                      display: true,
                      text: 'การดำเนินโครงการ',
                      fontSize: 20,
                    },
                    legend: {
                      display: false,
                      position: 'bottom',
                    },
                  }}
                  // data={genDataProject()}
                  data={projectStatusPieData}
                  // onClick={window.scrollTo({top:740,behavior: 'smooth'})}
                  onElementsClick={elems => {
                    // if required to build the URL, you can
                    // get datasetIndex and value index from an `elem`:

                    if (elems[0]) {
                      // console.log(elems[0]._model.backgroundColor);
                      let id;
                      if (
                        elems[0]._model.backgroundColor == 'rgb(184, 184, 184)'
                      ) {
                        id = 3;
                      } else if (
                        elems[0]._model.backgroundColor == 'rgb(66, 98, 255)'
                      ) {
                        id = 0;
                      } else if (
                        elems[0]._model.backgroundColor == 'rgb(36, 188, 41)'
                      ) {
                        id = 2;
                      } else if (
                        elems[0]._model.backgroundColor == 'rgb(255, 51, 92)'
                      ) {
                        id = 1;
                      }
                      // console.log(projectStatusDataset[id]);
                      this.setState({
                        peiType: id,
                        backgroundColor: elems[0]._model.backgroundColor,
                        projectDis: 'block',
                        showlist: 'block',
                        budgetDis: 'none',
                        kpiDis: 'none',
                      });
                    }
                  }}
                  // onClick={()=>this.handleClick1()}
                  width={1024}
                  height={600}
                />

                <br />
                <ListGroup flush>
                  <Table hover id="table1">
                    <tr>
                      <th> สถานะโครงการ</th>
                      <th style={{ textAlign: 'center' }}>
                        จำนวน
                        <br />
                        (โครงการ)
                      </th>
                    </tr>
                    <tr>
                      <td> {projectStatusDataset[3].label}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge
                          style={{ backgroundColor: '#ccc', color: 'black' }}
                        >
                          {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                          {projectStatusDataset[3].value}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td> {projectStatusDataset[0].label}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge color="primary">
                          {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                          {projectStatusDataset[0].value}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td> {projectStatusDataset[2].label}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge color="success">
                          {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                          {projectStatusDataset[2].value}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td> {projectStatusDataset[1].label}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge color="secondary">
                          {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                          {projectStatusDataset[1].value}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>รวมทั้งหมด</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge style={{ backgroundColor: 'black' }}>
                          {/* {!!pieDataSet[3] ? pieDataSet[3].dataSet.length : 0} */}
                          {this.state.data.length}
                        </Badge>
                      </td>
                    </tr>
                  </Table>
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4" md="4" sm="12" xs="12">
            <Card style={{ width: '99.9%' }}>
              <CardBody>
                <Pie
                  options={{
                    title: {
                      display: true,
                      text: 'การเบิกจ่ายงบประมาณ',
                      fontSize: 20,
                    },
                    legend: {
                      display: false,
                      position: 'bottom',
                    },
                  }}
                  // data={genPieData()}
                  data={budgetStatusPieData}
                  onElementsClick={elems => {
                    // if required to build the URL, you can
                    // get datasetIndex and value index from an `elem`:
                    // console.log(
                    //   elems[0]._datasetIndex + ', ' + elems[0]._index,
                    // );
                    if (elems[0]) {
                      // console.log(elems[0]._model.backgroundColor);
                      let id;
                      if (
                        elems[0]._model.backgroundColor == 'rgb(184, 184, 184)'
                      ) {
                        id = 3;
                      } else if (
                        elems[0]._model.backgroundColor == 'rgb(66, 98, 255)'
                      ) {
                        id = 0;
                      } else if (
                        elems[0]._model.backgroundColor == 'rgb(36, 188, 41)'
                      ) {
                        id = 1;
                      } else if (
                        elems[0]._model.backgroundColor == 'rgb(255, 51, 92)'
                      ) {
                        id = 2;
                      }
                      // console.log(budgetStatusDataset[id]);
                      this.setState({
                        peiType: id,
                        backgroundColor: elems[0]._model.backgroundColor,
                        budgetDis: 'block',
                        projectDis: 'none',
                        showlist: 'block',
                        kpiDis: 'none',
                      });
                    }
                  }}
                  width={1024}
                  height={600}
                />
                <br />
                <ListGroup flush>
                  <Table hover id="table1">
                    <tr>
                      <th> สถานะโครงการ</th>
                      <th style={{ textAlign: 'center' }}>
                        จำนวน
                        <br />
                        (โครงการ)
                      </th>
                    </tr>
                    <tr>
                      <td> {budgetStatusDataset[3].label}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge
                          style={{ backgroundColor: '#ccc', color: 'black' }}
                        >
                          {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                          {budgetStatusDataset[3].value}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td> {budgetStatusDataset[0].label}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge color="primary">
                          {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                          {budgetStatusDataset[0].value}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td> {budgetStatusDataset[1].label}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge color="success">
                          {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                          {budgetStatusDataset[1].value}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td> {budgetStatusDataset[2].label}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge color="secondary">
                          {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                          {budgetStatusDataset[2].value}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>รวมทั้งหมด</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge style={{ backgroundColor: 'black' }}>
                          {/* {!!pieDataSet[3] ? pieDataSet[3].dataSet.length : 0} */}
                          {this.state.data.length}
                        </Badge>
                      </td>
                    </tr>
                  </Table>
                  {/* <ListGroupItem>
                    <Badge style={{ backgroundColor: '#ccc', color: 'black' }}> */}
                  {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                  {/* {budgetStatusDataset[3].value}
                    </Badge>
                    &nbsp;&nbsp;&nbsp;{budgetStatusDataset[3].label}
                  </ListGroupItem>
                  <ListGroupItem>
                    <Badge color="primary"> */}
                  {/* {!!pieDataSet[1] ? pieDataSet[1].dataSet.length : 0} */}
                  {/* {budgetStatusDataset[0].value}
                    </Badge>
                    &nbsp;&nbsp;&nbsp;{budgetStatusDataset[0].label}
                  </ListGroupItem>
                  <ListGroupItem>
                    <Badge color="success"> */}
                  {/* {!!pieDataSet[3] ? pieDataSet[3].dataSet.length : 0} */}
                  {/* {budgetStatusDataset[1].value}
                    </Badge>
                    &nbsp;&nbsp;&nbsp;{budgetStatusDataset[1].label}
                  </ListGroupItem>

                  <ListGroupItem>
                    <Badge color="secondary"> */}
                  {/* {!!pieDataSet[2] ? pieDataSet[2].dataSet.length : 0} */}
                  {/* {budgetStatusDataset[2].value}
                    </Badge>
                    &nbsp;&nbsp;&nbsp;{budgetStatusDataset[2].label}
                  </ListGroupItem> */}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4" md="4" sm="12" xs="12">
            <Card style={{ width: '99.9%' }}>
              <CardBody>
                {/* {this.state.peiType} */}
                <Pie
                  options={{
                    title: {
                      display: true,
                      text: 'ผลการดำเนินงานตาม KPI',
                      fontSize: 20,
                    },
                    legend: {
                      display: false,
                      position: 'bottom',
                    },
                  }}
                  data={kpiStatusPieData}
                  onElementsClick={elems => {
                    // if required to build the URL, you can
                    // get datasetIndex and value index from an `elem`:
                    // console.log(
                    //   elems[0]._datasetIndex + ', ' + elems[0]._index,
                    // );
                    if (elems[0]) {
                      // console.log(elems[0]._model.backgroundColor);
                      let id;
                      if (
                        elems[0]._model.backgroundColor == 'rgb(184, 184, 184)'
                      ) {
                        id = 3;
                      } else if (
                        elems[0]._model.backgroundColor == 'rgb(66, 98, 255)'
                      ) {
                        id = 0;
                      } else if (
                        elems[0]._model.backgroundColor == 'rgb(36, 188, 41)'
                      ) {
                        id = 2;
                      } else if (
                        elems[0]._model.backgroundColor == 'rgb(255, 51, 92)'
                      ) {
                        id = 1;
                      }
                      // console.log(kpiStatusDataset[id]);
                      this.setState({
                        peiType: id,
                        backgroundColor: elems[0]._model.backgroundColor,
                        budgetDis: 'none',
                        projectDis: 'none',
                        showlist: 'block',
                        kpiDis: 'block',
                      });
                    }
                  }}
                  width={1024}
                  height={600}
                />{' '}
                <br />
                <ListGroup flush>
                  <Table hover id="table1">
                    <tr>
                      <th> สถานะตัวชี้วัด</th>
                      <th style={{ textAlign: 'center' }}>
                        จำนวน
                        <br />
                        (ตัวชี้วัด)
                      </th>
                    </tr>
                    <tr>
                      <td> {kpiStatusDataset[3].label}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge
                          style={{ backgroundColor: '#ccc', color: 'black' }}
                        >
                          {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                          {kpiStatusDataset[3].value}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td> {kpiStatusDataset[0].label}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge color="primary">
                          {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                          {kpiStatusDataset[0].value}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td> {kpiStatusDataset[2].label}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge color="success">
                          {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                          {kpiStatusDataset[2].value}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td> {kpiStatusDataset[1].label}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge color="secondary">
                          {/* {!!pieDataSet[0] ? pieDataSet[0].dataSet.length : 0} */}
                          {kpiStatusDataset[1].value}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>รวมทั้งหมด</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge style={{ backgroundColor: 'black' }}>
                          {/* {!!pieDataSet[3] ? pieDataSet[3].dataSet.length : 0} */}
                          {this.state.list_kpi.length}
                        </Badge>
                      </td>
                    </tr>
                  </Table>
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
          {/* {this.state.projectDis} */}
          <div
            id="viewProjectDetail"
            style={
              this.state.showlist == 'none'
                ? { display: 'block' }
                : { display: 'none' }
            }
          >
            <Col
              lg="12"
              md="12"
              sm="12"
              style={{ display: this.props.display }}
            >
              <Card>
                <CardHeader style={{ textAlign: 'center' }}>
                  <b>รายละเอียดการดำเนินโครงการ</b>
                  <br />
                  <b style={{ color: this.props.color }}>{this.props.Title}</b>
                </CardHeader>
                <CardBody>
                  <Table hover id="table1">
                    <thead>
                      <tr>
                        <th>รหัสงบประมาณ</th>
                        <th>ชื่อโครงการ</th>
                        <th>
                          ความก้าวหน้าโครงการ / <br />
                          ความก้าวหน้าเบิกจ่ายงบประมาณ
                        </th>
                        <th>วันที่เริ่มต้นโครงการ</th>
                        <th>วันที่สิ้นสุดโครงการ</th>
                        <th style={{ textAlign: 'center' }}>ตรวจสอบข้อมูล</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data.map(data => (
                        <tr>
                          <td
                            style={{
                              width: '20%',
                            }}
                          >
                            {data.budget_code}
                          </td>
                          <td
                            style={{
                              width: '20%',
                            }}
                          >
                            {data.project_name}
                          </td>
                          <td
                            style={{
                              width: '20%',
                            }}
                          >
                            <ProgressBar
                              dataprogress={data.project_progress}
                              datapic={0}
                            />
                            <ProgressBar
                              dataprogress={data.budget_progress}
                              datapic={1}
                            />
                          </td>
                          <td>{dateToShortString(data.start_date, 'TH')}</td>
                          <td>{dateToShortString(data.finish_date, 'TH')}</td>
                          <td
                            style={{
                              width: '10%',
                              textAlign: 'center',
                            }}
                          >
                            <SubProject
                              project_id={data._id}
                              department_id={data.department_id}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </div>
          {this.state.showlist == 'none' ? '' : this.handleClick1()}
          <TableProjectDetail
            Type={this.state.peiType}
            Title={
              !!projectStatusDataset[this.state.peiType]
                ? projectStatusDataset[this.state.peiType].label
                : []
            }
            color={this.state.backgroundColor}
            data={
              !!projectStatusDataset[this.state.peiType]
                ? projectStatusDataset[this.state.peiType].data
                : []
            }
            display={this.state.projectDis}
          ></TableProjectDetail>
          <TableDetail
            Type={this.state.peiType}
            Title={
              !!budgetStatusDataset[this.state.peiType]
                ? budgetStatusDataset[this.state.peiType].label
                : []
            }
            color={this.state.backgroundColor}
            data={
              !!budgetStatusDataset[this.state.peiType]
                ? budgetStatusDataset[this.state.peiType].data
                : []
            }
            display={this.state.budgetDis}
          ></TableDetail>
          <TableKpiDetail
            Type={this.state.peiType}
            Title={
              !!kpiStatusDataset[this.state.peiType]
                ? kpiStatusDataset[this.state.peiType].label
                : []
            }
            color={this.state.backgroundColor}
            data={
              !!kpiStatusDataset[this.state.peiType]
                ? kpiStatusDataset[this.state.peiType].data
                : []
            }
            display={this.state.kpiDis}
          ></TableKpiDetail>
        </Row>
      </Page>
    );
  }
}
export default DashboardPage;
