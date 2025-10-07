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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  FormFeedback,
  FormText,
  Input,
  Label,
  FormGroup,
  keyword,
} from 'reactstrap';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import {
  Chip,
  Fab,
  Grid,
  Button,
  LinearProgress,
  styled,
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { AiOutlineEye } from 'react-icons/ai';
import moment from 'moment';
const token_id = localStorage.getItem('token');

// const BorderLinearProgress = styled(LinearProgress)(({ colors, theme }) => ({
//   height: 7,
//   borderRadius: 5,
//   backgroundColor: colors + '50',
//   [`& .MuiLinearProgress-bar`]: {
//     borderRadius: 5,
//     backgroundColor: colors,
//   },
// }));

export default class DashboardBudgetPlanList extends React.Component {
  constructor(props) {
    super(props);
    let id;
    {
      this.props.page == ':id' ||
      this.props.page == '' ||
      this.props.page == undefined
        ? (id = 1)
        : (id = this.props.page);
    }
    this.state = {
      Budget: [],
      ButgetSources: [],
      refreshing: false,
      modal: false,
      validationError: '',
      validationError1: '',
      PlanID: '',
      PlanName: '',
      ID: '',
      isForm: '',
      data: [],
      data1: [
        { no: '1', name: 'ด้านบริหารงานทั่วไป', colors: '#9A9CE9' },
        { no: '2', name: 'ด้านบริการชุมชนและสังคม', colors: '#91BFD7' },
        { no: '3', name: 'ด้านการเศรษฐกิจ', colors: '#A6C0AE' },
        { no: '4', name: 'ด้านการดำเนินงานอื่น', colors: '#FEDC97' },
      ],
      data2: [],
      data3: [],
      selected: id,
      currenpage: id - 1,
      offset: 0,
      perPage: 10,
      keyword: '',
      url: process.env.REACT_APP_SOURCE_URL + '/dataPlans/list',
      url2: process.env.REACT_APP_SOURCE_URL + '/projects/list',
      type: '1',
      dataType: 1,
      dataType1: 1,
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
    this.loadCommentsFromServer().then(() => {
      this.setState({ refreshing: false });
    });
  };

  componentDidMount() {
    this.toggle();
    this.loadCommentsFromServer();
    this.loadCommentsFromServer2();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.year !== this.props.year) {
      // console.log('year2 state has changed.');

      this.loadCommentsFromServer2();
    }
  }
  loadCommentsFromServer() {
    $.ajax({
      url: this.state.url + '?page=' + '1' + '&size=' + '1000',
      //this.state.type
      data: {
        totalPage: this.state.perPage,
        offset: this.state.offset,
      },
      dataType: 'json',
      type: 'GET',
      success: data => {
        this.setState({
          data: data.result,
          data3: data.result,
          pageCount: Math.ceil(data.pagination.itemTotal / this.state.perPage),
        });
      },

      error: (xhr, status, err) => {
        console.error(this.state.url, status, err.toString()); // eslint-disable-line
      },
    });
  }

  loadCommentsFromServer2() {
    $.ajax({
      url: this.state.url2 + '?page=' + '1' + '&size=' + '1000' +
      '&year=' +
      (parseInt(this.props.year) - 543) +
      '&time=' +
      parseInt(this.props.period) +
      (this.props.department?
        '&project_department=' + this.props.department:''),
      // +
      // '&budget_year=' +
      // moment().year()
      // data: {
      //   totalPage: this.state.perPage,
      //   offset: this.state.offset,
      // },
      dataType: 'json',
      type: 'GET',
      success: data => {
        let resultx = data.result.result.filter(
          results =>
            new Date().getFullYear(results.create_date) ===
            this.props.year - 543,
        );
        this.setState({
          data2: data.result.result,
          pageCount: Math.ceil(
            data.result.pagination.itemTotal / this.state.perPage,
          ),
        });
      },

      error: (xhr, status, err) => {
        console.error(this.state.url, status, err.toString()); // eslint-disable-line
      },
    });
  }

  moneyFormat = e => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e);
  };
  sumary = (q1, q2, q3, q4) => {
    let a1 = parseFloat(q1).toString() === 'NaN' ? 0 : q1;
    let a2 = parseFloat(q2).toString() === 'NaN' ? 0 : q2;
    let a3 = parseFloat(q3).toString() === 'NaN' ? 0 : q3;
    let a4 = parseFloat(q4).toString() === 'NaN' ? 0 : q4;
    let sum = 0;
    sum = parseFloat(a1) + parseFloat(a2) + parseFloat(a3) + parseFloat(a4);
    if (sum.toString() === 'NaN') {
      return 0;
    } else {
      return sum;
    }
  };
  sumProjectTotal = item => {
    let sum = 0;
    item.forEach(b => {
      sum += parseFloat(b.project_total_budget);
    });
    return sum;
  };
  sumProjectUse = item => {
    let sum = 0;
    item.forEach(b => {
      sum += parseFloat(b.project_used_budget);
    });
    return sum;
  };
  sumProjectCount = item => {
    let sum = 0;
    item.forEach(
      b =>
        (sum += this.state.data2.filter(
          c => c.project_plan === b.plan_id,
        ).length),
    );
    return sum;
  };
  sumProjectAllTotal = item => {
    let sum = 0;
    item.forEach(b =>
      this.state.data2
        .filter(c => c.project_plan === b.plan_id)
        .forEach(d => {
          sum += parseFloat(d.project_total_budget);
        }),
    );
    return sum;
  };
  sumProjectAllUse = item => {
    let sum = 0;
    item.forEach(b =>
      this.state.data2
        .filter(c => c.project_plan === b.plan_id)
        .forEach(d => {
          sum += parseFloat(d.project_used_budget);
        }),
    );
    return sum;
  };
  render() {
    return (
      <>
        <Row>
          <Col>
            {/* <Card className="mb-12">
            <CardBody> */}

            {this.state.data1.map(item => (
              <Table
                responsive
                borderless
                id="table1"
                style={{
                  borderRadius: '10px',
                  border: 'solid 1px ' + item.colors,
                }}
                key={'tablePlan' + item.no}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: item.colors,
                    }}
                  >
                    <th
                      style={{
                        textAlign: 'center',
                        borderBottom: 'solid 1px #ffffff',
                      }}
                      colSpan="8"
                    >
                      {item.name}
                    </th>
                    {/* <th>BudgetSouceID</th> */}
                  </tr>
                  <tr style={{ backgroundColor: item.colors }}>
                    <th style={{ textAlign: 'center' }}>ลำดับ</th>
                    <th style={{ textAlign: 'center', width: '300px' }}>
                      ข้อมูล
                    </th>
                    {/* <th style={{ textAlign: 'center' }}>ปีงบประมาณ</th> */}
                    <th style={{ textAlign: 'center' }}>จำนวนโครงการ</th>
                    <th style={{ textAlign: 'center' }}>งบประมาณที่ตั้งไว้</th>
                    <th style={{ textAlign: 'center' }}>งบประมาณที่ใช้ไป</th>
                    <th style={{ textAlign: 'center' }}>งบประมาณคงเหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.length == 0 ? (
                    <tr>
                      <td colSpan="8" align="center">
                        ไม่มีข้อมูล
                      </td>
                    </tr>
                  ) : (
                    this.state.data
                      .filter(
                        a => a.plan_type.toString() === item.no.toString(),
                      )
                      .map((id, i) => (
                        <tr key={'table' + item.no + i}>
                          <td style={{ textAlign: 'center' }}>{i + 1}</td>
                          {/* <td>{id.budget_source_id}</td> */}
                          <td>
                            {id.plan_name}

                            {/* {this.state.dataType === 1
                          : id.expenditure_type_name} */}
                          </td>
                          {/* <td style={{ textAlign: 'center' }}>
                          {id.revenue_budget_year}
                         </td> */}
                          <td style={{ textAlign: 'center' }}>
                            {/* {this.moneyFormat(id.total_project)} */}
                            {
                              this.state.data2.filter(
                                a => a.project_plan === id.plan_id,
                              ).length
                            }
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {/* {this.moneyFormat(
                            id.revenue_budget_estimate,
                          ).toString() !== 'NaN'
                            ? this.moneyFormat(id.revenue_budget_estimate)
                            : '0'} */}
                            {this.moneyFormat(
                              this.sumProjectTotal(
                                this.state.data2.filter(
                                  a => a.project_plan === id.plan_id,
                                ),
                              ),
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {/* {this.moneyFormat(
                          this.sumary(
                            id.revenue_budget_q1,
                            id.revenue_budget_q2,
                            id.revenue_budget_q3,
                            id.revenue_budget_q4,
                          ),
                          )} */}
                            {/* {this.moneyFormat(parseFloat(id.project_used_budget))} */}
                            {this.moneyFormat(
                              this.sumProjectUse(
                                this.state.data2.filter(
                                  a => a.project_plan === id.plan_id,
                                ),
                              ),
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {this.moneyFormat(
                              parseFloat(
                                this.sumProjectTotal(
                                  this.state.data2.filter(
                                    a => a.project_plan === id.plan_id,
                                  ),
                                ),
                              ) -
                                parseFloat(
                                  this.sumProjectUse(
                                    this.state.data2.filter(
                                      a => a.project_plan === id.plan_id,
                                    ),
                                  ),
                                ),
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                  <tr
                    key={'tableSum' + item.no}
                    style={{ backgroundColor: item.colors + '80' }}
                  >
                    <td style={{ textAlign: 'center' }}></td>
                    <td>รวม</td>
                    <td style={{ textAlign: 'center' }}>
                      {this.sumProjectCount(
                        this.state.data.filter(
                          a => a.plan_type.toString() === item.no.toString(),
                        ),
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {this.moneyFormat(
                        this.sumProjectAllTotal(
                          this.state.data.filter(
                            a => a.plan_type.toString() === item.no.toString(),
                          ),
                        ),
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {this.moneyFormat(
                        this.sumProjectAllUse(
                          this.state.data.filter(
                            a => a.plan_type.toString() === item.no.toString(),
                          ),
                        ),
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {this.moneyFormat(
                        parseFloat(
                          this.sumProjectAllTotal(
                            this.state.data.filter(
                              a =>
                                a.plan_type.toString() === item.no.toString(),
                            ),
                          ),
                        ) -
                          parseFloat(
                            this.sumProjectAllUse(
                              this.state.data.filter(
                                a =>
                                  a.plan_type.toString() === item.no.toString(),
                              ),
                            ),
                          ),
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            ))}
          </Col>
        </Row>
      </>
    );
  }
}
