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
import DepartmentsList from '../../components/BasicInformation/DepartmentsList';

function Data({ page }) {
  return (
    <Page2
      title="ข้อมูลหน่วยงาน"
      breadcrumbs={[{ name: 'ข้อมูลหน่วยงาน', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <DepartmentsList page={page} title="หน่วยงาน" />
        </Col>
      </Row>
    </Page2>
  );
}

// export default Plan1;
export default class DepartmentsData extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <Data page={page} />;
  }
}
