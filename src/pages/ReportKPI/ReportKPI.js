import Page7 from 'components/Page7';
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
import PlanList2 from '../../components/BasicInformation/PlanList2';
import ProjectList from '../../components/AllProject/ProjectList';
import ReportList from '../../components/Report/ReportList';
import ReportKPIList from '../../components/ReportKPI/ReportKPIList';

function Report({ page }) {
  return (
    <Page7
      title="การรายงานผลตัวชี้วัด ( KPI )"
      breadcrumbs={[{ name: 'การรายงานผลตัวชี้วัด ( KPI )', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <ReportKPIList page={page} title="การรายงานผลตัวชี้วัด ( KPI )" />
        </Col>
      </Row>
    </Page7>
  );
}

// export default Plan1;
export default class ReportKPI extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <Report page={page} />;
  }
}
