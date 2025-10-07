import React from 'react';
import axios from 'axios';
import Page from 'components/Page';
import {
  Button,
  ButtonGroup,
  Table,
  Card,
  CardBody,
  CardHeader,
  Col,
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
  Row,
} from 'reactstrap';

export default class SubPlanAList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Budget: [],
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
      .get(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanAs/list')
      .then(res => {
        const Budget = res.data;
        this.setState({ Budget });
      });
  };

  fetch = () => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataMainPlans/list?page=0&size=0')
      .then(ress => {
        const ButgetSource = ress.data.map(id => {
          return { value: id.main_plan_id, display: id.main_plan_name };
        });
        this.setState({
          ButgetSources: [
            { value: '', display: '(เลือกข้อมูลกิจกรรมหลัก)' },
          ].concat(ButgetSource),
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.fetchData();
    this.fetch();
    this.toggle();
  }

  testAxiosPost = () => {
    axios
      .post(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanAs', {
        sub_plan_A_id: Math.floor(Math.random() * 100),
        main_plan_id: Math.floor(Math.random() * 100),
        sub_plan_A_name: Math.random()
          .toString(36)
          .substring(2),
      })

      .then(res => {
        this.fetchData();
      });
  };
  testAxiosDELETE = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanAs/' + id)
      .then(res => {
        this.fetchData();
      })
      .catch(err => {
        console.log(err);
      });
  };
  handleSubmit() {
    axios
      .post(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanAs', {
        budget_source_id: this.state.select,
        plan_name: this.state.PlanName,
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
                  <th>SubPlan A id</th>
                  <th>MainPlanID</th>
                  <th>SubPlan A Name</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {this.state.Budget.map(id => (
                  <tr>
                    <td>{id.sub_plan_A_id}</td>
                    <td>{id.main_plan_id}</td>
                    <td>{id.sub_plan_A_name}</td>
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
                เพิ่มข้อมูลกิจกรรมรอง A
              </ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup>
                    <Label for="MainPlanID" sm={12}>
                      ข้อมูลกิจกรรมหลัก
                    </Label>
                    <Col sm={12}>
                      <Input type="select" name="MainPlanID">
                        {this.state.ButgetSources.map(id => (
                          <option key={id.value} value={id.value}>
                            {id.display}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError}
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Label for="SubPlanA" sm={12}>
                      ชื่อกิจกรรมรอง A
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="SubPlanA"
                        placeholder="ชื่อกิจกรรมรอง A"
                      />
                    </Col>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError}
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
