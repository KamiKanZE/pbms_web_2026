import Page7 from 'components/Page7';
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
import ReportKPIDetailList from '../../components/ReportKPI/ReportKPIDetailList';

function Report({ page }) {
  return (
    <Page7
      title="ตัวชี้วัด"
      breadcrumbs={[{ name: 'ตัวชี้วัด', active: true }]}
      className="Plan1"
    >
      <Row>
        <Col>
          <ReportKPIDetailList page={page} title="ตัวชี้วัด" />
        </Col>
      </Row>
    </Page7>
  );
}

// export default Plan1;
export default class ReportKPIDetail extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <Report page={page} />;
  }
}
