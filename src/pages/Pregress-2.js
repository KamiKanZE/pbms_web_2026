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
import Pregress2 from 'components/Project/Pregress2';

const Pregress = () => {
  return (
    <Page
      title="แบบฟอร์มรายงานการปฎิบัติงาน"
      breadcrumbs={[
        { name: 'ข้อมูลโครงการ', active: false, link: '/project1' },
        { name: 'แบบฟอร์มรายงานการปฎิบัติงาน', active: true },
      ]}
      className="Pregress"
    >
      <Row>
        <Col xl={12} lg={12} md={12}>
          <Card>
            <Pregress2 />
          </Card>
        </Col>
      </Row>
    </Page>
  );
};

export default Pregress;
