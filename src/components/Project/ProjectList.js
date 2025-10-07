import Page from 'components/Page';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import { confirmAlert } from 'react-confirm-alert';
import SvgIcon from '@material-ui/core/SvgIcon';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Input,
  Table,
  Progress,
  Label,
  keyword,
} from 'reactstrap';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import { display } from '@material-ui/system';
import moment from 'moment';
const userDepartmentID = localStorage.getItem('userDepartmentID');
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
function SubProject({ project_id, department_id }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  if (department_id == userDepartmentID) {
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
          <MenuItem component={Link} to={'/project1-2/' + project_id}>
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
  } else {
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
          <MenuItem component={Link} to={'/project1-2view/' + project_id}>
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
}

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

export default class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    let id;
    {
      this.props.project_id == ':id' ||
      this.props.project_id == '' ||
      this.props.project_id == undefined
        ? (id = 1)
        : (id = this.props.project_id);
    }

    this.state = {
      list: [],
      modalShow: false,
      data: [],
      selected: id,
      offset: 0,
      perPage: 10,
      url: process.env.REACT_APP_SOURCE_URL + '/Projects/',
      // data1:{selected:id-1},
      keyword: '',
      currenpage: id - 1,
    };
    // this.handlePageClick = this.handlePageClick.bind(this.state.data1);
  }
  // fetchData = () => {
  //   axios
  //     .get(process.env.REACT_APP_SOURCE_URL + '/Projects?page='+this.this.state.selected+'&size='+this.state.perPage)
  //     .then(res => {
  //       this.setState({ list: res.data.result });
  //     });
  // };

  componentDidMount() {
    this.loadCommentsFromServer();
    // this.handlePageClick(this.state.data1);
  }

  ConfirmDelete = id => {
    confirmAlert({
      //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
      message: 'คุณต้องการจะลบข้อมูลนี้',
      buttons: [
        {
          label: 'ยืนยัน',
          onClick: () => this.DELETE(id),
        },
        {
          label: 'ยกเลิก',
        },
      ],
    });
  };

  DELETE = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/projects/' + id)
      .then(res => {
        this.loadCommentsFromServer();
      })
      .catch(err => {
        console.log(err);
      });
  };

  loadCommentsFromServer() {
    // const token_id = localStorage.getItem('token');
    $.ajax({
      url:
        this.state.url +
        '?page=' +
        this.state.selected +
        '&size=' +
        this.state.perPage +
        '&search=' +
        this.state.keyword,
      data: {
        totalPage: this.state.perPage,
        offset: Math.ceil(this.state.selected * this.state.perPage),
      },
      dataType: 'json',
      type: 'GET',
      success: data => {
        // let offset = Math.ceil(this.state.selected * this.state.perPage);
        this.setState({
          data: data.result,
          pageCount: Math.ceil(data.pagination.itemTotal / this.state.perPage),
          selected: this.state.selected,
        });
      },
      // headers: { Authorization: `Bearer ${token_id}` } ,
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString()); // eslint-disable-line
      },
    });
  }
  handlePageClick = data1 => {
    let selected = data1.selected + 1;
    let offset = Math.ceil(selected * this.state.perPage);
    this.setState({ offset: offset, selected: selected }, () => {
      // window.location.href=selected
      // return <Link to={'/Project1/' + selected}/>
      this.loadCommentsFromServer();
    });
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    this.loadCommentsFromServer();
  };
  render() {
    return (
      <Row>
        <Col sm={12} className="form-inline" style={{ paddingLeft: '0px' }}>
          <Col
            md={6}
            style={{ paddingLeft: '0px', textAlign: 'left' }}
            className="form-inline"
          >
            <Label for="PlanName" sm={4} style={{ paddingLeft: '0px' }}>
              จำนวนที่แสดงต่อหน้า
            </Label>
            <Col sm={8} style={{ textAlign: 'left' }}>
              <select
                type="text"
                name="perPage"
                onChange={this.handleInputChange}
                value={this.state.perPage}
              >
                <option>10</option>
                <option>20</option>
                <option>30</option>
              </select>
            </Col>
          </Col>

          <Col md={6} style={{ textAlign: 'right' }} className="form-inline">
            <Col md={10} style={{ textAlign: 'right' }}>
              <Input
                type="text"
                name="keyword"
                placeholder="คำค้นหา"
                onChange={this.handleInputChange}
                value={this.state.keyword}
                style={{ width: '100%' }}
              ></Input>
            </Col>

            <Col md={2} style={{ textAlign: 'right' }}>
              <Tooltip title="Add">
                <Fab
                  className="btn_not_focus"
                  onClick={() => this.onAdd()}
                  color="primary"
                >
                  <Icon>add</Icon>
                </Fab>
              </Tooltip>
            </Col>
          </Col>
        </Col>

        <Col sm={12}></Col>
        <Col>
          <Card className="mb-12">
            <CardBody>
              <Table hover id="table1">
                <thead>
                  <tr>
                    {/* <th>No.</th> */}
                    <th>รหัสงบประมาณ</th>
                    <th>ชื่อโครงการ</th>
                    <th>
                      ความก้าวหน้าโครงการ / <br />
                      ความก้าวหน้าเบิกจ่ายงบประมาณ
                    </th>
                    <th>วันที่เริ่มต้นโครงการ</th>
                    <th>วันที่สิ้นสุดโครงการ</th>
                    <th colSpan="2" style={{ textAlign: 'center' }} />
                    <th style={{ textAlign: 'center' }}>จัดการข้อมูล</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.data.map(data => (
                      <tr>
                        {/* <td
                  style={{
                    width: '10%',
                  }}
                /> */}
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
                            width: '3%',
                          }}
                        >
                          {data.department_id == userDepartmentID ? (
                            <Tooltip title="แก้ไข">
                              <IconButton
                                className="btn_not_focus"
                                color="inherit"
                                aria-label="แก้ไข"
                                size="small"
                                component={Link}
                                to={
                                  '/FormEditProject/' +
                                  data._id +
                                  '&' +
                                  this.state.selected
                                }
                              >
                                <Icon>edit</Icon>
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ''
                          )}
                          {/* <Tooltip title="แก้ไข">
                    <IconButton
                      className="btn_not_focus"
                      color="inherit"
                      aria-label="แก้ไข"
                      size="small"
                      component={Link}
                      to={'/FormEditProject/' + data._id}
                      style={
                        data.department_id == userDepartmentID
                          ? { display: 'block' }
                          : { display: 'none' }
                      }
                    >
                      <Icon>edit</Icon>
                    </IconButton>
                  </Tooltip> */}
                        </td>
                        <td
                          style={{
                            width: '4%',
                          }}
                        >
                          {data.department_id == userDepartmentID ? (
                            <Tooltip title="ลบ">
                              <IconButton
                                className="btn_not_focus"
                                color="secondary"
                                aria-label="ลบ"
                                size="small"
                                onClick={() => this.ConfirmDelete(data._id)}
                              >
                                <Icon>delete</Icon>
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ''
                          )}
                        </td>
                        <td
                          style={{
                            width: '10%',
                            textAlign: 'center',
                          }}
                        >
                          {/* <SubProject project_id={(data._id, data.department_id)} /> */}
                          <SubProject
                            project_id={data._id}
                            department_id={data.department_id}
                          />
                        </td>
                      </tr>
                    ))
                    //     ): ( <tr>
                    //     <td colSpan="4" align="center">
                    //       ไม่มีข้อมูลโครงการ
                    //     </td>
                    //   </tr>
                    // )
                  }
                </tbody>
              </Table>
              <Row>
                <Col md={12}>
                  {this.state.data.length == 0 ? (
                    ''
                  ) : (
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
                      forcePage={this.state.currenpage}
                      // subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                    />
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}
