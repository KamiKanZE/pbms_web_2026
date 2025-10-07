import Page from 'components/Page';
import axios from 'axios';
import React from 'react';
import DatePicker from 'react-datepicker';
import { Fab, FormControlLabel, Checkbox } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-datepicker/dist/react-datepicker.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import { confirmAlert } from 'react-confirm-alert';
import { red } from '@material-ui/core/colors';
import ReactPaginate from 'react-paginate';
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
  DropdownMenu,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  Label,
  FormText,
} from 'reactstrap';
// import { Link } from '@material-ui/core';
import $ from 'jquery';
import { Link } from 'react-router-dom';
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
      {/* {dataprogress}% */}
    </Progress>
  );
}
const token_id = localStorage.getItem('token');
export default class KPI_1List extends React.Component {
  constructor(props) {
    super(props);
    let id1;
    {
      this.props.page == ':id' ||
      this.props.page == '' ||
      this.props.page == undefined
        ? (id1 = 1)
        : (id1 = this.props.page);
    }
    this.state = {
      UnitOptions: [],
      selectedUnitOptions: [],
      kpiTypeOptions: [],
      selectedkpiTypeOptions: [],
      ProjectResponsePersonOptions: [],
      selectedProjectResponsePersonOptions: [],
      monthOptions: [
        {
          id: 1,
          label: 'มกราคม',
        },
        {
          id: 2,
          label: 'กุมภาพันธ์',
        },
        {
          id: 3,
          label: 'มีนาคม',
        },
        {
          id: 4,
          label: 'เมษายน',
        },
        {
          id: 5,
          label: 'พฤษภาคม',
        },
        {
          id: 6,
          label: 'มิถุนายน',
        },
        {
          id: 7,
          label: 'กรกฏาคม',
        },
        {
          id: 8,
          label: 'สิงหาคม',
        },
        {
          id: 9,
          label: 'กันยายน',
        },
        {
          id: 10,
          label: 'ตุลาคม',
        },
        {
          id: 11,
          label: 'พฤศจิกายน',
        },
        {
          id: 12,
          label: 'ธันวาคม',
        },
      ],
      selectedmonthOptions: [],
      modal: false,
      kpiTypeError: '',
      kpiCodeError: '',
      kpiNameError: '',
      unitError: '',
      month_reportError: '',
      kpi_planError: '',
      kpi_type_id: '',
      kpi_type_name: '',
      kpi_code: '',
      kpi_name: '',
      kpi_unit_id: '',
      kpi_unit_name: '',
      month_report: [],
      response_department: '',
      response_department_Error: '',
      kpi_plan: '',
      list: [],
      isForm: '',
      kpi_id: '',
      currenpage: id1 - 1,
      selected: id1,
      offset: 0,
      perPage: 10,
      error: '',
      keyword: '',
    };
  }
  validate = () => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let emptyText = 'กรุณากรอกข้อมูลให้ครบถ้วน';
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      kpiTypeError: '',
      kpiCodeError: '',
      kpiNameError: '',
      unitError: '',
      month_reportError: '',
      response_person_nameError: '',
      kpi_planError: '',
    };

    if (
      this.state.kpi_type_id.length <= 0 &&
      this.state.kpi_type_name.length <= 0
    ) {
      isError = true;
      errors.kpiTypeError = emptyText;
    }

    if (this.state.kpi_code.length <= 0) {
      isError = true;
      errors.kpiCodeError = emptyText;
    }

    if (this.state.kpi_name.length <= 0) {
      isError = true;
      errors.kpiNameError = emptyText;
    }

    if (
      this.state.kpi_unit_id.length <= 0 &&
      this.state.kpi_unit_name.length <= 0
    ) {
      isError = true;
      errors.unitError = emptyText;
    }

    if (this.state.month_report.length <= 0) {
      isError = true;
      errors.month_reportError = emptyText;
    }

    if (this.state.response_department.length <= 0) {
      isError = true;
      errors.response_department_Error = emptyText;
    }

    if (String(this.state.kpi_plan).length <= 0) {
      isError = true;
      errors.kpi_planError = emptyText;
    } else if (!String(this.state.kpi_plan).match(regexp)) {
      isError = true;
      errors.kpi_planError = numberText;
    }
    if (this.state.kpi_unit_name == 'ร้อยละ') {
      if (this.state.kpi_plan > 100) {
        isError = true;
        errors.kpi_planError = 'ค่าเป้าหมายห้ามเกิน 100';
        // error:true
      }
    }
    this.setState({
      ...this.state,
      ...errors,
    });

    return isError;
  };

  fetchData() {
    // axios
    //   .get(process.env.REACT_APP_SOURCE_URL + '/kpis?page=0&size=0')
    //   .then(res => {
    //     this.setState({ list: res.data.result });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    $.ajax({
      url:
        process.env.REACT_APP_SOURCE_URL +
        '/kpis?page=' +
        this.state.selected +
        '&size=' +
        this.state.perPage +
        '&search=' +
        this.state.keyword,
      data: { totalPage: this.state.perPage, offset: this.state.offset },
      dataType: 'json',
      type: 'GET',
      success: data => {
        this.setState({
          list: data.result,
          pageCount: Math.ceil(data.pagination.itemTotal / this.state.perPage),
        });
      },

      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString()); // eslint-disable-line
      },
    });
  }

  fetchUnitOptions() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataUnits/list?page=0&size=0')
      .then(ress => {
        const UnitOptions = ress.data.result.map(id => {
          return { id: id._id, label: id.unit_name };
        });
        this.setState(prevState => ({
          UnitOptions: prevState.UnitOptions.concat(UnitOptions),
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchkpiTypeOptions() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL + '/dataKpiTypes/list?page=0&size=0',
      )
      .then(ress => {
        const kpiTypeOptions = ress.data.result.map(id => {
          return { id: id._id, label: id.kpi_type_name };
        });
        this.setState(prevState => ({
          kpiTypeOptions: prevState.kpiTypeOptions.concat(kpiTypeOptions),
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchProjectResponsePersonOptions() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataDepartments/list?page=0&size=0',
      )
      .then(ress => {
        const ProjectResponsePersonOptions = ress.data.result.map(id => {
          return {
            department_id: id.department_id,
            department_name: id.department_name,
          };
        });
        this.setState(prevState => ({
          ProjectResponsePersonOptions:
            prevState.ProjectResponsePersonOptions.concat(
              ProjectResponsePersonOptions,
            ),
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        selectedmonthOptions: [],
        kpi_code: '',
        kpi_name: '',
        kpi_type_id: '',
        kpi_type_name: '',
        month_report: [],
        kpi_plan: '',
        kpi_unit_id: '',
        kpi_unit_name: '',
        selectedProjectResponsePersonOptions: [],
        selectedUnitOptions: [],
        selectedkpiTypeOptions: [],
        response_department: [],
        department_checked: '',
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
  componentDidMount() {
    this.fetchData();
    this.fetchUnitOptions();
    this.fetchkpiTypeOptions();
    this.fetchProjectResponsePersonOptions();
  }

  handleInputChange = e => {
    if (e.target.name == 'kpi_plan') {
      if (this.state.kpi_unit_name == 'ร้อยละ') {
        if (e.target.value > 100) {
          this.setState({
            kpi_planError: 'ค่าเป้าหมายห้ามเกิน 100',
            error: true,
            [e.target.name]: '',
          });
        } else {
          this.setState({
            kpi_planError: '',
            error: '',
            [e.target.name]: e.target.value,
          });
        }
      } else {
        this.setState({
          [e.target.name]: e.target.value,
          error: '',
        });
      }
      // if(this.state.UnitOptions==)
    } else {
      this.setState({
        [e.target.name]: e.target.value,
        error: '',
      });
    }
  };

  handleMultiSelectChange(e) {
    const selected = e.map(data => {
      return data.id;
    });
    this.setState({ month_report: [] });
    this.setState(prevState => ({
      month_report: prevState.month_report.concat(selected),
    }));
  }

  handleDepartSelectChange(e) {
    const selected = e.map(data => {
      return {
        department_id: data.department_id,
        department_name: data.department_name,
      };
    });
    this.setState({ response_department: [] });
    this.setState(prevState => ({
      response_department: prevState.response_department.concat(selected),
    }));
  }

  handleSelectChange(id, name, e) {
    // this.props.onChange({ [e.target.name]: e.target.value });
    if (e[0]) {
      this.setState({
        [id]: e[0].id,
        [name]: e[0].label,
      });
    } else {
      this.setState({
        [id]: '',
        [name]: '',
      });
    }
  }

  handleDepatmentChange(e) {
    if (e.target.checked == true) {
      this.setState({
        response_department: [
          { department_id: 1, department_name: 'หน่วยงานทั้งหมด' },
        ],
        department_checked: 1,
      });
      this.ProjectOwner.getInstance().clear();
    } else {
      this.setState({
        response_department: [],
        department_checked: '',
      });
    }
  }

  onEdit = id => {
    // this.setState({ modal: true });
    axios.get(process.env.REACT_APP_SOURCE_URL + '/kpis/' + id).then(res => {
      const {
        _id,
        kpi_code,
        kpi_name,
        kpi_type_id,
        kpi_type_name,
        month_report,
        kpi_plan,
        kpi_unit_id,
        kpi_unit_name,
        response_department,
      } = res.data;
      let result = [];
      for (let i = 0; i < month_report.length; i++) {
        result = this.state.monthOptions.filter(member => {
          return member.id == month_report[i];
        });
        this.setState(prevState => ({
          selectedmonthOptions: prevState.selectedmonthOptions.concat(result),
        }));
      }

      this.setState({
        kpi_code: kpi_code,
        kpi_name: kpi_name,
        kpi_type_id: kpi_type_id,
        kpi_type_name: kpi_type_name,
        month_report: month_report,
        kpi_plan: kpi_plan,
        kpi_unit_id: kpi_unit_id,
        kpi_unit_name: kpi_unit_name,
        response_department: response_department,
        department_checked: response_department[0].department_id == 1 ? 1 : 0,
        modal: true,
        kpi_id: _id,
        isForm: 'edit',
        selectedkpiTypeOptions: [{ id: kpi_type_id, label: kpi_type_name }],
        selectedUnitOptions: [{ id: kpi_unit_id, label: kpi_unit_name }],
      });
    });
  };

  onAdd() {
    this.setState({ modal: true, isForm: '' });
  }
  handleSubmit = e => {
    e.preventDefault();
    const err = this.validate();
    if (!err) {
      if (this.state.isForm == 'edit') {
        this.Update(e);
      } else {
        this.Insert(e);
      }
    }
  };

  Insert = e => {
    e.preventDefault();
    axios
      .post(
        process.env.REACT_APP_SOURCE_URL + '/kpis/',
        {
          kpi_code: this.state.kpi_code.trim(),
          kpi_name: this.state.kpi_name.trim(),
          kpi_type_id: this.state.kpi_type_id,
          kpi_type_name: this.state.kpi_type_name,
          month_report: this.state.month_report,
          kpi_plan: String(this.state.kpi_plan).trim(),
          kpi_unit_id: this.state.kpi_unit_id.trim(),
          kpi_unit_name: this.state.kpi_unit_name.trim(),
          response_department: this.state.response_department,
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        // confirmAlert({
        //   //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
        //   message: 'บันทึกข้อมูลสำเร็จ',
        //   buttons: [
        //     {
        //       label: 'ยืนยัน',
        //       onClick: () => this.fetchData(),
        //     },
        //   ],
        // });
        confirmAlert({
          message: 'บันทึกข้อมูลสำเร็จ',
          buttons: [],
        });
        setTimeout(() => (window.location.href = '/kpi1/'), 1000);
        this.setState({
          modal: false,
          kpi_code: '',
          kpi_name: '',
          kpi_type_id: '',
          kpi_type_name: '',
          month_report: [],
          kpi_plan: '',
          kpi_unit_id: '',
          kpi_unit_name: '',
          response_department: '',
          selectedmonthOptions: [],
        });
      })
      .catch(err => {
        if (err.response.data == 'Please Check your kpi code!') {
          const kpiCodeError = 'รหัสตัวชี้วัดซ้ำ';
          this.setState({
            kpiCodeError: kpiCodeError,
          });
        }
      });
  };

  Update = e => {
    e.preventDefault();
    const ID = this.state.ID;
    axios
      .patch(
        process.env.REACT_APP_SOURCE_URL + '/kpis/' + this.state.kpi_id,
        {
          kpi_code: this.state.kpi_code.trim(),
          kpi_name: this.state.kpi_name.trim(),
          kpi_type_id: this.state.kpi_type_id,
          kpi_type_name: this.state.kpi_type_name,
          month_report: this.state.month_report,
          kpi_plan: String(this.state.kpi_plan).trim(),
          kpi_unit_id: this.state.kpi_unit_id.trim(),
          kpi_unit_name: this.state.kpi_unit_name.trim(),
          response_department: this.state.response_department,
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        // confirmAlert({
        //   message: 'แก้ไขข้อมูลสำเร็จ',
        //   buttons: [
        //     {
        //       label: 'ยืนยัน',
        //       onClick: () => this.setState({ modal: false }),
        //     },
        //   ],
        // });
        confirmAlert({
          message: 'แก้ไขข้อมูลสำเร็จ',
          buttons: [],
        });
        setTimeout(
          () => (window.location.href = '/kpi1/' + this.state.selected),
          1000,
        );
        this.setState({
          modal: false,
          kpi_code: '',
          kpi_name: '',
          kpi_type_id: '',
          kpi_type_name: '',
          month_report: [],
          kpi_plan: '',
          kpi_unit_id: '',
          kpi_unit_name: '',
          response_department: '',
          isForm: '',
          selectedmonthOptions: [],
          keyword: '',
        });
      })
      .catch(err => {
        if (err.response.data == 'Please Check your kpi code!') {
          const kpiCodeError = 'รหัสตัวชี้วัดซ้ำ';
          this.setState({
            kpiCodeError: kpiCodeError,
          });
        }
      });
  };

  handleInputChange1 = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    this.fetchData(); /** รีโหลดตอนsearch */
  };

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
      .delete(process.env.REACT_APP_SOURCE_URL + '/kpis/' + id)
      .then(res => {
        this.fetchData();
      })
      .catch(err => {
        console.log(err);
      });
  };
  handlePageClick = data1 => {
    let selected = data1.selected + 1;
    let offset = Math.ceil(selected * this.state.perPage);
    this.setState({ offset: offset, selected: selected }, () => {
      // window.location.href=selected
      // return <Link to={'/Project1/' + selected}/>
      this.fetchData();
    });
  };
  render() {
    const ColoredLine = ({ color }) => (
      <hr
        style={{
          color: color,
          backgroundColor: color,
          height: 5,
        }}
      />
    );
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
                onChange={this.handleInputChange1}
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
                onChange={this.handleInputChange1}
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
        <Col>
          <Card className="mb-12">
            <CardBody>
              <Table responsive>
                <thead>
                  <tr>
                    {/* <th>No.</th> */}
                    <th style={{ width: '10%' }}>รหัสตัวชี้วัด</th>
                    <th>ชื่อตัวชี้วัด</th>
                    <th>ผลการรายงานตัวชี้วัด</th>
                    <th colSpan="3" />
                  </tr>
                </thead>
                <tbody>
                  {this.state.list.length == 0 ? (
                    <tr>
                      <td colSpan="4" align="center">
                        ไม่มีข้อมูลตัวชี้วัด
                      </td>
                    </tr>
                  ) : (
                    this.state.list.map(data => (
                      <tr>
                        {/* <td /> */}
                        <td>{data.kpi_code}</td>
                        <td>{data.kpi_name}</td>
                        <td
                          style={{
                            width: '30%',
                          }}
                        >
                          <ProgressBar dataprogress={data.kpi_progress} />
                        </td>
                        <td
                          style={{
                            width: '2%',
                          }}
                        >
                          <Tooltip title="เกณฑ์การให้คะแนน">
                            <IconButton
                              className="btn_not_focus"
                              aria-label="เกณฑ์การให้คะแนน"
                              size="small"
                              component={Link}
                              to={'/KPI1_2/' + data._id}
                            >
                              <Icon>star_rate</Icon>
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td
                          style={{
                            width: '2%',
                          }}
                        >
                          <Tooltip title="แก้ไข">
                            <IconButton
                              className="btn_not_focus"
                              color="inherit"
                              aria-label="แก้ไข"
                              size="small"
                              onClick={() => this.onEdit(data._id)}
                            >
                              <Icon>edit</Icon>
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td
                          style={{
                            width: '2%',
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
              {this.state.list.length != 0 ? (
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
              ) : (
                ''
              )}
            </CardBody>
          </Card>
        </Col>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle()}
          className={this.props.className}
          size="lg"
        >
          <ModalHeader toggle={this.toggle()} style={{ textAlign: 'center' }}>
            ข้อมูลตัวชี้วัด
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <FormGroup>
                    <Label sm={12}>
                      ประเภทตัวชี้วัด<font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      <Typeahead
                        clearButton
                        labelKey="label"
                        id="kpi_type_name"
                        name="kpi_type_name"
                        placeholder="ประเภทตัวชี้วัด"
                        options={this.state.kpiTypeOptions}
                        onChange={e =>
                          this.handleSelectChange(
                            'kpi_type_id',
                            'kpi_type_name',
                            e,
                          )
                        }
                        defaultSelected={this.state.selectedkpiTypeOptions}
                      />
                      <FormText style={{ color: red }}>
                        <span class="error">{this.state.kpiTypeError}</span>
                      </FormText>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      รหัสตัวชี้วัด<font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="text"
                          name="kpi_code"
                          id="kpi_code"
                          placeholder=""
                          onChange={this.handleInputChange}
                          value={this.state.kpi_code}
                        />
                        <FormText style={{ color: red }}>
                          <span class="error">{this.state.kpiCodeError}</span>
                        </FormText>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      ชื่อตัวชี้วัด<font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="text"
                          name="kpi_name"
                          id="kpi_name"
                          placeholder=""
                          onChange={this.handleInputChange}
                          value={this.state.kpi_name}
                        />
                        <FormText style={{ color: red }}>
                          <span class="error">{this.state.kpiNameError}</span>
                        </FormText>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      หน่วยนับ<font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Typeahead
                          clearButton
                          labelKey="label"
                          id="kpi_unit_name"
                          name="kpi_unit_name"
                          placeholder="เลือกหน่วยนับ"
                          options={this.state.UnitOptions}
                          onChange={e =>
                            this.handleSelectChange(
                              'kpi_unit_id',
                              'kpi_unit_name',
                              e,
                            )
                          }
                          defaultSelected={this.state.selectedUnitOptions}
                        />
                        <FormText style={{ color: red }}>
                          <span class="error">{this.state.unitError}</span>
                        </FormText>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      ค่าเป้าหมาย<font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="text"
                          name="kpi_plan"
                          id="kpi_plan"
                          placeholder=""
                          onChange={this.handleInputChange}
                          value={this.state.kpi_plan}
                        />
                        <FormText style={{ color: red }}>
                          <span class="error">{this.state.kpi_planError}</span>
                        </FormText>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <FormGroup>
                    <Label sm={12}>
                      เดือนสำหรับรายงานผล<font color={'red'}>*</font>
                    </Label>

                    <Col sm={12}>
                      <Typeahead
                        clearButton
                        multiple
                        labelKey="label"
                        id="report_month"
                        name="report_month"
                        placeholder="เลือกเดือนสำหรับรายงานผล"
                        options={this.state.monthOptions}
                        onChange={e => this.handleMultiSelectChange(e)}
                        defaultSelected={this.state.selectedmonthOptions}
                      />
                      <FormText style={{ color: red }}>
                        <span class="error">
                          {this.state.month_reportError}
                        </span>
                      </FormText>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <Label for="Select" sm={12}>
                    หน่วยงานผู้รับผิดชอบ
                    <font color={'red'} size="2">
                      *เลือกได้มากกว่า 1 รายการ
                    </font>
                  </Label>
                  <Col sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="response_department"
                          checked={this.state.department_checked}
                          onChange={e => this.handleDepatmentChange(e)}
                          value="1"
                          color="secondary"
                        />
                      }
                      label="เลือกทั้งหมด"
                    />
                  </Col>
                  <Col lg={12} md={12} sm={12}>
                    <Typeahead
                      clearButton
                      disabled={this.state.department_checked}
                      id="ProjectOwner"
                      labelKey="department_name"
                      name="response_department"
                      placeholder="เลือกผู้รายงานผล"
                      options={this.state.ProjectResponsePersonOptions}
                      onChange={e => this.handleDepartSelectChange(e)}
                      selected={this.state.response_department}
                      multiple
                      ref={ref => (this.ProjectOwner = ref)}
                    />
                    <FormText style={{ color: red }}>
                      <span class="error">
                        {this.state.response_department_Error}
                      </span>
                    </FormText>
                  </Col>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e => this.handleSubmit(e)}>
              บันทึก
            </Button>
            <Button color="secondary" onClick={this.toggle()}>
              ยกเลิก
            </Button>
          </ModalFooter>
        </Modal>
      </Row>
    );
  }
}
