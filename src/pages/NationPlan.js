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
import NationPlanList from 'components/Plan/NationPlanList';

function NationPlan1({page}) {
  return (
    <Page
      title="ข้อมูลยุทธศาสตร์กรม"
      breadcrumbs={[{ name: 'ข้อมูลยุทธศาสตร์กรม', active: true }]}
      className="NationPlan"
    >
      <Row>
        <Col>
          <NationPlanList page={page} />
        </Col>
      </Row>
    </Page>
  );
};
export default class NationPlan extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <NationPlan1 page={page} />;
  }
}
// export default NationPlan;
