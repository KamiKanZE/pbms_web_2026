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
import AddProjectPage from '../../components/AllProject/AddProjectPage';
import AddProjectMainData from '../../components/AllProject/AddProjectMainData';
import EditProjectMainData from '../../components/AllProject/EditProjectMainData';
import EditProjectPage from '../../components/AllProject/EditProjectPage';
import EditProjectActivityData from '../../components/AllProject/EditProjectActivityData';
import AddProjectKPIData from '../../components/AllProject/AddProjectKPIData';
import EditProjectKPIData from '../../components/AllProject/EditProjectKPIData';
import axios from 'axios';

function Data({ page, projectName }) {
  return (
    <EditProjectPage
      title="แก้ไขข้อมูลโครงการ"
      breadcrumbs={[{ name: 'แก้ไขข้อมูลโครงการ)', active: true }]}
      className="Plan1"
      id={page}
      projectName={projectName}
    >
      <Row>
        <Col>
          <EditProjectKPIData page={page} title="โครงการ" />
        </Col>
      </Row>
    </EditProjectPage>
  );
}

// export default Plan1;
export default class EditProjectData3 extends React.Component {
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
