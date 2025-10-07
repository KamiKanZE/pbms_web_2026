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
import KpiList from 'components/KPI/KpiList';

function KpiList2({ page }) {
  return (
    <Page
      title="ประเภทตัวชี้วัด"
      breadcrumbs={[{ name: 'ประเภทตัวชี้วัด', active: true }]}
      className="KpiList1"
    >
      <Row>
        <Col>
          <KpiList page={page} />
        </Col>
      </Row>
    </Page>
  );
}
export default class KpiList1 extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <KpiList2 page={page} />;
  }
}
// export default KpiList1;
