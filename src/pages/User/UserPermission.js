import Page5 from 'components/Page5';
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
import PermissionList from '../../components/User/PermissionList';

function UserPage({ page }) {
  return (
    <Page5
      title="ข้อมูลผู้ใช้"
      breadcrumbs={[{ name: 'ข้อมูลผู้ใช้', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <PermissionList page={page} title="ผู้ใช้งาน" />
        </Col>
      </Row>
    </Page5>
  );
}

// export default Plan1;
export default class UserPermission extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <UserPage page={page} />;
  }
}
