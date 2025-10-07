import Page3 from 'components/Page3';
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
import ProjectList from '../../components/Plan/ProjectList';

function ExpenceData({ page }) {
  return (
    <Page3
      title="โครงการทั้งหมด"
      breadcrumbs={[
        { name: 'ข้อมูลประเภทงบประมาณ (งบประมาณรายจ่าย)', active: true },
      ]}
      className="Plan1"
    >
      <Row>
        <Col>
          <ProjectList page={page} title="โครงการ" />
        </Col>
      </Row>
    </Page3>
  );
}

// export default Plan1;
export default class AllProjectData extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <ExpenceData page={page} />;
  }
}
