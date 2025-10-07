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
export default class FormProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Budget: [],
      ButgetSource: [],
      ButgetSource1: [],
      ButgetSource2: [],
      ButgetSources: [],
      refreshing: false,
      modal: false,
      selectedTeam: '',
      validationError: '',
      select: '',
      PlanName: '',
    };
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

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };
  fetchData = () => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataPlans/list')
      .then(res => {
        const Budget = res.data;
        this.setState({ Budget });
        //
      });
  };
  fetch = id => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources' + id)
      .then(ress => {
        const ButgetSource = ress.data;
        this.setState({ ButgetSource });
      })
      .catch(error => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.fetchData();
    this.fetch();
    this.fetch1();
  }
  fetch1 = () => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataMainPlans/list')
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
  testAxiosPost = () => {
    axios
      .post(process.env.REACT_APP_SOURCE_URL + '/dataPlans', {
        plan_id: Math.floor(Math.random() * 100),
        budget_source_id: Math.floor(Math.random() * 100),
        plan_name: Math.random()
          .toString(36)
          .substring(2),
      })

      .then(res => {
        this.fetchData();
      });
  };
  testAxiosDELETE = id => {
    axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataPlans/' + id)
      .then(res => {
        this.fetchData();
      })
      .catch(err => {
        console.log(err);
      });
  };
  handleSubmit() {
    axios
      .post(process.env.REACT_APP_SOURCE_URL + '/dataPlans', {
        budget_source_id: this.state.select,
        plan_name: this.state.PlanName,
      })
      .then(res => {
        // this.setState({
        //     movies:[this.state.name,this.state.type,this.state.description, this.state.id]
        // })
        this.toggle();
      });
  }
  employeeCreate = (select, PlanName) => {
    axios
      .post(process.env.REACT_APP_SOURCE_URL + '/dataPlans', {
        budget_source_id: select,
        plan_name: PlanName,
      })
      .then(res => {
      });
  };
  render() {
    return (
      <Form>
        <FormGroup inline>
          <Col md={12} inline>
            <Col sm={12}>
              <Label for="ProjectID" sm={5}>
                รหัสโครงการ :
              </Label>
              <Col sm={12}>
                {this.state.ButgetSource.map(id => (
                  <Label>{id.budget_source_name}</Label>
                ))}
              </Col>
            </Col>
            <Col sm={12}>
              <Label for="Project" sm={5}>
                ชื่อโครงการ :
              </Label>
              <Col sm={12}>
                {this.state.ButgetSource1.map(id => (
                  <Label>{id.budget_source_name}</Label>
                ))}
              </Col>
            </Col>

            <Col sm={12}>
              <Label for="Select" sm={5}>
                ชื่อกิจกรรม :
              </Label>
              <Col sm={12}>
                {this.state.ButgetSource2.map(id => (
                  <Label>{id.budget_source_name}</Label>
                ))}
              </Col>
            </Col>
          </Col>
        </FormGroup>
        <Row>
          <Col xl={6} lg={6} md={6}>
            <FormGroup inline>
              <Label for="Select" sm={12}>
                ความก้าวหน้ากิจกรรม
              </Label>
              <Col sm={12}>
                <Input type="select" name="progress">
                  <option disabled selected>
                    ความก้าวหน้ากิจกรรม
                  </option>
                  <option value="1">10%</option>
                  <option value="2">20%</option>
                  <option value="3">30%</option>
                  <option value="4">40%</option>
                  <option value="5">50%</option>
                  <option value="6">60%</option>
                  <option value="7">70%</option>
                  <option value="8">80%</option>
                  <option value="9">90%</option>
                  <option value="10">100%</option>
                </Input>
              </Col>
            </FormGroup>
          </Col>
          <Col xl={6} lg={6} md={6}>
            <FormGroup inline>
              <Label for="PlanTime" xl={12} lg={12} md={12}>
                ระยะเวลาดำเนินการตามแผน
              </Label>
              <Col xl={12} lg={12} md={12} style={{ overflow: 'hidden' }}>
                <FormGroup check inline>
                  <Label check>
                    <Input type="radio" name="1" value="1" />
                    <Label
                      style={{
                        backgroundColor: '#05d205',
                        color: 'white',
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                      }}
                    >
                      {'    '}
                      ตรงตามที่กำหนด{' '}
                    </Label>
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check>
                    <Input type="radio" name="1" value="2" />
                    <Label
                      style={{
                        backgroundColor: '#07bbe9',
                        color: 'white',
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                      }}
                    >
                      {' '}
                      เร็วกว่าที่กำหนด{' '}
                    </Label>
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check>
                    <Input type="radio" name="1" value="3" />
                    <Label
                      style={{
                        backgroundColor: 'orange',
                        color: 'white',
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                      }}
                    >
                      {' '}
                      ช้ากว่าที่กำหนด{' '}
                    </Label>
                  </Label>
                </FormGroup>
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xl={12} lg={12} md={12}>
            <FormGroup>
              <Label for="Performance" sm={12}>
                ผลการดำเนินงาน{' '}
              </Label>
              <Col sm={12}>
                <Input
                  type="textarea"
                  name="Performance"
                  placeholder="ผลการดำเนินงาน"
                />
              </Col>
              <Label for="Issue" sm={12}>
                ปัญหา/อุปสรรค{' '}
              </Label>
              <Col sm={12}>
                <Input
                  type="textarea"
                  name="Issue"
                  placeholder="ปัญหา/อุปสรรค "
                />
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xl={6} lg={6} md={6}>
            <FormGroup inline>
              <Label for="PlanTime" xl={12} lg={12} md={12}>
                ผลสำเร็จโครงการ
              </Label>
              <Col xl={12} lg={12} md={12}>
                <FormGroup check inline>
                  <Input type="checkbox" name="Finish" />
                  โครงการเสร็จสิ้นแล้ว
                </FormGroup>
              </Col>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xl={12} lg={12} md={12} style={{ textAlign: 'center' }}>
            <FormGroup>
              <Button color="primary">บันทึก</Button>
              <Button color="defualt">ยกเลิก</Button>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    );
  }
}
