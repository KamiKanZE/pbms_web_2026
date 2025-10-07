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
import UserList from 'components/User/User1-1';

function User1({id}){
  return (
    <Page
      title="ข้อมูลผู้ใช้"
      breadcrumbs={[{ name: 'ข้อมูลผู้ใช้', active: true }]}
      className="User1"
    >
      <Row>
        <Col>
          <UserList page={id}/>
        </Col>
      </Row>
    </Page>
  );
};

// export default User1_1;
export default class User1_1 extends React.Component {
  render() {
    let id = this.props.match.params.id;
    return <User1 page={id} />;
  }
}