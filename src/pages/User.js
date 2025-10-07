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
import UserList from 'components/User/UserList';

function User({page}) {
  return (
    <Page
      title="ข้อมูลผู้ใช้"
      breadcrumbs={[{ name: 'ข้อมูลผู้ใช้', active: true }]}
      className="User1"
    >
      <Row>
        <Col>
          <UserList page={page}/>
        </Col>
      </Row>
    </Page>
  );
};

// export default User;
export default class USer extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <User page={page} />;
  }
}