import Page4 from 'components/Page4';
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
import UserList2 from '../../components/User/User2';

function UserPage({ page }) {
  return (
    <Page4
      title="จัดการข้อมูลผู้ใช้"
      breadcrumbs={[{ name: 'จัดการข้อมูลผู้ใช้', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <UserList2 page={page} title="ข้อมูลผู้ใช้" />
        </Col>
      </Row>
    </Page4>
  );
}

// export default Plan1;
export default class UserManagement extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <UserPage page={page} />;
  }
}
