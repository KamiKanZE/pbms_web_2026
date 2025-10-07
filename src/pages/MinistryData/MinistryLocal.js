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
import MinistryLocalList from '../../components/BasicInformation/MinistryLocalList';

function MinistryData({ page }) {
  return (
    <Page2
      title="ข้อมูลยุทธศาสตร์"
      breadcrumbs={[{ name: 'ข้อมูลแผนงาน', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <MinistryLocalList
            page={page}
            title="ยุทธศาสตร์องค์กรปกครองส่วนท้องถิ่น (อปท.)"
          />
        </Col>
      </Row>
    </Page2>
  );
}

// export default Plan1;
export default class MinistryLocal extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <MinistryData page={page} />;
  }
}
