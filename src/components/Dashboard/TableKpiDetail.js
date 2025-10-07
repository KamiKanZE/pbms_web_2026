import Page from 'components/Page';
import axios from 'axios';
import React from 'react';
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
  Label,
  Progress,
} from 'reactstrap';
import ToolTip from 'react-portal-tooltip';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import { yellow } from '@material-ui/core/colors';
export const monthShortNameTH = [
  'ม.ค',
  'ก.พ',
  'มี.ค',
  'เม.ย',
  'พ.ค',
  'มิ.ย',
  'ก.ค',
  'ส.ค',
  'ก.ย',
  'ต.ค',
  'พ.ย',
  'ธ.ค',
];
export const monthShortNameEN = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];
export const dateToShortString = (date, language = 'EN') => {
  const monthNameArray = language == 'EN' ? monthShortNameEN : monthShortNameTH;
  return date != undefined
    ? `${moment(date).format('D')} ${
        monthNameArray[Number(moment(date).format('M')) - 1]
      } ${Number(moment(date).format('YYYY'))}`
    : '';
};

function ProgressBar({ dataprogress, datapic }) {
  let color;
  if (dataprogress <= 30) {
    color = 'danger';
  } else if (dataprogress <= 60) {
    color = 'warning';
  } else {
    color = 'success';
  }
  let title = 'เปอร์เซ็นการรายงานผล ตัวชี้วัด';
  return (
    <Progress
      color={color}
      value={dataprogress}
      className="mt-2"
      title={title}
      style={{ backgroundColor: 'rgba(106, 130, 251, 0.25)' }}
    >
      {datapic == '1' ? (
        <Label style={{ marginBottom: '0px', color: 'black' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path d="M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm9-13H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12z" />
          </svg>
          {dataprogress}%
        </Label>
      ) : (
        <Label style={{ marginBottom: '0px', color: 'black' }}>
          <img
            src="https://img.icons8.com/material-rounded/24/000000/in-progress.png"
            width="18"
            height="18"
          />
          {dataprogress}%
        </Label>
      )}
    </Progress>
  );
}

class KPIData extends React.Component {
  render() {
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
      <ToolTip
        active={this.props.brand}
        position="top"
        arrow="center"
        parent={this.props.id}
        style={styleTooltip}
      >
        <div>
          <FormGroup inline>
            <Row>
              <Col sm={12}>
                <Label for="ProjectID" sm={12}>
                  <h4>ข้อมูลตัวชี้วัด</h4>
                </Label>
              </Col>
              <Col sm={12}>
                <Label for="ProjectID" sm={4} style={mystyleRight}>
                  <b>รหัสตัวชี้วัด :</b>
                </Label>

                <Label sm={8}>
                  {this.props.DetailData.kpi_code != ''
                    ? this.props.DetailData.kpi_code
                    : '-'}
                </Label>
              </Col>
              <Col sm={12}>
                <Label for="Project" sm={4} style={mystyleRight}>
                  <b>ชื่อตัวชี้วัด :</b>
                </Label>

                <Label sm={8}>
                  {this.props.DetailData.kpi_name != ''
                    ? this.props.DetailData.kpi_name
                    : '-'}
                </Label>
              </Col>
              <Col sm={12}>
                <Label for="ProjectID" sm={4} style={mystyleRight}>
                  <b>ประเภทตัวชี้วัด :</b>
                </Label>

                <Label sm={8}>
                  {this.props.DetailData.kpi_type_name != ''
                    ? this.props.DetailData.kpi_type_name
                    : '-'}
                </Label>
              </Col>
              <Col sm={12}>
                <Label for="Project" sm={4} style={mystyleRight}>
                  <b>หน่วยนับ :</b>
                </Label>

                <Label sm={8}>
                  {this.props.DetailData.kpi_unit_name != ''
                    ? this.props.DetailData.kpi_unit_name
                    : '-'}
                </Label>
              </Col>
              <Col sm={12}>
                <Label for="Project" sm={4} style={mystyleRight}>
                  <b>ค่าเป้าหมาย :</b>
                </Label>

                <Label sm={8}>
                  {this.props.DetailData.kpi_plan != ''
                    ? this.props.DetailData.kpi_plan
                    : '-'}
                </Label>
              </Col>
              {/* <Col sm={12}>
                <Label for="Project" sm={4} style={mystyleRight}>
                  <b>เดือนสำหรับรายงานผล :</b>
                </Label>

                <Label sm={8}></Label>
              </Col> */}
              {/* <Col sm={12}>
                <Label for="Project" sm={4} style={mystyleRight}>
                  <b>หน่วยงานผู้รับผิดชอบ :</b>
                </Label>

                <Label sm={8}></Label>
              </Col> */}
            </Row>
          </FormGroup>
        </div>
      </ToolTip>
    );
  }
}

class TableDetail extends React.Component {
  state = {
    list: [],
    listRisk: [],
    data: [],
    selected: 0,
    offset: 0,
    perPage: 0,
    url: process.env.REACT_APP_SOURCE_URL + '/Projects/',
    result: [],
    result1: [],
    isTooltipActive: false,
    tooltipID: '',
    isTooltipRiskActive: false,
    ProjectRiskID: '',
    isTooltipActivBgActive: false,
    ProjectActivID: '',
    project_id: '',
    TbHeaderColor: '',
  };

  hideTooltip() {
    this.setState({ isTooltipActive: false });
  }

  Showtitle(type) {
    let title = <b> - </b>;
    if (type == 0) {
      title = <b style={{ color: '#6a82fc' }}>ตรงตามเวลาที่กำหนด</b>;
      this.setState({
        TbHeaderColor: '#6a82fc',
      });
    }
    return title;
  }

  componentDidMount() {}

  showKPIData = (id, status, datas) => {
    this.setState({
      isTooltipActive: status,
      tooltipID: '#kpiData' + id,
      data: datas,
    });
  };

  showActivityData = (id, status) => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/projects/activities/' + id)
      .then(res => {
        this.setState({
          list:
            res.data != ''
              ? res.data
              : [{ activity_detail: 'ไม่มีข้อมูลกิจกรรม...' }],
          isTooltipActivBgActive: status,
          ProjectActivID: '#projectActivityData' + id,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  showRiskData = (id, status) => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/projects/risks/' + id)
      .then(res => {
        this.setState({
          listRisk:
            res.data != ''
              ? res.data
              : [{ detail: 'ไม่มีข้อมูลความเสี่ยง...' }],
          isTooltipRiskActive: status,
          ProjectRiskID: '#risk' + id,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    let color = '#e5e5e5';
    if (this.props.color == 'rgb(184, 184, 184)') {
      color = 'black';
    }
    return (
      <Col lg="12" md="12" sm="12" style={{ display: this.props.display }}>
        <Card>
          <CardHeader style={{ textAlign: 'center' }}>
            <b>รายละเอียดผลการดำเนินงานตาม KPI</b>
            <br />
            <b style={{ color: this.props.color }}>{this.props.Title}</b>
          </CardHeader>
          <CardBody>
            <Table hover responsive>
              <thead>
                <tr style={{ backgroundColor: this.props.color, color: color }}>
                  <th width="10%">รหัสตัวชี้วัด</th>{' '}
                  <th width="40%" style={{ textAlign: 'center' }}>
                    {' '}
                    ชื่อตัวชี้วัด
                  </th>
                  <th width="20%" style={{ textAlign: 'center' }}>
                    {' '}
                    ผลการรายงานตัวชี้วัด
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.data.map(data => (
                  <tr>
                    <td>{data.kpi_code}</td>
                    <td>
                      <p
                        id={'kpiData' + data._id}
                        onMouseEnter={() =>
                          this.showKPIData(data._id, true, data)
                        }
                        onMouseLeave={() =>
                          this.showKPIData(data._id, false, data)
                        }
                      >
                        {data.kpi_name}
                      </p>
                      <KPIData
                        brand={this.state.isTooltipActive}
                        id={this.state.tooltipID}
                        DetailData={this.state.data}
                      />
                    </td>
                    <td>
                      <ProgressBar dataprogress={data.kpi_progress} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
export default TableDetail;
