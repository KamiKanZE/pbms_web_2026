import Page3 from 'components/Page3';
import React from 'react';
import axios from 'axios';
import { Col, Row } from 'reactstrap';
// import PlanList from 'components/Plan/PlanList';
// import PlanList2 from '../../components/BasicInformation/PlanList2';
import ProjectList from '../../components/AllProject/ProjectList';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import $ from 'jquery';
import { userID, userName, userDepartmentID, token_id, monthList, performanceOptions, durationOptions, userPermission, userType } from '../../components/constants';
export const monthNameTH = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

function Data({ page, yearList, monthList, month, start, end, handleInput, year, period, department, departments_list, handleInputChangeDateStart, handleInputChangeDateFinish }) {
  return (
    <>
      <div style={{ margin: '0px 1rem' }}>
        <div className="box-1 mb-2">ข้อมูลโครงการ</div>
        <Grid container spacing={1} className="flex mb-2">
          <Grid item xs={12} md={2}>
            <div className="box-6">รายละเอียดโครงการ</div>
          </Grid>
          {userPermission[0].manageUsersData || <Grid item xs={12} md={2}></Grid>}
          <Grid item xs={12} md={2} style={{ textAlign: 'right', display: 'flex', justifyContent: 'right' }}>
            <div className="row flex">
              <div className="col-5 mb-0" style={{ whiteSpace: 'nowrap', width: '150px' }}>
                เลือกปีโครงการ
              </div>
              <div className="col-7 mb-0">
                <select name="year" id="year" value={year} onChange={handleInput} className="form-control">
                  {yearList.map((k, i) => (
                    <option key={i} value={k.value}>
                      ปี {k.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={2} style={{ textAlign: 'right', display: 'flex', justifyContent: 'right' }}>
            <div className="flex">
              <div className="mb-0" style={{ whiteSpace: 'nowrap', width: '100px' }}>
                ช่วงเวลา
              </div>
              <div className="mb-0 ml-1">
                <select name="period" id="period" value={period} onChange={handleInput} className="form-control" style={{ width: '100%' }}>
                  <option value="0">ทั้งหมด</option>
                  <option value="1">ไตรมาส 1</option>
                  <option value="2">ไตรมาส 2</option>
                  <option value="3">ไตรมาส 3</option>
                  <option value="4">ไตรมาส 4</option>
                </select>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={3} style={{ textAlign: 'right', display: 'flex', justifyContent: 'right' }}>
            <div className="flex">
              <div className="mb-0" style={{ whiteSpace: 'nowrap', width: '100px' }}>
                ช่วงเดือน
              </div>
              <div className="mb-0 ml-1">
                <select name="start" id="start" value={start} onChange={handleInputChangeDateStart} className="form-control" style={{ width: '100%' }}>
                  {monthList.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              -
              <div className="mb-0 ml-1">
                <select name="end" id="end" value={end} onChange={handleInputChangeDateFinish} className="form-control" style={{ width: '100%' }}>
                  {monthList.map((item, i) => (
                    <option key={i} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Grid>
          {userType !== 3 ? (
            <Grid item xs={12} md={3} style={{ display: 'flex', justifyContent: 'right' }}>
              <div className="flex" style={{ textAlign: 'right' }}>
                <div className="mb-0" style={{ whiteSpace: 'nowrap', width: '100px' }}>
                  หน่วยงาน
                </div>
                <div className="mb-0 ml-1">
                  <select name="department" id="department" value={department} onChange={handleInput} className="form-control" style={{ width: '100%' }}>
                    <option value="">ทั้งหมด</option>
                    {departments_list.map(item => (
                      <option key={item.department_id} value={item.department_id}>
                        {item.department_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Grid>
          ) : (
            ''
          )}
        </Grid>
      </div>
      <Page3 title="โครงการทั้งหมด" breadcrumbs={[{ name: 'ข้อมูลประเภทงบประมาณ (งบประมาณรายจ่าย)', active: true }]} className="Plan1">
        <Row>
          <Col>
            <ProjectList page={page} year={year} period={period} start={start} end={end} department={department} title="โครงการ" />
          </Col>
        </Row>
      </Page3>
    </>
  );
}

// export default Plan1;
export default class AllProjectData extends React.Component {
  state = {
    yearList: [],
    month: moment().month(),
    year: moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543,
    period: 0,
    monthList: [],
    departments_list: [],
    department: '',
    month: '',
    url: process.env.REACT_APP_SOURCE_URL + '/projects/list',
  };
  componentDidMount() {
    // this.loadCommentsFromServer();
    this.yearLoop();
    this.monthLoop();
    this.fetchDataDepartments();
  }
  // loadCommentsFromServer() {
  //   $.ajax({
  //     url: this.state.url + '?page=1&size=1000',
  //     data: {
  //       totalPage: this.state.perPage,
  //       offset: this.state.offset,
  //     },
  //     dataType: 'json',
  //     type: 'GET',
  //     success: data => {
  //       // this.yearLoop(data.result.result);
  //     },

  //     error: (xhr, status, err) => {
  //       console.error(this.props.url, status, err.toString()); // eslint-disable-line
  //     },
  //   });
  // }
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
    let start = 10;
    let end = 9;
    const month = new Date().getMonth();
    let period;
    let j = 0;
    let year;
    for (let index = 10; index < 13; index++) {
      // start = 9;
      // end = 8;
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
  handleInputChange = e => {
    if (e.target.name == 'period') {
      this.checkmonthLoop(e.target.value);
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };
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
  render() {
    let page = this.props.match.params.id;
    return (
      <div>
        <Data
          dataset={page}
          yearList={this.state.yearList}
          year={this.state.year}
          monthList={this.state.monthList}
          month={this.state.month}
          start={this.state.start}
          end={this.state.end}
          period={this.state.period}
          departments_list={this.state.departments_list}
          department={this.state.department}
          handleInput={this.handleInputChange}
          handleInputChangeDateStart={this.handleInputChangeDateStart}
          handleInputChangeDateFinish={this.handleInputChangeDateFinish}
        />
      </div>
    );
  }
}
