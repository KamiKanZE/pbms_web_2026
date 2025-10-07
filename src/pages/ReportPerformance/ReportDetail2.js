import React from 'react';
import axios from 'axios';
import Report from './Report';
import moment from 'moment';
export default class ReportDetail2 extends React.Component {
  state = {
    projectName: '',
    projectDetail: {},
    revenue_type_category: '',
    projectStart: '',
  };

  componentDidMount() {
    this.getProject();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   // Optional: You might want to use this for debugging purposes
  //   console.log('Previous Props:', prevProps);
  //   console.log('Previous State:', prevState);
  // }

  getProject = () => {
    const { id } = this.props.match.params;

    axios
      .get(`${process.env.REACT_APP_SOURCE_URL}/projects/${id}`)
      .then(res => {
        const { project_name, budget_progress, project_progress, project_total_budget, project_current_amount, project_revenue_budget_type, project_start } = res.data.result;

        this.getDataRevenueTypes(project_revenue_budget_type);
        const projectStart = moment(project_start).year() + 543 + (moment(project_start).month() > 8 ? 1 : 0);
        this.setState({
          projectName: project_name,
          projectDetail: {
            budget_progress,
            project_progress,
            project_total_budget,
            project_used_budget: project_current_amount,
            project_revenue_budget_type,
          },
          projectStart: projectStart,
        });
      })
      .catch(error => {
        console.error('Error fetching project data:', error);
      });
  };

  getDataRevenueTypes = id => {
    axios
      .get(`${process.env.REACT_APP_SOURCE_URL}/dataRevenueTypes/${id}`)
      .then(res => {
        const { revenue_type_category } = res.data;
        this.setState({
          revenue_type_category: revenue_type_category || 1,
        });
      })
      .catch(error => {
        console.error('Error fetching revenue types data:', error);
        this.setState({ revenue_type_category: 1 });
      });
  };

  handleUpdateData = () => {
    this.getProject();
  };

  render() {
    const page = this.props.match.params.id;

    return (
      <Report
        page={page}
        projectName={this.state.projectName}
        projectDetail={this.state.projectDetail}
        revenue_type_category={this.state.revenue_type_category}
        projectStart={this.state.projectStart}
        onUpdateData={this.handleUpdateData}
      />
    );
  }
}
