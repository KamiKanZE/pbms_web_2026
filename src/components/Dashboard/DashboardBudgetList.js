import React, { useRef } from 'react';
import axios from 'axios';
import Page from 'components/Page';
import { Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormFeedback, FormText, Input, Label, FormGroup, keyword } from 'reactstrap';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import { Chip, Fab, Grid, Button, LinearProgress, styled } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { AiOutlineEye } from 'react-icons/ai';
import { display } from '@mui/system';
import { useDownloadExcel } from 'react-export-table-to-excel';
import moment from 'moment';
import html2canvas from 'html2canvas';

const token_id = localStorage.getItem('token');

// const BorderLinearProgress = styled(LinearProgress)(({ colors, theme }) => ({
//   height: 7,
//   borderRadius: 5,
//   backgroundColor: colors + '50',
//   [`& .MuiLinearProgress-bar`]: {
//     borderRadius: 5,
//     backgroundColor: colors,
//   },
// }));

function SampleHook(e) {
  const tableRef = useRef(null);
  const tableRef1 = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'ข้อมูลงบประมาณ ' + moment().format('DD/MM') + '/' + (moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543),
    sheet: 'ข้อมูลงบประมาณ',
  });
  // function takeshot(){
  //   let div = document.getElementById('gendiv11');

  //   html2canvas(div).then(function (canvas) {
  //     //document.getElementById('output').appendChild(canvas);
  //     // document.getElementById('output').src;
  //     //let canvas2 = document.getElementById('output');
  //     const img = canvas.toDataURL('image/png');
  //     var a = document.createElement('a'); //Create <a>
  //     a.href = img; //Image Base64 Goes here
  //     a.download = `Image_project${moment()}.png`; //File name Here
  //     a.click(); //Downloaded file
  //     //document.write('<a src="' + img + '" download/>');
  //     //window.location.href(img)
  //   });
  // }
  function moneyFormat(e) {
    return e === 0 ? '0.00' : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e);
  }
  function moneyFormat1(e) {
    return new Intl.NumberFormat().format(e);
  }
  return (
    <Row>
      <Col sm={6}></Col>
      <Col sm={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="box-17" onClick={onDownload}>
          {' '}
          Export excel{' '}
        </button>
        {/* 
            <div className="box-16 ml-2" onClick={takeshot}>
              ส่งออก PNG
            </div> */}
      </Col>
      <div ref={tableRef} id="gendiv11" md={12}>
        <Col sm={12}>
          {/* <Card className="mb-12">
            <CardBody> */}
          <Table responsive borderless id="table">
            <thead>
              <tr style={{ backgroundColor: '#e0ecfa' }}>
                <th style={{ textAlign: 'center', width: '300px' }}>ข้อมูล</th>
                <th style={{ textAlign: 'center' }}>ปีงบประมาณ</th>
                <th style={{ textAlign: 'center' }}>จำนวนโครงการ</th>
                <th style={{ textAlign: 'center' }}>งบประมาณรายรับ</th>
                <th style={{ textAlign: 'center' }}>งบประมาณรายจ่าย</th>
                <th style={{ textAlign: 'center' }}>งบประมาณคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {e.dataset.length == 0 ? (
                <tr>
                  <td colSpan="6" align="center">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                <tr key={'table'}>
                  <td>งบประมาณทั้งหมด</td>
                  {/* <td>{id.budget_source_id}</td> */}
                  <td style={{ textAlign: 'center' }}>{e.year}</td>
                  <td style={{ textAlign: 'center' }}>{moneyFormat1(e.project + e.project1)}</td>
                  <td style={{ textAlign: 'center' }}>{moneyFormat(parseFloat(e.reven))}</td>
                  <td style={{ textAlign: 'center' }}>
                    {/* {moneyFormat(
                          this.sumary(
                            id.revenue_budget_q1,
                            id.revenue_budget_q2,
                            id.revenue_budget_q3,
                            id.revenue_budget_q4,
                          ),
                        )} */}
                    {moneyFormat(parseFloat(e.expen))}
                  </td>
                  <td style={{ textAlign: 'center' }}>{moneyFormat(parseFloat(e.reven) - parseFloat(e.expen))}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
        <Col sm={12}>
          {/* <Card className="mb-12">
            <CardBody> */}
          <Table responsive borderless id="table1">
            <thead>
              <tr style={{ backgroundColor: '##0099ff' }}>
                <th style={{ textAlign: 'center' }}>ลำดับ</th>
                {/* <th>BudgetSouceID</th> */}
                <th style={{ textAlign: 'center', width: '300px' }}>ข้อมูล</th>
                <th style={{ textAlign: 'center' }}>ปีงบประมาณ</th>
                <th style={{ textAlign: 'center' }}>จำนวนโครงการ</th>
                <th style={{ textAlign: 'center' }}>งบประมาณที่ตั้งไว้</th>
                <th style={{ textAlign: 'center' }}>งบประมาณที่ใช้ไป</th>
                <th style={{ textAlign: 'center' }}>งบประมาณคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {e.dataset.length == 0 ? (
                <tr>
                  <td colSpan="7" align="center">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                e.dataset
                  .sort((a, b) => (a.revenue_budget_type > b.revenue_budget_type ? -1 : 1))
                  .map((id, i) => (
                    <tr key={'table' + i}>
                      <td style={{ textAlign: 'center' }}>{i + 1}</td>
                      {/* <td>{id.budget_source_id}</td> */}
                      <td>{id.revenue_budget_type_name}</td>
                      <td style={{ textAlign: 'center' }}>{id.revenue_budget_year}</td>
                      <td style={{ textAlign: 'center' }}>{moneyFormat1(id.total_project)}</td>
                      <td style={{ textAlign: 'center' }}>{moneyFormat(id.revenue_budget_estimate).toString() !== 'NaN' ? moneyFormat(id.revenue_budget_estimate) : '0.00'}</td>
                      <td style={{ textAlign: 'center' }}>{moneyFormat(parseFloat(id.project_used_budget))}</td>
                      <td style={{ textAlign: 'center' }}>{moneyFormat(parseFloat(id.revenue_budget_estimate) - parseFloat(id.project_used_budget))}</td>
                    </tr>
                  ))
              )}
              <tr style={{ backgroundColor: '##0099ff' }}>
                <th colSpan={2} style={{ textAlign: 'center' }}>
                  รวม
                </th>
                <th style={{ textAlign: 'center' }}>{e.year}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat1(e.project)}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(e.reven)}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(e.revenuse)}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(e.reven - e.revenuse)}</th>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col>
          {/* <Card className="mb-12">
            <CardBody> */}
          <Table responsive borderless id="table2">
            <thead>
              <tr style={{ backgroundColor: '#e0ecfa' }}>
                <th style={{ textAlign: 'center' }}>ลำดับ</th>
                {/* <th>BudgetSouceID</th> */}
                <th style={{ textAlign: 'center', width: '300px' }}>ข้อมูล</th>
                <th style={{ textAlign: 'center' }}>ปีงบประมาณ</th>
                <th style={{ textAlign: 'center' }}>จำนวนโครงการ</th>
                <th style={{ textAlign: 'center' }}>งบประมาณที่ตั้งไว้</th>
                <th style={{ textAlign: 'center' }}>งบประมาณที่ใช้ไป</th>
                <th style={{ textAlign: 'center' }}>งบประมาณคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {e.dataset1.length == 0 ? (
                <tr>
                  <td colSpan="7" align="center">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                e.dataset1
                  .sort((a, b) => (a.expenditure_budget_id > b.expenditure_budget_id ? -1 : 1))
                  .map((id, i) => (
                    <tr key={'table' + i}>
                      <td style={{ textAlign: 'center' }}>{i + 1}</td>
                      <td>{id.expenditure_budget_type_name}</td>
                      <td style={{ textAlign: 'center' }}>{id.expenditure_budget_year}</td>
                      <td style={{ textAlign: 'center' }}>{moneyFormat1(id.total_project)}</td>
                      <td style={{ textAlign: 'center' }}>
                        {moneyFormat(id.expenditure_budget_estimate).toString() !== 'NaN' ? moneyFormat(id.expenditure_budget_estimate) : '0.00'}
                        {/* {moneyFormat(id.project_total_budget)} */}
                      </td>
                      <td style={{ textAlign: 'center' }}>{moneyFormat1(id.project_used_budget)}</td>
                      <td style={{ textAlign: 'center' }}>{moneyFormat(parseFloat(id.expenditure_budget_estimate) - parseFloat(id.project_used_budget))}</td>
                    </tr>
                  ))
              )}
              <tr style={{ backgroundColor: '##0099ff' }}>
                <th colSpan={2} style={{ textAlign: 'center' }}>
                  รวม
                </th>
                {/* <th>BudgetSouceID</th> */}
                <th style={{ textAlign: 'center' }}>{e.year}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat1(e.project1)}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(e.expen)}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(e.expenuse)}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(e.expen - e.expenuse)}</th>
              </tr>
            </tbody>
          </Table>
        </Col>
      </div>
    </Row>
  );
}

export default class DashboardBudgetList extends React.Component {
  constructor(props) {
    super(props);
    let id;
    {
      this.props.page == ':id' || this.props.page == '' || this.props.page == undefined ? (id = 1) : (id = this.props.page);
    }
    this.state = {
      Budget: [],
      ButgetSources: [],
      refreshing: false,
      modal: false,
      validationError: '',
      validationError1: '',
      PlanID: '',
      PlanName: '',
      ID: '',
      isForm: '',
      data: [],
      data1: [{}, {}, {}],
      data3: [],
      selected: id,
      currenpage: id - 1,
      offset: 0,
      perPage: 100,
      keyword: '',
      url: process.env.REACT_APP_SOURCE_URL + '/revenueBudgets/reports',
      url2: process.env.REACT_APP_SOURCE_URL + '/expenditureBudgets/reports',
      type: '',
      dataType: 0,
      dataType1: 1,
    };
  }

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  // _onRefresh = () => {
  //   this.setState({ refreshing: true });
  //   this.loadCommentsFromServer().then(() => {
  //     this.loadCommentsFromServer2()
  //     this.setState({ refreshing: false });
  //   });
  // };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });

    // this.loadCommentsFromServer();
  };
  handleInputChangeType = e => {
    this.setState({
      dataType: e.target.value,
      dataType1: e.target.value,
    });
    if (e.target.value.toString() === '0') {
      this.loadCommentsFromServer();
      this.loadCommentsFromServer2();
    } else if (e.target.value.toString() === '1') {
      this.loadCommentsFromServer();
    } else if (e.target.value.toString() === '2') {
      this.loadCommentsFromServer2();
    }
  };
  handleInputChangeType2 = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });;
    if (e.target.value === '') {
      this.setState({
        data: this.state.data3,
      });
    } else {
      this.setState({
        data: this.state.data3.filter(a => parseInt(a.revenue_type_category) === parseInt(e.target.value)),
      });
    }
    // setTimeout(() => {
    //   this.loadCommentsFromServer();
    // }, 500);
  };

  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
    this.loadCommentsFromServer2();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.year !== this.props.year) {
      // console.log('year state has changed.');
      if (this.state.dataType.toString() === '0') {
        this.loadCommentsFromServer();
        this.loadCommentsFromServer2();
      } else if (this.state.dataType.toString() === '1') {
        this.loadCommentsFromServer();
      } else if (this.state.dataType.toString() === '2') {
        this.loadCommentsFromServer2();
      }
    }
  }
  loadCommentsFromServer() {
    $.ajax({
      url: this.state.url + '?page=' + this.state.offset + '&size=' + this.state.perPage + '&revenue_budget_year=' + this.props.year,
      //this.state.type
      data: {
        totalPage: this.state.perPage,
        offset: this.state.offset,
      },
      dataType: 'json',
      type: 'GET',
      success: data => {
        let revenue = 0;
        let project = 0;
        let sumuse = 0;
        data.result.map(a => {
          revenue = revenue + parseFloat(a.revenue_budget_estimate);
          project = project + a.total_project;
          sumuse = sumuse + parseFloat(a.project_used_budget);
        });
        this.setState({
          reven: revenue,
          project: project,
          revenuse: sumuse,
          type: '',
          data: data.result,
          data3: data.result,
        });
      },

      error: (xhr, status, err) => {
        console.error(this.state.url, status, err.toString()); // eslint-disable-line
      },
    });
  }

  loadCommentsFromServer2() {
    $.ajax({
      url: this.state.url2 + '?page=' + this.state.offset + '&size=' + this.state.perPage + '&expenditure_budget_year=' + this.props.year,

      dataType: 'json',
      type: 'GET',
      success: data => {
        let expenditure = 0;
        let project1 = 0;
        let sumuse = 0;
        data.result.map(a => {
          expenditure = expenditure + parseFloat(a.expenditure_budget_estimate);
          project1 = project1 + a.total_project;
          sumuse = sumuse + parseFloat(a.project_used_budget);
        });
        this.setState({
          data1: data.result,
          project1: project1,
          expen: expenditure,
          expenuse: sumuse,
        });
      },

      error: (xhr, status, err) => {
        console.error(this.state.url, status, err.toString()); // eslint-disable-line
      },
    });
  }
  handlePageClick = data => {
    let selected = data.selected + 1;

    let offset = Math.ceil(selected * this.state.perPage);
    this.setState({ offset: offset, selected: selected }, () => {
      this.loadCommentsFromServer();
    });
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    this.loadCommentsFromServer();
  };
  moneyFormat = e => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e);
  };
  sumary = (q1, q2, q3, q4) => {
    let a1 = parseFloat(q1).toString() === 'NaN' ? 0 : q1;
    let a2 = parseFloat(q2).toString() === 'NaN' ? 0 : q2;
    let a3 = parseFloat(q3).toString() === 'NaN' ? 0 : q3;
    let a4 = parseFloat(q4).toString() === 'NaN' ? 0 : q4;
    let sum = 0;
    sum = parseFloat(a1) + parseFloat(a2) + parseFloat(a3) + parseFloat(a4);
    if (sum.toString() === 'NaN') {
      return 0;
    } else {
      return sum;
    }
  };
  render() {
    return (
      <SampleHook
        dataset={this.state.data}
        dataset1={this.state.data1}
        reven={this.state.reven}
        expen={this.state.expen}
        revenuse={this.state.revenuse}
        expenuse={this.state.expenuse}
        project={this.state.project}
        project1={this.state.project1}
        year={this.props.year}
      />
      // <Row>
      //   <Col sm={12}>
      //     <div className="box-14 mb-3">
      //       <Grid container spacing={1}>
      //         <Grid item md={4} style={{ textAlign: 'right' }}>
      //           <li className="mt-2">เลือกแสดง</li>
      //         </Grid>
      //         <Grid item md={8}>
      //           <table style={{ width: '80%' }}>
      //             <tbody>
      //               <tr style={{ height: '50px' }}>
      //                 <td>
      //                   <div className="flex" style={{ width: '80%' }}>
      //                     <span style={{ width: '30%' }}>ข้อมูล</span>
      //                     <Input
      //                       type="select"
      //                       name="dataType"
      //                       value={this.state.dataType}
      //                       onChange={this.handleInputChangeType}
      //                     >
      //                       <option value={0}>ข้อมูลงบประมาณทั้งหมด</option>
      //                       <option value={1}>ข้อมูลงบประมาณรายรับ</option>
      //                       <option value={2}>ข้อมูลงบประมาณรายจ่าย</option>
      //                     </Input>
      //                   </div>
      //                 </td>
      //               </tr>

      //               {/* <tr style={{ height: '50px' }}>
      //                 {parseInt(this.state.dataType) === 1 ? (
      //                   <td>
      //                     <div className="flex" style={{ width: '80%' }}>
      //                       <span style={{ width: '30%' }}>ประเภท</span>
      //                       <Input
      //                         type="select"
      //                         name="type"
      //                         value={this.state.type}
      //                         onChange={this.handleInputChangeType2}
      //                       >
      //                         <option value={''}>ทั้งหมด</option>
      //                         <option value={1}>รายได้จัดเก็บเอง</option>
      //                         <option value={2}>
      //                           รายได้ที่รัฐบาลเก็บแล้วจัดสรรให้องค์กรปกครองส่วนท้องถิ่น
      //                         </option>
      //                         <option value={3}>
      //                           รายได้ที่รัฐบาลอุดหนุนแล้วจัดสรรให้องค์กรปกครองส่วนท้องถิ่น
      //                         </option>
      //                       </Input>
      //                     </div>
      //                   </td>
      //                 ) : (
      //                   <td></td>
      //                 )}
      //               </tr> */}

      //               {/* <tr>
      //                 <div className="flex" style={{ width: '50%' }}>
      //                   <span style={{ width: '23%' }}></span>

      //                   <Button
      //                     variant="contained"
      //                     style={{
      //                       backgroundColor: '#ff962d',
      //                       outline: 'none',
      //                     }}
      //                     onClick={() =>
      //                       this.loadCommentsFromServer2(this.state.dataType)
      //                     }
      //                   >
      //                     <Icon style={{ color: '#ffffff' }}>search</Icon>
      //                   </Button>
      //                 </div>
      //               </tr> */}
      //             </tbody>
      //           </table>
      //         </Grid>
      //       </Grid>
      //     </div>
      //   </Col>
      //   <Col sm={6}></Col>
      //   <Col sm={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      //     {/* <ExportCSV
      //       fileName={
      //         'ข้อมูลโครงการ' +
      //         moment().format('DD/MM') +
      //         '/' +
      //         (moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543)
      //       }
      //       tableId={document.getElementById('table1')}
      //     /> */}
      //     <button onClick={onDownload}> Export excel </button>

      //     <div className="box-16 ml-2" onClick={this.takeshot}>
      //       ส่งออก PNG
      //     </div>
      //   </Col>
      //   <div ref={tableRef}>
      //   <Col sm={12}>
      //     {/* <Card className="mb-12">
      //     <CardBody> */}
      //     <Table
      //       responsive
      //       borderless
      //       id="table"
      //       style={{ display: this.state.dataType == 0 ? 'table' : 'none' }}
      //     >
      //       <thead>
      //         <tr style={{ backgroundColor: '#e0ecfa' }}>
      //           <th style={{ textAlign: 'center', width: '300px' }}>
      //             ข้อมูล
      //           </th>
      //           <th style={{ textAlign: 'center' }}>ปีงบประมาณ</th>
      //           <th style={{ textAlign: 'center' }}>จำนวนโครงการ</th>
      //           <th style={{ textAlign: 'center' }}>งบประมาณรายรับ</th>
      //           <th style={{ textAlign: 'center' }}>งบประมาณรายจ่าย</th>
      //           <th style={{ textAlign: 'center' }}>งบประมาณคงเหลือ</th>
      //         </tr>
      //       </thead>
      //       <tbody>
      //         {this.state.data.length == 0 ? (
      //           <tr>
      //             <td colSpan="6" align="center">
      //               ไม่มีข้อมูล
      //             </td>
      //           </tr>
      //         ) : (
      //           <tr key={'table'}>
      //             <td>งบประมาณทั้งหมด</td>
      //             {/* <td>{id.budget_source_id}</td> */}
      //             <td style={{ textAlign: 'center' }}>{this.props.year}</td>
      //             <td style={{ textAlign: 'center' }}>
      //               {this.moneyFormat(
      //                 this.state.project + this.state.project1,
      //               )}
      //             </td>
      //             <td style={{ textAlign: 'center' }}>
      //               {this.moneyFormat(parseFloat(this.state.reven))}
      //             </td>
      //             <td style={{ textAlign: 'center' }}>
      //               {/* {this.moneyFormat(
      //                   this.sumary(
      //                     id.revenue_budget_q1,
      //                     id.revenue_budget_q2,
      //                     id.revenue_budget_q3,
      //                     id.revenue_budget_q4,
      //                   ),
      //                 )} */}
      //               {this.moneyFormat(parseFloat(this.state.expen))}
      //             </td>
      //             <td style={{ textAlign: 'center' }}>
      //               {this.moneyFormat(
      //                 parseFloat(this.state.reven) -
      //                   parseFloat(this.state.expen),
      //               )}
      //             </td>
      //           </tr>
      //         )}
      //       </tbody>
      //     </Table>
      //   </Col>
      //   <Col sm={12}>
      //     {/* <Card className="mb-12">
      //     <CardBody> */}
      //     <Table
      //       responsive
      //       borderless
      //       id="table1"
      //       style={{ display: this.state.dataType == 2 ? 'none' : 'table' }}
      //     >
      //       <thead>
      //         <tr style={{ backgroundColor: '##0099ff' }}>
      //           <th style={{ textAlign: 'center' }}>ลำดับ</th>
      //           {/* <th>BudgetSouceID</th> */}
      //           <th style={{ textAlign: 'center', width: '300px' }}>
      //             ข้อมูล
      //           </th>
      //           <th style={{ textAlign: 'center' }}>ปีงบประมาณ</th>
      //           <th style={{ textAlign: 'center' }}>จำนวนโครงการ</th>
      //           <th style={{ textAlign: 'center' }}>งบประมาณที่ตั้งไว้</th>
      //           <th style={{ textAlign: 'center' }}>งบประมาณที่ใช้ไป</th>
      //           <th style={{ textAlign: 'center' }}>งบประมาณคงเหลือ</th>
      //         </tr>
      //       </thead>
      //       <tbody>
      //         {this.state.data.length == 0 ? (
      //           <tr>
      //             <td colSpan="7" align="center">
      //               ไม่มีข้อมูล
      //             </td>
      //           </tr>
      //         ) : (
      //           this.state.data
      //             .sort((a, b) =>
      //               a.revenue_budget_type > b.revenue_budget_type ? -1 : 1,
      //             )
      //             .map((id, i) => (
      //               <tr key={'table' + i}>
      //                 <td style={{ textAlign: 'center' }}>{i + 1}</td>
      //                 {/* <td>{id.budget_source_id}</td> */}
      //                 <td>
      //                   {id.revenue_budget_type_name}

      //                   {/* {this.state.dataType === 1
      //                   : id.expenditure_type_name} */}
      //                 </td>
      //                 <td style={{ textAlign: 'center' }}>
      //                   {id.revenue_budget_year}
      //                 </td>
      //                 <td style={{ textAlign: 'center' }}>
      //                   {this.moneyFormat(id.total_project)}
      //                 </td>
      //                 <td style={{ textAlign: 'center' }}>
      //                   {this.moneyFormat(
      //                     id.revenue_budget_estimate,
      //                   ).toString() !== 'NaN'
      //                     ? this.moneyFormat(id.revenue_budget_estimate)
      //                     : '0'}
      //                 </td>
      //                 <td style={{ textAlign: 'center' }}>
      //                   {/* {this.moneyFormat(
      //                   this.sumary(
      //                     id.revenue_budget_q1,
      //                     id.revenue_budget_q2,
      //                     id.revenue_budget_q3,
      //                     id.revenue_budget_q4,
      //                   ),
      //                 )} */}
      //                   {this.moneyFormat(parseFloat(id.project_used_budget))}
      //                 </td>
      //                 <td style={{ textAlign: 'center' }}>
      //                   {this.moneyFormat(
      //                     parseFloat(id.revenue_budget_estimate) -
      //                       parseFloat(id.project_used_budget),
      //                   )}
      //                 </td>
      //               </tr>
      //             ))
      //         )}
      //         <tr style={{ backgroundColor: '##0099ff' }}>
      //           <th colSpan={2} style={{ textAlign: 'center' }}>
      //             รวม
      //           </th>
      //           {/* <th>BudgetSouceID</th> */}
      //           <th style={{ textAlign: 'center' }}>{this.props.year}</th>
      //           <th style={{ textAlign: 'center' }}>
      //             {this.moneyFormat(this.state.project)}
      //           </th>
      //           <th style={{ textAlign: 'center' }}>
      //             {this.moneyFormat(this.state.reven)}
      //           </th>
      //           <th style={{ textAlign: 'center' }}>
      //             {this.moneyFormat(this.state.revenuse)}
      //           </th>
      //           <th style={{ textAlign: 'center' }}>
      //             {this.moneyFormat(this.state.reven - this.state.revenuse)}
      //           </th>
      //         </tr>
      //       </tbody>
      //     </Table>
      //   </Col>
      //   <Col>
      //     {/* <Card className="mb-12">
      //     <CardBody> */}
      //     <Table
      //       responsive
      //       borderless
      //       id="table2"
      //       style={{ display: this.state.dataType == 1 ? 'none' : 'table' }}
      //     >
      //       <thead>
      //         <tr style={{ backgroundColor: '#e0ecfa' }}>
      //           <th style={{ textAlign: 'center' }}>ลำดับ</th>
      //           {/* <th>BudgetSouceID</th> */}
      //           <th style={{ textAlign: 'center', width: '300px' }}>
      //             ข้อมูล
      //           </th>
      //           <th style={{ textAlign: 'center' }}>ปีงบประมาณ</th>
      //           <th style={{ textAlign: 'center' }}>จำนวนโครงการ</th>
      //           <th style={{ textAlign: 'center' }}>งบประมาณที่ตั้งไว้</th>
      //           <th style={{ textAlign: 'center' }}>งบประมาณที่ใช้ไป</th>
      //           <th style={{ textAlign: 'center' }}>งบประมาณคงเหลือ</th>
      //         </tr>
      //       </thead>
      //       <tbody>
      //         {this.state.data.length == 0 ? (
      //           <tr>
      //             <td colSpan="7" align="center">
      //               ไม่มีข้อมูล
      //             </td>
      //           </tr>
      //         ) : (
      //           this.state.data1
      //             .sort((a, b) =>
      //               a.expenditure_budget_id > b.expenditure_budget_id
      //                 ? -1
      //                 : 1,
      //             )
      //             .map((id, i) => (
      //               <tr key={'table' + i}>
      //                 <td style={{ textAlign: 'center' }}>{i + 1}</td>
      //                 {/* <td>{id.budget_source_id}</td> */}
      //                 <td>
      //                   {id.expenditure_budget_type_name}
      //                   {/* {this.state.dataType === 1
      //                   : id.expenditure_type_name} */}
      //                 </td>
      //                 <td style={{ textAlign: 'center' }}>
      //                   {id.expenditure_budget_year}
      //                 </td>
      //                 <td style={{ textAlign: 'center' }}>
      //                   {id.total_project}
      //                 </td>
      //                 <td style={{ textAlign: 'center' }}>
      //                   {this.moneyFormat(
      //                     id.expenditure_budget_estimate,
      //                   ).toString() !== 'NaN'
      //                     ? this.moneyFormat(id.expenditure_budget_estimate)
      //                     : ''}
      //                   {/* {this.moneyFormat(id.project_total_budget)} */}
      //                 </td>
      //                 <td style={{ textAlign: 'center' }}>
      //                   {this.moneyFormat(id.project_used_budget)}
      //                 </td>
      //                 <td style={{ textAlign: 'center' }}>
      //                   {this.moneyFormat(
      //                     parseFloat(id.expenditure_budget_estimate) -
      //                       parseFloat(id.project_used_budget),
      //                   )}
      //                 </td>
      //               </tr>
      //             ))
      //         )}
      //         <tr style={{ backgroundColor: '##0099ff' }}>
      //           <th colSpan={2} style={{ textAlign: 'center' }}>
      //             รวม
      //           </th>
      //           {/* <th>BudgetSouceID</th> */}
      //           <th style={{ textAlign: 'center' }}>{this.props.year}</th>
      //           <th style={{ textAlign: 'center' }}>
      //             {this.moneyFormat(this.state.project1)}
      //           </th>
      //           <th style={{ textAlign: 'center' }}>
      //             {this.moneyFormat(this.state.expen)}
      //           </th>
      //           <th style={{ textAlign: 'center' }}>
      //             {this.moneyFormat(this.state.expenuse)}
      //           </th>
      //           <th style={{ textAlign: 'center' }}>
      //             {this.moneyFormat(this.state.expen - this.state.expenuse)}
      //           </th>
      //         </tr>
      //       </tbody>
      //     </Table>
      //   </Col>
      //   </div>
      // </Row>
    );
  }
}
