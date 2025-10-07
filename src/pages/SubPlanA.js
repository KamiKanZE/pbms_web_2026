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
import SubPlanAList from 'components/Plan/SubPlanAList';

const SubPlanA = () => {
  return (
    <Page
      title="ข้อมูลกิจกรรมรอง A"
      breadcrumbs={[{ name: 'ข้อมูลกิจกรรมรอง A', active: true }]}
      className="SubPlanA"
    >
      <Row>
        <Col>
          <SubPlanAList />
        </Col>
      </Row>
    </Page>
  );
};

export default SubPlanA;
