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
import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const token_id = localStorage.getItem('token');
export default class DepartmentsList extends React.Component {
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
      validationError2: '',
      line_token:'',
      ID: '',
      isForm: '',
      data: [],
      selected: id,
      currenpage: id - 1,
      offset: 0,
      perPage: 10,
      keyword: '',
      dataName: '',
      dataDetail: '',
      dataType: '2',
      status: 1,
      url: process.env.REACT_APP_SOURCE_URL + '/dataDepartments/list',
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
    MySwal.fire({
      title: <strong>คุณต้องการจะลบข้อมูลนี้</strong>,
      // html: <i>You clicked the button!</i>,
      icon: 'warning',
      confirmButtonColor: '#66BB66',
      confirmButtonText: 'ยืนยัน',
      showCancelButton: true,
      cancelButtonColor: '#EE4444',
      cancelButtonText: 'ยกเลิก',
    }).then(result => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // MySwal.fire({ title: <strong>ok</strong> });
        this.DELETE(id);
      }
    });
    //   confirmAlert({
    //     //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
    //     message: 'คุณต้องการจะลบข้อมูลนี้',
    //     buttons: [
    //       {
    //         label: 'ยืนยัน',
    //         onClick: () => this.DELETE(id),
    //       },
    //       {
    //         label: 'ยกเลิก',
    //       },
    //     ],
    //   });
    // };
    // render() {
    //   return (
    //     <div className="container">
    //       <button onClick={this.submit}>Confirm dialog</button>
    //     </div>
    // );
  };
  DELETE = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataDepartments/' + id)
      .then(res => {
        // confirmAlert({
        //   message: 'ลบข้อมูลสำเร็จ',
        //   buttons: [],
        // });
        // setTimeout(
        //   () => (window.location.href = '/MinistryData/MinistryLand'),
        //   1000,
        // );
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        this.loadCommentsFromServer();
        // this.loadCommentsFromServer();
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    // this.setState({ modal: true });
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataDepartments/' + id)
      .then(res => {
        // const ButgetSource1 = res.data;
        // this.setState({ ButgetSource1 });
        const {
          department_id,
          department_name,
          department_detail,
          line_token,
          // development_goal_start,
          // development_goal_finish,
          department_status,
        } = res.data;
        // .map(id => ({'PlanID':
        //   id.main_department_id, 'PlanName':id.main_department_name
        // }));
        this.setState({
          // PlanID: department_id,
          // PlanName: department_name,          
          modal: true,
          ID: department_id,
          isForm: 'edit',
          dataName: department_name,
          line_token,
          // dataDetail: department_detail,
          // startYear: development_goal_start,
          // endYear: development_goal_finish,
          status: department_status,
          validationError: '',
          validationError1: '',
          validationError2: '',
          header: 'แก้ไข' + this.props.title,
        });
      });
  };
  handleInputChange = e => {
    const {name,value} = e.target
    if(name=="Department"){
      this.setState({
      validationError1: '',
      })
    }else if(name=="line_token"){
      this.setState({
        validationError2: '',
        })
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onAdd() {
    this.setState({
      dataName: '',
      dataDetail: '',
      status: 1,
      modal: true,
      isForm: '',
      line_token:'',
      validationError: '',
      validationError1: '',
      validationError2: '',
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
    if (
      this.state.dataName.trim()
      // this.state.startYear &&
      // this.state.endYear
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/dataDepartments',
          {
            // department_id: this.state.PlanID.trim(),
            // department_name: this.state.PlanName.trim(),
            department_name: this.state.dataName.trim(),
            line_token:this.state.line_token.trim(),
            // department_detail: this.state.dataDetail,
            // department_type: this.state.dataType,
            // development_goal_start: this.state.startYear,
            // development_goal_finish: this.state.endYear,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.setState({
            modal: false,
            dataName: '',
            dataDetail: '',
            line_token:'',
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
          // confirmAlert({
          //   message: 'บันทึกข้อมูลสำเร็จ',
          //   buttons: [],
          // });
          MySwal.fire({
            title: <strong>บันทึกข้อมูลสำเร็จ</strong>,
            // html: <i>You clicked the button!</i>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          this.loadCommentsFromServer();
          // setTimeout(
          //   () => (window.location.href = '/MinistryData/MinistryLand'),
          //   1000,
          // );
        })
        .catch(err => {
          if (
            err.response.data === 'This department_name already exists!' ||
            'This plan_name already exists!'
          ) {
            const validationError1 = 'ชื่อข้อมูลซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError1: validationError1,
            });
          }
        });
    } else {
      // const validationError = this.state.PlanID.trim()
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.dataName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      // const validationError3 = this.state.endYear
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        // validationError: validationError,
        validationError1: validationError1,
        // validationError2: validationError2,
        // validationError3: validationError3,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.ID;
    if (
      ID &&
      this.state.dataName.trim() &&
      this.state.status
      // this.state.startYear &&
      // this.state.endYear
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/dataDepartments/' + ID,
          {
            // department_id: this.state.PlanID.trim(),
            // department_name: this.state.PlanName.trim(),
            department_name: this.state.dataName.trim(),
            line_token:this.state.line_token.trim(),
            // department_detail: this.state.dataDetail,
            // department_type: this.state.dataType,
            department_status: this.state.status,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          if (res.data.message === 'Updated!') {
            this.loadCommentsFromServer();
            this.setState({
              modal: false,
              isForm: '',
              ID: '',
              dataName: '',
              dataDetail: '',
              line_token:'',
              line:'',
              status: 1,
            });
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลสำเร็จ</strong>,
              // html: <i>You clicked the button!</i>,
              icon: 'success',
              timer: 1000,
              showConfirmButton: false,
            });
          }
        })
        .catch(err => {
          if (err.response.data === 'This department_name already exists!') {
            const validationError1 = 'ชื่อข้อมูลซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError1: validationError1,
            });
          }
        });
    } else {
      const validationError = this.state.ID
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError1 = this.state.dataName
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      // const validationError2 = this.state.line_token
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      // const validationError3 = this.state.endYear
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        validationError: validationError,
        validationError1: validationError1,
        // validationError2: validationError2,
        // validationError3: validationError3,
      });
    }
  };
  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyword !== this.state.keyword) {
      // console.log('keyword state has changed.');
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
        // '&department_type=' +
        // this.state.dataType,
        '&search=' +
        this.state.keyword,
      data: {
        totalPage: this.state.perPage,
        offset: this.state.offset,
      },
      dataType: 'json',
      type: 'GET',
      success: data => {
        if (data.result.length === 0 && this.state.selected !== 0) {
          this.handlePageClick({ selected: this.state.selected - 2 });
        } else {
          if (this.state.selected === 0) {
            this.setState({
              selected: 1,
            });
          }
          this.setState({
            data: data.result,
            pageCount: Math.ceil(
              data.pagination.itemTotal / this.state.perPage,
            ),
          });
        }
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
  // handleInputChange = e => {
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   });
  //   this.loadCommentsFromServer();
  // };
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
                  <th style={{ textAlign: 'center' }}>ชื่อข้อมูล</th>
                  <th>LineToken</th>
                  {/* <th style={{ textAlign: 'center' }}>ปีเริ่มต้น</th>
                  <th style={{ textAlign: 'center' }}>ปีสิ้นสุด</th> */}
                  <th style={{ textAlign: 'center' }}>จัดการข้อมูล</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.length == 0 ? (
                  <tr>
                    <td colSpan="3" align="center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  this.state.data
                    //.filter(item => item.department_type === this.state.dataType)
                    .map((id, i) => (
                      <tr key={'table' + i}>
                        <td style={{ textAlign: 'center' }}>
                          {(parseInt(this.state.selected) - 1) * 10 + (i + 1)}
                        </td>
                        {/* <td>{id.budget_source_id}</td> */}
                        <td>{id.department_name}</td>
                        <td>{id.line_token}</td>
                        <td style={{ textAlign: 'center' }}>
                          <Tooltip title="แก้ไข">
                            <span
                              className="edit-button"
                              onClick={() => this.onEdit(id.department_id)}
                            >
                              <Icon style={{ fontSize: '14px' }}>edit</Icon>
                            </span>
                          </Tooltip>
                          &nbsp;
                          <Tooltip title="ลบ">
                            <span
                              className="delete-button"
                              onClick={() =>
                                this.testAxiosDELETE(id.department_id)
                              }
                            >
                              <Icon style={{ fontSize: '14px' }}>
                                delete_outline
                              </Icon>
                            </span>
                          </Tooltip>
                          {/* </div> */}
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
                  {/* <Input
                  type="hidden"
                  name="ID"
                  onChange={this.handleInputChange}
                  value={this.state.ID}
                /> */}

                  <FormGroup>
                    <Label for="dataName" sm={12}>
                      ชื่อข้อมูล <font color="red">*</font>
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="dataName"
                        placeholder="ชื่อข้อมูล"
                        value={this.state.dataName}
                        onChange={this.handleInputChange}
                        // value={this.state.PlanName}
                        //
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>
                  </FormGroup>
                  <FormGroup>
                        <Label for="PlanName" sm={12}>
                          LineToken
                        </Label>
                        <Col sm={12}>
                          <Input
                            type="text"
                            name="line_token"
                            // placeholder="line_token"
                            value={this.state.line_token}
                            onChange={this.handleInputChange}
                          />
                        </Col>
                        <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                          {this.state.validationError2}
                        </Col>
                      </FormGroup>
                  {this.state.isForm === 'edit' ? (
                    <Row>
                      <Col sm={6}>
                        <FormGroup>
                          <Label for="PlanName" sm={12}>
                            สถานะ <font color="red">*</font>
                          </Label>
                          <Col sm={12}>
                            <Input
                              type="select"
                              name="status"
                              value={this.state.status}
                              onChange={this.handleInputChange}
                              // value={this.state.PlanName}
                              //
                            >
                              <option value={1}>เปิด</option>
                              <option value={2}>ปิด</option>
                            </Input>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}
                  <FormGroup style={{ textAlign: 'center' }}>
                    <Button color="success">บันทึก</Button>
                    &nbsp;
                    <Button color="danger" onClick={this.toggle()}>
                      ยกเลิก
                    </Button>
                  </FormGroup>
                </Form>
              </ModalBody>
              {/* <ModalFooter /> */}
            </Modal>
            {/* </CardBody>
          </Card> */}
          </Col>
        </Row>
        <div className="floating-button">
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
        </div>
      </>
    );
  }
}
