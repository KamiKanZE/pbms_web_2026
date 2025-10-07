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
import { avatarsData, chartjs, productsData, supportTicketsData, todosData, userProgressTableData } from 'demos/dashboardPage';
import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import { Bar, Line, Pie, HorizontalBar, Doughnut } from 'react-chartjs-2';
import { MdBubbleChart, MdInsertChart, MdPersonPin, MdPieChart, MdRateReview, MdShare, MdShowChart, MdThumbUp } from 'react-icons/md';
import { TiStarFullOutline } from 'react-icons/ti';
import { IoMdCheckbox, IoIosAlarm } from 'react-icons/io';
import { AiFillEdit, AiFillFileAdd, AiFillFolderAdd } from 'react-icons/ai';
import { GoCircleSlash } from 'react-icons/go';
import InfiniteCalendar from 'react-infinite-calendar';
import { Badge, Button, Table, Card, CardBody, CardDeck, CardGroup, CardHeader, CardTitle, Col, ListGroup, ListGroupItem, Progress, Row, Label, Input } from 'reactstrap';
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
// import DashboardBudgetList from '../components/Dashboard/DashboardBudgetList';
import DashboardBudgetPlanList from '../components/Dashboard/DashboardBudgetPlanList';
import DashboardBudgetDepartmantList from '../components/Dashboard/DashboardBudgetDepartmantList';
import SampleHook from '../components/Dashboard/DashboardTableBudget';
import { CanvasJSChart } from 'canvasjs-react-charts'; // Correct import
export const monthNameTH = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
// const CanvasJSChart = CanvasJSReact.CanvasJSChart;
class DashboardNew extends React.Component {
  state = {
    list: [],
    list_kpi: [],
    modalShow: false,
    data: [],
    selected: 1,
    offset: 0,
    perPage: 1000,
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
    monthList: [],
    period: 0,
    revenue: 0,
    revenue1: 0,
    revenue2: 0,
    sumrevenue: 0,
    expenses: [],
    sumexpenses: 0,
    sumdata1: 0,
    sumdata2: 0,
    year: moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543,
  };
  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
    this.yearLoop();
    this.monthLoop();
    this.loadCommentsFromServer();
    //this.fetchDataKPI();
    this.fetchDatarRevenueBudgets();
    this.fetchDatarExpenditureBudgets();
    this.fetchDataReportKPI();
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
    if (prevState.start !== this.state.start || prevState.end !== this.state.end) {
      // console.log('period state has changed.');
      this.loadCommentsFromServer();
    }
  }

  loadCommentsFromServer() {
    $.ajax({
      url:
        this.state.url +
        '?page=' +
        this.state.offset +
        '&size=' +
        this.state.perPage +
        '&year=' +
        (parseInt(this.state.year) - 543) +
        '&time=' +
        this.state.period +
        (this.state.department ? '&project_department=' + this.state.department : '') +
        '&month_start=' +
        this.state.start +
        '&month_end=' +
        this.state.end,
      // data: {
      //   totalPage: this.state.perPage,
      //   offset: this.state.offset,
      // },
      dataType: 'json',
      type: 'GET',
      success: data => {
        let resultz = [];
        // if (this.state.period === '') {
        resultz = data.result.result;
        const dataset1 = [];
        const dataset2 = [];
        let a1 = 0;
        let a2 = 0;
        let a3 = 0;
        let a4 = 0;
        let a5 = 0;
        let a6 = 0;
        let b1 = 0;
        let b2 = 0;
        let b3 = 0;
        let b4 = 0;
        resultz.map((a, b) => {
          if (a.project_status === 3) {
            a1 = a1 + 1;
          }
          if (a.project_status === 1) {
            a2 = a2 + 1;
          }
          if (a.project_status === 2) {
            a3 = a3 + 1;
          }
          if (a.project_status === 0) {
            a4 = a4 + 1;
          }
          if (a.project_status === 5) {
            a5 = a5 + 1;
          }
          if (a.project_status === 4) {
            a6 = a6 + 1;
          }

          if (a.budget_progress === 0) {
            b1 = b1 + 1;
          }
          if (a.budget_progress === 100) {
            b2 = b2 + 1;
          }
          if (parseFloat(a.budget_progress) > 0 && parseFloat(a.budget_progress) <= 99) {
            b3 = b3 + 1;
          }
          if (parseFloat(a.budget_progress) > 100) {
            b4 = b4 + 1;
          }
        });
        dataset1.push(a1);
        dataset1.push(a2);
        dataset1.push(a3);
        dataset1.push(a4);
        dataset1.push(a5);
        dataset1.push(a6);
        dataset2.push(b1);
        dataset2.push(b2);
        dataset2.push(b3);
        dataset2.push(b4);
        const sumdata1 = a1 + a2 + a3 + a4 + a5 + a6;
        const sumdata2 = b1 + b2 + b3 + b4;
        this.setState({
          data: resultz,
          // result: result,
          // result1: result1,
          dataset1: dataset1,
          sumdata1: sumdata1,
          dataset2: dataset2,
          sumdata2: sumdata2,
          a1: a1,
          a2: a2,
          a3: a3,
          a4: a4,
          a5: a5,
          a6: a6,
          sumproject: resultz.length,
          //pageCount: Math.ceil(data.pagination.itemTotal / this.state.perPage),
        });
        // this.yearLoop(resultz);
      },

      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString()); // eslint-disable-line
      },
    });
  }

  fetchDataKPI() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/kpis?page=0&size=0&year=' + this.state.year)
      .then(res => {
        const year = new Date().getFullYear();
        let resultc = res.data.result;
        // .filter(
        //   results =>
        //     new Date().getFullYear(results.create_date) === this.state.year,
        // );
        this.setState({ list_kpi: resultc });
      })
      .catch(error => {
        console.log(error);
      });
  }
  fetchDataDepartments() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataDepartments/list?page=0&size=0')
      .then(res => {
        this.setState({ departments_list: res.data.result });
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchDatarRevenueBudgets() {
    // axios
    // .get(process.env.REACT_APP_SOURCE_URL + '/revenueBudgets/list?page=0&size=1000')
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/revenueBudgets/reports?page=0&revenue_budget_year=' + this.state.year)
      .then(res => {
        // const year = new Date().getFullYear();
        // let resultc = res.data.result.filter(
        //   results => new Date().getFullYear(results.create_date) == 2020,
        // );
        let sum = 0;
        let sum1 = 0;
        let sum2 = 0;
        let revenue = 0;
        let project = 0;
        let sumuse = 0;
        let revenuelist = [];
        res.data.result.filter(a => {
          revenue = revenue + parseFloat(a.revenue_budget_estimate);
          project = project + a.total_project;
          sumuse = sumuse + parseFloat(a.project_used_budget);
          if (parseInt(a.revenue_type_category) === parseInt(1)) {
            sum = sum + parseFloat(a.revenue_budget_estimate);
          }
          if (parseInt(a.revenue_type_category) === parseInt(2)) {
            sum1 = sum1 + parseFloat(a.revenue_budget_estimate);
          }
          if (parseInt(a.revenue_type_category) === parseInt(3)) {
            sum2 = sum2 + parseFloat(a.revenue_budget_estimate);
          }
        });
        revenuelist.push(sum);
        revenuelist.push(sum1);
        revenuelist.push(sum2);
        this.setState({
          revenueBudgets_list: res.data.result,
          revenue: sum,
          revenue1: sum1,
          revenue2: sum2,
          sumrevenue: sum + sum1 + sum2,
          reven: revenue,
          project: project,
          revenuse: sumuse,
          revenuelist: revenuelist,
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
    return sum;
  }
  revenueSum2 = data => {
    let sum = 0;
    data.map(rb => {
      sum = sum + parseFloat(rb.revenue_budget_estimate);
    });
    return sum;
  };
  expenditureSum() {
    let sum = 0;
    this.state.expenditureBudgets_list.map(eb => {
      sum = sum + parseFloat(eb.expenditure_budget_estimate);
    });
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
      // this.revenueSum();
      //this.revenueSum2();
      // this.expenditureSum();
    }, 500);
  };
  handleInputChange2 = e => {
    // this.setState({
    //   [e.target.name]: e.target.value,
    // });
    if (e.target.name == 'period') {
      this.checkmonthLoop(e.target.value);
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };
  fetchDatarExpenditureBudgets() {
    // axios
    // .get(
    //   process.env.REACT_APP_SOURCE_URL +
    //   '/expenditureBudgets/list?page=0&size=0',
    // )
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/expenditureBudgets/reports?page=0&expenditure_budget_year=' + this.state.year + '&totalPage=100&offset=0')
      .then(res => {
        // const year = new Date().getFullYear();
        // let resultc = res.data.result.filter(
        //   results => new Date().getFullYear(results.create_date) == 2020,
        // );
        let list = [];
        let sum = 0;
        let expenditure = 0;
        let project1 = 0;
        let sumuse = 0;
        res.data.result.map(a => {
          sum = sum + parseFloat(a.expenditure_budget_estimate);
          expenditure = expenditure + parseFloat(a.expenditure_budget_estimate);
          project1 = project1 + a.total_project;
          sumuse = sumuse + parseFloat(a.project_used_budget);
        });
        this.setState({
          expenditureBudgets_list: res.data.result,
          sumexpenses: sum,
          project1: project1,
          expen: expenditure,
          expenuse: sumuse,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchDataReportKPI() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi?page=0&size=0&year=' + this.state.year)
      .then(res => {
        const dataset3 = [];
        let c1 = 0;
        let c2 = 0;
        let c3 = 0;
        let c4 = 0;
        let c5 = 0;
        let c6 = 0;
        res.data.result.map((a, b) => {
          if (a.kpi_year === this.state.year) {
            if (a.kpi_score_target === 0 || !a.kpi_score_target) {
              c1 = c1 + 1;
            }
            if (a.kpi_score_target === 5) {
              c2 = c2 + 1;
            }
            if (a.kpi_score_target === 4) {
              c3 = c3 + 1;
            }
            if (a.kpi_score_target === 3) {
              c4 = c4 + 1;
            }
            if (a.kpi_score_target === 2) {
              c5 = c5 + 1;
            }
            if (a.kpi_score_target === 1) {
              c6 = c6 + 1;
            }
          }
        });
        dataset3.push(c1);
        dataset3.push(c2);
        dataset3.push(c3);
        dataset3.push(c4);
        dataset3.push(c5);
        dataset3.push(c6);
        const sumkpi = c1 + c2 + c3 + c4 + c5 + c6;
        this.setState({
          report_kpi_list: res.data.result.filter(a => a.kpi_year === this.state.year),
          dataset3: dataset3,
          sumkpi: sumkpi,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  yearLoop() {
    let yl = [];
    const year = new Date().getFullYear();
    for (let index = 2560; index < year + 543 + 5; index++) {
      yl = yl.concat([{ value: index, label: index }]);
    }
    this.setState({
      yearList: yl,
    });
  }
  monthLoop() {
    let yl = [];
    let period;
    let j = 0;
    let year;
    let start = 10;
    let end = 9;
    for (let index = 10; index < 13; index++) {
      if (index > 8) {
        year = this.state.year - 1;
      } else {
        year = this.state.year;
      }
      yl = yl.concat([{ value: index, label: monthNameTH[index] }]);

      if (index == 12) {
        if (j == 0) {
          index = 0;
          j = 1;
        }
      } else {
        if (index == 9) {
          index = 12;
        }
      }
    }
    this.setState({
      period: period,
      start: start,
      end: end,
      monthList: yl,
    });
  }
  checkmonthLoop(period) {
    let yl = [];
    let start;
    let end;
    let j = 0;
    let year = this.state.year;
    if (period == 0) {
      start = 10;
      end = 9;
      for (let index = 10; index < 13; index++) {
        yl.push({ value: index, label: monthNameTH[index] });
      }
      // Optionally add months from index 0 to 9 if needed
      for (let index = 1; index < 10; index++) {
        yl.push({ value: index, label: monthNameTH[index] });
      }
    }
    if (period == 1) {
      start = 10;
      end = 12;
      for (let index = 10; index <= 12; index++) {
        yl = yl.concat([{ value: index, label: monthNameTH[index] }]);
      }
    }
    if (period == 2) {
      start = 1;
      end = 3;
      for (let index = 1; index < 4; index++) {
        yl = yl.concat([{ value: index, label: monthNameTH[index] }]);
      }
    }
    if (period == 3) {
      start = 4;
      end = 6;
      for (let index = 4; index < 7; index++) {
        yl = yl.concat([{ value: index, label: monthNameTH[index] }]);
      }
    }
    if (period == 4) {
      start = 7;
      end = 9;
      for (let index = 7; index < 10; index++) {
        yl = yl.concat([{ value: index, label: monthNameTH[index] }]);
      }
    }

    this.setState({
      start: start,
      end: end,
      period: period,
      monthList: yl,
    });
  }
  handleInputChangeDateStart = e => {
    var a = e.target.value;
    var b = this.state.end;
    if ((a > 0 && a < 10 && a > b) || (a > 9 && a < 13 && a > b && b > 9)) {
      b = a;
    } else if (a > 0 && a < 10 && b > 9) {
      b = a;
    }
    this.setState({
      start: a,
      end: b,
    });
  };
  handleInputChangeDateFinish = e => {
    var a = +this.state.start;
    var b = +e.target.value;
    if (a > 0 && a < 10 && b < 10 && a > b) {
      b = a;
    } else if (a > 0 && a < 10 && b > 9) {
      b = a;
    } else if (a >= 10 && b >= 10 && a > b) {
      b = a;
    }
    this.setState({
      start: a,
      end: b,
    });
  };
  renderProjectStatus(status, label, dotClass, color) {
    const percentage = parseFloat((this.state.data.filter(a => parseFloat(a.project_status) === status).length / this.state.data.length) * 100).toFixed(2);

    return (
      <div className="flex mb-2" style={{ alignItems: 'center' }}>
        <span className="text-dashboard-7" style={{ alignItems: 'right' }}>{isNaN(percentage) ? 0 : percentage}%</span>
        <div className={`${dotClass} mr-2 ml-2`} style={{ backgroundColor: color, margin: '0 8px' }}></div>
        <span className="text-dashboard-6 text-left">{label}</span>
      </div>
    );
  }
  handleClick = (event, element) => {
    if (element.length > 0) {
      const index = element[0].index; // ดึง index ของ slice ที่ถูกคลิก
      this.setState({ selectedProjectStatus: index }); // ใช้ this.setState เพื่ออัปเดตสถานะ
      window.scrollTo({ top: 740, behavior: 'smooth' });
    }
  };
  render() {
    const plugins = [
      {
        afterDraw: function (chart) {
          let sum = 0;
          chart.data.datasets[0].data.map(a => {
            sum = sum + a;
          });
          if (sum == 0) {
            let ctx = chart.ctx;
            let width = chart.width;
            let height = chart.height;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '16px Arial';
            ctx.fillText('No data to display', width / 2, height / 2);
            ctx.restore();
          }
        },
      },
    ];
    let sumall = [];
    if (this.state.sumrevenue > 0) {
      sumall.push(this.state.sumrevenue);
    }
    if (this.state.sumexpenses > 0) {
      sumall.push(this.state.sumexpenses);
    }
    const dataset1 = Array.isArray(this.state.dataset1) ? this.state.dataset1 : [];
    
    const total = dataset1.reduce((a, b) => a + b, 0);
    const hasData = total > 0;
    // Prepare dataPoints with value and percentage
    const dataPoints = dataset1.map((value, index) => ({
      y: value,
      label: [
        "โครงการเบิกเงินแล้วสิ้นสุด",
        "โครงการได้ตามกำหนดการ",
        "โครงการดำเนินการแล้วแต่ล่าช้า",
        "โครงการยังไม่ดำเนินการ",
        "โครงการเลยเวลามาแล้วยังไม่ดำเนินการทำ",
        "โครงการยกเลิก"
      ][index] || `Label ${index + 1}`, // Fallback label if index is out of bounds
      indexLabel: `{label} {y} (${((value / total) * 100).toFixed(2)}%)`,
      color: [
        '#3f50fb', // blue
        '#64c404', // green
        '#ffcc66', // yellow
        '#fe0803', // red
        '#ee4444', // dark red
        '#bbbbbb'  // gray
      ][index] || '#cccccc' // Fallback color if index is out of bounds
    }));

    const options = {
      animationEnabled: true,
      title: {
        text: "การดำเนินโครงการ",
      },
      data: [
        {
          type: "pie",
          startAngle: -90,
          // yValueFormatString: "0.##%",
          dataPoints: dataPoints
        }
      ]
    };
    return (
      <div className="ml-2 mr-2">
        <div className="box-1 mb-2">หน้าหลัก</div>

        <div className="box-2 mb-2">
          <Grid container spacing={1} className="flex mb-2">
            <Grid item xs={12} md={1}>
              <div className="box-6">{this.state.year}</div>
            </Grid>
            <Grid item xs={false} md={4}></Grid>
            <Grid
              item
              xs={12}
              md={2}
              style={{
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'right',
              }}
            >
              <div className=" flex">
                <div className="mb-0" style={{ whiteSpace: 'nowrap', width: '100px' }}>
                  เลือกปีโครงการ
                </div>
                <div className="mb-0 ml-1">
                  <select name="year" id="year" value={this.state.year} onChange={this.handleInputChange} className="form-control" style={{ width: '100%' }}>
                    {this.state.yearList.map(item => (
                      <option value={item.value}>ปี {item.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              md={2}
              style={{
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'right',
              }}
            >
              <div className=" flex">
                <div className="mb-0" style={{ whiteSpace: 'nowrap' }}>
                  ช่วงเวลา
                </div>
                <div className="mb-0 ml-1">
                  <select name="period" id="period" value={this.state.period} onChange={this.handleInputChange2} className="form-control" style={{ width: '100%' }}>
                    <option value="0">ทั้งหมด</option>
                    <option value="1">ไตรมาส 1</option>
                    <option value="2">ไตรมาส 2</option>
                    <option value="3">ไตรมาส 3</option>
                    <option value="4">ไตรมาส 4</option>
                  </select>
                </div>
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              style={{
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'right',
              }}
            >
              <div className=" flex">
                <div className="mb-0" style={{ whiteSpace: 'nowrap', width: '100px' }}>
                  ช่วงเดือน
                </div>
                <div className="mb-0 ml-1">
                  <select name="start" id="start" value={this.state.start} onChange={this.handleInputChangeDateStart} className="form-control" style={{ width: '100%' }}>
                    {this.state.monthList.map(item => (
                      <option value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
                -
                <div className="mb-0 ml-1">
                  <select name="end" id="end" value={this.state.end} onChange={this.handleInputChangeDateFinish} className="form-control" style={{ width: '100%' }}>
                    {this.state.monthList.map(item => (
                      <option
                        value={item.value}
                        disabled={(this.state.start > 0 && this.state.start < 10 && item.value > 9) || (this.state.start > 9 && item.value > 9 && this.state.start > item.value) || (this.state.start > 0 && this.state.start < 10 && this.state.start > item.value) ? 'disabled' : ''}
                      >
                        {' '}
                        {item.label}
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
              style={{
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'right',
              }}
            >
              <Grid item xs={false} md={4}></Grid>
              <Grid item xs={12} md={8} style={{ display: 'flex', 'justify-content': 'right' }}>
                <div className=" flex" style={{ textAlign: 'right' }}>
                  <div className="mb-0" style={{ whiteSpace: 'nowrap', width: '100px' }}>
                    หน่วยงาน
                  </div>
                  <div className="mb-0 ml-1">
                    <select name="department" id="department" value={this.state.department} onChange={this.handleInputChange2} className="form-control" style={{ width: '100%' }}>
                      <option value="">ทั้งหมด</option>
                      {this.state.departments_list.map(item => (
                        <option value={item.department_id}>{item.department_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div>
            <Grid container spacing={1} className="flex mb-3" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <Grid item xs={12} md={4}>
        <div className="box-card">
          <div className="box-card-header-1">การดำเนินโครงการ</div>
          <div className="box-card-body">
            <Grid container spacing={1}>
              <Grid item xs={12} md={12}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  {hasData ? (
                    <CanvasJSChart options={options} />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '16px',
                        color: '#888',
                      }}
                    >
                      No data to display
                    </div>
                  )}
                </div>
                <div className="col-12">
                  <span className="text-dashboard-7">โครงการทั้งหมด</span>
                  <span className="text-dashboard-9">{this.state.data.length}</span>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div>
                  {this.renderProjectStatus(3, 'โครงการเบิกเงินแล้วสิ้นสุด', 'dot-dashboard-1', '#3f50fb')}
                  {this.renderProjectStatus(1, 'โครงการได้ตามกำหนดการ', 'dot-dashboard-2', '#64c404')}
                  {this.renderProjectStatus(2, 'โครงการดำเนินการแล้วแต่ล่าช้า', 'dot-dashboard-3', '#ffcc66')}
                  {this.renderProjectStatus(0, 'โครงการยังไม่ดำเนินการ', 'dot-dashboard-4', '#fe0803')}
                  {this.renderProjectStatus(5, 'โครงการเลยเวลามาแล้วยังไม่ดำเนินการทำ', 'dot-dashboard-5', '#ee4444')}
                  {this.renderProjectStatus(4, 'โครงการยกเลิก', 'dot-dashboard-6', '#bbbbbb')}
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
                      <Grid item xs={12} md={12}>
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
                              cutoutPercentage: 0,
                              tooltips: {
                                callbacks: {
                                  label: function (tooltipItem, data) {
                                    let label = data.labels[tooltipItem.index];
                                    let sum = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                    return ' ' + ((value / sum) * 100).toFixed(2) + ' % ' + label;
                                  },
                                },
                              },
                            }}
                            plugins={plugins}
                            data={{
                              labels: ['ยังไม่มีการรายงาน', 'เป็นไปตามแผน', 'เบิกจ่ายต่ำกว่าแผน', 'เบิกจ่ายเกินแผน'],
                              datasets: [
                                {
                                  data: this.state.dataset2,
                                  backgroundColor: ['#FFAA22', '#9A9CE9', '#78DAB6', '#EE4444'],
                                  borderWidth: 1,
                                },
                              ],
                            }}
                          />
                        </div>
                        <div className="col-12 ">
                          <span className="text-dashboard-7">โครงการทั้งหมด</span> <span className="text-dashboard-9">{this.state.data.length}</span>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <div>
                          <div className="flex mb-2">
                            <span className="text-dashboard-7">
                              {' '}
                              {parseFloat((this.state.data.filter(a => parseFloat(a.budget_progress) === 0).length / this.state.data.length) * 100)
                                .toFixed(0)
                                .replace('NaN', 0)}
                              %
                            </span>
                            <div className="dot-dashboard-1 mr-2 ml-2"></div>
                            <span className="text-dashboard-6">ยังไม่มีการรายงาน</span>
                          </div>
                          <div className="flex  mb-2">
                            <span className="text-dashboard-7">
                              {parseFloat((this.state.data.filter(a => parseFloat(a.budget_progress) === 100).length / this.state.data.length) * 100)
                                .toFixed(0)
                                .replace('NaN', 0)}
                              %
                            </span>
                            <div className="dot-dashboard-2 mr-2 ml-2"></div>
                            <span className="text-dashboard-6">เป็นไปตามแผน</span>
                          </div>
                          <div className="flex  mb-2">
                            <span className="text-dashboard-7">
                              {parseFloat((this.state.data.filter(a => parseFloat(a.budget_progress) > 0 && parseFloat(a.budget_progress) <= 99).length / this.state.data.length) * 100)
                                .toFixed(0)
                                .replace('NaN', 0)}
                              %
                            </span>
                            <div className="dot-dashboard-3 mr-2 ml-2"></div>
                            <span className="text-dashboard-6">เบิกจ่ายต่ำกว่าแผน</span>
                          </div>
                          <div className="flex  mb-2">
                            <span className="text-dashboard-7">
                              {parseFloat((this.state.data.filter(a => parseFloat(a.budget_progress) > 100).length / this.state.data.length) * 100)
                                .toFixed(0)
                                .replace('NaN', 0)}
                              %
                            </span>
                            <div className="dot-dashboard-4 mr-2 ml-2"></div>
                            <span className="text-dashboard-6">เบิกจ่ายเกินแผน</span>
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
                  <div className="box-card-header-3">ผลการดำเนินงานตาม KPI</div>
                  <div className="box-card-body">
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={12}>
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
                              cutoutPercentage: 0,
                              tooltips: {
                                callbacks: {
                                  label: function (tooltipItem, data) {
                                    let label = data.labels[tooltipItem.index];
                                    let sum = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                    return ' ' + ((value / sum) * 100).toFixed(2) + ' % ' + label;
                                  },
                                  displayColors: function (tooltipItem, chart) {
                                    let backgroundColor = chart.data.datasets[0].backgroundColor[tooltipItem.index];
                                    return {
                                      backgroundColor: backgroundColor,
                                    };
                                  },
                                },
                              },
                            }}
                            plugins={plugins}
                            data={{
                              labels: ['ยังไม่มีการรายงาน', 'ดีมาก', 'ดี', 'พอใช้', 'ปรับปรุง', 'ไม่ผ่าน'],
                              datasets: [
                                {
                                  data: this.state.dataset3,
                                  backgroundColor: ['#BBBBBB', '#008000', '#00FF00', '#ffff00', '#FF00FF', '#FF0000'],
                                  borderWidth: 1,
                                },
                              ],
                            }}
                          />
                        </div>
                        <div className="col-12 ">
                          <span className="text-dashboard-7">ตัวชี้วัด KPI ทั้งหมด</span> <span className="text-dashboard-9">{this.state.sumkpi}</span>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <div>
                          <div className="flex mb-2">
                            <span className="text-dashboard-7">{((this.state.report_kpi_list.filter(a => parseInt(a.kpi_score_target) === 0 || a.kpi_score_target === undefined).length / this.state.report_kpi_list.length) * 100).toFixed(0).replace('NaN', 0)}%</span>
                            <div className="dot-dashboard-1 mr-2 ml-2" style={{ backgroundColor: '#BBBBBB' }}></div>
                            <span className="text-dashboard-6">ยังไม่มีการรายงาน</span>
                          </div>
                          <div className="flex  mb-2">
                            <span className="text-dashboard-7">{((this.state.report_kpi_list.filter(a => parseInt(a.kpi_score_target) === 5).length / this.state.report_kpi_list.length) * 100).toFixed(0).replace('NaN', 0)}%</span>
                            <div className="dot-dashboard-2 mr-2 ml-2" style={{ backgroundColor: '#008000' }}></div>
                            <span className="text-dashboard-6">ดีมาก</span>
                          </div>
                          <div className="flex  mb-2">
                            <span className="text-dashboard-7">{((this.state.report_kpi_list.filter(a => parseInt(a.kpi_score_target) === 4).length / this.state.report_kpi_list.length) * 100).toFixed(0).replace('NaN', 0)}%</span>
                            <div className="dot-dashboard-3 mr-2 ml-2" style={{ backgroundColor: '#00FF00' }}></div>
                            <span className="text-dashboard-6">ดี</span>
                          </div>
                          <div className="flex  mb-2">
                            <span className="text-dashboard-7">{((this.state.report_kpi_list.filter(a => parseInt(a.kpi_score_target) === 3).length / this.state.report_kpi_list.length) * 100).toFixed(0).replace('NaN', 0)}%</span>
                            <div className="dot-dashboard-4 mr-2 ml-2" style={{ backgroundColor: '#ffff00' }}></div>
                            <span className="text-dashboard-6">พอใช้</span>
                          </div>
                          <div className="flex  mb-2">
                            <span className="text-dashboard-7">{((this.state.report_kpi_list.filter(a => parseInt(a.kpi_score_target) === 2).length / this.state.report_kpi_list.length) * 100).toFixed(0).replace('NaN', 0)}%</span>
                            <div className="dot-dashboard-4 mr-2 ml-2" style={{ backgroundColor: '#FF00FF' }}></div>
                            <span className="text-dashboard-6">ปรับปรุง</span>
                          </div>
                          <div className="flex  mb-2">
                            <span className="text-dashboard-7">{((this.state.report_kpi_list.filter(a => parseInt(a.kpi_score_target) === 1).length / this.state.report_kpi_list.length) * 100).toFixed(0).replace('NaN', 0)}%</span>
                            <div className="dot-dashboard-4 mr-2 ml-2" style={{ backgroundColor: '#FF0000' }}></div>
                            <span className="text-dashboard-6">ไม่ผ่าน</span>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={1} className="flex mb-2" style={{ textAlign: 'center', justifyContent: 'center' }}>
              <Grid item xs={6} md={2}>
                <div className="box-dashboard-4">
                  <div className="row">
                    <div className="col-6 flex pr-0" style={{ justifyContent: 'center' }}>
                      <div className="circle-dashboard-4">
                        <IoMdCheckbox style={{ fontSize: '40px' }} />
                      </div>
                    </div>
                    <div className="col-6">
                      <div>โครงการ</div> <div>เบิกเงินแล้วสิ้นสุด</div> <div className="text-dashboard-4">{this.state.a1}</div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} md={2}>
                <div className="box-dashboard-2 ">
                  <div className="row">
                    <div className="col-6 flex pr-0" style={{ justifyContent: 'center' }}>
                      <div className="circle-dashboard-2">
                        <TiStarFullOutline style={{ fontSize: '40px' }} />
                      </div>
                    </div>
                    <div className="col-6">
                      <div>โครงการ</div> <div>ได้ตามกำหนดการ</div>
                      <div className="text-dashboard-2">{this.state.a2}</div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} md={2}>
                <div className="box-dashboard-3">
                  <div className="row">
                    <div className="col-6 flex pr-0" style={{ justifyContent: 'center' }}>
                      <div className="circle-dashboard-3">
                        {/* <AiFillEdit style={{ fontSize: '40px' }} /> */}
                        <img src="https://framerusercontent.com/images/sRAWe8qFLGIgQmDqUuDRNNoPM1k.png" alt="" width="30" height="30" style={{ alignItems: 'center' }} />
                      </div>
                    </div>
                    <div className="col-6">
                      <div>โครงการดำเนิน</div> <div>การแล้วแต่ล่าช้า</div>
                      <div className="text-dashboard-3">{this.state.a3}</div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} md={2}>
                <div className="box-dashboard-1">
                  <div className="row">
                    <div className="col-6 flex pr-0" style={{ justifyContent: 'center' }}>
                      <div className="circle-dashboard-1">
                        <IoIosAlarm style={{ fontSize: '40px' }} />
                      </div>
                    </div>
                    <div className="col-6">
                      <div>โครงการ </div>
                      <div>ยังไม่ดำเนินการ</div>
                      <div className="text-dashboard-1">{this.state.a4}</div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} md={2}>
                <div className="box-dashboard-5">
                  <div className="row">
                    <div className="col-6 flex pr-0" style={{ justifyContent: 'center' }}>
                      <div className="circle-dashboard-5">
                        <img src="https://framerusercontent.com/images/nTsF5MQEhdVjEd671OPlLJHgM.png" width={30} height={30} alt="" style={{ alignItems: 'center' }} />
                        {/* <GoCircleSlash style={{ fontSize: '40px' }} /> */}
                      </div>
                    </div>
                    <div className="col-6">
                      <div>โครงการ</div> <div>เลยเวลามาแล้ว</div> <div>ยังไม่ดำเนินการทำ</div>
                      <div className="text-dashboard-5">{this.state.a5}</div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} md={2}>
                <div className="box-dashboard-6">
                  <div className="row">
                    <div className="col-6 flex pr-0" style={{ justifyContent: 'center' }}>
                      <div className="circle-dashboard-6">
                        {/* <AiFillFolderAdd style={{ fontSize: '40px' }} /> */}
                        <GoCircleSlash style={{ fontSize: '40px' }} />
                      </div>
                    </div>
                    <div className="col-6">
                      <div>โครงการยกเลิก</div>
                      <div className="text-dashboard-10">{this.state.a6}</div>
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
                    <td rowSpan="2" style={{ width: '33%', textAlign: 'center' }}>
                      {' '}
                      <Doughnut
                        options={{
                          legend: {
                            display: false,
                            position: 'bottom',
                          },
                          cutoutPercentage: 0,
                          tooltips: {
                            callbacks: {
                              label: function (tooltipItem, data) {
                                let label = data.labels[tooltipItem.index];
                                let sum = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return label + ' : ' + new Intl.NumberFormat().format(value);
                              },
                              displayColors: function (tooltipItem, chart) {
                                let backgroundColor = chart.data.datasets[0].backgroundColor[tooltipItem.index];
                                return {
                                  backgroundColor: backgroundColor,
                                };
                              },
                            },
                          },
                        }}
                        plugins={plugins}
                        data={{
                          labels: ['รายรับรวม', 'รายจ่ายรวม'],
                          datasets: [
                            {
                              data: sumall,
                              backgroundColor: ['#AEEEE0', '#9A9CE9'],
                              borderWidth: 1,
                            },
                          ],
                        }}
                      />
                      <div className="mt-5">
                        <div className="text-dashboard-7-1">ข้อมูลงบประมาณรวม</div>
                        <div>
                          <span className="text-dashboard-8">งบประมาณคงเหลือ : {this.moneyFormat(this.state.sumrevenue - this.state.sumexpenses)} บาท</span>
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
                                <span className="text-dashboard-7">รายรับรวม {this.moneyFormat(this.state.sumrevenue)} บาท</span>
                              </td>
                              <td>
                                <div className="dot-dashboard-2 mr-2 ml-2"></div>
                              </td>
                              <td>
                                <span className="text-dashboard-7">รายจ่ายรวม {this.moneyFormat(this.state.sumexpenses)} บาท</span>
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
                          cutoutPercentage: 0,
                          tooltips: {
                            callbacks: {
                              label: function (tooltipItem, data) {
                                let label = data.labels[tooltipItem.index];
                                let sum = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return label + ' : ' + new Intl.NumberFormat().format(value);
                              },
                              displayColors: function (tooltipItem, chart) {
                                let backgroundColor = chart.data.datasets[0].backgroundColor[tooltipItem.index];
                                return {
                                  backgroundColor: backgroundColor,
                                };
                              },
                            },
                          },
                        }}
                        plugins={plugins}
                        data={{
                          labels: ['รายได้จัดเก็บเอง', 'รายได้ที่รัฐบาลเก็บแล้วจัดสรรให้องค์กรปกครองส่วนท้องถิ่น', 'รายได้ที่รัฐบาลอุดหนุนให้องค์กรปกครองส่วนท้องถิ่น'],
                          datasets: [
                            {
                              data: this.state.revenuelist,
                              backgroundColor: ['#00EAFF', '#1199EE', '#AEEEE0'],
                              borderWidth: 1,
                            },
                          ],
                        }}
                      />
                      <div style={{ textAlign: 'center' }} className="text-dashboard-7-1">
                        งบประมาณรายรับ <span className="text-dashboard-9">{this.moneyFormat(this.state.sumrevenue)} บาท</span>
                      </div>
                    </td>
                    <td style={{ width: '35%' }}>
                      <div>
                        <table>
                          <tbody>
                            <tr>
                              <td style={{ textAlign: 'right' }}>
                                <span className="text-dashboard-7">{this.moneyFormat(this.state.revenue)} บาท</span>
                              </td>
                              <td>
                                <div className="dot-dashboard-11 mr-2 ml-2"></div>
                              </td>
                              <td>
                                <span className="text-dashboard-6">ประเภท รายได้จัดเก็บเอง</span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: 'right' }}>
                                <span className="text-dashboard-7">{this.moneyFormat(this.state.revenue1)} บาท</span>
                              </td>
                              <td>
                                <div className="dot-dashboard-12 mr-2 ml-2"></div>
                              </td>
                              <td>
                                <span className="text-dashboard-6">ประเภท รายได้ที่รัฐบาลเก็บแล้วจัดสรรให้องค์กรปกครองส่วนท้องถิ่น</span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: 'right' }}>
                                <span className="text-dashboard-7">{this.moneyFormat(this.state.revenue2)} บาท</span>
                              </td>
                              <td>
                                <div className="dot-dashboard-3 mr-2 ml-2"></div>
                              </td>
                              <td>
                                <span className="text-dashboard-6">ประเภท รายได้ที่รัฐบาลอุดหนุนให้องค์กรปกครองส่วนท้องถิ่น</span>
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
                          cutoutPercentage: 0,
                          tooltips: {
                            callbacks: {
                              label: function (tooltipItem, data) {
                                let label = data.labels[tooltipItem.index];
                                let sum = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return label + ' : ' + new Intl.NumberFormat().format(value);
                              },
                              displayColors: function (tooltipItem, chart) {
                                let backgroundColor = chart.data.datasets[0].backgroundColor[tooltipItem.index];
                                return {
                                  backgroundColor: backgroundColor,
                                };
                              },
                            },
                          },
                        }}
                        plugins={plugins}
                        data={{
                          labels: this.state.expenditureBudgets_list.map(id => id.expenditure_budget_type_name),

                          datasets: [
                            {
                              data: this.state.expenditureBudgets_list.map(id => parseFloat(id.expenditure_budget_estimate)),
                              backgroundColor: ['#EE4444', '#7755CC', '#9A9CE9', '#BB66CC', '#FF88AA', '#FFAA22', '#F7D1FF'],
                              borderWidth: 1,
                            },
                          ],
                        }}
                      />
                      <div style={{ textAlign: 'center' }} className="text-dashboard-7-1">
                        งบประมาณรายจ่าย <span className="text-dashboard-9">{this.moneyFormat(this.state.sumexpenses)} บาท</span>
                      </div>
                    </td>
                    <td style={{ width: '33%' }}>
                      <div>
                        <table>
                          <tbody>
                            {this.state.expenditureBudgets_list.map((id, i) => (
                              <tr key={'expenditureBudgets_list' + i}>
                                <td style={{ textAlign: 'right' }}>
                                  <span className="text-dashboard-7">{this.moneyFormat(id.expenditure_budget_estimate)} บาท</span>
                                </td>
                                <td>
                                  <div className={`dot-dashboard-${4 + i} mr-2 ml-2`}></div>
                                </td>
                                <td>
                                  <span className="text-dashboard-6"> {id.expenditure_budget_type_name}</span>
                                </td>
                              </tr>
                            ))}
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
            <div className="mb-2">
              <div className="mt-2">
                <SampleHook
                  dataset={this.state.revenueBudgets_list}
                  dataset1={this.state.expenditureBudgets_list}
                  reven={this.state.reven}
                  expen={this.state.expen}
                  revenuse={this.state.revenuse}
                  expenuse={this.state.expenuse}
                  project={this.state.project}
                  project1={this.state.project1}
                  sumproject={this.state.sumproject}
                  year={this.state.year}
                />
              </div>
            </div>
            {/* <div className="box-13 mb-2">รายการงบประมาณ</div>

            <div className="mb-2">
              <div className="mt-2">
                <DashboardBudgetList
                  page={null}
                  year={this.state.year}
                  period={this.state.period}
                  select_depaetment={this.state.department}
                  title="รายการงบประมาณ"
                />
              </div>
            </div> */}
            <hr />
            {/* <div className="box-13 mb-2">รายการงบประมาณรายจ่ายตามแผนงาน</div>
            <div className="mb-2">
              <div className="mt-2">
                <DashboardBudgetPlanList
                  page={null}
                  year={this.state.year}
                  period={this.state.period}
                  select_depaetment={this.state.department}
                  title="รายการงบประมาณรายจ่ายตามแผนงาน"
                />
              </div>
            </div> */}
          </div>
          <hr />
          <div className="box-13 mb-2">รายการงบประมาณรายจ่ายตามหน่วยงาน</div>
          <div className="mb-2">
            <div className="mt-2">
              <DashboardBudgetDepartmantList page={null} year={this.state.year} period={this.state.period} select_depaetment={this.state.department} dataset={this.state.data} title="รายการงบประมาณรายจ่ายตามหน่วยงาน" />
            </div>
          </div>

          <hr />
          <div>
            <div>
              <DashboardReportProjectList page={null} year={this.state.year} data={this.state.data} period={this.state.period} select_depaetment={this.state.department} title="โครงการ" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default DashboardNew;
