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
import KpiTypesList from '../../components/BasicInformation/KpiTypesList';

function Data({ page }) {
  return (
    <Page2
      title="ข้อมูลประเภทตัวชี้วัด"
      breadcrumbs={[{ name: 'ข้อมูลประเภทตัวชี้วัด', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <KpiTypesList
            type_category={'1'}
            page={page}
            title="ตัวชี้วัดภายใน"
          />
        </Col>
      </Row>
    </Page2>
  );
}

// export default Plan1;
export default class Internal extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <Data page={page} />;
  }
}
