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
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { confirmAlert } from 'react-confirm-alert';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
const token_id = localStorage.getItem('token');
export default class UnitList extends React.Component {
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
      Budget: [],
      refreshing: false,
      UnitID: '',
      UnitName: '',
      isForm: '',
      ID: '',
      data: [],
      selected: id1,
      offset: 0,
      perPage: 10,
      keyword: '',
      validationError: '',
      currenpage: id1 - 1,
    };
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };
  // fetchData = () => {
  //   axios
  //     .get(process.env.REACT_APP_SOURCE_URL + '/dataUnits/list')
  //     .then(res => {
  //       const Budget = res.data.result;
  //       this.setState({ Budget });
  //     });
  // };

  // componentDidMount() {
  //   this.fetchData();
  //   this.toggle();
  // }
  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
  }
  loadCommentsFromServer() {
    $.ajax({
      url:
        process.env.REACT_APP_SOURCE_URL +
        '/dataUnits/list?page=' +
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
          data: data.result,
          pageCount: Math.ceil(data.pagination.itemTotal / this.state.perPage),
        });
      },

      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString()); // eslint-disable-line
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
  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        validationError: '',
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataUnits/' + id)
      .then(res => {
        this.fetchData();
      })
      .catch(err => {
        console.log(err);
      });
  };

  onEdit = id => {
    // this.setState({ modal: true });
    const idUser = id.split('&');
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataUnits/' + idUser[0])
      .then(res => {
        const { _id, unit_id, unit_name } = res.data;
        this.setState({
          // UnitID: unit_id,
          UnitName: unit_name,
          modal: true,
          ID: _id,
          isForm: 'edit',
          header: 'แก้ไขข้อมูลหน่วยนับ',
          // validationError: '',
        });
      });
  };
  handleInputChange = e => {
    if (e.target.name == 'UnitName') {
      this.setState({
        validationError: '',
      });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onAdd() {
    this.setState({
      modal: true,
      UnitName: '',
      UnitID: '',
      isForm: '',
      ID: '',
      header: 'เพิ่มข้อมูลหน่วยนับ',
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
    // this.state.UnitID.trim() &&
    if (this.state.UnitName.trim()) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/dataUnits',
          {
            // unit_id: this.state.UnitID.trim(),
            unit_name: this.state.UnitName.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.setState({
            modal: false,
            UnitName: '',
            UnitID: '',
          });
          confirmAlert({ message: 'บันทึกข้อมูลสำเร็จ', buttons: [] });
          setTimeout(() => (window.location.href = '/Unit/'), 1000);
        })
        .catch(err => {
          if (err.response.data == 'Please Check your unit name!') {
            const validationError = 'ชื่อหน่วยนับซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError: validationError,
            });
          }
        });
    } else {
      // alert('กรุณากรอกข้อมูลให้ครบ');
      const validationError = this.state.UnitName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      this.setState({
        validationError: validationError,
      });
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.ID;
    if (
      this.state.UnitName.trim()
      // && this.state.UnitID.trim()
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/dataUnits/' + ID,
          {
            // unit_id: this.state.UnitID.trim(),
            unit_name: this.state.UnitName.trim(),
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          this.setState({
            modal: false,
            UnitName: '',
            UnitID: '',
            isForm: '',
            ID: '',
          });
          confirmAlert({ message: 'แก้ไขข้อมูลสำเร็จ', buttons: [] });
          setTimeout(
            () => (window.location.href = '/Unit/' + this.state.selected),
            1000,
          );
        })
        .catch(err => {
          if (err.response.data == 'Please Check your unit name!') {
            const validationError = 'ชื่อหน่วยนับซ้ำ กรุณากรอกใหม่';

            this.setState({
              validationError: validationError,
            });
          }
        });
    } else {
      // alert('กรุณากรอกข้อมูลให้ครบ');
      const validationError = this.state.UnitName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      this.setState({
        validationError: validationError,
      });
    }
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    this.loadCommentsFromServer();
  };
  render() {
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
                onChange={this.handleInputChange}
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
                onChange={this.handleInputChange}
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

        <Col sm={12}></Col>
        <Col>
          <Card className="mb-12">
            <CardBody>
              <Table responsive bordered striped hover>
                <thead>
                  <tr>
                    {' '}
                    {/* <th>UnitID</th> */}
                    <th>ชื่อหน่วยนับ</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.length == 0 ? (
                    <tr>
                      <td colSpan="4" align="center">
                        ไม่มีข้อมูลหน่วยนับ
                      </td>
                    </tr>
                  ) : (
                    this.state.data.map(id => (
                      <tr>
                        {/* <td>{id.unit_id}</td> */}
                        <td>{id.unit_name}</td>
                        <td style={{ textAlign: 'right' }}>
                          <Tooltip title="แก้ไข">
                            <IconButton
                              className="btn_not_focus"
                              size="small"
                              color="default"
                              aria-label="แก้ไข"
                              onClick={() => this.onEdit(id._id)}
                            >
                              <Icon>edit_icon</Icon>
                            </IconButton>
                          </Tooltip>
                          {/* &nbsp;
                    <Tooltip title="ลบ">
                      <IconButton
                        className="btn_not_focus"
                        size="small"
                        color="secondary"
                        aria-label="ลบ"
                        onClick={() => this.testAxiosDELETE(id._id)}
                      >
                        <Icon>delete</Icon>
                      </IconButton>
                    </Tooltip> */}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
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
              <Modal
                isOpen={this.state.modal}
                toggle={this.toggle()}
                className={this.props.className}
              >
                <ModalHeader toggle={this.toggle()}>
                  {this.state.header}
                </ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.handleSubmit}>
                    {/* <FormGroup>
                  <Label for="UnitID" sm={12}>
                    รหัสข้อมูลหน่วยนับ
                  </Label>
                  <Col sm={12}>
                    <Input
                      type="text"
                      name="UnitID"
                      placeholder="ข้อมูลรหัสข้อมูลหน่วยนับหน่วยนับ"
                      onChange={this.handleInputChange}
                      value={this.state.UnitID}
                      required
                    />
                  </Col>
                </FormGroup> */}
                    <FormGroup>
                      <Label for="UnitName" sm={12}>
                        ข้อมูลหน่วยนับ <font color="red">*</font>
                      </Label>
                      <Col sm={12}>
                        <Input
                          type="text"
                          name="UnitName"
                          placeholder="ข้อมูลหน่วยนับ"
                          onChange={this.handleInputChange}
                          value={this.state.UnitName}
                          // required
                        />
                      </Col>
                      <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError}
                      </Col>
                    </FormGroup>
                    <FormGroup style={{ textAlign: 'right' }}>
                      <Button color="primary">บันทึก</Button>&nbsp;
                      <Button color="secondary" onClick={this.toggle()}>
                        ยกเลิก
                      </Button>
                    </FormGroup>
                  </Form>
                </ModalBody>
                <ModalFooter />
              </Modal>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}
