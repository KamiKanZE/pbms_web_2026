import Page3 from 'components/Page3';
import React from 'react';
import { Col, Row } from 'reactstrap';
import AddProjectPage from '../../components/AllProject/AddProjectPage';
import axios from 'axios';
import ImportProject from '../../components/AllProject/ImportProject';

function Data({ page, projectName }) {
  return (
    <AddProjectPage
      title="เพิ่มข้อมูลโครงการ"
      breadcrumbs={[{ name: 'เพิ่มข้อมูลโครงการ)', active: true }]}
      className="Plan1"
      id={page}
      projectName={projectName}
    >
      <Row>
        <Col>
          <ImportProject page={page} title="โครงการ" />
        </Col>
      </Row>
    </AddProjectPage>
  );
}

// export default Plan1;
export default class ImportProjectData extends React.Component {
  state = {
    projectName: '',
  };

  componentDidMount() {
    // this.getProject();
  }
  // getProject() {
  //   axios
  //     .get(
  //       process.env.REACT_APP_SOURCE_URL +
  //         '/projects/' +
  //         this.props.match.params.id,
  //     )
  //     .then(res => {
  //       const { project_name } = res.data.result;
  //       this.setState({
  //         projectName: project_name,
  //       });
  //     });
  // }
  render() {
    let page = this.props.match.params.id;
    return <Data page={page} projectName={this.state.projectName} />;
  }
}
