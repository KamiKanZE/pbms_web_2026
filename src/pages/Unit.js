import Page from 'components/Page';
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
} from 'reactstrap';
import UnitList from 'components/Project/UnitList';
  function Unit1 ({ page }) {
  return (
    <Page
      title="ข้อมูลหน่วยนับ"
      breadcrumbs={[{ name: 'ข้อมูลหน่วยนับ', active: true }]}
      className="Unit"
    >
      <Row>
        <Col>
          <UnitList page={page}/>
        </Col>
      </Row>
    </Page>
  );
};

// export default Unit;
export default class Unit extends React.Component {
  render() {
    let id = this.props.match.params.id;
    return <Unit1 page={id} />;
  }
}