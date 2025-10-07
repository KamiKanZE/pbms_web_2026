import React, { useState } from 'react';
import axios from 'axios';
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
  ButtonGroup,
  DropdownMenu,
  keyword,
} from 'reactstrap';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import $ from 'jquery';
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from 'material-ui-thai-datepickers';
import AsyncCreatableExample from './selectProject'
import { border, display, width } from '@mui/system';
import { useDownloadExcel } from 'react-export-table-to-excel';
import 'moment/locale/th';
import ReactPaginate from 'react-paginate';
import EventLog from './EventLog';
import Select2 from 'react-select2-wrapper';
// import SelectActivity from './selectActivity';
import '../../styles/select.css';
import { alpha } from '@material-ui/core/styles'
export const monthNameTH = [
  '',
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
const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: 2,
    }}
  />
);
const monthList = [
  { no: 0, name: 'ม.ค.' },
  { no: 1, name: 'ก.พ.' },
  { no: 2, name: 'มี.ค.' },
  { no: 3, name: 'เม.ย.' },
  { no: 4, name: 'พ.ค.' },
  { no: 5, name: 'มิ.ย.' },
  { no: 6, name: 'ก.ค.' },
  { no: 7, name: 'ส.ค.' },
  { no: 8, name: 'ก.ย.' },
  { no: 9, name: 'ต.ค.' },
  { no: 10, name: 'พ.ย.' },
  { no: 11, name: 'ธ.ค.' },
];
const listOptionType = [
  { id: "createProject", text: "สร้างโครงการ" },
  { id: "updateProjectBudget", text: "แก้ไขงบประมาณโครงการ" },
  { id: "updateProject", text: "แก้ไขโครงการ" }, 
  { id: "removeProject", text: "ลบโครงการ" }, 
  { id: "createActivity", text: "เพิ่มกิจกรรม" }, 
  { id: "updateActivity", text: "แก้ไขกิจกรรม" }, 
  { id: "removeActivity", text: "ลบกิจกรรม"}, 
  { id: "createProgress", text: "เพิ่มการรายงานผล" }, 
  { id: "updateProgress", text: "แก้ไขการรายงานผล" }, 
  { id: "removeProgress", text: "ลบการรายงานผล" },
  // {id:"createRevenue",text:"เพิ่มงบประมาณรายรับ"},
  // {id:"updateRevenue",text:"แก้ไขงบประมาณรายรับ"},
  // {id:"removeRevenue",text:"ลบงบประมาณรายรับ"},
  // {id:"createExpenditure",text:"เพิ่มงบประมาณรายจ่าย"},
  // {id:"updateExpenditure",text:"แก้ไขงบประมาณรายจ่าย"},
  // {id:"removeExpenditure",text:"ลบงบประมาณรายจ่าย"},
  { id: "login", text: "เข้าสู่ระบบ" }, 
  { id: "logout", text: "ออกจากระบบ"}
]
// export default Plan1;
export default class Activity extends React.Component {
  state = {
    url: process.env.REACT_APP_SOURCE_URL + '/activityLogs/list',
    start: new Date(),
    finish: new Date(),
    namesearch: '',
    activitysearch: '',
    dataType: '',
    perPage: 10,
    selected: 1,
    currenpage: 0,
    offset: 0,
    data: [],
    data2: [],
    projectsId: '',
    optionActivity: []
  };
  componentDidMount() {
    this.loadCommentsFromServer();
    this.loadCommentsFromServer1();
  }

  loadCommentsFromServer() {
    const start = moment(this.state.start).format('yyyy-MM-DD');
    const finish = moment(this.state.finish).format('yyyy-MM-DD');
    axios
      .get(
        this.state.url +
        '?date_start=' +
        start +
        '&date_end=' +
        finish +
        '&action_key=' +
        this.state.dataType +
        '&project_name=' +
        this.state.namesearch +
        '&activity_name=' +
        this.state.activitysearch,
      )
      .then(res => {
        let resultz = res.data;
        if (res.data.length > 0) {
          const start = (this.state.selected - 1) * this.state.perPage;
          const end = start + +this.state.perPage;
          const result = resultz.slice(start, end);
          this.setState({
            data: result,
            pageCount: Math.ceil(res.data.length / this.state.perPage),
          });
        } else {
          this.setState({
            data: resultz,
            pageCount: Math.ceil(res.data.length / this.state.perPage),
          });
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }
  loadCommentsFromServer1() {
    const start = moment(this.state.start).format('yyyy-MM-DD');
    const finish = moment(this.state.finish).format('yyyy-MM-DD');
    axios
      .get(
        this.state.url +
        '?date_start=' +
        start +
        '&date_end=' +
        finish +
        '&action_key=' +
        this.state.dataType +
        '&project_name=' +
        this.state.namesearch +
        '&activity_name=' +
        this.state.activitysearch,
      )
      .then(res => {
        let resultz = res.data;
        this.setState({
          data2: resultz,
          pageCount: Math.ceil(res.data.length / this.state.perPage),
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }
  handlePageClick = data => {
    let selected = data.selected + 1;

    let offset = Math.ceil(selected * this.state.perPage);
    this.setState(
      { offset: offset, selected: selected, currenpage: selected - 1 },
      () => {
        this.loadCommentsFromServer();
        // this.loadCommentsFromServer2();
      },
    );
  };
  thaiDate = e => {
    var date = moment(e).get('date');
    var month = moment(e).get('month');
    var year = moment(e).get('year') + 543;

    let monthThai = monthList.filter(list => list.no === month)[0].name;
    return e != undefined ? date + ' ' + monthThai + ' ' + year : '';
  };
  getTime = e => {
    var h = moment(e).get('hour');
    var m = moment(e).get('minute');
    var s = moment(e).get('second');
    return e != undefined ? h + ':' + m + ':' + s + ' น.' : '';
  };
  handleSelectChange = e => {
    if (e.length > 0) {
      this.getSelectActivity(e[0].id)
      this.setState({
        projectsId: e[0].id,
        namesearch: e[0].text,
      });
    } else {
      this.setState({
        optionActivity: []
      });
    }
  };
  handleInputChangeSelect = e => {
    this.setState({
      namesearch: e,
    });
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  getSelectActivity(id) {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/activityLogs/getActivity?project_id=' + id)
      .then(res => {
        let resultz = [];
        let data = {}
        res.data.map(item => {
          data = { text: item.activity_detail, id: item.activity_detail }
          resultz.push(data)
        }
        )
        this.setState({
          optionActivity: resultz
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }
  handleInputChangeDateStart = e => {
    const start = moment(e).format('yyyy-MM-DD');
    const finish = moment(this.state.finish).format('yyyy-MM-DD');
    let end;
    if (start > finish) {
      end = e;
    }
    this.setState({
      start: e,
      finish: end,
    });
  };
  handleInputChangeDateFinish = e => {
    var a = moment(this.state.projectStart).format('yyyy-MM-DD');
    var b = moment(e).format('yyyy-MM-DD');
    // var diff = b.diff(a, 'days');
    let end;
    if (a > b) {
      end = e;
    }
    this.setState({
      finish: e,
      start: end,
    });
  };

  handleSearch = e => {
    // let form = $('#search')[0]
    // const data = new FormData(form);
    // for (const [name,value] of data) {
    //   this.setState({
    //     [name]: value,
    //       });
    // }
    setTimeout(() => {
      this.loadCommentsFromServer();
      this.loadCommentsFromServer1();
    }, 100);
  };
  handleSelectPage = e => {
    this.setState({
      [e.target.name]: e.target.value,
      currenpage: 0,
      selected: 1,
    });
    setTimeout(() => {
      this.loadCommentsFromServer();
      // this.loadCommentsFromServer2();
    }, 500);
  };
  handleSelectChange1 = e => {
    if (e.length > 0) {
      // this.getSelectActivity(e[0].id)
      this.setState({
        activitysearch: e[0].text,
      });
    }
  };
  handleInputChangeSelect1 = e => {
    this.setState({
      activitysearch: e,
    });
  };
  render() {
    return (
      <div style={{ margin: '0px 1rem' }}>
        <div className="box-1 mb-2">Event log</div>
        <Row className="m-0">
          <Grid item xs={12} md={2}>
            <div className="box-6">Event log</div>
          </Grid>
          <Grid
            item
            xs={12}
            md={10}
            style={{ display: 'flex', justifyContent: 'end' }}
          >
            <EventLog
              DataExport={this.state.data2}
              fileName={
                'ข้อมูลโครงการ ' +
                moment().format('DD/MM') +
                '/' +
                (moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543)
              }
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <ColoredLine color="gray" />
          </Grid>
          <Grid item xs={12} md={12}>
            <Row className="m-0">
              <Col xs={12} md={6}>
                <Row className="m-0">
                  <span md={3} className="mt-2">
                    โครงการที่เกี่ยวข้อง :
                  </span>
                  <Col md={9}>
                    <AsyncCreatableExample selectId="namesearch" selectName="namesearch" onSelectValue={this.handleSelectChange} onChangeInput={this.handleInputChangeSelect} />
                    {/* <Input
                      type="text"
                      name="namesearch"
                      value={this.state.namesearch}
                      onChange={this.handleInputChange}
                      placeholder={'ค้นหาโครงการที่เกี่ยวข้อง'}
                    ></Input> */}
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={6}>
                <Row>
                  <span className="col-md-3 mt-2 text-right">
                    กิจกรรมที่เกี่ยวข้อง :
                  </span>
                  <Col md={9}>
                    {/* <SelectActivity selectId="activity" selectName="activity" onSelectValue={this.handleSelectChange1} onChangeInput={this.handleInputChangeSelect1}  dataId={this.state.projectsId} /> */}
                    {/* <Input
                      type="text"
                      name="activitysearch"
                      value={this.state.activitysearch}
                      onChange={this.handleInputChange}
                      placeholder={'ค้นหากิจกรรมที่เกี่ยวข้อง'}
                    ></Input> */}
                    <Select2 data={this.state.optionActivity}
                      name="activitysearch"
                      value={this.state.activitysearch}
                      onChange={(e) => { this.setState({ activitysearch: e.target.value }); }}

                      options={{
                        placeholder: 'โปรดระบุหรือเลือกโครงการเพื่อค้นหา',
                        allowClear: true,
                        tags: true
                      }}
                      style={{ width: '100%' }} />

                    {/* <Input
                      type="select"
                      name="activitysearch"
                      // value={this.state.activitysearch}
                      onChange={this.handleInputChange}
                    ><option value="">ทั้งหมด</option>
                      {this.state.optionActivity.map(item =>
                      (
                        <option value={item.activity_detail} key={'optionActivity' + item.activity_id}>
                          {item.activity_detail}
                        </option>
                      )
                      )}
                    </Input> */}
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={5} className="my-2">
                <Row className="m-0">
                  <span md={3} className="mt-2">
                    ประเภทข้อมูล :
                  </span>
                  <Col md={9}>
                  
                  <Select2 data={listOptionType}
                      name="dataType"
                      value={this.state.dataType}
                      onChange={(e) => { this.setState({ dataType: e.target.value }); }}

                      options={{
                        placeholder: 'โปรดระบุหรือเลือกโครงการเพื่อค้นหา',
                        allowClear: true,
                        tags: true
                      }}
                      style={{ width: '100%' }} />
                    {/* <Input
                      type="select"
                      name="dataType"
                      value={this.state.dataType}
                      onChange={this.handleInputChange}
                    >
                      <option value="">ทั้งหมด</option>
                      <option value="createProject">สร้างโครงการ</option>
                      <option value="updateProjectBudget">แก้ไขงบประมาณโครงการ</option>
                      <option value="updateProject">แก้ไขโครงการ</option>
                      <option value="removeProject">ลบโครงการ</option>
                      <option value="createActivity">เพิ่มกิจกรรม</option>
                      <option value="updateActivity">แก้ไขกิจกรรม</option>
                      <option value="removeActivity">ลบกิจกรรม</option>
                      <option value="createProgress">เพิ่มการรายงานผล</option>
                      <option value="updateProgress">แก้ไขการรายงานผล</option>
                      <option value="removeProgress">ลบการรายงานผล</option>
                      {/* <option value="createRevenue">เพิ่มงบประมาณรายรับ</option>
                      <option value="updateRevenue">แก้ไขงบประมาณรายรับ</option>
                      <option value="removeRevenue">ลบงบประมาณรายรับ</option>
                      <option value="createExpenditure">เพิ่มงบประมาณรายจ่าย</option>
                      <option value="updateExpenditure">แก้ไขงบประมาณรายจ่าย</option>
                      <option value="removeExpenditure">ลบงบประมาณรายจ่าย</option> 
                      {/*
                      <option value="login">เข้าสู่ระบบ</option>
                      <option value="logout">ออกจากระบบ</option>
                    </Input> */}
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={7}>
                <Row>
                  <Col xs={4} md={2} className="my-2 p-0">
                    <Grid
                      xs={12}
                      sm={12}
                      md={12}
                      item
                      style={{ textAlign: 'right' }}
                      className="mt-2"
                    >
                      ช่วงระยะเวลา
                    </Grid>
                  </Col>
                  <Col xs={12} md={10} className="my-2 p-0">
                    <Row className="m-0">
                      <Col xs={12} md={6}>
                        <Row>
                          <Grid
                            xs={12}
                            sm={6}
                            md={4}
                            item
                            style={{ textAlign: 'right' }}
                            className="mt-2"
                          >
                            เริ่มต้น :{' '}
                          </Grid>
                          <Col xs={12} sm={6} md={8} item>
                            <MuiPickersUtilsProvider
                              utils={MomentUtils}
                              locale={'th'}
                            >
                              <DatePicker
                                //renderInput={params => <TextField {...params} />}
                                className="form-control"
                                format="DD/MM/YYYY"
                                pickerHeaderFormat="ddd D MMM"
                                yearOffset={543}
                                name="start"
                                value={this.state.start}
                                onChange={this.handleInputChangeDateStart}
                                TextFieldComponent={params => <Input {...params} />}
                                cancelLabel="ยกเลิก"
                                okLabel="ตกลง"
                                // disabled={this.state.isEdit}
                                minDate={moment('2024-08-12', 'YYYY-MM-DD')} // ปิดตั้งแต่ 8/12/2567 ลงไป
                              />
                            </MuiPickersUtilsProvider>
                            <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                              <div>{this.state.validationError14}</div>
                              <div>{this.state.validationError14_2}</div>
                            </Col>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} md={6}>
                        <Row>
                          <Grid
                            xs={6}
                            md={4}
                            className="mt-2"
                            item
                            style={{ textAlign: 'right' }}
                          >
                            สิ้นสุด :{' '}
                          </Grid>
                          <Col xs={6} md={8} item>
                            <MuiPickersUtilsProvider
                              utils={MomentUtils}
                              locale={'th'}
                            >
                              <DatePicker
                                //renderInput={params => <TextField {...params} />}
                                className="form-control"
                                format="DD/MM/YYYY"
                                pickerHeaderFormat="ddd D MMM"
                                yearOffset={543}
                                name="finish"
                                value={this.state.finish}
                                // disablePast
                                minDate={this.state.start} // ปิดตั้งแต่ 8/12/2567 ลงไป
                                onChange={this.handleInputChangeDateFinish}
                                TextFieldComponent={params => <Input {...params} />}
                                cancelLabel="ยกเลิก"
                                okLabel="ตกลง"
                                disabled={this.state.isEdit}
                              />
                            </MuiPickersUtilsProvider>
                            <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                              <div>{this.state.validationError15}</div>
                              <div>{this.state.validationError15_2}</div>
                            </Col>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col md={12} style={{ textAlign: 'end' }}>
                <Button
                  type="button"
                  className="btn btn-success"
                  style={{ marginBottom: '6px', borderRadius: '10px' }}
                  onClick={this.handleSearch}
                >
                  ค้นหา
                </Button>
              </Col>
            </Row>
          </Grid>
          <Col sm={12} className="p-0">
            <Col sm={6} className="my-2">
              <Grid container spacing={1} className="flex">
                <Grid item sm={2} md={1}>
                  <div>แสดง</div>
                </Grid>
                <Grid item sm={4} md={2}>
                  <Input
                    type="select"
                    name="perPage"
                    onChange={this.handleSelectPage}
                    // onClick={() => this.handleSelectPage()}
                    value={this.state.perPage}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Input>
                </Grid>
                <Grid item sm={4} md={2}>
                  <div>รายการ</div>
                </Grid>
              </Grid>
            </Col>
            <Table
              responsive
              borderless
              className="tableb"
              id="table1"
              style={{
                border: '1px solid black',
                borderCollapse: 'collapse',
                width: '100%',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: 'rgb(224, 236, 250)' }}>
                  <th
                    style={{
                      border: '1px solid black',
                      textAlign: 'center',
                      width: '5%',
                    }}
                  >
                    ลำดับ
                  </th>
                  <th
                    style={{
                      border: '1px solid black',
                      textAlign: 'center',
                      width: '10%',
                    }}
                  >
                    วันที่
                  </th>
                  <th
                    style={{
                      border: '1px solid black',
                      textAlign: 'center',
                      width: '10%',
                    }}
                  >
                    เวลา
                  </th>
                  <th
                    style={{
                      border: '1px solid black',
                      textAlign: 'center',
                      width: '15%',
                    }}
                  >
                    ประเภทข้อมูล
                  </th>
                  <th
                    style={{
                      border: '1px solid black',
                      textAlign: 'center',
                      width: '25%',
                    }}
                  >
                    โครงการที่เกี่ยวข้อง
                  </th>
                  <th
                    style={{
                      border: '1px solid black',
                      textAlign: 'center',
                      width: '20%',
                    }}
                  >
                    กิจกรรมที่เกี่ยวข้อง
                  </th>
                  <th
                    style={{
                      border: '1px solid black',
                      textAlign: 'center',
                      width: '15%',
                    }}
                  >
                    ผู้ทำรายการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.length == 0 ? (
                  <tr>
                    <td colSpan="7" align="center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  this.state.data.map((id, i) => (
                    <tr key={'table' + i}>
                      <td
                        style={{
                          border: '1px solid black',
                          textAlign: 'center',
                        }}
                      >
                        {(parseInt(this.state.selected) - 1) *
                          this.state.perPage +
                          (i + 1)}
                      </td>
                      <td
                        style={{
                          border: '1px solid black',
                          textAlign: 'center',
                        }}
                      >
                        {this.thaiDate(id.create_at)}
                      </td>
                      <td
                        style={{
                          border: '1px solid black',
                          textAlign: 'center',
                        }}
                      >
                        {this.getTime(id.create_at)}
                      </td>
                      <td
                        style={{
                          border: '1px solid black',
                          textAlign: 'center',
                        }}
                      >
                        {id.action_type.name}
                      </td>
                      <td
                        style={{
                          border: '1px solid black',
                        }}
                      >
                        {id.project_name}
                      </td>
                      <td
                        style={{
                          border: '1px solid black',
                        }}
                      >
                        {id.activity_name}
                      </td>
                      <td
                        style={{
                          border: '1px solid black',
                          textAlign: 'center',
                        }}
                      >
                        {id.user}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            {this.state.data.length != 0 ? (
              <div style={{ display: 'flex', justifyContent: 'right' }}>
                <ReactPaginate
                  previousLabel={'ย้อนกลับ'}
                  nextLabel={'ถัดไป'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.state.pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                  forcePage={this.state.currenpage}
                />
              </div>
            ) : (
              ''
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
