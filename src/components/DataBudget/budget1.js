import React from 'react';
import axios from 'axios';
import Page from 'components/Page';
import {
  Col,
  Row,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  Form,
  Label,
  FormGroup,
  Input,
  Button,
} from 'reactstrap';

import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
class Index extends React.Component {
  state = {
    Budget: [],
    refreshing: false,
    modal: false,
    budget_source_id: '',
    budget_source_name: '',
  };
  toggle = modalType => () => {
    if (!modalType) {
      this.handleReset();
      return this.setState({
        modal: !this.state.modal,
      });
    }
    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (
      this.state.budget_source_id.trim() &&
      this.state.budget_source_name.trim()
    ) {
      this.props.onAddPost(this.state);
      this.handleReset();
    }
  };
  handleReset = () => {
    this.setState({
      budget_source_id: '',
      budget_source_name: '',
    });
  };
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };
  fetchData = () => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources/list')
      .then(res => {
        const Budget = res.data;
        this.setState({ Budget });
        //;
      });
  };
  componentDidMount() {
    this.fetchData();
  }
  render() {
    return (
      <Page
        title="BudgetSource-1"
        breadcrumbs={[{ name: 'Plan-1', active: true }]}
        className="Plan1"
      >
        <Row>
          <Col style={{ textAlign: 'right' }}>
            <Tooltip title="Add">
              <Fab
                className="btn_not_focus"
                onClick={this.toggle()}
                color="primary"
              >
                <Icon>add</Icon>
              </Fab>
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="mb-12">
              <CardBody>
                <Row>
                  <Col xl={8} lg={8} md={8} />
                  <Col xl={12} lg={12} md={12}>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>BudgetSourceID</th>
                          <th>BudgetSourceName</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.Budget.map(id => (
                          <tr>
                            <td />
                            <td>{id.budget_source_id}</td>
                            <td>{id.budget_source_name}</td>
                            <td>
                              <Tooltip title="แก้ไข">
                                <IconButton
                                  className="btn_not_focus"
                                  size="small"
                                  color="default"
                                  aria-label="แก้ไข"
                                >
                                  <Icon>edit_icon</Icon>
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="ลบ">
                                <IconButton
                                  className="btn_not_focus"
                                  size="small"
                                  color="secondary"
                                  aria-label="ลบ"
                                >
                                  <Icon>delete</Icon>
                                </IconButton>
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
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
        >
          <ModalHeader toggle={this.toggle()}>เพิ่มข้อมูลแผนงาน</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="budget_source_id" sm={12}>
                  รหัสข้อมูลแผนงาน
                </Label>
                <Col sm={12}>
                  <Input
                    type="text"
                    name="budget_source_id"
                    placeholder="รหัสข้อมูลแผนงาน"
                    onChange={this.handleInputChange}
                    value={this.state.budget_source_id}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Label for="budget_source_name" sm={12}>
                  ชื่อข้อมูลแผนงาน
                </Label>
                <Col sm={12}>
                  <Input
                    type="text"
                    name="budget_source_name"
                    placeholder="ชื่อข้อมูลแผนงาน"
                    onChange={this.handleInputChange}
                    value={this.state.budget_source_name}
                  />
                </Col>
              </FormGroup>
              <FormGroup style={{ textAlign: 'right' }}>
                <Col sm={12}>
                  <Button type="submit" color="primary" onClick={this.toggle()}>
                    Submit
                  </Button>
                  &nbsp;
                  {/* <Button color="secondary" onClick={this.toggle()}>
              Cancel
            </Button> */}
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </Page>
    );
  }
}
export default Index;
