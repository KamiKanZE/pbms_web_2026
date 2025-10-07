import axios from 'axios';
import Page from 'components/Page';
import moment from 'moment'; // Example for onSort prop
import React from 'react'; // Import React
import { render } from 'react-dom'; // Import render method
import Datatable from 'react-bs-datatable'; // Import this package
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
} from 'reactstrap';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { confirmAlert } from 'react-confirm-alert';

export default class Testtable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Budget: [],
      refreshing: false,
      BudgetSourceId: '',
      BudgetSourceName: '',
      modal: false,
      ID: '',
      isForm: '',
    };
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };
  fetchData = () => {
    //axios.get('http://192.168.42.141:3333/dataBudgetSource/list')
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources/list')
      .then(res => {
        const Budget = res.data.result;
        this.setState({ Budget });
        // ;
      });
  };

  componentDidMount() {
    this.fetchData();
    this.toggle();
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources/' + id)
      .then(res => {
        this.fetchData();
      })
      .catch(err => {
        console.log(err);
      });
  };

  onEdit = id => {
    // this.setState({ modal: true });
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources/' + id)
      .then(res => {
        const { _id, budget_source_id, budget_source_name } = res.data;

        this.setState({
          BudgetSourceId: budget_source_id,
          BudgetSourceName: budget_source_name,
          modal: true,
          ID: _id,
          isForm: 'edit',
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
      BudgetSourceId: '',
      PlanName: '',
      modal: true,
      isForm: '',
      ID: '',
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
      this.state.BudgetSourceId.trim() &&
      this.state.BudgetSourceName.trim()
    ) {
      axios
        .post(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources', {
          budget_source_id: this.state.BudgetSourceId.trim(),
          budget_source_name: this.state.BudgetSourceName.trim(),
        })
        .then(res => {
          this.fetchData();
          this.setState({
            modal: false,
            BudgetSourceId: '',
            BudgetSourceName: '',
            isForm: '',
            ID: '',
          });
        });
    } else {
      alert('กรุณากรอกข้อมูลให้ครบ');
    }
  };
  handleUpdate = e => {
    e.preventDefault();
    const ID = this.state.ID;
    if (
      this.state.BudgetSourceId.trim() &&
      this.state.BudgetSourceName.trim()
    ) {
      axios
        .patch(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources/' + ID, {
          budget_source_id: this.state.BudgetSourceId.trim(),
          budget_source_name: this.state.BudgetSourceName.trim(),
        })
        .then(res => {
          this.fetchData();
          this.setState({
            modal: false,
            BudgetSourceId: '',
            BudgetSourceName: '',
          });
        });
    } else {
      alert('กรุณากรอกข้อมูลให้ครบ');
    }
  };
  render() {
    const add = {
      add: (
        <Tooltip title="Add">
          <Fab
            className="btn_not_focus"
            onClick={() => this.onAdd()}
            color="primary"
          >
            <Icon>add</Icon>
          </Fab>
        </Tooltip>
      ),
    };

    const header = [
      {
        title: 'BUDGETSOUCEID',
        prop: 'budget_source_id',
        sortable: true,
        filterable: true,
        width: '100%',
      },
      { title: 'BUDGETSOUCENAME', prop: 'budget_source_name',width: '500px', filterable: true, sortable: true },
      { title: 'EDIT', prop: 'edit' },
      { title: 'DELETE', prop: 'delete' },
    ];

    const body = this.state.Budget.map(id => {
      return {
        budget_source_id: id.budget_source_id,
        budget_source_name: id.budget_source_name,
        edit: (
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
        ),
        // <Button className="btn btn-warning btn-sm">Edit</Button>,
        delete: (
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
          </Tooltip>
        ),
        // <Button className="btn btn-danger btn-sm">Delete</Button>,
      };
    });
    const onSortFunction = {
      date(columnValue) {
        // Convert the string date format to UTC timestamp
        // So the table could sort it by number instead of by string
        return moment(columnValue, 'Do MMMM YYYY').valueOf();
      },
    };

    const customLabels = {
      first: '<<',
      last: '>>',
      prev: '<',
      next: '>',
      show: 'Display',
      entries: 'rows',
      noResults: 'There is no data to be displayed',
    };
    return (
      <Row>
        <Col md={12} style={{ textAlign: 'right' }}>
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
        <Col md={12}>
          <Card>
            <CardBody>
              <Datatable
                tableHeader={header}
                tableBody={body}
                keyName="userTable"
                // tableClass="bordered striped hover"
                rowsPerPage={10}
                rowsPerPageOption={[2, 20, 50, 100]}
                initialSort={{ prop: 'budget_source_id', isAscending: true }}
                onSort={onSortFunction}
                tableFooter={customLabels}
                style={{ width: '100%' }}
                // labels={customLabels}
              />
              <Modal
                isOpen={this.state.modal}
                toggle={this.toggle()}
                className={this.props.className}
              >
                <ModalHeader toggle={this.toggle()}>
                  เพิ่มข้อมูลแหล่งงบประมาณ(ผลผลิต)
                </ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                      <Label sm={12}>รหัสข้อมูลแหล่งงบประมาณ(ผลผลิต)</Label>
                      <Col sm={12}>
                        <Input
                          type="text"
                          name="BudgetSourceId"
                          placeholder="รหัสข้อมูลแหล่งงบประมาณ(ผลผลิต)"
                          onChange={this.handleInputChange}
                          value={this.state.BudgetSourceId}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label sm={12}>ชื่อข้อมูลแหล่งงบประมาณ(ผลผลิต)</Label>
                      <Col sm={12}>
                        <Input
                          type="text"
                          name="BudgetSourceName"
                          placeholder="ชื่อข้อมูลแหล่งงบประมาณ(ผลผลิต)"
                          onChange={this.handleInputChange}
                          value={this.state.BudgetSourceName}
                        />
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
