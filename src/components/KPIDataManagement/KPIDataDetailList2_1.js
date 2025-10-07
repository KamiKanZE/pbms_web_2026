import React from 'react';
import axios from 'axios';
import Page from 'components/Page';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  FormFeedback,
  FormText,
  Input,
  Label,
  Button,
  FormGroup,
  keyword,
} from 'reactstrap';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import { Fab, Grid } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import { NavLink } from 'react-router-dom';
const token_id = localStorage.getItem('token');
export default class KPIDataDetailList2_1 extends React.Component {
  constructor(props) {
    super(props);
    let id;
    {
      this.props.page == ':id' ||
      this.props.page == '' ||
      this.props.page == undefined
        ? (id = 1)
        : (id = this.props.page);
    }
    this.state = {
      Budget: [],
      ButgetSources: [],
      refreshing: false,
      modal: false,
      modal1: false,
      validationError: '',
      validationError1: '',
      PlanID: '',
      PlanName: '',
      ID: '',
      isForm: '',
      data: [],
      data1: [{}, {}, {}],
      selected: 1,
      currenpage: id - 1,
      offset: 0,
      perPage: 1000,
      keyword: '',
      url: process.env.REACT_APP_SOURCE_URL + '/projects/list',
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
  toggle1 = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal1: !this.state.modal1,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadCommentsFromServer().then(() => {
      this.setState({ refreshing: false });
    });
  };

  // getKpiType = id => {
  //   axios
  //     .get(process.env.REACT_APP_SOURCE_URL + '/dataKpiTypes/' + id)
  //     .then(res => {
  //       const { _id, kpi_type_code, kpi_type_name } = res.data;
  //     });
  // };

  testAxiosDELETE = id => {
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
  render() {
    return (
      <div className="container">
        <button onClick={this.submit}>Confirm dialog</button>
      </div>
    );
  }
  DELETE = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataPlans/' + id)
      .then(res => {
        confirmAlert({
          message: 'ลบข้อมูลสำเร็จ',
          buttons: [],
        });
        setTimeout(() => (window.location.href = '/plan1/'), 1000);
        // this.loadCommentsFromServer();
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    // this.setState({ modal: true });
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataPlans/' + id)
      .then(res => {
        // const ButgetSource1 = res.data;
        // this.setState({ ButgetSource1 });
        const { _id, plan_id, plan_name } = res.data;
        // .map(id => ({'PlanID':
        //   id.main_plan_id, 'PlanName':id.main_plan_name
        // }));
        this.setState({
          // PlanID: plan_id,
          PlanName: plan_name,
          modal: true,
          ID: _id,
          isForm: 'edit',
          validationError: '',
          validationError1: '',
          header: 'แก้ไข' + this.props.title,
        });
      });
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      validationError1: '',
    });
  };
  onAdd() {
    this.setState({
      PlanID: '',
      PlanName: '',
      modal: true,
      isForm: '',
      validationError: '',
      validationError1: '',
      header: 'เพิ่มข้อมูล' + this.props.title,
    });
  }
  onScroe() {
    this.setState({
      PlanID: '',
      PlanName: '',
      modal1: true,
      isForm: '',
      validationError: '',
      validationError1: '',
      header: 'เพิ่มข้อมูล' + this.props.title,
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.isForm == 'edit') {
      this.handleUpdate(e);
    } else {
      this.handleSubmit1(e);
    }
  };

  handleSubmit1 = e => {
    e.preventDefault();
    if (this.state.PlanName.trim()) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/dataPlans',
          {
            // plan_id: this.state.PlanID.trim(),
            plan_name: this.state.PlanName.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            PlanID: '',
            PlanName: '',
          });
          // //confirmAlert({
          //   //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
          //   message: 'บันทึกข้อมูลเรียบร้อย',
          //   buttons: [
          //     {
          //       label: 'ตกลง',
          //     },
          //   ],
          // });
          confirmAlert({
            message: 'บันทึกข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(() => (window.location.href = '/plan1/'), 1000);
        })
        .catch(err => {
          if (err.response.data == 'Please Check your plan name!') {
            const validationError1 = 'ชื่อข้อมูลแผนงานซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError1: validationError1,
            });
          }
        });
    } else {
      // const validationError = this.state.PlanID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.PlanName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        // validationError: validationError,
        validationError1: validationError1,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.ID;
    if (
      // this.state.PlanID.trim() &&
      this.state.PlanName.trim()
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/dataPlans/' + ID,
          {
            // plan_id: this.state.PlanID.trim(),
            plan_name: this.state.PlanName.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.loadCommentsFromServer();
          this.setState({
            modal: false,
            // PlanID: '',
            PlanName: '',
            isForm: '',
            ID: '',
          });

          confirmAlert({
            message: 'แก้ไขข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(
            () => (window.location.href = '/plan1/' + this.state.selected),
            1000,
          );
        })
        .catch(err => {
          if (err.response.data == 'Please Check your plan name!') {
            const validationError1 = 'ชื่อข้อมูลแผนงานซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError1: validationError1,
            });
          }
        });
    } else {
      const validationError = this.state.PlanID.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.PlanName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        validationError: validationError,
        validationError1: validationError1,
      });
    }
  };
  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
    //this.getKpiType(this.props.id);
  }
  loadCommentsFromServer() {
    $.ajax({
      url:
        this.state.url +
        '?page=' +
        this.state.selected +
        '&size=' +
        this.state.perPage +
        // '&search=' +
        // this.state.keyword +
        '&year='+this.props.year+
        '&project_policy=' +
        this.props.id,
      data: {
        totalPage: this.state.perPage,
        offset: this.state.offset,
      },
      dataType: 'json',
      type: 'GET',
      success: data => {
        this.setState({
          data: data.result.result,
          pageCount: Math.ceil(
            data.result.pagination.itemTotal / this.state.perPage,
          ),
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

  projectProgressStatus = e => {
    let status;
    if (e === 0) {
      status = 'บันทึกข้อมูลโครงการ';
    }
    if (e === 1) {
      status = 'ยังไม่ดำเนินการ';
    }
    if (e === 2) {
      status = 'อยู่ระหว่างดำเนินการ';
    }
    if (e === 3) {
      status = 'ดำเนินการแล้ว';
    }
    if (e === 4) {
      status = 'ยกเลิกการดำเนินการ';
    }
    return status;
  };
  projectMoneyFormat = e => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e);
  };

  render() {
    return (
      <>
        <Row>
          <Col sm={12}></Col>
          <Col>
            {/* <Card className="mb-12">
            <CardBody> */}
            <Table responsive borderless id="table1">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  <th style={{ textAlign: 'left' }}>ชื่อโครงการ</th>
                  <th style={{ textAlign: 'center' }}>งบประมาณที่ตั้งไว้</th>
                  <th style={{ textAlign: 'center' }}>งบประมาณที่ใช้ไป</th>
                  <th style={{ textAlign: 'center' }}>สถานะโครงการ</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.length == 0 ? (
                  <tr>
                    <td colSpan="4" align="center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  this.state.data
                    .sort((a, b) => (a.project_name > b.project_name ? 1 : -1))
                    .map((id, i) => (
                      <tr key={'table' + i}>
                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                        <td style={{ textAlign: 'left' }}>{id.project_name}</td>
                        <td style={{ textAlign: 'center' }}>
                          {this.projectMoneyFormat(id.project_total_budget)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {this.projectMoneyFormat(id.project_used_budget)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {this.projectProgressStatus(id.project_status)}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </Table>

            {/* {this.state.data.length != 0 ? (
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
            )} */}

            {/* </CardBody>
          </Card> */}
          </Col>
        </Row>

        {/* <div className="floating-button">
          <Tooltip title="Add">
            <Fab
              className="btn_not_focus"
              style={{
                border: '10px solid #3f51b5',
                backgroundColor: '#fff',
                width: '70px',
                height: '70px',
              }}
              onClick={() => this.onAdd()}
              // color="primary"
            >
              <Icon color="primary">add</Icon>
            </Fab>
          </Tooltip>
        </div> */}
      </>
    );
  }
}
