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
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const token_id = localStorage.getItem('token');
export default class AddProjectKPIData extends React.Component {
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
      ID: id,
      isForm: '',
      data: [],
      data1: [], //หลอกตา
      selected: id,
      currenpage: id - 1,
      offset: 0,
      perPage: 10,
      keyword: '',
      url: process.env.REACT_APP_SOURCE_URL + '/projects/kpis/' + id,

      projectId: id,
      kpiId: '',
      kpiName: '',
      kpiUnit: '',
      kpiUnitName: '',
      kpiTarget: '',
      kpiResult: '',
      kpiStatus: '',
      unitList: [],

      validationError: '',
      validationError1: '',
      validationError2: '',
      validationError3: '',
      validationError4: '',
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
    if (id !== undefined) {
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
    } else {
      MySwal.fire({
        title: <strong>ไม่พบ Risk ID</strong>,
        html: <i>กรุณาลองใหม่อีกครั้ง</i>,
        icon: 'error',
        confirmButtonColor: '#66BB66',
        // confirmButtonText: 'ยืนยัน',
        // showCancelButton: true,
        // cancelButtonColor: '#EE4444',
        // cancelButtonText: 'ยกเลิก',
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };
  DELETE = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/projects/kpis/kpis/' + id)
      .then(res => {
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        this.loadCommentsFromServer();
        // setTimeout(() => (window.location.href = '/plan1/'), 1000);
        // this.loadCommentsFromServer();
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    // this.setState({ modal: true });
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/projects/kpis/kpis/' + id)
      .then(res => {
        const {
          project_id,
          kpi_id,
          kpi_name,
          kpi_unit,
          kpi_unit_name,
          kpi_target,
          kpi_result,
        } = res.data.result;

        this.setState({
          modal: true,
          isForm: 'edit',
          ID: project_id,
          header: 'แก้ไขข้อมูลตัวชี้วัด',
          projectId: project_id,
          kpiId: kpi_id,
          kpiName: kpi_name,
          kpiUnit: kpi_unit,
          kpiUnitName: kpi_unit_name,
          kpiTarget: kpi_target,
          kpiResult: kpi_result,

          validationError: '',
          validationError1: '',
          validationError2: '',
          validationError3: '',
          validationError4: '',
        });
      });
  };
  getDataUnits() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataUnits/list?size=100')
      .then(res => {
        this.setState({
          unitList: res.data.result,
        });
      });
  }
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onAdd() {
    this.setState({
      modal: true,
      isForm: '',
      kpiId: '',
      kpiName: '',
      kpiUnit: '',
      kpiUnitName: '',
      kpiTarget: '',
      kpiResult: '',

      validationError: '',
      validationError1: '',
      validationError2: '',
      validationError3: '',
      validationError4: '',
      header: 'เพิ่มข้อมูลตัวชี้วัด',
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.isForm === 'edit') {
      this.handleUpdate(e);
    } else {
      this.handleSubmit1(e);
    }
  };

  handleSubmit1 = e => {
    e.preventDefault();
    if (
      this.state.kpiName.trim() &&
      this.state.kpiUnit &&
      this.state.kpiTarget
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL +
            '/projects/kpis/' +
            this.state.projectId,
          {
            kpi_name: this.state.kpiName,
            kpi_unit: this.state.kpiUnit,
            kpi_unit_name: this.state.unitList.filter(
              type => type.unit_id === this.state.kpiUnit,
            )[0].unit_name,
            kpi_target: this.state.kpiTarget,
            //kpi_result: this.state.kpiResult,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          MySwal.fire({
            title: <strong>บันทึกข้อมูลสำเร็จ</strong>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          this.setState({
            modal: false,
          });
          this.loadCommentsFromServer();
          //setTimeout(() => (window.location.href = '/plan1/'), 1000);
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
      const validationError1 = this.state.kpiName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.kpiUnit
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.kpiTarget
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      // const validationError4 = this.state.kpiResult
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        validationError1: validationError1,
        validationError2: validationError2,
        validationError3: validationError3,
        // validationError4: validationError4,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.kpiId;
    if (
      this.state.kpiName.trim() &&
      this.state.kpiUnit &&
      this.state.kpiTarget
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/projects/kpis/' + ID,
          {
            kpi_name: this.state.kpiName,
            kpi_unit: this.state.kpiUnit,
            kpi_unit_name: this.state.unitList.filter(
              type => type.unit_id === this.state.kpiUnit,
            )[0].unit_name,
            kpi_target: this.state.kpiTarget,
            kpi_result: this.state.kpiResult,
            kpi_status: 1,
            //kpi_status:this.state.kpiStatus,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          //this.loadCommentsFromServer();
          MySwal.fire({
            title: <strong>แก้ไขข้อมูลสำเร็จ</strong>,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          this.setState({
            modal: false,
          });
          this.loadCommentsFromServer();
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
      const validationError1 = this.state.kpiName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.kpiUnit
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.kpiTarget
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      // const validationError4 = this.state.kpiResult
      //   ? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        validationError1: validationError1,
        validationError2: validationError2,
        validationError3: validationError3,
        // validationError4: validationError4,
      });
    }
  };
  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
    this.getDataUnits();
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
          // data: data,
          data: data.result,
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
    //this.loadCommentsFromServer();
  };
  handleInputChangeNumber = e => {
    var value = NaN;
    if (
      parseInt(e.target.value) >= 0 &&
      parseInt(e.target.value).toString() !== 'NaN'
    ) {
      if (parseInt(e.target.value) > 5) {
        if (e.target.name === 'kpiLikelihood') {
          this.setState({
            validationError2: 'กรุณากรอก 1-5',
          });
        }
        if (e.target.name === 'kpiImpact') {
          this.setState({
            validationError3: 'กรุณากรอก 1-5',
          });
        }
      } else {
        if (e.target.name === 'kpiLikelihood') {
          this.setState({
            validationError2: '',
          });
        }
        if (e.target.name === 'kpiImpact') {
          this.setState({
            validationError3: '',
          });
        }
        value = e.target.value;
      }

      this.setState({
        [e.target.name]: value.toString(),
      });
    }
  };
  render() {
    return (
      <>
        <Row>
          <Col sm={12}>
            <div className="box-9">ข้อมูลตัวชี้วัด</div>
          </Col>
          <Col>
            <Table responsive borderless id="table1">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  <th style={{ textAlign: 'left' }}>ชื่อตัวชี้วัด</th>
                  <th style={{ textAlign: 'center' }}>ค่าเป้าหมาย</th>
                  <th style={{ textAlign: 'center' }}>หน่วยนับ</th>
                  <th style={{ textAlign: 'center' }}>ผลตัวชี้วัด</th>
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
                  this.state.data.map((id, i) => (
                    <tr key={'table' + i}>
                      <td style={{ textAlign: 'center' }}>{i + 1}</td>
                      {/* <td>{id.budget_source_id}</td> */}
                      <td style={{ textAlign: 'left' }}>{id.kpi_name}</td>
                      <td style={{ textAlign: 'center' }}>{id.kpi_target}</td>
                      <td style={{ textAlign: 'center' }}>
                        {id.kpi_unit_name}
                      </td>
                      <td style={{ textAlign: 'center' }}>{id.kpi_result}</td>
                      {/* <td>{id.kpi_result}</td> */}
                      <td style={{ textAlign: 'center' }}>
                        <Tooltip title="แก้ไข">
                          <span
                            className="edit-button"
                            onClick={() => this.onEdit(id.kpi_id)}
                          >
                            <Icon style={{ fontSize: '14px' }}>edit</Icon>
                          </span>
                        </Tooltip>
                        &nbsp;
                        <Tooltip title="ลบ">
                          <span
                            className="delete-button"
                            onClick={() => this.testAxiosDELETE(id.kpi_id)}
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

            {/* {this.state.data1.length != 0 ? (
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

            <div style={{ display: 'flex', justifyContent: 'right' }}>
              <NavLink to={`/AllProject/AddProject2/${this.state.projectId}`}>
                {'ข้อมูลกิจกรรม <<'}
              </NavLink>
              <div className="box-10">{'หน้าก่อน'}</div>
              <div className="box-10">{'หน้าถัดไป'}</div>
              <NavLink to={`/AllProject/AddProject4/${this.state.projectId}`}>
                {'>> ข้อมูลความเสี่ยง'}
              </NavLink>
            </div>

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
                      ชื่อตัวชี้วัด <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="textarea"
                        name="kpiName"
                        onChange={this.handleInputChange}
                        value={this.state.kpiName}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>

                    <Label for="PlanName" sm={12}>
                      หน่วยนับ <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="select"
                        name="kpiUnit"
                        onChange={this.handleInputChange}
                        value={this.state.kpiUnit}
                      >
                        <option value={''}>กรุณาเลือก</option>
                        {this.state.unitList &&
                          this.state.unitList
                            .filter(type => parseInt(type.unit_status) === 1)
                            .map((type, no) => (
                              <option
                                value={type.unit_id}
                                key={'optionUnit' + no}
                              >
                                {type.unit_name}
                              </option>
                            ))}
                      </Input>
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError2}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ค่าเป้าหมาย
                      <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="kpiTarget"
                        onChange={this.handleInputChange}
                        value={this.state.kpiTarget}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError3}
                    </Col>
                    {/* <Label for="PlanName" sm={12}>
                      เกณฑ์การให้คะแนน :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="kpiResult"
                        onChange={this.handleInputChange}
                        value={this.state.kpiResult}
                      />
                    </Col> 
                     <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>
                    */}
                    {this.state.isForm === 'edit' ? (
                      <>
                        <Label for="PlanName" sm={12}>
                          ผลตัวชี้วัด :
                        </Label>
                        <Col sm={12}>
                          <Input
                            type="text"
                            name="kpiResult"
                            onChange={this.handleInputChange}
                            value={this.state.kpiResult}
                          />
                        </Col>
                        <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                          {this.state.validationError4}
                        </Col>
                      </>
                    ) : (
                      ''
                    )}
                  </FormGroup>
                  <FormGroup style={{ textAlign: 'center' }}>
                    <Button color="success">บันทึก</Button>&nbsp;
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
