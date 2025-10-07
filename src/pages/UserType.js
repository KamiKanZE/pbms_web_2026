import Page from 'components/Page';
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
} from 'reactstrap';
import UserTypeList from 'components/User/UserTypeList';

function UserType1 ({ page }) {
  return (
    <Page
      title="ข้อมูลประเภทผู้ใช้"
      breadcrumbs={[{ name: 'ข้อมูลประเภทผู้ใช้', active: true }]}
      className="UserType1"
    >
      <Row>
        <Col>
          <UserTypeList  page={page}/>
        </Col>
      </Row>
    </Page>
  );
};

// export default UserType;
export default class UserType extends React.Component {
  render() {
    let id = this.props.match.params.id;
    return <UserType1 page={id} />;
  }
}