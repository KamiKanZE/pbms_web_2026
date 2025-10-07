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

function PlanData({ page }) {
  return (
    <Page2
      title="ข้อมูลแผนงาน"
      breadcrumbs={[{ name: 'ข้อมูลแผนงาน', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <PlanList2 page={page} title="ด้านบริหารทั่วไป" />
        </Col>
      </Row>
    </Page2>
  );
}

// export default Plan1;
export default class PlanGeneral extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <PlanData page={page} />;
  }
}
