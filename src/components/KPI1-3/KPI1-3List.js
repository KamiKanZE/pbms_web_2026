import Page from 'components/Page';
import axios from 'axios';
import React from 'react';
import DatePicker from 'react-datepicker';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-datepicker/dist/react-datepicker.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import { confirmAlert } from 'react-confirm-alert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
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
  ButtonToolbar,
  ButtonGroup,
  FormText,
} from 'reactstrap';
import { MdEvent } from 'react-icons/md';
import $ from 'jquery';
// import { Link } from '@material-ui/core';
import { Link } from 'react-router-dom';

function MonthName({ month_name }) {
  let name;
  switch (month_name) {
    case 1:
      name = 'มกราคม';
      break;
    case 2:
      name = 'กุมภาพันธ์';
      break;
    case 3:
      name = 'มีนาคม';
      break;
    case 4:
      name = 'เมษายน';
      break;
    case 5:
      name = 'พฤษภาคม';
      break;
    case 6:
      name = 'มิถุนายน';
      break;
    case 7:
      name = 'กรกฏาคม';
      break;
    case 8:
      name = 'สิงหาคม';
      break;
    case 9:
      name = 'กันยายน';
      break;
    case 10:
      name = 'ตุลาคม';
      break;
    case 11:
      name = 'พฤศจิกายน';
      break;
    case 12:
      name = 'ธันวาคม';
      break;
  }
  return <div>{name}</div>;
}
const token_id = localStorage.getItem('token');
export default class KPI_1List extends React.Component {
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
      UnitOptions: [],
      selectedUnitOptions: [],
      kpiTypeOptions: [],
      criteriaOptions: [],
      criteriaOptions1: [],
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
      kpi_type_id: '',
      kpi_type_name: '',
      kpi_code: '',
      kpi_name: '',
      kpi_unit_id: '',
      kpi_unit_name: '',
      month_report: [],
      response_person_id: '',
      response_person_name: '',
      kpi_plan: '',
      list: [],
      isForm: '',
      kpi_id: '',
      criteria_id: '',
      level: '',
      plan: '',
      result: '',
      comment: '',
      obstacle: '',
      criteriaError: '',
      planError: '',
      resultError: '',
      selected: id,
      offset: 0,
      perPage: 10,
      currenpage: id - 1,
    };
  }
  validate = () => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let emptyText = 'กรุณากรอกให้ครบถ้วน';
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      criteriaError: '',
      planError: '',
      resultError: '',
    };

    if (this.state.criteria_id.length <= 0) {
      isError = true;
      errors.criteriaError = emptyText;
    }

    if (this.state.plan.length <= 0) {
      isError = true;
      errors.planError = emptyText;
    } else if (!this.state.plan.match(regexp)) {
      isError = true;
      errors.planError = numberText;
    }

    if (this.state.result.length <= 0) {
      isError = true;
      errors.resultError = emptyText;
    } else if (!this.state.result.match(regexp)) {
      isError = true;
      errors.resultError = numberText;
    }

    this.setState({
      ...this.state,
      ...errors,
    });

    return isError;
  };
  fetchData() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/kpis?page=0&size=0')
      .then(res => {
        this.setState({ list: res.data.result });
      })
      .catch(error => {
        console.log(error);
      });
  }
  loadCommentsFromServer() {
    $.ajax({
      url:
        process.env.REACT_APP_SOURCE_URL +
        '/kpis?page=' +
        this.state.selected +
        '&size=' +
        this.state.perPage,
      data: {
        totalPage: this.state.perPage,
        offset: Math.ceil(this.state.selected * this.state.perPage),
      },
      dataType: 'json',
      type: 'GET',
      success: data => {
        // let offset = Math.ceil(this.state.selected * this.state.perPage);
        this.setState({
          list: data.result,
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
      .get(process.env.REACT_APP_SOURCE_URL + '/users/list?page=0&size=0')
      .then(ress => {
        const ProjectResponsePersonOptions = ress.data.result.map(id => {
          return { id: id._id, label: id.name };
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
        level: '',
        plan: '',
        result: '',
        comment: '',
        obstacle: '',
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
  componentDidMount() {
    this.loadCommentsFromServer();
    this.fetchUnitOptions();
    this.fetchkpiTypeOptions();
    this.fetchProjectResponsePersonOptions();
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
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

  handlCriteria(e) {
    this.setState({
      level: '',
      plan: '',
      result: '',
      comment: '',
      obstacle: '',
      isForm: '',
    });
    // if (e[0]) {
    //   this.setState({
    //     criteria_id: e[0].id,
    //   });
    //   axios
    //     .get(
    //       process.env.REACT_APP_SOURCE_URL + '/kpisReports/reports/' + e[0].id,
    //     )
    if (e.target.value) {
      this.setState({
        criteria_id: e.target.value,
      });
      axios
        .get(
          process.env.REACT_APP_SOURCE_URL +
            '/kpisReports/reports/' +
            e.target.value,
        )
        .then(ress => {
          for (let i = 0; i < ress.data.length; i++) {
            if (ress.data[i].month == this.state.month) {
              this.setState({
                level: ress.data[i].level,
                plan: ress.data[i].plan,
                result: ress.data[i].result,
                comment: ress.data[i].comment,
                obstacle: ress.data[i].obstacle,
                report_cri: ress.data[i]._id,
                isForm: 'edit',
              });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  onEdit(id, item_id) {
    this.setState({ modal: true, criteriaOptions: [] });
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/kpisReports/criteria/' +
          item_id +
          '?page=0&size=0',
      )
      .then(ress => {
        const criteriaOptions = ress.data.map(id => {
          return { id: id._id, label: id.criteria_name };
        });
        this.setState({ criteriaOptions1: ress.data });
        this.setState(prevState => ({
          criteriaOptions: prevState.criteriaOptions.concat(criteriaOptions),
          month: id,
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }

  onAdd() {
    this.setState({ modal: true, isForm: '' });
  }
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.isForm == 'edit') {
      this.Update(e);
    } else {
      this.Insert(e);
    }
  };

  Insert = e => {
    e.preventDefault();
    const err = this.validate();
    if (!err) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL +
            '/kpisReports/' +
            this.state.criteria_id,
          {
            // level: this.state.level.trim(),
            plan: this.state.plan.trim(),
            result: this.state.result,
            comment: this.state.comment,
            obstacle: this.state.obstacle,
            month: this.state.month,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          confirmAlert({
            message: 'บันทึกข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(() => (window.location.href = '/KPI1_3'), 1000);
          this.fetchData();
          this.setState({
            modal: false,
            level: '',
            plan: '',
            result: '',
            comment: '',
            obstacle: '',
          });
        });
    }
  };

  Update = e => {
    e.preventDefault();
    const err = this.validate();
    if (!err) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL +
            '/kpisReports/' +
            this.state.report_cri,
          {
            level: this.state.level,
            plan: this.state.plan,
            result: this.state.result,
            comment: this.state.comment,
            obstacle: this.state.obstacle,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          confirmAlert({
            message: 'แก้ไขข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(() => (window.location.href = '/KPI1_3'), 1000);
          this.fetchData();
          this.setState({
            modal: false,
            level: '',
            plan: '',
            result: '',
            comment: '',
            obstacle: '',
          });
        });
    }
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

  render() {
    return (
      <div>
        <Row>
          <Col>
            <Card className="mb-3">
              <CardBody>
                <Table>
                  <thead>
                    <tr>
                      {/* <th>No.</th> */}
                      <th>รหัสตัวชี้วัด</th>
                      <th>ชื่อตัวชี้วัด</th>
                      <th> เดือนสำหรับรายงานผล</th>
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
                          <td
                            style={{
                              width: '50%',
                            }}
                          >
                            {data.kpi_name}
                          </td>
                          <td>
                            <UncontrolledButtonDropdown direction="down">
                              <DropdownToggle caret>
                                <MdEvent size="1em" />
                              </DropdownToggle>
                              <DropdownMenu right>
                                {data.month_report.map(data1 => (
                                  <DropdownItem
                                    onClick={() => this.onEdit(data1, data._id)}
                                  >
                                    <MonthName month_name={data1} />
                                  </DropdownItem>
                                ))}
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                <Row>
                  <Col md={12}>
                    {this.state.list.length == 0 ? (
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
                      เกณฑ์การประเมิน<font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      {/* <Typeahead
                        // clearButton
                        labelKey="label"
                        id="criteriaOptions"
                        name="criteriaOptions"
                        placeholder="เกณฑ์การประเมิน"
                        options={this.state.criteriaOptions}
                        onChange={e => this.handlCriteria(e)}
                        
                      /> */}
                      <Input
                        type="select"
                        name="criteriaOptions"
                        onChange={e => this.handlCriteria(e)}
                        // value={this.state.criteriaOptions}
                        // required
                        // options={this.state.criteriaOptions}
                        placeholder="เกณฑ์การประเมิน"
                      >
                        <option selected disabled>
                          เกณฑ์การประเมิน
                        </option>
                        {this.state.criteriaOptions1.map(id => (
                          <option key={id._id} value={id._id}>
                            {id.criteria_name}
                          </option>
                        ))}
                      </Input>
                      <FormText>
                        <span class="error">{this.state.criteriaError}</span>
                      </FormText>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                {/* <Col xl={4} lg={4} md={4}>
                  <FormGroup>
                    <Label sm={12}>ระดับคะแนน</Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="text"
                          name="level"
                          id="level"
                          placeholder="ระดับคะแนน"
                          onChange={this.handleInputChange}
                          value={this.state.level}
                        />
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col> */}
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      แผน<font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="text"
                          name="plan"
                          id="plan"
                          placeholder="แผน"
                          onChange={this.handleInputChange}
                          value={this.state.plan}
                        />
                        <FormText>
                          <span class="error">{this.state.planError}</span>
                        </FormText>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      ผล<font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="text"
                          name="result"
                          id="result"
                          placeholder="ผล"
                          onChange={this.handleInputChange}
                          value={this.state.result}
                        />
                        <FormText>
                          <span class="error">{this.state.resultError}</span>
                        </FormText>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <FormGroup>
                    <Label sm={12}>หมายเหตุ</Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="textarea"
                          name="comment"
                          id="comment"
                          placeholder="หมายเหตุ"
                          onChange={this.handleInputChange}
                          value={this.state.comment}
                        />
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <FormGroup>
                    <Label sm={12}>อุปสรรคต่อการดำเนินงาน</Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="textarea"
                          name="obstacle"
                          id="obstacle"
                          placeholder="อุปสรรคต่อการดำเนินงาน"
                          onChange={this.handleInputChange}
                          value={this.state.obstacle}
                        />
                      </FormGroup>
                    </Col>
                  </FormGroup>
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
      </div>
    );
  }
}
