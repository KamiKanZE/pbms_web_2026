import $ from 'jquery';
import React from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { TiStarFullOutline } from 'react-icons/ti';
import { RiEmotionSadLine, RiEmotionLaughLine, RiEmotionLine, RiEmotionHappyLine, RiEmotionNormalLine, RiEmotionUnhappyLine } from 'react-icons/ri';
import { IoMdCheckbox, IoIosAlarm } from 'react-icons/io';
import { GoCircleSlash } from 'react-icons/go';
import { Row } from 'reactstrap';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import DashboardReportProjectListViewer from '../components/Dashboard/DashboardViewer';
import DashboardBudgetDepartmantList from '../components/Dashboard/DashboardBudgetDepartmantList';
import SampleHook from '../components/Dashboard/DashboardTableBudget';

export const monthNameTH = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

class DashboardViewer extends React.Component {
  state = {
    list: [],
    list_kpi: [],
    modalShow: false,
    data: [],
    projectStatusCounts: { 3: 0, 1: 0, 2: 0, 0: 0, 5: 0, 4: 0 },
    budgetProgressCounts: { 0: 0, 100: 0, '1-99': 0, '>100': 0 },
    sumProject: 0,
    dataset1: [],
    dataset2: [],
    dataset3: [], // Ensure this is initialized
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
    sumkpi: 0,
    yearProject: moment().month() >= 9 ? moment().year() + 544 : moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543,
    project_status: '',
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
    this.chengSubtitle(1);
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
        (parseInt(this.state.yearProject) - 543) +
        '&time=' +
        this.state.period +
        (this.state.department ? '&project_department=' + this.state.department : '') +
        '&month_start=' +
        this.state.start +
        '&month_end=' +
        this.state.end,
      dataType: 'json',
      type: 'GET',
      success: data => {
        let resultz = [];
        const projectStatusOrder = [3, 1, 2, 0, 5, 4];
        const projectStatusCounts = { 3: 0, 1: 0, 2: 0, 0: 0, 5: 0, 4: 0 };
        const budgetProgressCounts = [0, 0, 0]; // For budget progress ranges
        resultz = data.result.result;
        // Process each item in resultz
        resultz.forEach(a => {
          // Update project status counts based on the specified statuses
          if (a.project_status in projectStatusCounts) {
            projectStatusCounts[a.project_status]++;
          }
          // Update budget progress counters
          let end = new Date(a.project_finish).toLocaleString('sv-SE');
          const today = new Date().toLocaleString('sv-SE');
          const progress = parseFloat(a.budget_progress);
          if (progress === 0) {
            budgetProgressCounts[0]++;
          } else if (progress > 0 && progress <= 99 && today <= end) {
            budgetProgressCounts[1]++;
          } else if (progress > 0 && progress <= 99 && today > end) {
            budgetProgressCounts[2]++;
            // } else if (progress > 100) {
            //   budgetProgressCounts[3]++;
          }
        });
        // Convert projectStatusCounts object to an array for dataset1
        // const dataset1 = Object.values(projectStatusCounts);
        const dataset1 = projectStatusOrder.map(status => projectStatusCounts[status]);
        // Populate dataset2 with budget progress counts
        const dataset2 = [...budgetProgressCounts];
        // Calculate sums
        const sumdata1 = dataset1.reduce((a, b) => a + b, 0);
        const sumdata2 = dataset2.reduce((a, b) => a + b, 0);
        // Update state with processed data
        this.setState({
          data: resultz,
          dataset1,
          sumdata1,
          dataset2,
          sumdata2,
          sumproject: resultz.length,
          a1: projectStatusCounts[3], // status 3
          a2: projectStatusCounts[1], // status 1
          a3: projectStatusCounts[2], // status 2
          a4: projectStatusCounts[0], // status 0
          a5: projectStatusCounts[5], // status 5
          a6: projectStatusCounts[4], // status 4
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
      .get(process.env.REACT_APP_SOURCE_URL + '/kpis?page=0&size=0&year=' + this.state.yearProject)
      .then(res => {
        const yearProject = new Date().getFullYear();
        let resultc = res.data.result;
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
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/revenueBudgets/reports?page=0&revenue_budget_year=' + this.state.yearProject)
      .then(res => {
        let sum = 0;
        let sum1 = 0;
        let sum2 = 0;
        let revenue = 0;
        let project = 0;
        let sumuse = 0;
        let sumset = 0;
        let revenuelist = [];
        res.data.result.filter(a => {
          revenue = revenue + parseFloat(a.revenue_budget_estimate);
          project = project + a.total_project;
          sumset = sumset+parseFloat(a.project_set_budget);
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
          revenset:sumset,
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
    // console.log(sum);
    //this.setState({ revenueBudgets_sum: sum });
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
    if (e.target.name == 'period') {
      this.checkmonthLoop(e.target.value);
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };
  fetchDatarExpenditureBudgets() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/expenditureBudgets/reports?page=0&expenditure_budget_year=' + this.state.yearProject + '&totalPage=100&offset=0')
      .then(res => {
        let list = [];
        let sum = 0;
        let expenditure = 0;
        let project1 = 0;
        let sumuse = 0;
        let sumset = 0;
        res.data.result.map(a => {
          sum = sum + parseFloat(a.expenditure_budget_estimate);
          sumset = sumset + parseFloat(a.project_set_budget);
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
          expenset:sumset
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchDataReportKPI() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/kpis/1/kpi?page=0&size=0&year=' + this.state.yearProject)
      .then(res => {
        const dataset3 = [];
        let c1 = 0;
        let c2 = 0;
        let c3 = 0;
        let c4 = 0;
        let c5 = 0;
        let c6 = 0;
        res.data.result.map((a, b) => {
          // if (a.kpi_year === this.state.year) {
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
          // }
        });
        dataset3.push(c1);
        dataset3.push(c2);
        dataset3.push(c3);
        dataset3.push(c4);
        dataset3.push(c5);
        dataset3.push(c6);
        const sumkpi = c1 + c2 + c3 + c4 + c5 + c6;
        this.setState({
          report_kpi_list: res.data.result.filter(a => a.kpi_year === this.state.yearProject),
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
        year = this.state.yearProject - 1;
      } else {
        year = this.state.yearProject;
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
    let year = this.state.yearProject;
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
      <div className="flex mb-2" style={{ alignItems: 'center', cursor: 'pointer' }} onClick={() => this.handleClick1(status)}>
        <span className="text-dashboard-7" style={{ alignItems: 'right' }}>
          {isNaN(percentage) ? 0 : percentage}%
        </span>
        <div className={`${dotClass} mr-2 ml-2`} style={{ backgroundColor: color, margin: '0 8px' }}></div>
        <span className="text-dashboard-6 text-left">{label}</span>
      </div>
    );
  }
  handleClick = (event, element) => {
    const projectStatusOrder = [3, 1, 2, 0, 5, 4];
    if (element.length > 0) {
      const index = element[0]._index; // ดึง index ของ slice ที่ถูกคลิก
      this.setState({ project_status: projectStatusOrder[index] }); // ใช้ this.setState เพื่ออัปเดตสถานะ
      window.scrollTo({ top: 685, behavior: 'smooth' });
    }
  };
  handleClick1 = status => {
    if (this.state.project_status !== status) {
      // Update only if the value has changed
      this.setState({ project_status: status }, () => {
        window.scrollTo({ top: 685, behavior: 'smooth' });
      });
    }
  };
  chengSubtitle = (id, event = null) => {
    const target = event ? event.target : null;

    if (target && target.classList.contains('active')) return;

    document.querySelectorAll('.box-card-header-2').forEach(header => header.classList.remove('active'));

    ['subTitle1', 'subTitle2', 'subTitle3'].forEach((sub, index) => {
      document.getElementById(sub).style.display = id === index + 1 ? 'block' : 'none';
    });

    if (target) {
      target.classList.add('active');
    }
  };
  render() {
    const circleColors = ['#BBBBBB', '#008000', '#00FF00', '#ffff00', '#FF00FF', '#FF0000'];
    const plugins = [
      {
        afterDraw: function (chart) {
          let sum = 0;
          chart.data.datasets[0].data.map(a => {
            sum = sum + a;
          });
          if (sum === 0) {
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
    let sumall = [this.state.sumrevenue, this.state.sumexpenses].filter(val => val > 0);
    return (
      <div className="ml-2 mr-2">
        <div className="box-1 mb-2">หน้าหลัก</div>

        <div className="box-2 mb-2">
          <Grid container spacing={1} className="flex mb-2">
            <Grid item xs={12} md={1}>
              <div className="box-6">{this.state.yearProject}</div>
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
                  <select name="yearProject" id="yearProject" value={this.state.yearProject} onChange={this.handleInputChange} className="form-control" style={{ width: '100%' }}>
                    {this.state.yearList.map(item => (
                      <option key={item.value} value={item.value}>
                        ปี {item.label}
                      </option> // เพิ่ม key ที่นี่
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
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                -
                <div className="mb-0 ml-1">
                  <select name="end" id="end" value={this.state.end} onChange={this.handleInputChangeDateFinish} className="form-control" style={{ width: '100%' }}>
                    {this.state.monthList.map(item => (
                      <option
                        key={item.value}
                        value={item.value}
                        disabled={
                          (this.state.start > 0 && this.state.start < 10 && item.value > 9) ||
                          (this.state.start > 9 && item.value > 9 && this.state.start > item.value) ||
                          (this.state.start > 0 && this.state.start < 10 && this.state.start > item.value)
                            ? 'disabled'
                            : ''
                        }
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
                <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'right' }}>
                  <div className=" flex" style={{ textAlign: 'right' }}>
                    <div className="mb-0" style={{ whiteSpace: 'nowrap', width: '100px' }}>
                      หน่วยงาน
                    </div>
                    <div className="mb-0 ml-1">
                      <select name="department" id="department" value={this.state.department} onChange={this.handleInputChange2} className="form-control" style={{ width: '100%' }}>
                        <option value="">ทั้งหมด</option>
                        {this.state.departments_list.map(item => (
                          <option key={item.department_id} value={item.department_id}>
                            {item.department_name}
                          </option>
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
                  <div className="box-card-header-2 active" style={{ cursor: 'pointer' }} onClick={e => this.chengSubtitle(1, e)}>
                    การดำเนินโครงการ
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
                          <Pie
                            options={{
                              legend: { display: false, position: 'center' },
                              cutoutPercentage: 0,
                              maintainAspectRatio: true,
                              tooltips: {
                                callbacks: {
                                  label: function (tooltipItem, data) {
                                    const label = data.labels[tooltipItem.index];
                                    const sum = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                    return ` ${value} (${((value / sum) * 100).toFixed(2)} %) ${label}`;
                                  },
                                },
                              },
                              onClick: this.handleClick, // เมื่อคลิก slice จะเรียก handleClick
                            }}
                            plugins={plugins}
                            data={{
                              labels: [
                                'โครงการเบิกเงินแล้วสิ้นสุด',
                                'โครงการได้ตามกำหนดการ',
                                'โครงการดำเนินการแล้วแต่ล่าช้า',
                                'โครงการยังไม่ดำเนินการ',
                                'โครงการเลยเวลามาแล้วยังไม่ดำเนินการทำ',
                                'โครงการยกเลิก',
                              ],
                              datasets: [
                                {
                                  data: this.state.dataset1,
                                  backgroundColor: [
                                    '#3f50fb', // blue
                                    '#64c404', // green
                                    '#ffcc66', // yellow
                                    '#fe0803', // red
                                    '#ee4444', // dark red
                                    '#bbbbbb', // gray
                                  ],
                                  borderWidth: 1,
                                },
                              ],
                            }}
                          />
                        </div>
                        <div className="col-12">
                          <span className="text-dashboard-7">โครงการทั้งหมด</span>
                          <span className="text-dashboard-9"> {this.state.data.length}</span>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={7}>
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
                <div className="box-card">
                  <div className="box-card-header-2" style={{ cursor: 'pointer' }} onClick={e => this.chengSubtitle(2, e)}>
                    โครงการที่เบิกจ่ายงบประมาณ
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
                            justifyContent: 'center',
                          }}
                        >
                          <Pie
                            options={{
                              legend: {
                                display: false,
                                position: 'bottom',
                              },
                              cutoutPercentage: 0,
                              tooltips: {
                                callbacks: {
                                  label: function (tooltipItem, data) {
                                    const label = data.labels[tooltipItem.index];
                                    const sum = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                    return ` ${value} (${((value / sum) * 100).toFixed(2)} %) ${label}`;
                                  },
                                },
                              },
                            }}
                            plugins={plugins}
                            data={{
                              // labels: ['ยังไม่มีการรายงาน', 'เป็นไปตามแผน', 'เบิกจ่ายต่ำกว่าแผน', 'เบิกจ่ายเกินแผน'],
                              labels: ['ยังไม่มีการรายงาน', 'เป็นไปตามแผน', 'เบิกจ่ายต่ำกว่าแผน'],
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
                        <div className="col-12">
                          <span className="text-dashboard-7">โครงการทั้งหมด</span>
                          <span className="text-dashboard-9"> {this.state.data.length}</span>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <div>
                          {[
                            { label: 'ยังไม่มีการรายงาน', colorClass: 'dot-dashboard-1', value: 0 },
                            { label: 'เป็นไปตามแผน', colorClass: 'dot-dashboard-2', value: 1 },
                            { label: 'เบิกจ่ายต่ำกว่าแผน', colorClass: 'dot-dashboard-3', value: 2 },
                            // { label: 'เบิกจ่ายเกินแผน', colorClass: 'dot-dashboard-4', value: 3 },
                          ].map((item, index) => {
                            // Get dataset value and total data length
                            const datasetValue = this.state.dataset2[item.value] || 0;
                            const totalDataLength = this.state.data.length || 1; // Avoid division by zero

                            // Calculate percentage
                            const percentage = (datasetValue / totalDataLength) * 100;

                            return (
                              <div key={index} className="flex mb-2">
                                <span className="text-dashboard-7">{parseFloat(percentage).toFixed(2)}%</span>
                                <div className={`${item.colorClass} mr-2 ml-2`}></div>
                                <span className="text-dashboard-6">{item.label}</span>
                              </div>
                            );
                          })}
                          <div className="flex mb-2" style={{ height: '21px' }}></div>
                          <div className="flex mb-2" style={{ height: '21px' }}></div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div className="box-card">
                  <div className="box-card-header-2" style={{ cursor: 'pointer' }} onClick={e => this.chengSubtitle(3, e)}>
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
                          <Pie
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
                                    const label = data.labels[tooltipItem.index];
                                    const sum = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                    return ` ${value} (${((value / sum) * 100).toFixed(2)} %) ${label}`;
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
                        <div className="col-12">
                          <span className="text-dashboard-7">ตัวชี้วัด KPI ทั้งหมด</span>
                          <span className="text-dashboard-9">{this.state.sumkpi}</span>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={7}>
                        {Array.isArray(this.state.dataset3) && this.state.dataset3.length > 0 ? (
                          this.state.dataset3.map((value, index) => {
                            const colors = ['#BBBBBB', '#008000', '#00FF00', '#ffff00', '#FF00FF', '#FF0000'];
                            const labels = ['ยังไม่มีการรายงาน', 'ดีมาก', 'ดี', 'พอใช้', 'ปรับปรุง', 'ไม่ผ่าน'];
                            const percentage = ((value / this.state.dataset3.length) * 100).toFixed(2);
                            return (
                              <div className="flex mb-2" key={index}>
                                <span className="text-dashboard-7">{percentage}%</span>
                                <div className={`dot-dashboard-${index + 1} mr-2 ml-2`} style={{ backgroundColor: colors[index] }}></div>
                                <span className="text-dashboard-6">{labels[index]}</span>
                              </div>
                            );
                          })
                        ) : (
                          <div>Loading KPI data...</div>
                        )}
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={1} className="flex mb-2" id="subTitle1" style={{ textAlign: 'center', justifyContent: 'center' }}>
              <Row className="m-0">
                <Grid item xs={6} md={2} className="px-1" style={{ cursor: 'pointer' }} onClick={() => this.handleClick1(3)}>
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
                <Grid item xs={6} md={2} className="px-1" style={{ cursor: 'pointer' }} onClick={() => this.handleClick1(1)}>
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
                <Grid item xs={6} md={2} className="px-1" style={{ cursor: 'pointer' }} onClick={() => this.handleClick1(2)}>
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
                <Grid item xs={6} md={2} className="px-1" style={{ cursor: 'pointer' }} onClick={() => this.handleClick1(0)}>
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
                <Grid item xs={6} md={2} className="px-1" style={{ cursor: 'pointer' }} onClick={() => this.handleClick1(5)}>
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
                <Grid item xs={6} md={2} className="px-1" style={{ cursor: 'pointer' }} onClick={() => this.handleClick1(4)}>
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
              </Row>
            </Grid>
            <Grid container spacing={1} className="flex mb-2" id="subTitle2" style={{ textAlign: 'center', justifyContent: 'center' }}>
              <Row className="m-0">
                <Grid item xs={6} md={3} className="px-1">
                  <div className="box-dashboard-3">
                    <div className="row">
                      <div className="col-6 flex pr-0" style={{ justifyContent: 'center' }}>
                        <div className="circle-dashboard-3">
                          <img src="https://framerusercontent.com/images/sRAWe8qFLGIgQmDqUuDRNNoPM1k.png" alt="" width="30" height="30" style={{ alignItems: 'center' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div>ยังไม่มีการรายงาน</div> <div className="text-dashboard-3">{this.state.dataset2[0]}</div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6} md={3} className="px-1">
                  <div className="box-dashboard-7">
                    <div className="row">
                      <div className="col-6 flex pr-0" style={{ justifyContent: 'center' }}>
                        <div className="circle-dashboard-7">
                          <IoMdCheckbox style={{ fontSize: '40px' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div>เป็นไปตามแผน</div>
                        <div className="text-dashboard-6-1">{this.state.dataset2[1]}</div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6} md={3} className="px-1">
                  <div className="box-dashboard-2">
                    <div className="row">
                      <div className="col-6 flex pr-0" style={{ justifyContent: 'center' }}>
                        <div className="circle-dashboard-2">
                          {/* <AiFillEdit style={{ fontSize: '40px' }} /> */}
                          <TiStarFullOutline style={{ fontSize: '40px' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div>เบิกจ่ายต่ำกว่าแผน</div>
                        <div className="text-dashboard-2">{this.state.dataset2[2]}</div>
                      </div>
                    </div>
                  </div>
                </Grid>
                {/* <Grid item xs={6} md={3} className="px-1">
                  <div className="box-dashboard-5">
                    <div className="row">
                      <div className="col-6 flex pr-0" style={{ justifyContent: 'center' }}>
                        <div className="circle-dashboard-5">
                          <IoIosAlarm style={{ fontSize: '40px' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div>เบิกจ่ายเกินแผน</div>
                        <div className="text-dashboard-5">{this.state.dataset2[3]}</div>
                      </div>
                    </div>
                  </div>
                </Grid> */}
              </Row>
            </Grid>

            <Grid container spacing={1} className="flex mb-2" id="subTitle3" style={{ textAlign: 'center', justifyContent: 'center' }}>
              <Row className="m-0">
                {this.state.dataset3.map((data, index) => (
                  <Grid item xs={6} md={2} className="px-1" key={index}>
                    <div className={`box-dashboard-${index + 1}`}>
                      <div className="row">
                        <div className="col-6 flex pr-0" style={{ justifyContent: 'center' }}>
                          <div
                            className={`circle-dashboard-${index + 1}`}
                            style={{ backgroundColor: circleColors[index] }} // กำหนดสีพื้นหลังเฉพาะ circle-dashboard
                          >
                            {index === 0 && <RiEmotionSadLine style={{ fontSize: '40px' }} />}
                            {index === 1 && <RiEmotionLaughLine style={{ fontSize: '40px' }} />}
                            {index === 2 && <RiEmotionLine style={{ fontSize: '40px' }} />}
                            {index === 3 && <RiEmotionHappyLine style={{ fontSize: '40px' }} />}
                            {index === 4 && <RiEmotionNormalLine style={{ fontSize: '40px' }} />}
                            {index === 5 && <RiEmotionUnhappyLine style={{ fontSize: '40px' }} />}
                          </div>
                        </div>
                        <div className="col-6">
                          <div>{['ยังไม่มีการรายงาน', 'ดีมาก', 'ดี', 'พอใช้', 'ปรับปรุง', 'ไม่ผ่าน'][index]}</div>
                          <div className={`text-dashboard-${index + 1}`}>{data}</div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Row>
            </Grid>
          </div>
          <hr />
          <div>
            <div>
              <DashboardReportProjectListViewer
                page={null}
                year={this.state.yearProject}
                select_status={this.state.project_status}
                period={this.state.period}
                select_department={this.state.department || null}
                title="โครงการ"
              />
            </div>
          </div>
          <div>
            <div className="box-13 mb-2">ข้อมูลงบประมาณทั้งหมด</div>
            <div>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td rowSpan="2" style={{ width: '33%', textAlign: 'center' }}>
                      {' '}
                      <Pie
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
                      <Pie
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
                      <Pie
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
                  revenset={this.state.revenset}
                  expenset={this.state.expenset}
                  expenuse={this.state.expenuse}
                  project={this.state.project}
                  project1={this.state.project1}
                  sumproject={this.state.sumproject}
                  year={this.state.yearProject}
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
              <DashboardBudgetDepartmantList
                page={null}
                year={this.state.yearProject}
                period={this.state.period}
                start = {this.state.start}
                end = {this.state.end}
                select_depaetment={this.state.department}
                title="รายการงบประมาณรายจ่ายตามหน่วยงาน"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default DashboardViewer;
