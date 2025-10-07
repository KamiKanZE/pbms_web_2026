import React from 'react';
import axios from 'axios';
import Page from 'components/Page';
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
export default class SubPlanBList extends React.Component {
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
      .get(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanBs/list')
      .then(res => {
        const Budget = res.data;
        this.setState({ Budget });
      });
  };
  fetch = () => {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL + '/dataSubPlanAs/list?page=0&size=0',
      )
      .then(ress => {
        const ButgetSource = ress.data.map(id => {
          return { value: id.sub_plan_A_id, display: id.sub_plan_A_name };
        });
        this.setState({
          ButgetSources: [{ value: '', display: '(เลือกกิจกรรมรอง A)' }].concat(
            ButgetSource,
          ),
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
  testAxiosPost = () => {
    axios
      .post(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanBs', {
        sub_plan_B_id: Math.floor(Math.random() * 100),
        sub_plan_A_id: Math.floor(Math.random() * 100),
        sub_plan_B_name: Math.random()
          .toString(36)
          .substring(2),
      })

      .then(res => {
        this.fetchData();
      });
  };
  testAxiosDELETE = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanBs/' + id)
      .then(res => {
        this.fetchData();
      })
      .catch(err => {
        console.log(err);
      });
  };
  handleSubmit() {
    axios
      .post(process.env.REACT_APP_SOURCE_URL + '/dataSubPlanBs', {
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
                  <th>SubPlan B id</th>
                  <th>SubPlan A id</th>
                  <th>SubPlan B Name</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {this.state.Budget.map(id => (
                  <tr>
                    <td>{id.sub_plan_B_id}</td>
                    <td>{id.sub_plan_A_id}</td>
                    <td>{id.sub_plan_B_name}</td>
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
                เพิ่มข้อมูลกิจกรรมรอง B
              </ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup>
                    <Label for="SubPlanA" sm={12}>
                      ชื่อกิจกรรมรอง A
                    </Label>
                    <Col sm={12}>
                      <Input type="select" name="SubPlanA">
                        {this.state.ButgetSources.map(id => (
                          <option key={id.value} value={id.value}>
                            {id.display}
                          </option>
                        ))}
                      </Input>
                      <div style={{ color: 'red', marginTop: '5px' }}>
                        {this.state.validationError}
                      </div>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Label for="SubPlanB" sm={12}>
                      ชื่อกิจกรรมรอง B
                    </Label>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="SubPlanB"
                        placeholder="ชื่อกิจกรรมรอง B"
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
