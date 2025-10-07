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

function ExpenceData({ page }) {
  // const token_id = localStorage.getItem('token');
  return (
    <Page2
      title="ข้อมูลประเภทงบประมาณ (งบประมาณรายจ่าย)"
      breadcrumbs={[
        { name: 'ข้อมูลประเภทงบประมาณ (งบประมาณรายจ่าย)', active: true },
      ]}
      className="Plan1"
    >
      <Row>
        <Col>
          <PlanList2 page={page} title="งบประมาณ (รายจ่าย)" />
        </Col>
      </Row>
    </Page2>
  );
}

// export default Plan1;
export default class ExpenceBudget extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <ExpenceData page={page} />;
  }
}
