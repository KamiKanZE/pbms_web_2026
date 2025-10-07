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
import BudgetTypeList from 'components/BudgetSource/BudgetTypeList';

function BudgetType1({page}) {
  return (
    <Page
      title="ข้อมูลประเภทงบประมาณ"
      breadcrumbs={[{ name: 'ข้อมูลประเภทงบประมาณ', active: true }]}
      className="BudgetType"
    >
      <Row>
        <Col>
          <BudgetTypeList page={page} />
        </Col>
      </Row>
    </Page>
  );
};

// export default BudgetType;
export default class BudgetType extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <BudgetType1 page={page} />;
  }
}