import Page2 from 'components/Page2';
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

function IncomeData({ page }) {
  return (
    <Page2
      title="ข้อมูลประเภทงบประมาณ (งบประมาณรายรับ)"
      breadcrumbs={[
        { name: 'ข้อมูลประเภทงบประมาณ (งบประมาณรายรับ)', active: true },
      ]}
      className="Plan1"
    >
      <Row>
        <Col>
          <PlanList2 page={page} title="ประเภทรายได้จัดเก็บเอง" />
        </Col>
      </Row>
    </Page2>
  );
}

// export default Plan1;
export default class IncomeSelf extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <IncomeData page={page} />;
  }
}
