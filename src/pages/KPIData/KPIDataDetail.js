import Page9 from 'components/Page9';
import axios from 'axios';
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
import PlanList from 'components/Plan/PlanList';
import BudgetList from '../../components/ReportBudget/ReBudgetList';
import KPIDataList from '../../components/KPIDataManagement/KPIDataList';
import KPIDataDetailList from '../../components/KPIDataManagement/KPIDataDetailList';
import KPIDataDetailList2 from '../../components/KPIDataManagement/KPIDataDetailList2';

function Data({ page, code, kpi_id,year }) {
  return (
    <Page9
      title="จัดการข้อมูลตัวชี้วัด KPI"
      breadcrumbs={[{ name: 'ข้อมูลตัวชี้วัด KPI', active: true }]}
      className="Plan1"
      id={page}
      code={code}
    >
      <Row>
        <Col>
          {code !== 'KPI2' ? (
            <KPIDataDetailList
              id={page}
              kpi_id={kpi_id}
              page={page}
              title="ตัวชี้วัด KPI"
              year={year}
            />
          ) : (
            <KPIDataDetailList2 id={page} page={page} title="ตัวชี้วัด KPI" year={year}/>
          )}
        </Col>
      </Row>
    </Page9>
  );
}

// export default Plan1;
export default class KPIDataDetail extends React.Component {
  render() {
    let page = this.props.match.params.id;
    let kpi_id = this.props.match.params.kpi_id;
    let year = this.props.match.params.year;
    return <Data page={page} code={page} kpi_id={kpi_id} year={year}/>;
  }
}
