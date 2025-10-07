import Page8 from 'components/Page8';
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
// import PlanList from 'components/Plan/PlanList';
import ReBudgetList from '../../components/ReportBudget/ReBudgetList';

function Data({ page }) {
  return (
    <Page8
      title="ข้อมูลงบประมาณ  ( รายรับ )"
      breadcrumbs={[{ name: 'จัดการข้อมูลงบประมาณ', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <ReBudgetList page={page} title="ข้อมูลงบประมาณ (งบประมาณรายรับ)" />
        </Col>
      </Row>
    </Page8>
  );
}

// export default Plan1;
export default class IncomeDataManagement extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <Data page={page} />;
  }
}
