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
import MinistryLandList from '../../components/BasicInformation/MinistryLandList';

function MinistryData({ page }) {
  return (
    <Page2
      title="ข้อมูลยุทธศาสตร์"
      breadcrumbs={[{ name: 'ข้อมูลแผนงาน', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <MinistryLandList page={page} title="ยุทธศาสตร์ชาติ 20 ปี" />
        </Col>
      </Row>
    </Page2>
  );
}

// export default Plan1;
export default class MinistryLand extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <MinistryData page={page} />;
  }
}
