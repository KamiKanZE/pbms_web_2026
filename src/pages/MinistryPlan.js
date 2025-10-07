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
  keyword,
} from 'reactstrap';
import MinistryPlanList from 'components/Plan/MinistryPlanList';


function MinistryPlan1({page}) {
  return (
    <Page
      title="ข้อมูลยุทธศาสตร์หน่วยงาน"
      breadcrumbs={[{ name: 'ข้อมูลยุทธศาสตร์หน่วยงาน', active: true }]}
      className="MinistryPlan"
    >
      <Row>
        <Col>
          <MinistryPlanList page={page}/>
        </Col>
      </Row>
    </Page>
  );
};
export default class MainPlan extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <MinistryPlan1 page={page} />;
  }
}
// export default MinistryPlan;
