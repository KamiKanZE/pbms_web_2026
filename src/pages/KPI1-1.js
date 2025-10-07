import Page from 'components/Page';
import axios from 'axios';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Calendar from 'react-infinite-calendar';
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
} from 'reactstrap';
import { getColor } from 'utils/colors';
import Picker from 'react-month-picker';
const today = new Date();
const lastWeek = new Date(today.getFullYear(), today.getMonth());
export default class Project1_2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Budget: [],
      ButgetSource: [],
      ButgetSources: [],
      refreshing: false,
      modal: false,
      selectedTeam: '',
      validationError: '',
      select: '',
      PlanName: '',
      Namekpi: '',
      Target: '',
    };
  }
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
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
    this.fetchData();
    this.fetch();
    this.toggle();
  }

  render() {
    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary');
    let pickerLang = {
        months: [
          'Jan',
          'Feb',
          'Mar',
          'Spr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        from: 'From',
        to: 'To',
      },
      mvalue = { year: 2015, month: 11 },
      mrange = { from: { year: 2014, month: 8 }, to: { year: 2015, month: 5 } };

    let makeText = m => {
      if (m && m.year && m.month)
        return pickerLang.months[m.month - 1] + '. ' + m.year;
      return '?';
    };
    return (
      <Page
        title="ข้อมูลตัวชี้วัด"
        breadcrumbs={[{ name: 'ข้อมูลตัวชี้วัด', active: true }]}
        className="Project1_2"
      >
        <Row>
          <Col>
            <Card className="mb-3">
              <CardBody>
                <br />
                <Row>
                  <Col>
                    <Form>
                      <Row>
                        <Col xl={6} lg={6} md={6}>
                          <FormGroup>
                            <Label sm={12}>ประเภทตัวชี้วัด</Label>
                            <Col sm={12}>
                              <Input
                                type="select"
                                name="TypeKpi"
                                placeholder="ประเภทตัวชี้วัด"
                              >
                                <option selected disabled>
                                  ประเภทตัวชี้วัด
                                </option>
                              </Input>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xl={6} lg={6} md={6}>
                          <FormGroup>
                            <Label sm={12}>รหัสตัวชี้วัด</Label>
                            <Col sm={12}>
                              <Input
                                type="select"
                                name="IdKpi"
                                placeholder="รหัสตัวชี้วัด"
                              />
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup>
                        <Label sm={12}>ชื่อตัวชี้วัด</Label>
                        <Col sm={12}>
                          <Input name="Namekpi" placeholder="ชื่อตัวชี้วัด" />
                        </Col>
                      </FormGroup>
                      <Row>
                        <Col xl={6} lg={6} md={6}>
                          <FormGroup>
                            <Label sm={12}>ค่าเป้าหมาย</Label>
                            <Col sm={12}>
                              <Input name="Target" placeholder="ค่าเป้าหมาย" />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xl={6} lg={6} md={6}>
                          <FormGroup>
                            <Label sm={12}>หน่วยนับ</Label>
                            <Col sm={12}>
                              <Input
                                type="select"
                                name="Unit"
                                placeholder="หน่วยนับ"
                              >
                                <option value="คน">คน</option>
                                <option value="อัน">อัน</option>
                              </Input>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xl={6} lg={6} md={6}>
                          <FormGroup>
                            <Label sm={12}>เดือนสำหรับรายงานผล</Label>
                            <Col lg="12" md="12" sm="12" xs="12">
                              <div className="แก้ไข">
                                <Picker
                                  ref="pickAMonth"
                                  years={[
                                    2008,
                                    2010,
                                    2011,
                                    2012,
                                    2014,
                                    2015,
                                    2016,
                                    2017,
                                  ]}
                                  name="dateMonth"
                                  value={mvalue}
                                  lang={pickerLang.months}
                                  onChange={this.handleAMonthChange}
                                  onDismiss={this.handleAMonthDissmis}
                                >
                                  {/* <MonthBox
                                    value={makeText(mvalue)}
                                    onClick={this.handleClickMonthBox}
                                  /> */}
                                </Picker>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xl={6} lg={6} md={6}>
                          <FormGroup>
                            <Label sm={12}>ชื่อผู้รับผิดชอบ</Label>
                            <Col sm={12}>
                              <Input
                                type="select"
                                name="Owner"
                                placeholder="ชื่อผู้รับผิดชอบ"
                              >
                                <option selected disabled>
                                  ชื่อผู้รับผิดชอบรายงานผล
                                </option>
                                <option value="นาย">นาย</option>
                                <option value="นาง">นาง</option>
                              </Input>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{ textAlign: 'center' }}>
                          <Button color="primary">Submit</Button>
                          <Button color="secondary">Cancel</Button>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}
