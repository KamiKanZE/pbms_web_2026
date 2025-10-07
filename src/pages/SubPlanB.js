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
  keyword,
} from 'reactstrap';
import SubPlanBList from 'components/Plan/SubPlanBList';

const SubPlanB = () => {
  return (
    <Page
      title="ข้อมูลกิจกรรมรอง B"
      breadcrumbs={[{ name: 'ข้อมูลกิจกรรมรอง B', active: true }]}
      className="SubPlanB"
    >
      <Row>
        <Col>
          <SubPlanBList />
        </Col>
      </Row>
    </Page>
  );
};

export default SubPlanB;
