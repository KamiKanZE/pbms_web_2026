import Page9 from 'components/Page9';
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
// import BudgetList from '../../components/ReportBudget/ReBudgetList';
import KPIDataList from '../../components/KPIDataManagement/KPIDataList';

function Data({ page }) {
  return (
    <Page9
      title="ข้อมูลตัวชี้วัด KPI"
      breadcrumbs={[{ name: 'ข้อมูลตัวชี้วัด KPI', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <KPIDataList page={page} title="ข้อมูลตัวชี้วัด KPI" />
        </Col>
      </Row>
    </Page9>
  );
}

// export default Plan1;
export default class KPIData extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <Data page={page} />;
  }
}
