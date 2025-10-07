import Page6 from 'components/Page6';
import React from 'react';
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
  ButtonGroup,
  DropdownMenu,
  keyword,
} from 'reactstrap';
import ReportDetailPage from '../../components/Report/ReportDetailPage';
import ReportKPIData from '../../components/Report/ReportKPIData';
import ReportProjectPage from '../../components/Report/ReportProjectPage';
import axios from 'axios';

function Report({ page, projectName, projectDetail, revenue_type_category }) {

  return (
    <ReportProjectPage
      title="โครงการ"
      breadcrumbs={[{ name: 'การรายงานผลปฏิบัติงาน', active: true }]}
      className="Plan1"
      id={page}
      projectName={projectName}
      projectDetail={projectDetail}
      revenue_type_category={revenue_type_category}
    >
      <Row>
        <Col>
          <ReportKPIData page={page} title="การรายงานผลปฏิบัติงาน" />
        </Col>
      </Row>
    </ReportProjectPage>
  );
}

// export default Plan1;
export default class ReportDetail3 extends React.Component {
  state = {
    projectName: '',
    projectDetail: {},
    revenue_type_category: '',
  };

  componentDidMount() {
    this.getProject();
  }
  getProject() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
        '/projects/' +
        this.props.match.params.id,
      )
      .then(res => {
        const {
          project_name,
          budget_progress,
          project_progress,
          project_total_budget,
          project_current_amount,
          project_revenue_budget_type,
        } = res.data.result;
        this.getDataRevenueTypes(project_revenue_budget_type);
        this.setState({
          projectName: project_name,
          projectDetail: {
            budget_progress: budget_progress,
            project_progress: project_progress,
            project_total_budget: project_total_budget,
            project_used_budget: project_current_amount,
            project_revenue_budget_type: project_revenue_budget_type,
          },
        });
      });
  }

  getDataRevenueTypes = id => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataRevenueTypes/' + id)
      .then(res => {
        
        if (res.data !== null || res.data !== 'null' || res.data !== '' || res.data !== undefined) {
          const { revenue_type_category } = res.data;
          this.setState({
            revenue_type_category: revenue_type_category,
          });
        } else {
          this.setState({
            revenue_type_category: 1,
          });
        }

      });
  };
  render() {
    let page = this.props.match.params.id;
    return (
      <Report
        page={page}
        projectName={this.state.projectName}
        projectDetail={this.state.projectDetail}
        revenue_type_category={this.state.revenue_type_category}
      />
    );
  }
}
