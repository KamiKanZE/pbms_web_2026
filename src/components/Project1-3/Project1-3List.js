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
const token_id = localStorage.getItem('token');
const userID = localStorage.getItem('userID');

export default class Project1_3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      budget_source_name: '-',
      project_name: '-',
      project_objective: '-',
      UnitOptions: [],
      selectedUnitOptions: [],
      modal: false,
      pkpi_id: '',
      PKPI_code: '',
      PKPI_codeError: '',
      PKPI_name: '',
      PKPI_nameError: '',
      target_value: '',
      target_valueError: '',
      unit_id: '',
      unit_name: '',
      unitError: '',
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
      PKPI_codeError: '',
      PKPI_nameError: '',
      target_valueError: '',
      unitError: '',
    };
    // if (this.state.PKPI_code.length <= 0) {
    //   isError = true;
    //   errors.PKPI_codeError = emptyText;
    // }

    if (this.state.PKPI_name.length <= 0) {
      isError = true;
      errors.PKPI_nameError = emptyText;
    }

    if (this.state.target_value.length <= 0) {
      isError = true;
      errors.target_valueError = emptyText;
    }

    if (this.state.unit_id.length <= 0 && this.state.unit_name.length <= 0) {
      isError = true;
      errors.unitError = emptyText;
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
          '/projects/kpis/' +
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
          budget_source_name: res.data.project_reason,
          project_name: res.data.project_name,
          project_objective: res.data.project_objective,
          project_target: res.data.project_target,
          ownerID: res.data.owner_id,
        });

      })
      .catch(error => {
        console.log(error);
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
  onAdd() {
    this.setState({
      modal: true,
      PKPI_code: '',
      PKPI_name: '',
      target_value: '',
      unit_id: '',
      unit_name: '',
      selectedUnitOptions: [],
      isForm: '',
    });
  }
  componentDidMount() {
    this.fetchData();
    this.fetchUnitOptions();
    this.fetchProjectData();
  }

  handleInputChange = e => {
    if (e.target.name == 'target_value') {
      if (this.state.unit_name == 'ร้อยละ') {
        if (e.target.value > 100) {
          this.setState({
            target_valueError: 'ค่าเป้าหมายห้ามเกิน 100',
            [e.target.name]: '',
          });
        } else {
          this.setState({
            target_valueError: '',
            [e.target.name]: e.target.value,
          });
        }
      } else {
        this.setState({
          [e.target.name]: e.target.value,
        });
      }
      // if(this.state.UnitOptions==)
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
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
      .get(process.env.REACT_APP_SOURCE_URL + '/projects/kpis/kpis/' + id)
      .then(res => {
        const { _id, PKPI_code, PKPI_name, target_value, unit_id, unit_name } =
          res.data;
        this.setState({
          selectedUnitOptions: [{ id: unit_id, label: unit_name }],
          PKPI_code: PKPI_code,
          PKPI_name: PKPI_name,
          target_value: target_value,
          unit_id: unit_id,
          unit_name: unit_name,
          modal: true,
          pkpi_id: _id,
          isForm: 'edit',
        });

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
          '/projects/kpis/' +
          this.props.project_id,
        {
          // PKPI_code: this.state.PKPI_code.trim(),
          PKPI_name: this.state.PKPI_name.trim(),
          target_value: this.state.target_value.trim(),
          unit_id: this.state.unit_id.trim(),
          unit_name: this.state.unit_name,
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
          () => (window.location.href = '/project1-3/' + this.props.project_id),
          1000,
        );
        this.setState({
          modal: false,
          PKPI_code: '',
          PKPI_name: '',
          target_value: '',
          unit_id: '',
          unit_name: '',
          isForm: '',
        });
      });
  };

  Update = e => {
    e.preventDefault();
    axios
      .patch(
        process.env.REACT_APP_SOURCE_URL +
          '/projects/kpis/' +
          this.state.pkpi_id,
        {
          // PKPI_code: this.state.PKPI_code.trim(),
          PKPI_name: this.state.PKPI_name.trim(),
          target_value: this.state.target_value.trim(),
          unit_id: this.state.unit_id.trim(),
          unit_name: this.state.unit_name,
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
          () => (window.location.href = '/project1-3/' + this.props.project_id),
          1000,
        );
        this.setState({
          modal: false,
          PKPI_code: '',
          PKPI_name: '',
          target_value: '',
          unit_id: '',
          unit_name: '',
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/projects/kpis/kpis/' + id)
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
                  onClick={() => this.onAdd()}
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
                        <Label>{this.state.project_name}</Label>
                      </Col>
                    </Col>
                    <Col sm={12}>
                      <Label for="Project" sm={12}>
                        <b>ความสำคัญของโครงการ/หลักการและเหตุผล :</b>
                      </Label>
                      <Col sm={12}>
                        <Label id="p_wrap">
                          {this.state.budget_source_name}
                        </Label>
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
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      {/* <th>No.</th> */}
                      {/* <th>รหัสตัวชี้วัด</th> */}
                      <th>ชื่อตัวชี้วัด</th>
                      {/* <th>ความก้าวหน้าตัวชี้วัดโครงการ</th> */}
                      <th>หน่วยนับ</th>
                      <th>ค่าเป้าหมาย</th>
                      {/* <th /> */}
                      {this.state.ownerID == userID ? <th colSpan="2" /> : ''}
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
                          {/* <td>{data.PKPI_code}</td> */}
                          <td>{data.PKPI_name}</td>
                          {/* <td
                          style={{
                            width: '30%',
                          }}
                        >
                          <Progress
                            color={'success'}
                            value={data.activity_progress}
                            className="mt-2"
                          >
                            {data.activity_progress}%
                          </Progress>
                        </td> */}
                          <td>{data.unit_name}</td>
                          <td>{data.target_value}</td>
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
            ข้อมูลตัวชี้วัดภายใต้โครงการ
          </ModalHeader>
          <ModalBody>
            <Form>
              {/* <FormGroup>
                <Label sm={12}>
                  รหัสตัวชี้วัด<font color={'red'}>*</font>
                </Label>
                <Col sm={12}>
                  <Input
                    type="text"
                    name="PKPI_code"
                    placeholder="รหัสตัวชี้วัด"
                    onChange={this.handleInputChange}
                    value={this.state.PKPI_code}
                  />
                  <FormText>
                    <span class="error">{this.state.PKPI_codeError}</span>
                  </FormText>
                </Col>
              </FormGroup> */}
              <FormGroup>
                <Label sm={12}>
                  ชื่อตัวชี้วัด<font color={'red'}>*</font>
                </Label>
                <Col sm={12}>
                  <Input
                    type="text"
                    name="PKPI_name"
                    placeholder="ชื่อตัวชี้วัด"
                    onChange={this.handleInputChange}
                    value={this.state.PKPI_name}
                  />
                  <FormText>
                    <span className="error">{this.state.PKPI_nameError}</span>
                  </FormText>
                </Col>
              </FormGroup>
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
                          id="unit_name"
                          name="unit_name"
                          placeholder="เลือกหน่วยนับ"
                          options={this.state.UnitOptions}
                          onChange={e =>
                            this.handleSelectChange('unit_id', 'unit_name', e)
                          }
                          defaultSelected={this.state.selectedUnitOptions}
                        />
                        <FormText>
                          <span className="error">{this.state.unitError}</span>
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
                          name="target_value"
                          id="target_value"
                          placeholder="ค่าเป้าหมาย"
                          onChange={this.handleInputChange}
                          value={this.state.target_value}
                        />
                        <FormText>
                          <span className="error">
                            {this.state.target_valueError}
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
