import Page10 from 'components/Page10';
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

import ExBudgetList from '../../components/ReportBudget/ExBudgetList';

function Data({ page }) {
  return (
    <Page10
      title="ข้อมูลงบประมาณ  ( รายจ่าย )"
      breadcrumbs={[{ name: 'จัดการข้อมูลงบประมาณ', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <ExBudgetList page={page} title="ข้อมูลงบประมาณ (งบประมาณรายจ่าย)" />
        </Col>
      </Row>
    </Page10>
  );
}

// export default Plan1;
export default class ExpenceDataManagement extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <Data page={page} />;
  }
}
