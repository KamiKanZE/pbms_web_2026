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
import PolicyPresidentList from '../../components/BasicInformation/PolicyPresidentList';

function PolicyData({ page }) {
  return (
    <Page2
      title="ข้อมูลนโยบายนายกเทศมนตรีประจำปี"
      breadcrumbs={[{ name: 'ข้อมูลนโยบายนายกเทศมนตรีประจำปี', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <PolicyPresidentList page={page} title="นโยบายนายกเทศมนตรีประจำปี" />
        </Col>
      </Row>
    </Page2>
  );
}

// export default Plan1;
export default class PolicyPresident extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <PolicyData page={page} />;
  }
}
