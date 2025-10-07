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
import EditProjectActivityData from '../../components/AllProject/EditProjectActivityNew';
import axios from 'axios';
import moment from 'moment';

function Data({ page, projectName,projectStart }) {
  return (
    <EditProjectPage
      title="แก้ไขข้อมูลโครงการ"
      breadcrumbs={[{ name: 'แก้ไขข้อมูลโครงการ)', active: true }]}
      className="Plan1"
      id={page}
      projectName={projectName}
      projectStart={projectStart}
    >
      <Row>
        <Col>
          <EditProjectActivityData page={page} title="โครงการ" projectStart={projectStart}/>
        </Col>
      </Row>
    </EditProjectPage>
  );
}

// export default Plan1;
export default class EditProjectData2 extends React.Component {
  state = {
    projectName: '',
    projectStart:''
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
        const { project_name,project_start } = res.data.result;
        const projectStart = moment(project_start).year() + 543 + (moment(project_start).month() > 8 ? 1 : 0);
        this.setState({
          projectName: project_name,
          projectStart :projectStart
        });
      });
  }
  render() {
    let page = this.props.match.params.id;
    return <Data page={page} projectName={this.state.projectName} projectStart={this.state.projectStart}/>;
  }
}
