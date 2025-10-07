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
import { Chip, Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const token_id = localStorage.getItem('token');

const monthList = [
  { no: 0, name: 'เดือนมกราคม', nameshort: 'ม.ค.' },
  { no: 1, name: 'เดือนกุมภาพันธ์', nameshort: 'ก.พ.' },
  { no: 2, name: 'เดือนมีนาคม', nameshort: 'มี.ค.' },
  { no: 3, name: 'เดือนเมษายน', nameshort: 'เม.ย.' },
  { no: 4, name: 'เดือนพฤษภาคม', nameshort: 'พ.ค.' },
  { no: 5, name: 'เดือนมิถุนายน', nameshort: 'มิ.ย.' },
  { no: 6, name: 'เดือนกรกฎาคม', nameshort: 'ก.ค.' },
  { no: 7, name: 'เดือนสิงหาคม', nameshort: 'ส.ค.' },
  { no: 8, name: 'เดือนกันยายน', nameshort: 'ก.ย.' },
  { no: 9, name: 'เดือนตุลาคม', nameshort: 'ต.ค.' },
  { no: 10, name: 'เดือนพฤษจิกายน', nameshort: 'พ.ย.' },
  { no: 11, name: 'เดือนธันวาคม', nameshort: 'ธ.ค.' },
];

function Risk({ value }) {
  let color;
  let text;
  if (value <= 5) {
    color = '#99CC66';
    text = 'ต่ำ';
  } else if (value <= 9) {
    color = '#FFEE66';
    text = 'ปานกลาง';
  } else if (value <= 15) {
    color = '#FFCC66';
    text = 'สูง';
  } else if (value <= 25) {
    color = '#EE4444';
    text = 'สูงมาก';
  }

  return (
    <>
      <Chip
        style={{ backgroundColor: color, fontWeight: '600' }}
        label={text}
      />
    </>
  );
}
export default class AddProjectRiskData extends React.Component {
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
      url: process.env.REACT_APP_SOURCE_URL + '/projects/risks/' + id,

      projectId: id,
      riskId: '',
      riskDetail: '',
      riskLikelihood: '',
      riskImpact: '',
      riskReduction: '',
      riskStatus: '',

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
      .delete(process.env.REACT_APP_SOURCE_URL + '/projects/risks/risks/' + id)
      .then(res => {
        MySwal.fire({
          title: <strong>ลบข้อมูลสำเร็จ</strong>,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        this.loadCommentsFromServer();
      })
      .catch(err => {
        console.log(err);
      });
  };
  onEdit = id => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/projects/risks/risks/' + id)
      .then(res => {
        const {
          project_id,
          risk_id,
          risk_detail,
          risk_likelihood,
          risk_impact,
          risk_reduction,
        } = res.data.result;

        this.setState({
          modal: true,
          isForm: 'edit',
          ID: project_id,
          header: 'แก้ไขข้อมูลความเสี่ยง',
          projectId: project_id,
          riskId: risk_id,
          riskDetail: risk_detail,
          riskLikelihood: risk_likelihood,
          riskImpact: risk_impact,
          riskReduction: risk_reduction,

          validationError: '',
          validationError1: '',
          validationError2: '',

          validationError3: '',
          validationError4: '',
        });
      });
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onAdd() {
    this.setState({
      modal: true,
      isForm: '',
      riskId: '',
      riskDetail: '',
      riskLikelihood: '',
      riskImpact: '',
      riskReduction: '',

      validationError: '',
      validationError1: '',
      validationError2: '',
      validationError3: '',
      validationError4: '',
      header: 'เพิ่มข้อมูลความเสี่ยง',
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
      this.state.riskDetail.trim() &&
      this.state.riskLikelihood &&
      this.state.riskImpact &&
      this.state.riskReduction
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL +
            '/projects/risks/' +
            this.state.projectId,
          {
            risk_detail: this.state.riskDetail,
            risk_likelihood: this.state.riskLikelihood,
            risk_impact: this.state.riskImpact,
            risk_reduction: this.state.riskReduction,
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
      const validationError1 = this.state.riskDetail.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.riskLikelihood
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.riskImpact
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      const validationError4 = this.state.riskReduction
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        validationError1: validationError1,
        validationError2: validationError2,
        validationError3: validationError3,
        validationError4: validationError4,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.riskId;
    if (
      this.state.riskDetail.trim() &&
      this.state.riskLikelihood &&
      this.state.riskImpact &&
      this.state.riskReduction
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/projects/risks/' + ID,
          {
            risk_detail: this.state.riskDetail,
            risk_likelihood: this.state.riskLikelihood,
            risk_impact: this.state.riskImpact,
            risk_reduction: this.state.riskReduction,
            risk_status: 1,
            //risk_status:this.state.riskStatus,
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
      const validationError1 = this.state.riskDetail.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.riskLikelihood
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.riskImpact
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      const validationError4 = this.state.riskReduction
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      this.setState({
        validationError1: validationError1,
        validationError2: validationError2,
        validationError3: validationError3,
        validationError4: validationError4,
      });
    }
  };
  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
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
        if (e.target.name === 'riskLikelihood') {
          this.setState({
            validationError2: 'กรุณากรอก 1-5',
          });
        }
        if (e.target.name === 'riskImpact') {
          this.setState({
            validationError3: 'กรุณากรอก 1-5',
          });
        }
      } else {
        if (e.target.name === 'riskLikelihood') {
          this.setState({
            validationError2: '',
          });
        }
        if (e.target.name === 'riskImpact') {
          this.setState({
            validationError3: '',
          });
        }
        value = e.target.value;
      }
    }
    this.setState({
      [e.target.name]: value.toString(),
    });
  };
  hoverTable = id => {
    //return (document.getElementById(id).className = '');
    document.getElementById(id).classList.add('hover-tb');
    //document.getElementById(id).classList.remove('hightlight');
  };
  outHoverTable = id => {
    document.getElementById(id).classList.remove('hover-tb');
  };
  showRisk = id => {
    for (let index = 1; index <= 5; index++) {
      for (let index1 = 1; index1 <= 5; index1++) {
        if (index.toString() + index1.toString() !== id) {
          document
            .getElementById(index.toString() + index1.toString())
            .classList.add('hightlight');
        }
      }
    }
  };
  hideRisk = id => {
    for (let index = 1; index <= 5; index++) {
      for (let index1 = 1; index1 <= 5; index1++) {
        if (index.toString() + index1.toString() !== id) {
          document
            .getElementById(index.toString() + index1.toString())
            .classList.remove('hightlight');
        }
      }
    }
  };

  render() {
    return (
      <>
        <Row>
          <Col sm={12}>
            <div className="box-9">ตารางความเสี่ยง</div>
          </Col>
          <Col>
            <table className="tg">
              <thead>
                <tr>
                  <th className="tg-ymo1" rowSpan="2">
                    ผลกระทบ
                  </th>
                  <th className="tg-as3b" colSpan="5">
                    โอกาสเกิด
                  </th>
                </tr>
                <tr>
                  <th className="tg-aw58">ระดับ 1</th>
                  <th className="tg-1e0e">
                    <span>ระดับ 2</span>
                  </th>
                  <th className="tg-4mqo">
                    <span>ระดับ 3</span>
                  </th>
                  <th className="tg-h7u1">
                    <span>ระดับ 4</span>
                  </th>
                  <th className="tg-0uq8">
                    <span>ระดับ 5</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tg-ymo1">
                    <span>ระดับ 5</span>
                  </td>
                  <td id="15" className="tg-7o62">
                    <span>ต่ำ</span>
                  </td>
                  <td id="25" className="tg-jp6u">
                    <span>สูง</span>
                  </td>
                  <td id="35" className="tg-jp6u">
                    <span>สูง</span>
                  </td>
                  <td id="45" className="tg-cvi2">
                    <span>สูงมาก</span>
                  </td>
                  <td id="55" className="tg-cvi2">
                    <span>สูงมาก</span>
                  </td>
                </tr>
                <tr>
                  <td className="tg-ymo1">
                    <span>ระดับ 4</span>
                  </td>
                  <td id="14" className="tg-7o62">
                    <span>ต่ำ</span>
                  </td>
                  <td id="24" className="tg-arcq">
                    <span>ปานกลาง</span>
                  </td>
                  <td id="34" className="tg-jp6u">
                    <span>สูง</span>
                  </td>
                  <td id="44" className="tg-cvi2">
                    <span>สูงมาก</span>
                  </td>
                  <td id="54" className="tg-cvi2">
                    <span>สูงมาก</span>
                  </td>
                </tr>
                <tr>
                  <td className="tg-ymo1">
                    <span>ระดับ 3</span>
                  </td>
                  <td id="13" className="tg-7o62">
                    ต่ำ
                  </td>
                  <td id="23" className="tg-arcq">
                    <span>ปานกลาง</span>
                  </td>
                  <td id="33" className="tg-arcq">
                    <span>ปานกลาง</span>
                  </td>
                  <td id="43" className="tg-jp6u">
                    <span>สูง</span>
                  </td>
                  <td id="53" className="tg-jp6u">
                    <span>สูง</span>
                  </td>
                </tr>
                <tr>
                  <td className="tg-ymo1">
                    <span>ระดับ 2</span>
                  </td>
                  <td id="12" className="tg-7o62">
                    <span>ต่ำ</span>
                  </td>
                  <td id="22" className="tg-7o62">
                    <span>ต่ำ</span>
                  </td>
                  <td id="32" className="tg-arcq">
                    <span>ปานกลาง</span>
                  </td>
                  <td id="42" className="tg-arcq">
                    <span>ปานกลาง</span>
                  </td>
                  <td id="52" className="tg-jp6u">
                    <span>สูง</span>
                  </td>
                </tr>
                <tr>
                  <td className="tg-ymo1">
                    <span>ระดับ 1</span>
                  </td>
                  <td id="11" className="tg-7o62">
                    <span>ต่ำ</span>
                  </td>
                  <td id="21" className="tg-7o62">
                    <span>ต่ำ</span>
                  </td>
                  <td id="31" className="tg-7o62">
                    <span>ต่ำ</span>
                  </td>
                  <td id="41" className="tg-7o62">
                    <span>ต่ำ</span>
                  </td>
                  <td id="51" className="tg-7o62">
                    <span>ต่ำ</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col sm={12}>
            <div className="box-9">ข้อมูลความเสี่ยง</div>
          </Col>
          <Col>
            {/* <Card className="mb-12">
            <CardBody> */}

            <Table responsive borderless id="table1">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  <th style={{ textAlign: 'left' }}>ประเด็นความเสี่ยง</th>
                  <th style={{ textAlign: 'center' }}>โอกาสเกิด</th>
                  <th style={{ textAlign: 'center' }}>ผลกระทบ</th>
                  <th style={{ textAlign: 'center' }}>ระดับความเสี่ยง</th>
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
                    <tr
                      id={'tr' + i}
                      key={'table' + i}
                      onMouseOver={() => {
                        this.showRisk(
                          id.risk_likelihood.toString() +
                            id.risk_impact.toString(),
                        );
                        this.hoverTable('tr' + i);
                      }}
                      onMouseOut={() => {
                        this.hideRisk(
                          id.risk_likelihood.toString() +
                            id.risk_impact.toString(),
                        );
                        this.outHoverTable('tr' + i);
                      }}
                    >
                      <td style={{ textAlign: 'center' }}>{i + 1}</td>
                      {/* <td>{id.budget_source_id}</td> */}
                      <td style={{ textAlign: 'left' }}>{id.risk_detail}</td>
                      <td style={{ textAlign: 'center' }}>
                        {id.risk_likelihood}
                      </td>
                      <td style={{ textAlign: 'center' }}>{id.risk_impact}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Risk value={id.risk_likelihood * id.risk_impact} />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Tooltip title="แก้ไข">
                          <span
                            className="edit-button"
                            onClick={() => this.onEdit(id.risk_id)}
                          >
                            <Icon style={{ fontSize: '14px' }}>edit</Icon>
                          </span>
                        </Tooltip>
                        &nbsp;
                        <Tooltip title="ลบ">
                          <span
                            className="delete-button"
                            onClick={() => this.testAxiosDELETE(id.risk_id)}
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
            {/* 
            {this.state.data1.length != 0 ? (
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
              <NavLink to={`/AllProject/AddProject3/${this.state.projectId}`}>
                {'ข้อมูลตัวชี้วัด <<'}
              </NavLink>
              <div className="box-10">{'หน้าก่อน'}</div>
              {/* <div className="box-10">{'หน้าถัดไป'}</div>
              <NavLink to="/AllProject/AddProject4">
                {'>> ข้อมูลความเสี่ยง'}
              </NavLink> */}
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
                      ประเด็นความเสี่ยง <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="textarea"
                        name="riskDetail"
                        onChange={this.handleInputChange}
                        value={this.state.riskDetail}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      โอกาสเกิด <font color="red"> * ( 1 - 5 ) </font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="number"
                        name="riskLikelihood"
                        max={5}
                        min={0}
                        onChange={this.handleInputChangeNumber}
                        value={this.state.riskLikelihood}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError2}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      ผลกระทบ <font color="red"> * ( 1 - 5 ) </font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="number"
                        name="riskImpact"
                        max={5}
                        min={0}
                        onChange={this.handleInputChangeNumber}
                        value={this.state.riskImpact}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError3}
                    </Col>
                    <Label for="PlanName" sm={12}>
                      แนวทางการลดความเสี่ยง <font color="red">*</font> :
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="textarea"
                        name="riskReduction"
                        onChange={this.handleInputChange}
                        value={this.state.riskReduction}
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError4}
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
