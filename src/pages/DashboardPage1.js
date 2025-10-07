import { AnnouncementCard, TodosCard } from 'components/Card';
import HorizontalAvatarList from 'components/HorizontalAvatarList';
import MapWithBubbles from 'components/MapWithBubbles';
import Page from 'components/Page';
import ProductMedia from 'components/ProductMedia';
import SupportTicket from 'components/SupportTicket';
import UserProgressTable from 'components/UserProgressTable';
import { IconWidget, NumberWidget } from 'components/Widget';
import { getStackLineChart, stackLineChartOptions } from 'demos/chartjs';
import $ from 'jquery';
import ToolTip from 'react-portal-tooltip';
import {
  avatarsData,
  chartjs,
  productsData,
  supportTicketsData,
  todosData,
  userProgressTableData,
} from 'demos/dashboardPage';
import React, { useState } from 'react';
import axios from 'axios';
import { Bar, Line, Pie, HorizontalBar, Doughnut } from 'react-chartjs-2';
import {
  MdBubbleChart,
  MdInsertChart,
  MdPersonPin,
  MdPieChart,
  MdRateReview,
  MdShare,
  MdShowChart,
  MdThumbUp,
} from 'react-icons/md';
import InfiniteCalendar from 'react-infinite-calendar';
import {
  Badge,
  Button,
  Table,
  Card,
  CardBody,
  CardDeck,
  CardGroup,
  CardHeader,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  FormGroup,
  Input,
  Tooltip,
  Label,
} from 'reactstrap';
import { getColor } from 'utils/colors';
import { randomNum } from 'utils/demos';
import moment from 'moment';
import { textAlign, width } from '@material-ui/system';
const today = new Date();
const lastWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7,
);
////////////////////////
const groupArrayByDistinctValue = (array, keyName = false) => {
  let distinctValues = [];
  let newObject = [];
  array.forEach(obj => {
    if (!!keyName) {
      if (!distinctValues.includes(obj[keyName])) {
        distinctValues.push(obj[keyName]);
        newObject.push({ value: obj[keyName], dataSet: [obj] });
      } else {
        let index = newObject.findIndex(e => e.value == obj[keyName]);
        newObject[index].dataSet = [...newObject[index].dataSet, obj];
      }
    } else {
      if (distinctValues.includes(obj)) {
        let index = newObject.findIndex(e => e.value == obj);
        newObject[index].count = newObject[index].count + 1;
      } else {
        distinctValues.push(obj);
        newObject.push({ value: obj, count: 1 });
      }
    }
  });
  return newObject;
};
const colorChart = [
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC',
];
//////////////////
class DashboardPage extends React.Component {
  state = {
    list: [],
    modalShow: false,
    data: [],
    selected: 0,
    offset: 0,
    perPage: 0,
    url: process.env.REACT_APP_SOURCE_URL + '/Projects/',
    result: [],
    result1: [],
    isTooltipActive: false,
    isTooltipActive2: false,
    isTooltipActive3: false,
  };
  showTooltip() {
    this.setState({ isTooltipActive: true });
  }
  hideTooltip() {
    this.setState({ isTooltipActive: false });
  }
  showTooltip2() {
    this.setState({ isTooltipActive2: true });
  }
  hideTooltip2() {
    this.setState({ isTooltipActive2: false });
  }
  showTooltip3() {
    this.setState({ isTooltipActive3: true });
  }
  hideTooltip3() {
    this.setState({ isTooltipActive3: false });
  }
  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
    this.loadCommentsFromServer();
  }

  loadCommentsFromServer() {
    $.ajax({
      url:
        this.state.url +
        '?page=' +
        this.state.selected +
        '&size=' +
        this.state.perPage,
      //data: { totalPage: this.state.perPage, offset: this.state.offset },
      dataType: 'json',
      type: 'GET',
      success: data => {
        let result = data.result.filter(
          results => results.project_progress == 0,
        );
        let result1 = data.result.filter(
          results1 => results1.project_progress != 0,
        );
        this.setState({
          data: data.result,
          result: result,
          result1: result1,
          //pageCount: Math.ceil(data.pagination.itemTotal / this.state.perPage),
        });
      },

      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString()); // eslint-disable-line
      },
    });
  }
  render() {
    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary');
    const MONTHS = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const genPieData = () => {
      const { data } = this.state;
      // console.log(data.map(el => moment(el.create_date).format('M')));
      let pieDataSet = groupArrayByDistinctValue(
        this.state.data,
        'budget_type_name',
      );
      return {
        datasets: [
          {
            data: pieDataSet.map(e => e.dataSet.length),
            backgroundColor: colorChart,
            label: 'Dataset 1',
          },
        ],
        labels: pieDataSet.map(e => e.value),
      };
    };
    const genDataDepart = () => {
      const { data } = this.state;
      // console.log(data.map(el => moment(el.create_date).format('M')));
      let pieDataSet = groupArrayByDistinctValue(
        this.state.data,
        'department_name',
      );
      return {
        datasets: [
          {
            data: pieDataSet.map(e => e.dataSet.length),
            backgroundColor: colorChart,
            label: 'Dataset 1',
          },
        ],
        labels: pieDataSet.map(e => e.value),
      };
    };

    const genDataDepart1 = () => {
      const { data } = this.state;
      // console.log(data.map(el => moment(el.create_date).format('M')));
      let pieDataSet = groupArrayByDistinctValue(
        this.state.data,
        'department_name',
      );
      return {
        datasets: [
          {
            data: pieDataSet.map(e => e.dataSet.length),
            backgroundColor: colorChart,
            label: 'Dataset 1',
          },
        ],
        labels: pieDataSet.map(e => e.value),
      };
    };
    // console.log(groupArrayByDistinctValue(this.state.data, 'budget_source_id'));
    const mystyle = {
      textAlign: '-webkit-center',
    };
    const mystyleRight = {
      textAlign: '-webkit-right',
    };
    const styleWhite = {
      color: 'white',
    };
    let styleTooltip = {
      style: {
        background: 'rgba(0,0,0,.8)',
        padding: 20,
        boxShadow: '5px 0px 3px rgba(0,0,0,.1)',
        color: 'white',
        width: '800px',
      },
      arrowStyle: {
        color: 'rgba(0,0,0,.8)',
        borderColor: false,
      },
    };
    return (
      <Page
        className="DashboardPage"
        title="Dashboard"
        breadcrumbs={[{ name: 'Dashboard', active: true }]}
      >
        <Row>
          {/* <Col lg="12" md="12" sm="12">
            <Card>
              <CardHeader>โครงการทั้งหมด {this.state.data.length} โครงการ</CardHeader>
              <CardBody style={{ paddingLeft: '0', paddingRight: '0' }}>
                <Col md="12" style={{ width: '99%' }}>
                  <HorizontalBar data={genLineData()} />
                </Col>
              </CardBody>
            </Card>
          </Col> */}

          <Col lg="12" md="12" sm="12" xs="12">
            <Card style={{ width: '99.9%' }}>
              <CardHeader>ความก้าวหน้าโครงการ</CardHeader>
              <CardBody style={mystyle}>
                <Col lg="6" md="6" sm="6" xs="6">
                  <FormGroup>
                    <Input type="select" name="select" id="exampleSelect">
                      <option>งบดำเนินงาน</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6" sm="6" xs="6">
                  <Pie data={genPieData()} />
                </Col>
              </CardBody>
            </Card>
          </Col>

          {/* <Col lg="6" md="12" sm="12" xs="12">
            <Card>
              <CardHeader>ระบบติดตามแผนงานโครงการ</CardHeader>
              <CardBody>
                <Line data={genPieData()} />
              </CardBody>
            </Card>
          </Col> */}
          <Col lg="12" md="12" sm="12">
            <Card>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th colSpan="5" style={mystyle}>
                        งบดำเนินงาน
                      </th>
                    </tr>
                    <tr>
                      <th>ชื่อโครงการ</th>{' '}
                      <th style={{ textAlign: 'center' }}>
                        {' '}
                        งบประมาณทั้งโครงการ
                      </th>
                      <th style={{ textAlign: 'center' }}> งบประมาณที่ใช้</th>
                      <th style={{ textAlign: 'center' }}> งบประมาณที่เหลือ</th>
                      <th style={{ textAlign: 'center' }}>
                        {' '}
                        ความก้าวหน้าการเบิกจ่าย
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <p
                          id="text"
                          onMouseEnter={this.showTooltip.bind(this)}
                          onMouseLeave={this.hideTooltip.bind(this)}
                        >
                          โครงการพัฒนาระบบ Project and Budget Monitoring System
                          By MyBizThailand.
                        </p>
                        <ToolTip
                          active={this.state.isTooltipActive}
                          position="top"
                          arrow="center"
                          parent="#text"
                          style={styleTooltip}
                        >
                          <div>
                            <FormGroup inline>
                              <Row>
                                <Col sm={12}>
                                  <Label for="ProjectID" sm={12}>
                                    <h4>ข้อมูลโครงการ</h4>
                                  </Label>
                                </Col>
                                <Col sm={12}>
                                  <Label
                                    for="ProjectID"
                                    sm={4}
                                    style={mystyleRight}
                                  >
                                    <b>ชื่อโครงการ :</b>
                                  </Label>

                                  <Label sm={8}>
                                    โครงการพัฒนาระบบ Project and Budget
                                    Monitoring System By MyBizThailand.
                                  </Label>
                                </Col>
                                <Col sm={12}>
                                  <Label
                                    for="Project"
                                    sm={4}
                                    style={mystyleRight}
                                  >
                                    <b>
                                      ความสำคัญของโครงการ/หลักการและเหตุผล :
                                    </b>
                                  </Label>

                                  <Label sm={8}>
                                    งี้ ซิลเวอร์ คอนแท็ควาทกรรมแคมปัสอพาร์ทเมนท์
                                    สุนทรีย์ตนเองล็อบบี้วอลซ์
                                  </Label>
                                </Col>
                                <Col sm={12}>
                                  <Label
                                    for="Project"
                                    sm={4}
                                    style={mystyleRight}
                                  >
                                    <b>
                                      ขอบเขตของโครงการ/พื้นที่เป้าหมาย/กลุ่มเป้าหมาย
                                      :
                                    </b>
                                  </Label>

                                  <Label sm={8}>
                                    คอนแท็ควาทกรรมแคมปัสอพาร์ทเมนท์
                                    สุนทรีย์ตนเองล็อบบี้วอลซ์
                                  </Label>
                                </Col>
                                <Col sm={12}>
                                  <Label
                                    for="Project"
                                    sm={4}
                                    style={mystyleRight}
                                  >
                                    <b>วัตถุประสงค์ :</b>
                                  </Label>

                                  <Label sm={8}>
                                    ซาบะวาทกรรมปาสเตอร์เคสเช็ก
                                  </Label>
                                </Col>
                              </Row>
                            </FormGroup>
                          </div>
                        </ToolTip>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <p
                          id="text2"
                          onMouseEnter={this.showTooltip2.bind(this)}
                          onMouseLeave={this.hideTooltip2.bind(this)}
                        >
                          3000000
                        </p>
                        <ToolTip
                          active={this.state.isTooltipActive2}
                          position="top"
                          arrow="center"
                          parent="#text2"
                          style={styleTooltip}
                        >
                          <div>
                            <Row>
                              <Col sm={12}>
                                <Label for="ProjectID" sm={12}>
                                  <h4>ข้อมูลกิจกรรมภายใต้โครงการ</h4>
                                </Label>
                              </Col>
                            </Row>
                            <Row>
                              <Table responsive style={styleWhite}>
                                <thead>
                                  <tr>
                                    <th>ขั้นตอน/กิจกรรม</th>
                                    <th>ค่าใช้จ่าย</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>ขั้นตอนที่ 1 </td>
                                    <td>200000</td>
                                  </tr>
                                  <tr>
                                    <td>ขั้นตอนที่ 2 </td>
                                    <td>300000</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </Row>
                          </div>
                        </ToolTip>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <p
                          id="text3"
                          onMouseEnter={this.showTooltip3.bind(this)}
                          onMouseLeave={this.hideTooltip3.bind(this)}
                        >
                          100000
                        </p>
                        <ToolTip
                          active={this.state.isTooltipActive3}
                          position="top"
                          arrow="center"
                          parent="#text3"
                          style={styleTooltip}
                        >
                          <div>
                            <Row>
                              <Col sm={12}>
                                <Label for="ProjectID" sm={12}>
                                  <h4>ยอดเงินที่ใช้ไป / คงเหลือของกิจกรรม</h4>
                                </Label>
                              </Col>
                            </Row>
                            <Row>
                              <Table responsive style={styleWhite}>
                                <thead>
                                  <tr>
                                    <th>ขั้นตอน/กิจกรรม</th>
                                    <th>ยอดเงินที่ใช้ไป</th>
                                    <th>ยอดเงินคงเหลือ</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>ขั้นตอนที่ 1 </td>
                                    <td>18000</td>
                                    <td>2000</td>
                                  </tr>
                                  <tr>
                                    <td>ขั้นตอนที่ 2 </td>
                                    <td>200000</td>
                                    <td>100000</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </Row>
                          </div>
                        </ToolTip>
                      </td>
                      <td style={{ textAlign: 'center' }}>2900000</td>
                      <td style={{ textAlign: 'center' }}>3.33 %</td>
                    </tr>
                    <tr>
                      <td>
                        โครงการพัฒนาระบบ Project and Budget Monitoring System By
                        MyBizThailand.
                      </td>
                      <td style={{ textAlign: 'center' }}>3000000</td>
                      <td style={{ textAlign: 'center' }}>100000</td>
                      <td style={{ textAlign: 'center' }}>2900000</td>
                      <td style={{ textAlign: 'center' }}>3.33 %</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}
export default DashboardPage;
