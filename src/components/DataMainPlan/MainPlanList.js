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
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
} from 'reactstrap';
export default class MainPlanList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Budget: [],
      PlanID: '',
      MainPlan: '',
      ButgetSources: [],
      refreshing: false,
    };
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };
  fetchData = () => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataMainPlans/list')
      .then(res => {
        const Budget = res.data;
        this.setState({ Budget });
      });
  };
  fetch = () => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataPlans/list')
      .then(ress => {
        const ButgetSource = ress.data.map(id => {
          return { value: id.plan_id, display: id.plan_name };
        });
        this.setState({
          ButgetSources: [{ value: '', display: '(เลือกข้อมูลแผนงาน)' }].concat(
            ButgetSource,
          ),
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
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
  componentDidMount() {
    this.fetchData();
    this.fetch();
    this.toggle();
  }

  testAxiosPost = () => {
    axios
      .post(process.env.REACT_APP_SOURCE_URL + '/dataMainPlans', {
        main_plan_id: Math.floor(Math.random() * 100),
        plan_id: Math.floor(Math.random() * 100),
        main_plan_name: Math.random()
          .toString(36)
          .substring(2),
      })

      .then(res => {
        this.fetchData();
      });
  };
  testAxiosDELETE = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataMainPlans/' + id)
      .then(res => {
        this.fetchData();
      })
      .catch(err => {
        console.log(err);
      });
  };
  handleSubmit() {
    axios
      .post(process.env.REACT_APP_SOURCE_URL + '/dataMainPlans', {
        budget_source_id: this.state.PlanID,
        plan_name: this.state.MainPlan,
      })
      .then(res => {
        this.setState({
          movies: [
            this.state.name,
            this.state.type,
            this.state.description,
            this.state.id,
          ],
        });
        this.toggle();
      });
  }
  render() {
    return (
      <Page>
        <Row>
          <Col>
            <Table hover id="table1">
              <thead>
                <tr>
                  <th>MainPlanID</th>
                  <th>PlanID</th>
                  <th>MainPlanName</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {this.state.Budget.map(id => (
                  <tr>
                    <td>{id.main_plan_id}</td>
                    <td>{id.plan_id}</td>
                    <td>{id.main_plan_name}</td>
                    <td>
                      <Button className="btn btn-warning btn-sm">Edit</Button>
                    </td>
                    <td>
                      <Button
                        className="btn btn-danger btn-sm"
                        id={id._id}
                        onClick={() => this.testAxiosDELETE(id._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <button
              className="btn btn-primary btn-sm"
              onClick={this.testAxiosPost}
            >
              Add
            </button>
            <Button
              onClick={this.toggle()}
              className="btn btn-sm"
              color="primary"
            >
              Add
            </Button>
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle()}
              className={this.props.className}
            >
              <ModalHeader toggle={this.toggle()}>
                เพิ่มข้อมูลกิจกรรมหลัก
              </ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup>
                    <Label for="PlanID" sm={12}>
                      ข้อมูลแผนงาน
                    </Label>
                    <Col sm={12}>
                      <Input type="select" name="PlanID">
                        {this.state.ButgetSources.map(id => (
                          <option value={id.value}>{id.display}</option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={12}>
                      <div style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError}
                      </div>
                    </Col>
                    <Label for="MainPlan" sm={12}>
                      ชื่อกิจกรรมหลัก
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="MainPlan"
                        placeholder="ชื่อกิจกรรมหลัก"
                      />
                    </Col>
                  </FormGroup>
                  <Button color="primary" onClick={this.handleSubmit}>
                    Submit
                  </Button>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.toggle()}>
                  Submit
                </Button>
                <Button color="secondary" onClick={this.toggle()}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </Page>
    );
  }
}
