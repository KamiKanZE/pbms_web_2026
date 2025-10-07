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
import DepartmentList from 'components/DepartmentList';

const Department = () => {
  return (
    <Page
      title="ข้อมูลหน่วยงาน"
      breadcrumbs={[{ name: 'ข้อมูลหน่วยงาน', active: true }]}
      className="Department"
    >
      <Row>
        <Col>
          <DepartmentList />
        </Col>
      </Row>
    </Page>
  );
};

export default Department;
