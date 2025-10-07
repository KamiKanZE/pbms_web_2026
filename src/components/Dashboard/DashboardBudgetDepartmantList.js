import React from 'react';
import axios from 'axios';
import { Card, Col, Row, Table, Form, FormFeedback, FormText, Input, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import moment from 'moment';

export default class DashboardBudgetDepartmantList extends React.Component {
  constructor(props) {
    super(props);
    const initialPage = this.props.page || 1;
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
      selected: initialPage,
      currentPage: initialPage - 1,
      offset: 0,
      perPage: 10,
      keyword: '',
      url: `${process.env.REACT_APP_SOURCE_URL}/dataDepartments/reports`,
      url2: `${process.env.REACT_APP_SOURCE_URL}/projects/list`,
      type: '1',
      dataType: 1,
      dataType1: 1,
    };
  }

  toggleModal =
    (modalType = null) =>
    () => {
      if (modalType) {
        this.setState(prevState => ({
          [`modal_${modalType}`]: !prevState[`modal_${modalType}`],
        }));
      } else {
        this.setState(prevState => ({
          modal: !prevState.modal,
        }));
      }
    };

  componentDidMount() {
    // this.toggleModal();
    // this.loadData();
    this.loadDepartmentData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.year !== this.props.year || prevProps.period !== this.props.period || prevProps.start !== this.props.start || prevProps.end !== this.props.end) {
      // console.log('department state has changed.');
      this.loadDepartmentData();
    }
  }
  // loadData = () => {
  //   this.loadDepartmentData();
  //   // this.loadProjectData();
  // };

  loadDepartmentData = () => {
    $.ajax({
      url: `${this.state.url}?page=0&year=${this.props.year}&time=${this.props.period||''}&month_start=${this.props.start||''}&month_end=${this.props.end||''}`,
      data: { totalPage: this.state.perPage, offset: this.state.offset },
      dataType: 'json',
      type: 'GET',
      success: data => {
        this.setState({
          data: data.result,
        });
      },
      error: (xhr, status, err) => {
        console.error(this.state.url, status, err.toString());
      },
    });
  };

  // loadProjectData = () => {
  //   $.ajax({
  //     url: `${this.state.url2}?page=1&size=1000`,
  //     data: { totalPage: this.state.perPage, offset: this.state.offset },
  //     dataType: 'json',
  //     type: 'GET',
  //     success: data => {
  //       const filteredResults = data.result.result.filter(item => new Date().getFullYear(item.create_date) === this.props.year - 543);
  //       this.setState({
  //         data2: filteredResults,
  //         pageCount: Math.ceil(data.result.pagination.itemTotal / this.state.perPage),
  //       });
  //     },
  //     error: (xhr, status, err) => {
  //       console.error(this.state.url, status, err.toString());
  //     },
  //   });
  // };

  formatMoney = value => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  formatMoney1 = value => new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  sumValues = (...values) => {
    return values.reduce((acc, value) => {
      const num = parseFloat(value);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
  };

  calculateTotal = (items, field) => {
    return items.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0);
  };

  renderTableRow = (id, i) => {
    const projectData = this.state.data.filter(item => item.project_department === id.department_id);
    const totalBudget = this.calculateTotal(projectData, 'project_total_budget');
    const usedBudget = this.calculateTotal(projectData, 'project_current_amount');
    const setBudget = this.calculateTotal(projectData, 'project_used_budget');
    const remainingBudget = totalBudget - usedBudget;

    return (
      <tr key={i}>
        <td style={{ textAlign: 'center' }}>{i + 1}</td>
        <td>{id.department_name}</td>
        <td style={{ textAlign: 'center' }}>{this.formatMoney1(projectData.length)}</td>
        <td style={{ textAlign: 'center' }}>{this.formatMoney(totalBudget)}</td>
        <td style={{ textAlign: 'center' }}>{this.formatMoney(setBudget)}</td>
        <td style={{ textAlign: 'center' }}>{this.formatMoney(usedBudget)}</td>
        <td style={{ textAlign: 'center' }}>{this.formatMoney(remainingBudget)}</td>
      </tr>
    );
  };

  render() {
    const totalBudget = this.calculateTotal(this.state.data, 'department_budget_estimate');
    const usedBudget = this.calculateTotal(this.state.data, 'department_use_budget');
    const setBudget = this.calculateTotal(this.state.data, 'department_set_budget');
    const project = this.calculateTotal(this.state.data, 'department_project_count');
    const remainingBudget = totalBudget - usedBudget;

    return (
      <>
        <Row>
          <Col>
            <Table responsive borderless style={{ borderRadius: '10px', border: '1px solid #FFC6C6' }} key={'tableDepartment'}>
              <thead>
                <tr style={{ backgroundColor: '#FFC6C6' }}>
                  <th style={{ textAlign: 'center' }}>ลำดับ</th>
                  <th style={{ textAlign: 'center', width: '300px' }}>ข้อมูล</th>
                  <th style={{ textAlign: 'center' }}>จำนวนโครงการ แผนดำเนินงาน</th>
                  <th style={{ textAlign: 'center' }}>งบประมาณที่ตั้งไว้</th>
                  {/* <th style={{ textAlign: 'center' }}>งบประมาณที่จัดสรรแล้ว</th> */}
                  <th style={{ textAlign: 'center' }}>งบประมาณที่ใช้ไป</th>
                  <th style={{ textAlign: 'center' }}>งบประมาณคงเหลือ</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.length === 0 ? (
                  <tr>
                    <td colSpan="6" align="center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  this.state.data.map((id, i) => (
                    <tr key={i}>
                      <td style={{ textAlign: 'center' }}>{i + 1}</td>
                      <td>{id.department_name}</td>
                      <td style={{ textAlign: 'center' }}>{this.formatMoney1(id.department_project_count)}</td>
                      <td style={{ textAlign: 'center' }}>{this.formatMoney(id.department_budget_estimate)}</td>
                      {/* <td style={{ textAlign: 'center' }}>{this.formatMoney(id.department_set_budget)}</td> */}
                      <td style={{ textAlign: 'center' }}>{this.formatMoney(id.department_use_budget)}</td>
                      <td style={{ textAlign: 'center' }}>{this.formatMoney(id.department_balance_budget)}</td>
                    </tr>
                  ))
                )}
                <tr>
                  <th colSpan={2} style={{ textAlign: 'center' }}>
                    รวม
                  </th>
                  <th style={{ textAlign: 'center' }}>{this.formatMoney1(project)}</th>
                  <th style={{ textAlign: 'center' }}>{this.formatMoney(totalBudget)}</th>
                  {/* <th style={{ textAlign: 'center' }}>{this.formatMoney(setBudget)}</th> */}
                  <th style={{ textAlign: 'center' }}>{this.formatMoney(usedBudget)}</th>
                  <th style={{ textAlign: 'center' }}>{this.formatMoney(remainingBudget)}</th>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col className="bar">
            <Bar
              options={{
                maintainAspectRatio: false,
                legend: { display: true, position: 'bottom' },
                tooltips: {
                  callbacks: {
                    label: (tooltipItem, data) => {
                      const label = data.datasets[tooltipItem.datasetIndex].label;
                      const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                      return `${label} : ${new Intl.NumberFormat().format(value)}`;
                    },
                  },
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        callback: value => new Intl.NumberFormat().format(value),
                      },
                    },
                  ],
                },
              }}
              data={{
                labels: this.state.data.map(id => id.department_name),
                datasets: [
                  {
                    label: 'งบประมาณที่ตั้งไว้',
                    data: this.state.data.map((item) => item.department_budget_estimate || 0),
                    borderColor: '#83B65D',
                    backgroundColor: '#83B65D70',
                    borderWidth: 2,
                  },
                  {
                    label: 'งบประมาณที่ใช้ไป',
                    data: this.state.data.map((item) => item.department_use_budget || 0),
                    borderColor: '#FADA39',
                    backgroundColor: '#FADA3970',
                    borderWidth: 2,
                  },
                ],
              }}
            />
          </Col>
        </Row>
      </>
    );
  }
}

DashboardBudgetDepartmantList.propTypes = {
  dataset: PropTypes.array.isRequired,
  page: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  year: PropTypes.number,
};
