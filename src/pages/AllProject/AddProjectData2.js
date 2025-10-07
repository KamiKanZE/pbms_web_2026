import Page3 from 'components/Page3';
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
import PlanList from 'components/Plan/PlanList';
import PlanList2 from '../../components/BasicInformation/PlanList2';
import ProjectList from '../../components/AllProject/ProjectList';
import AddProjectPage from '../../components/AllProject/AddProjectPage';
import AddProjectActivityData from '../../components/AllProject/AddProjectActivityData';
import axios from 'axios';

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
          <AddProjectActivityData page={page} title="โครงการ" />
        </Col>
      </Row>
    </AddProjectPage>
  );
}

// export default Plan1;
export default class AddProjectData2 extends React.Component {
  state = {
    projectName: '',
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
        const { project_name } = res.data.result;
        this.setState({
          projectName: project_name,
        });
      });
  }
  render() {
    let page = this.props.match.params.id;
    return <Data page={page} projectName={this.state.projectName} />;
  }
}
