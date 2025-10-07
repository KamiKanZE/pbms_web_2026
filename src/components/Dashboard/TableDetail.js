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

function ProgressBar({ dataprogress, datapic }) {
  let color;
  if (dataprogress <= 30) {
    color = 'danger';
  } else if (dataprogress <= 60) {
    color = 'warning';
  } else {
    color = 'success';
  }
  let title;
  if (datapic == '1') {
    title = 'เปอร์เซ็นการเบิกจ่ายงบประมาณ';
  } else {
    title = 'เปอร์เซ็นการทำงานของโครงการ';
  }
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
          <img
            src="https://img.icons8.com/material-rounded/48/000000/thai-baht.png"
            width="14"
            height="14"
          />
          &nbsp;
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

class ProjectData extends React.Component {
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
                  <h4>ข้อมูลโครงการ</h4>
                </Label>
              </Col>
              <Col sm={12}>
                <Label for="ProjectID" sm={4} style={mystyleRight}>
                  <b>ชื่อโครงการ :</b>
                </Label>

                <Label sm={8}>
                  {this.props.DetailData.project_name != ''
                    ? this.props.DetailData.project_name
                    : '-'}
                </Label>
              </Col>
              <Col sm={12}>
                <Label for="Project" sm={4} style={mystyleRight}>
                  <b>ความสำคัญของโครงการ/หลักการและเหตุผล :</b>
                </Label>

                <Label sm={8}>
                  {this.props.DetailData.budget_source_name != ''
                    ? this.props.DetailData.budget_source_name
                    : '-'}
                </Label>
              </Col>
              <Col sm={12}>
                <Label for="Project" sm={4} style={mystyleRight}>
                  <b>ขอบเขตของโครงการ/พื้นที่เป้าหมาย/กลุ่มเป้าหมาย :</b>
                </Label>

                <Label sm={8}>
                  {this.props.DetailData.project_target != ''
                    ? this.props.DetailData.project_target
                    : '-'}
                </Label>
              </Col>
              <Col sm={12}>
                <Label for="Project" sm={4} style={mystyleRight}>
                  <b>วัตถุประสงค์ :</b>
                </Label>

                <Label sm={8}>
                  {this.props.DetailData.project_objective != ''
                    ? this.props.DetailData.project_objective
                    : '-'}
                </Label>
              </Col>
            </Row>
          </FormGroup>
        </div>
      </ToolTip>
    );
  }
}

class ProjectTotalBudget extends React.Component {
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
                  {this.props.DetailData.activity_detail ==
                  'ไม่มีข้อมูลกิจกรรม...' ? (
                    ''
                  ) : (
                    <th>ค่าใช้จ่าย</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {this.props.DetailData.map(data => (
                  <tr>
                    <td>{data.activity_detail} </td>
                    {this.props.DetailData.activity_detail ==
                    'ไม่มีข้อมูลกิจกรรม...' ? (
                      ''
                    ) : (
                      <td>
                        {data.cost != '-'
                          ? Number(data.cost).toLocaleString('en')
                          : ''}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </div>
      </ToolTip>
    );
  }
}

class ProjectUsedBudget extends React.Component {
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
        position="left"
        arrow="center"
        parent={this.props.id}
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
                  <th>ยอดเงินที่ใช้ไป</th>
                  <th>ยอดเงินคงเหลือ</th>
                </tr>
              </thead>
              <tbody>
                {this.props.DetailData.map(data => (
                  <tr>
                    <td>{data.activity_detail} </td>
                    {data.activity_detail == 'ไม่มีข้อมูลกิจกรรม...' ? (
                      ''
                    ) : (
                      <td>
                        {Number(data.current_amount).toLocaleString('en')}
                      </td>
                    )}
                    {data.activity_detail == 'ไม่มีข้อมูลกิจกรรม...' ? (
                      ''
                    ) : (
                      <td>
                        {data.cost
                          ? Number(
                              data.cost - data.current_amount,
                            ).toLocaleString('en')
                          : ''}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </div>
      </ToolTip>
    );
  }
}

class TableDetail extends React.Component {
  state = {
    list: [],
    data: [],
    selected: 0,
    offset: 0,
    perPage: 0,
    url: process.env.REACT_APP_SOURCE_URL + '/Projects/',
    result: [],
    result1: [],
    isTooltipActive: false,
    tooltipID: '',
    isTooltipProjectToatalBgActive: false,
    ProjectToatalBgID: '',
    isTooltipProjectUsedBgActive: false,
    ProjectUsedBgID: '',
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

  showProjectData = (id, status, datas) => {
    this.setState({
      isTooltipActive: status,
      tooltipID: '#projectData' + id,
      data: datas,
    });
  };

  showProjectTotalBudget = (id, status) => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/projects/activities/' + id)
      .then(res => {
        this.setState({
          list:
            res.data != ''
              ? res.data
              : [{ activity_detail: 'ไม่มีข้อมูลกิจกรรม...', cost: '-' }],
          isTooltipProjectToatalBgActive: status,
          ProjectToatalBgID: '#projectTotalBudget' + id,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  showProjectUsedBudget = (id, status) => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/projects/activities/' + id)
      .then(res => {
        this.setState({
          list:
            res.data != ''
              ? res.data
              : [{ activity_detail: 'ไม่มีข้อมูลกิจกรรม...', cost: '-' }],
          isTooltipProjectUsedBgActive: status,
          ProjectUsedBgID: '#projectUsedBudget' + id,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  handleClick(project_id) {
    window.location = '/view/' + project_id;
  }
  render() {
    let color = '#e5e5e5';
    if (this.props.color == 'rgb(184, 184, 184)') {
      color = 'black';
    }
    return (
      <Col lg="12" md="12" sm="12" style={{ display: this.props.display }}>
        <Card>
          <CardHeader style={{ textAlign: 'center' }}>
            <b>รายละเอียดการเบิกจ่ายงบประมาณ</b>
            <br />
            <b style={{ color: this.props.color }}>{this.props.Title}</b>
          </CardHeader>
          <CardBody>
            {/* {this.props.Type} */}
            <Table hover responsive>
              <thead>
                <tr style={{ backgroundColor: this.props.color, color: color }}>
                  <th width="50%">ชื่อโครงการ</th>
                  <th style={{ textAlign: 'center' }}>
                    {' '}
                    ความก้าวหน้าการเบิกจ่าย
                  </th>
                  <th style={{ textAlign: 'center' }}> งบประมาณทั้งโครงการ</th>
                  <th style={{ textAlign: 'center' }}> งบประมาณที่ใช้</th>
                  <th style={{ textAlign: 'center' }}> งบประมาณที่เหลือ</th>
                </tr>
              </thead>
              <tbody>
                {this.props.data.map(data => (
                  <tr onClick={() => this.handleClick(data._id)}>
                    <td>
                      <p
                        id={'projectData' + data._id}
                        onMouseEnter={() =>
                          this.showProjectData(data._id, true, data)
                        }
                        onMouseLeave={() =>
                          this.showProjectData(data._id, false, data)
                        }
                      >
                        {data.project_name}
                      </p>
                      <ProjectData
                        brand={this.state.isTooltipActive}
                        id={this.state.tooltipID}
                        DetailData={this.state.data}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <ProgressBar
                        dataprogress={data.budget_progress}
                        datapic={1}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <p
                        id={'projectTotalBudget' + data._id}
                        onMouseEnter={() =>
                          this.showProjectTotalBudget(data._id, true)
                        }
                        onMouseLeave={() =>
                          this.showProjectTotalBudget(data._id, false)
                        }
                      >
                        {Number(data.project_total_budget).toLocaleString('en')}
                      </p>
                      <ProjectTotalBudget
                        brand={this.state.isTooltipProjectToatalBgActive}
                        id={this.state.ProjectToatalBgID}
                        DetailData={this.state.list}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <p
                        id={'projectUsedBudget' + data._id}
                        onMouseEnter={() =>
                          this.showProjectUsedBudget(data._id, true)
                        }
                        onMouseLeave={() =>
                          this.showProjectUsedBudget(data._id, false)
                        }
                      >
                        {Number(data.project_current_amount).toLocaleString(
                          'en',
                        )}
                      </p>
                      <ProjectUsedBudget
                        brand={this.state.isTooltipProjectUsedBgActive}
                        id={this.state.ProjectUsedBgID}
                        DetailData={this.state.list}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {Number(
                        data.project_total_budget - data.project_current_amount,
                      ).toLocaleString('en')}
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
