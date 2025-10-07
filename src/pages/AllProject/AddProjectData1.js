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
import AddProjectPage from '../../components/AllProject/AddProjectPage';
import AddProjectMainData from '../../components/AllProject/AddProjectMainData';

function Data({ page }) {
  return (
    <AddProjectPage
      title="เพิ่มข้อมูลโครงการ"
      breadcrumbs={[{ name: 'เพิ่มข้อมูลโครงการ)', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <AddProjectMainData page={page} title="โครงการ" />
        </Col>
      </Row>
    </AddProjectPage>
  );
}

// export default Plan1;
export default class AddProjectData1 extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <Data page={page} />;
  }
}
