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
import moment from 'moment';
const token_id = localStorage.getItem('token');
export default class KPIDataList extends React.Component {
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
      validationError: '',
      validationError1: '',
      PlanID: '',
      PlanName: '',
      ID: '',
      isForm: '',
      data: [],
      data1: [
        {
          code: 'KPI 1',
          type: 'ตัวชี้วัดภายใน',
          name: 'ข้อตกลงการปฏิบัติราชการ',
        },
        { code: 'KPI 2', type: 'ตัวชี้วัดภายใน', name: 'รายงานนายกประจำปี' },
        {
          code: 'KPI 3',
          type: 'ตัวชี้วัดภายใน',
          name: 'รายงานกิจการประจำปี Annual Report',
        },
        {
          code: 'KPI 4',
          type: 'ตัวชี้วัดภายนอก',
          name: 'การประเมินประสิทธิภาพของ อปท. (LPA)',
        },
        {
          code: 'KPI 5',
          type: 'ตัวชี้วัดภายนอก',
          name: 'การประเมินคุณธรรมและความโปร่งใส (ITA)',
        },
        {
          code: 'KPI 6',
          type: 'ตัวชี้วัดภายนอก',
          name: 'ประเมินการจัดบริการสาธารณะ',
        },
      ],
      selected: id,
      currenpage: id - 1,
      offset: 0,
      perPage: 10,
      keyword: '',
      url: process.env.REACT_APP_SOURCE_URL + '/dataKpiTypes/list',
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

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadCommentsFromServer().then(() => {
      this.setState({ refreshing: false });
    });
  };

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
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyword !== this.state.keyword) {
      setTimeout(() => {
        this.loadCommentsFromServer();
      }, 100);
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
        '&search=' +
        this.state.keyword,
      data: {
        totalPage: this.state.perPage,
        offset: this.state.offset,
      },
      dataType: 'json',
      type: 'GET',
      success: data => {
        this.setState({
          data: data.result,
          pageCount: Math.ceil(data.pagination.itemTotal / this.state.perPage),
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
  render() {
    return (
      <>
        <Row>
          <Col sm={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}></Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <div style={{ textAlign: 'right' }}>
                      <Input
                        type="text"
                        name="keyword"
                        placeholder={'ค้นหา'}
                        onChange={this.handleInputChange}
                        value={this.state.keyword}
                        style={{ width: '100%' }}
                      ></Input>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Col>
          <Col>
            {/* <Card className="mb-12">
            <CardBody> */}
            <Table responsive borderless id="table1">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  <th style={{ textAlign: 'center' }}>รหัสตัวชี้วัด</th>
                  <th style={{ textAlign: 'center' }}>ประเภทตัวชี้วัด</th>

                  {/* <th>BudgetSouceID</th> */}
                  <th style={{ textAlign: 'left' }}>ชื่อตัวชี้วัด</th>
                  <th style={{ textAlign: 'center' }}>จัดการข้อมูล</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.length == 0 ? (
                  <tr>
                    <td colSpan="5" align="center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  this.state.data
                    .sort((a, b) =>
                      a.kpi_type_code > b.kpi_type_code ? 1 : -1,
                    )
                    .slice(0, 2)
                    .map((id, i) =>
                      id.kpi_type_code === 'KPI1' ||
                      id.kpi_type_code === 'KPI2' ? (
                        <tr key={'table' + i}>
                          <td style={{ textAlign: 'center' }}>{i + 1}</td>
                          <td style={{ textAlign: 'center' }}>
                            {id.kpi_type_code}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {id.kpi_type_category.toString() === '1'
                              ? 'ตัวชี้วัดภายใน'
                              : 'ตัวชี้วัดภายนอก'}
                          </td>
                          {/* <td>{id.budget_source_id}</td> */}

                          <td>{id.kpi_type_name}</td>
                          <td style={{ textAlign: 'center' }}>
                            <Grid item sm={12} md={12}>
                              <NavLink
                                to={`/KPIData/KPIDataDetail/${id.kpi_type_code}/${id.kpi_type_id}/${moment().get('year')}`}
                              >
                                <Tooltip title="ดูข้อมูล">
                                  <span className="view-button">
                                    <Icon style={{ fontSize: '14px' }}>
                                      grid_view
                                    </Icon>
                                  </span>
                                </Tooltip>
                              </NavLink>
                            </Grid>
                            {/* </div> */}
                          </td>
                        </tr>
                      ) : (
                        ''
                      ),
                    )
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

            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle()}
              className={this.props.className}
            >
              <ModalHeader
                toggle={this.toggle()}
                style={{
                  backgroundColor: '#e0ecfa',
                  borderTopLeftRadius: '1.5rem',
                  borderTopRightRadius: '1.5rem',
                }}
              >
                {this.state.header}
              </ModalHeader>
              <ModalBody
                style={{
                  borderRadius: '1.5rem',
                }}
              >
                <Form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Label for="PlanName" sm={12}>
                      ชื่อข้อมูล <font color="red">*</font>
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="ministry"
                        placeholder="ชื่อข้อมูล"
                        // onChange={this.handleInputChange}
                        // value={this.state.PlanName}
                        //
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>
                  </FormGroup>
                  <FormGroup style={{ textAlign: 'center' }}>
                    <Button color="success">บันทึก</Button>&nbsp;
                    <Button color="danger" onClick={this.toggle()}>
                      ยกเลิก
                    </Button>
                  </FormGroup>
                </Form>
              </ModalBody>
            </Modal>
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
             
            >
              <Icon color="primary">add</Icon>
            </Fab>
          </Tooltip>
        </div> */}
      </>
    );
  }
}
