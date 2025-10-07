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
import EditProjectMainData from '../../components/AllProject/EditProjectMainData';
import EditProjectPage from '../../components/AllProject/EditProjectPage';
import ReportDetailPage from '../../components/Report/ReportDetailPage';
import ReportMainData from '../../components/Report/ReportMainData';
import ReportProjectPage from '../../components/Report/ReportProjectPage';
import axios from 'axios';

function Report({ page, basename, projectName, projectDetail, revenue_type_category }) {
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
          <ReportMainData page={page} basename={basename} title="การรายงานผลปฏิบัติงาน" />
        </Col>
      </Row>
    </ReportProjectPage>
  );
}

// export default Plan1;
export default class ReportDetail1 extends React.Component {
  state = {
    projectName: '',
    projectDetail: {},
    revenue_type_category: '',
  };

  componentDidMount() {
    this.getProject();
  }
  getProject() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/projects/' + this.props.match.params.id).then(res => {
      const { project_name, budget_progress, project_progress, project_total_budget, project_current_amount, project_revenue_budget_type } = res.data.result;
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
        if (res.data && res.data.revenue_type_category) {
          this.setState({
            revenue_type_category: res.data.revenue_type_category,
          });
        } else {
          this.setState({
            revenue_type_category: 1,
          });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        this.setState({
          revenue_type_category: 1,
        });
      });
  };

  render() {
    let page = this.props.match.params.id;
    let getBasename2 = window.location.pathname.split('/');
    return <Report page={page} basename={getBasename2} projectName={this.state.projectName} projectDetail={this.state.projectDetail} revenue_type_category={this.state.revenue_type_category} />;
  }
}
