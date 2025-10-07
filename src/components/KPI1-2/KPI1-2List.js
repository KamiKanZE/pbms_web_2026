import Page from 'components/Page';
import axios from 'axios';
import React from 'react';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { Typeahead } from 'react-bootstrap-typeahead';
import { confirmAlert } from 'react-confirm-alert';
import { red } from '@material-ui/core/colors';
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
const token_id = localStorage.getItem('token');
export default class KPI1_2List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kpi_code: '',
      kpi_name: '',
      modal: false,
      criteria_id: '',
      criteria_name: '',
      level: '',
      kpi_id: this.props.kpi_id,
      list: [],
      isForm: '',
    };
  }
  validate = () => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let emptyText = 'กรุณากรอกข้อมูลให้ครบถ้วน';
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      criteria_nameError: '',
      levelError: '',
    };

    if (this.state.criteria_name.length <= 0) {
      isError = true;
      errors.criteria_nameError = emptyText;
    }

    if (this.state.level.length <= 0) {
      isError = true;
      errors.levelError = emptyText;
    } else if (!this.state.level.match(regexp)) {
      isError = true;
      errors.levelError = numberText;
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
          '/kpis/criteria/' +
          this.props.kpi_id +
          '?page=0&size=0',
      )
      .then(res => {
        this.setState({ list: res.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchKpi() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/kpis/' + this.props.kpi_id)
      .then(res => {
        this.setState({
          kpi_code: res.data.kpi_code,
          kpi_name: res.data.kpi_name,
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
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
  exit() {
    this.setState({
      modal: false,
    });
  }
  componentDidMount() {
    this.fetchData();
    this.fetchKpi();
  }

  handleInputChange = e => {
    // let num = Number(e.target.value).toLocaleString('en');
    this.setState({
      criteria_nameError: '',
      [e.target.name]: e.target.value,
    });
  };
  handleInputChange2 = e => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      levelError: '',
    };
    const newvalue = e.target.value.replace(/,/g, '');
    if (!String(newvalue).match(regexp)) {
      isError = true;
      errors.levelError = numberText;
      const valuewithcomma = '';
      this.setState({
        ...errors,
        [e.target.name]: valuewithcomma,
      });
    } else if (newvalue > 100) {
      isError = true;
      errors.levelError = 'ห้ามกรอมข้อมูลเกิน 100';
      const valuewithcomma = '';
      this.setState({
        ...errors,
        [e.target.name]: valuewithcomma,
      });
    } else {
      // isError = false;
      const valuewithcomma = Number(newvalue).toLocaleString('en');
      this.setState({
        ...errors,
        [e.target.name]: valuewithcomma,
      });
    }

    return isError;
  };
  onAdd() {
    this.setState({
      modal: true,
      isForm: '',
      criteria_name: '',
      level: '',
      levelError: '',
      criteria_nameError: '',
    });
  }
  onEdit = id => {
    // this.setState({ modal: true });
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/kpis/criteria/criteria/' + id)
      .then(res => {
        const { _id, criteria_name, level } = res.data;
        this.setState({
          criteria_name: criteria_name,
          level: level,
          criteria_id: _id,
          modal: true,
          isForm: 'edit',
          levelError: '',
          criteria_nameError: '',
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
          '/kpis/criteria/' +
          this.props.kpi_id,
        {
          criteria_name: this.state.criteria_name,
          level: this.state.level,
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        confirmAlert({
          message: 'บันทึกข้อมูลสำเร็จ',
          buttons: [],
        });
        setTimeout(
          () => (window.location.href = '/kpi1_2/' + this.props.kpi_id),
          1000,
        );
        this.fetchData();
        this.setState({
          modal: false,
          criteria_name: '',
          level: '',
          isForm: '',
        });
      })
      .catch(err => {
        if (err.response.data == 'Please Check your criteria name!') {
          this.setState({
            criteria_nameError: 'เกณฑ์การประเมิน ซ้ำ',
          });
        }
      });
  };

  Update = e => {
    e.preventDefault();
    axios
      .patch(
        process.env.REACT_APP_SOURCE_URL +
          '/kpis/criteria/' +
          this.state.criteria_id,
        {
          criteria_name: this.state.criteria_name,
          level: this.state.level,
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        confirmAlert({
          message: 'แก้ไขข้อมูลสำเร็จ',
          buttons: [],
        });
        setTimeout(
          () => (window.location.href = '/kpi1_2/' + this.props.kpi_id),
          1000,
        );
        this.fetchData();
        this.setState({
          modal: false,
          criteria_name: '',
          level: '',
          isForm: '',
        });
      })
      .catch(err => {
        if (err.response.data == 'Please Check your criteria name!') {
          this.setState({
            criteria_nameError: 'เกณฑ์การประเมิน ซ้ำ',
          });
        }
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
      .delete(
        process.env.REACT_APP_SOURCE_URL + '/kpis/criteria/criteria/' + id,
      )
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
            <Tooltip title="Add">
              <Fab
                className="btn_not_focus"
                color="primary"
                onClick={() => this.onAdd()}
              >
                <Icon>add</Icon>
              </Fab>
            </Tooltip>
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
                        <b>รหัสตัวชี้วัด :</b>&nbsp;
                        {this.state.kpi_code}
                      </Label>
                    </Col>
                    <Col sm={12}>
                      <Label for="Project" sm={12}>
                        <b>ชื่อตัวชี้วัด :</b>&nbsp;{this.state.kpi_name}
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
                      <th>เกณฑ์การประเมิน</th>
                      <th>ระดับคะแนน</th>
                      {/* <th /> */}
                      <th colSpan="2" />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.list.length == 0 ? (
                      <tr>
                        <td colSpan="4" align="center">
                          ไม่มีข้อมูลเกณฑ์การประเมิน
                        </td>
                      </tr>
                    ) : (
                      this.state.list.map(data => (
                        <tr>
                          {/* <td /> */}
                          <td>{data.criteria_name}</td>
                          <td
                            style={{
                              width: '30%',
                            }}
                          >
                            {data.level}
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
            ข้อมูลเกณฑ์การประเมิน
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label sm={12}>
                  เกณฑ์การประเมิน<font color={'red'}>*</font>
                </Label>
                <Col sm={12}>
                  <Input
                    type="text"
                    name="criteria_name"
                    placeholder="เกณฑ์การประเมิน"
                    onChange={this.handleInputChange}
                    value={this.state.criteria_name}
                    autoComplete="off"
                  />
                  <FormText style={{ color: red }}>
                    <span class="error">{this.state.criteria_nameError}</span>
                  </FormText>
                </Col>
              </FormGroup>
              <Row>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label sm={12}>
                      ระดับคะแนน<font color={'red'}>*</font>
                    </Label>
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="text"
                          name="level"
                          id="level"
                          placeholder="ระดับคะแนน"
                          onChange={this.handleInputChange2}
                          value={this.state.level}
                        />
                        <FormText style={{ color: red }}>
                          <span class="error">{this.state.levelError}</span>
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
            <Button color="secondary" onClick={() => this.exit()}>
              ยกเลิก
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
