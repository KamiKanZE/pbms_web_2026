import Page from 'components/Page';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import { confirmAlert } from 'react-confirm-alert';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Label,
  Progress,
} from 'reactstrap';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
function SubProject({ project_id }) {
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
        {/* <MenuItem component={Link} to={'/project1-2/' + project_id}>
          กิจกรรมภายใต้โครงการ
        </MenuItem>
        <MenuItem component={Link} to={'/project1-3/' + project_id}>
          ตัวชี้วัดภายใต้โครงการ
        </MenuItem>
        <MenuItem component={Link} to={'/project1-4/' + project_id}>
          ความเสี่ยงภายใต้โครงการ
        </MenuItem> */}
        <MenuItem component={Link} to={'/progress1report/' + project_id}>
          รายงานผลการปฎิบัติงาน
        </MenuItem>
      </Menu>
    </div>
  );
}

function ProgressBar({ dataprogress }) {
  let color;
  if (dataprogress <= 30) {
    color = 'danger';
  } else if (dataprogress <= 60) {
    color = 'warning';
  } else {
    color = 'success';
  }
  return (
    <Progress
      color={color}
      value={dataprogress}
      className="mt-2"
      style={{ backgroundColor: 'rgba(106, 130, 251, 0.25)' }}
    >
      <Label style={{ marginBottom: '0px', color: 'black' }}>
        <img
          src="https://img.icons8.com/material-rounded/24/000000/in-progress.png"
          width="18"
          height="18"
        />
        {dataprogress}%
      </Label>
    </Progress>
  );
}

export default class ReportProject extends React.Component {
  state = {
    list: [],
    modalShow: false,
    data: [],
    selected: 1,
    offset: 0,
    perPage: 10,
    url: process.env.REACT_APP_SOURCE_URL + '/projects/user/',
  };
  // fetchData = () => {
  //   const userID = localStorage.getItem('userID');
  //   axios.get(this.state.url + userID).then(res => {
  //     this.setState({ list: res.data.result });
  //   });
  // };
  componentDidMount() {
    this.loadCommentsFromServer();
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
    const userID = localStorage.getItem('userID');
    $.ajax({
      url:
        this.state.url +
        userID +
        '?page=' +
        this.state.selected +
        '&size=' +
        this.state.perPage,
      data: { totalPage: this.state.perPage, offset: this.state.offset },
      dataType: 'json',
      type: 'GET',
      success: data => {
        this.setState({
          data: data.result,
          pageCount: Math.ceil(data.pagination.itemTotal / this.state.perPage),
        });
      },

      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString()); // eslint-disable-line
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

  render() {
    return (
      <div>
        <Table hover id="table1">
          <thead>
            <tr>
              {/* <th>No.</th> */}
              <th>รหัสงบประมาณ</th>
              <th>ชื่อโครงการ</th>
              <th>ความก้าวหน้าโครงการ</th>
              {/* <th />
              <th /> */}
              <th>การจัดการข้อมูล</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.length == 0 ? (
              <tr>
                <td colSpan="4" align="center">
                  ไม่มีข้อมูลโครงการ
                </td>
              </tr>
            ) : (
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
                    <ProgressBar dataprogress={data.project_progress} />
                  </td>
                  {/* <td
                  style={{
                    width: '3%',
                  }}
                >
                  <Tooltip title="แก้ไข">
                    <IconButton
                      className="btn_not_focus"
                      color="inherit"
                      aria-label="แก้ไข"
                      size="small"
                      component={Link}
                      to={'/FormEditProject/' + data._id}
                    >
                      <Icon>edit</Icon>
                    </IconButton>
                  </Tooltip>
                </td>
                <td
                  style={{
                    width: '4%',
                  }}
                >
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
                </td> */}
                  <td
                    style={{
                      width: '10%',
                      textAlign: 'center',
                    }}
                  >
                    <SubProject project_id={data._id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        <Row>
          <Col md={12} style={{ textAlign: 'right' }}>
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
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
