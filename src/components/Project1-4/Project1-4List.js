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
import { Link } from 'react-router-dom';
import { textAlign } from '@material-ui/system';
import { orange } from '@material-ui/core/colors';
import $ from 'jquery';
function getColor(id) {
  const txt = document.getElementById(id);
  txt.className = '';
  return txt.className;
}

function mouseOut(id) {
  const txt = document.getElementById(id);
  txt.className = 'ss';
  return txt.className;
}
const token_id = localStorage.getItem('token');
const userID = localStorage.getItem('userID');
export default class Project1_4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      budget_source_name: '-',
      project_reason: '-',
      project_objective: '-',
      risk_id: '',
      contengency_plan: '',
      contengency_planError: '',
      detail: '',
      detailError: '',
      effect: '',
      effectError: '',
      possibility: '',
      possibilityError: '',
      total: '',
      project_id: this.props.project_id,
      list: [],
      isForm: '',
      ownerID: '',
    };
  }

  validate = () => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let emptyText = 'กรุณากรอกข้อมูลให้ครบถ้วน';
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      contengency_planError: '',
      detailError: '',
      effectError: '',
      possibilityError: '',
    };
    if (this.state.contengency_plan.length <= 0) {
      isError = true;
      errors.contengency_planError = emptyText;
    }

    if (this.state.possibility.length <= 0) {
      isError = true;
      errors.possibilityError = emptyText;
    }
    if (!String(this.state.possibility).match(regexp)) {
      isError = true;
      errors.possibilityError = numberText;
    }

    if (this.state.effect.length <= 0) {
      isError = true;
      errors.effectError = emptyText;
    }
    if (!String(this.state.effect).match(regexp)) {
      isError = true;
      errors.effectError = numberText;
    }

    if (this.state.detail.length <= 0) {
      isError = true;
      errors.detailError = emptyText;
    }

    this.setState({
      ...this.state,
      ...errors,
    });

    return isError;
  };

  fetchData() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/projects/risks/' +
          this.props.project_id,
      )
      .then(res => {
        this.setState({ list: res.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchProjectData() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL + '/projects/' + this.props.project_id,
      )
      .then(res => {
        if (res.data.project_name == '') {
          res.data.project_name = '-';
        } else {
          res.data.project_name = res.data.project_name;
        }
        if (res.data.project_reason == '') {
          res.data.project_reason = '-';
        } else {
          res.data.project_reason = res.data.project_reason;
        }
        if (res.data.project_objective == '') {
          res.data.project_objective = '-';
        } else {
          res.data.project_objective = res.data.project_objective;
        }
        if (res.data.project_target == '' || res.data.project_target == null) {
          res.data.project_target = '-';
        } else {
          res.data.project_target = res.data.project_target;
        }
        this.setState({
          budget_source_name: res.data.project_name,
          project_reason: res.data.project_reason,
          project_objective: res.data.project_objective,
          project_target: res.data.project_target,
          ownerID: res.data.owner_id,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        contengency_plan: '',
        detail: '',
        effect: '',
        possibility: '',
        total: '',
        contengency_planError: '',
        detailError: '',
        effectError: '',
        possibilityError: '',
        isForm: '',
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
  componentDidMount() {
    this.fetchData();
    this.fetchProjectData();
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleInputChange1 = e => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let emptyText = 'กรุณากรอกโอกาสเกิด 1-5';
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      possibilityError: '',
    };
    if (e.target.value > 5 || e.target.value < 1) {
      isError = true;
      errors.possibilityError = emptyText;
      e.target.value = '';
    } else if (!String(e.target.value).match(regexp)) {
      isError = true;
      errors.possibilityError = numberText;
      e.target.value = '';
    }
    this.setState({
      ...this.state,
      ...errors,
      [e.target.name]: e.target.value,
    });

    return isError;
  };
  handleInputChange2 = e => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let emptyText = 'กรุณากรอกผลกระทบ 1-5';
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      effectError: '',
    };

    if (e.target.value > 5 || e.target.value < 1) {
      isError = true;
      errors.effectError = emptyText;
      e.target.value = '';
    } else if (!String(e.target.value).match(regexp)) {
      isError = true;
      errors.effectError = numberText;
      e.target.value = '';
    }
    this.setState({
      ...this.state,
      ...errors,
      [e.target.name]: e.target.value,
    });

    return isError;
  };
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

  onEdit = id => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/projects/risks/risks/' + id)
      .then(res => {
        const {
          _id,
          contengency_plan,
          detail,
          effect,
          possibility,
          // total,
        } = res.data;
        this.setState({
          contengency_plan: contengency_plan,
          detail: detail,
          effect: effect,
          possibility: possibility,
          // total: total,
          modal: true,
          risk_id: _id,
          isForm: 'edit',
        });

      })
      .catch(err => {
        console.log(err);
      });
  };

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
        process.env.REACT_APP_SOURCE_URL +
          '/projects/risks/' +
          this.props.project_id,
        {
          contengency_plan: this.state.contengency_plan,
          detail: this.state.detail,
          effect: this.state.effect,
          possibility: this.state.possibility,
          // total: this.state.total,
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        confirmAlert({
          //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
          message: 'บันทึกข้อมูลสำเร็จ',
          buttons: [
            // {
            //   label: 'ยืนยัน',
            //   onClick: () => this.fetchData(),
            // },
          ],
        });
        setTimeout(
          () => (window.location.href = '/project1-4/' + this.props.project_id),
          1000,
        );
        this.setState({
          modal: false,
          contengency_plan: '',
          detail: '',
          effect: '',
          possibility: '',
          total: '',
          isForm: '',
        });
      });
  };

  Update = e => {
    e.preventDefault();
    axios
      .patch(
        process.env.REACT_APP_SOURCE_URL +
          '/projects/risks/' +
          this.state.risk_id,
        {
          contengency_plan: this.state.contengency_plan,
          detail: this.state.detail,
          effect: this.state.effect,
          possibility: this.state.possibility,
          // total: this.state.detail * this.state.effect,
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        confirmAlert({
          //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
          message: 'แก้ไขข้อมูลสำเร็จ',
          buttons: [
            // {
            //   label: 'ยืนยัน',
            //   onClick: () => this.fetchData(),
            // },
          ],
        });
        setTimeout(
          () => (window.location.href = '/project1-4/' + this.props.project_id),
          1000,
        );
        this.setState({
          modal: false,
          contengency_plan: '',
          detail: '',
          effect: '',
          possibility: '',
          total: '',
          isForm: '',
        });
      });
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/projects/risks/risks/' + id)
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
          <Col md={12} style={{ textAlign: 'right' }}>
            {this.state.ownerID == userID ? (
              <Tooltip title="Add">
                <Fab
                  className="btn_not_focus"
                  color="primary"
                  onClick={this.toggle()}
                >
                  <Icon>add</Icon>
                </Fab>
              </Tooltip>
            ) : (
              ''
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="mb-3">
              <CardBody>
                <FormGroup inline>
                  <Col md={12} inline>
                    <Col sm={12}>
                      <Label for="ProjectID" sm={12}>
                        <b>ชื่อโครงการ :</b>
                      </Label>
                      <Col sm={12}>
                        <Label>{this.state.budget_source_name}</Label>
                      </Col>
                    </Col>
                    <Col sm={12}>
                      <Label for="Project" sm={12}>
                        <b>ความสำคัญของโครงการ/หลักการและเหตุผล :</b>
                      </Label>
                      <Col sm={12}>
                        <Label id="p_wrap">{this.state.project_reason}</Label>
                      </Col>
                    </Col>

                    <Col sm={12}>
                      <Label for="Select" sm={12}>
                        <b>วัตถุประสงค์ :</b>
                      </Label>
                      <Col sm={12}>
                        <Label id="p_wrap">
                          {this.state.project_objective}
                        </Label>
                      </Col>
                    </Col>
                    <Col sm={12}>
                      <Label for="Select" sm={12}>
                        <b>ขอบเขตของโครงการ/พื้นที่เป้าหมาย/กลุ่มเป้าหมาย :</b>
                      </Label>

                      <Label sm={12} id="p_wrap">
                        {this.state.project_target}
                      </Label>
                    </Col>
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="mb-3">
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th rowSpan="2" style={{ textAlign: 'center' }}>
                      ผลกระทบ
                    </th>
                    <th colSpan="5" style={{ textAlign: 'center' }}>
                      โอกาสเกิด
                    </th>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'center' }}>1</th>
                    <th style={{ textAlign: 'center' }}>2</th>
                    <th style={{ textAlign: 'center' }}>3</th>
                    <th style={{ textAlign: 'center' }}>4</th>
                    <th style={{ textAlign: 'center' }}>5</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th style={{ textAlign: 'center' }}>5</th>
                    <th
                      style={{ backgroundColor: 'yellow', textAlign: 'center' }}
                      id="51"
                      class="ss"
                    >
                      <Label class="sss">ปานกลาง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'orange', textAlign: 'center' }}
                      id="52"
                      class="ss"
                    >
                      <Label class="ss">สูง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'orange', textAlign: 'center' }}
                      id="53"
                      class="ss"
                    >
                      <Label class="ss">สูง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'red', textAlign: 'center' }}
                      id="54"
                      class="ss"
                    >
                      <Label class="ss">สูงมาก</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'red', textAlign: 'center' }}
                      id="55"
                      class="ss"
                    >
                      <Label class="ssp">สูงมาก</Label>
                    </th>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'center' }}>4</th>
                    <th
                      style={{ backgroundColor: 'yellow', textAlign: 'center' }}
                      id="41"
                      class="ss"
                    >
                      <Label class="ssp">ปานกลาง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'yellow', textAlign: 'center' }}
                      id="42"
                      class="ss"
                    >
                      <Label class="ssp">ปานกลาง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'orange', textAlign: 'center' }}
                      id="43"
                      class="ss"
                    >
                      <Label class="ssp">สูง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'orange', textAlign: 'center' }}
                      id="44"
                      class="ss"
                    >
                      <Label class="ssp">สูง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'red', textAlign: 'center' }}
                      id="45"
                      class="ss"
                    >
                      <Label class="ssp">สูงมาก </Label>
                    </th>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'center' }}>3</th>
                    <th
                      style={{ backgroundColor: 'green', textAlign: 'center' }}
                      id="31"
                      class="ss"
                    >
                      <Label class="ssp">ต่ำ</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'yellow', textAlign: 'center' }}
                      id="32"
                      class="ss"
                    >
                      <Label class="ssp">ปานกลาง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'yellow', textAlign: 'center' }}
                      id="33"
                      class="ss"
                    >
                      <Label class="ssp">ปานกลาง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'orange', textAlign: 'center' }}
                      id="34"
                      class="ss"
                    >
                      <Label class="ssp">สูง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'orange', textAlign: 'center' }}
                      id="35"
                      class="ss"
                    >
                      <Label class="ssp">สูง</Label>
                    </th>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'center' }}>2</th>
                    <th
                      style={{ backgroundColor: 'green', textAlign: 'center' }}
                      id="21"
                      class="ss"
                    >
                      <Label class="ssp">ต่ำ</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'yellow', textAlign: 'center' }}
                      id="22"
                      class="ss"
                    >
                      <Label class="ssp">ปานกลาง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'yellow', textAlign: 'center' }}
                      id="23"
                      class="ss"
                    >
                      <Label class="ssp">ปานกลาง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'yellow', textAlign: 'center' }}
                      id="24"
                      class="ss"
                    >
                      <Label class="ssp">ปานกลาง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'orange', textAlign: 'center' }}
                      id="25"
                      class="ss"
                    >
                      <Label class="ssp">สูง</Label>
                    </th>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'center' }}>1</th>
                    <th
                      style={{ backgroundColor: 'green', textAlign: 'center' }}
                      id="11"
                      class="ss"
                    >
                      <label class="ssp">ต่ำ</label>
                    </th>
                    <th
                      style={{ backgroundColor: 'green', textAlign: 'center' }}
                      id="12"
                      class="ss"
                    >
                      <label class="ssp">ต่ำ</label>
                    </th>
                    <th
                      style={{ backgroundColor: 'green', textAlign: 'center' }}
                      id="13"
                      class="ss"
                    >
                      <Label class="ssp">ต่ำ</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'yellow', textAlign: 'center' }}
                      id="14"
                      class="ss"
                    >
                      <Label class="ssp">ปานกลาง</Label>
                    </th>
                    <th
                      style={{ backgroundColor: 'yellow', textAlign: 'center' }}
                      id="15"
                      class="ss"
                    >
                      <Label class="ssp">ปานกลาง</Label>
                    </th>
                  </tr>
                </tbody>
              </Table>
            </Card>
            <Card className="mb-3">
              <Table responsive hover>
                <thead>
                  <tr>
                    {/* <th>No.</th> */}
                    <th>ประเด็นความเสี่ยง</th>
                    <th>โอกาสเกิด</th>
                    <th>ผลกระทบ</th>
                    <th>ระดับความเสี่ยง</th>
                    <th colSpan="2" />
                  </tr>
                </thead>
                <tbody>
                  {this.state.list.length == 0 ? (
                    <tr>
                      <td colSpan="4" align="center">
                        ไม่มีข้อมูลความเสี่ยง
                      </td>
                    </tr>
                  ) : (
                    this.state.list.map(data => (
                      <tr
                        onClick={() => getColor(data.effect + data.possibility)}
                        onMouseOver={() =>
                          getColor(data.effect + data.possibility)
                        }
                        onMouseOut={() =>
                          mouseOut(data.effect + data.possibility)
                        }
                      >
                        {/* <td /> */}
                        <td>{data.detail}</td>
                        <td>{data.possibility}</td>
                        <td>{data.effect}</td>
                        <td>{data.total}</td>
                        {this.state.ownerID == userID ? (
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
                        ) : (
                          ''
                        )}
                        {this.state.ownerID == userID ? (
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
                        ) : (
                          ''
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
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
            ข้อมูลแผนความเสี่ยงโครงการ
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label sm={12}>
                  ประเด็นความเสี่ยง<font color={'red'}>*</font>
                </Label>
                <Col sm={12}>
                  <Input
                    type="text"
                    name="detail"
                    placeholder="ประเด็นความเสี่ยง"
                    onChange={this.handleInputChange}
                    value={this.state.detail}
                  />
                  <FormText>
                    <span className="error">{this.state.detailError}</span>
                  </FormText>
                </Col>
              </FormGroup>
              <Row>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      โอกาสเกิด<font color={'red'}>* (1-5)</font>
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="text"
                          name="possibility"
                          id="possibility"
                          placeholder="โอกาสเกิด"
                          onChange={this.handleInputChange1}
                          value={this.state.possibility}
                        />
                        <FormText>
                          <span className="error">
                            {this.state.possibilityError}
                          </span>
                        </FormText>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      ผลกระทบ<font color={'red'}>* (1-5)</font>
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="text"
                          name="effect"
                          id="effect"
                          placeholder="ผลกระทบ"
                          onChange={this.handleInputChange2}
                          value={this.state.effect}
                        />
                        <FormText>
                          <span className="error">
                            {this.state.effectError}
                          </span>
                        </FormText>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
                {/* <Col xl={4} lg={4} md={4}>
                  <FormGroup>
                    <Label sm={12}>รวม</Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="text"
                          name="total"
                          id="total"
                          placeholder=""
                          onChange={this.handleInputChange}
                          value={this.state.total}
                        />
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col> */}
                <Col xl={12} lg={12} md={12}>
                  <FormGroup>
                    <Label sm={12}>
                      แนวทางการลดความเสี่ยง<font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="textarea"
                          name="contengency_plan"
                          id="contengency_plan"
                          placeholder="แนวทางการลดความเสี่ยง"
                          onChange={this.handleInputChange}
                          value={this.state.contengency_plan}
                        />
                        <FormText>
                          <span className="error">
                            {this.state.contengency_planError}
                          </span>
                        </FormText>
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
