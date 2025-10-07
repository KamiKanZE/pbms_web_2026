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
import ProjectTypeList from 'components/Project/ProjectTypeList';

const ProjectType = () => {
  return (
    <Page
      title="ข้อมูลประเภทโครงการ"
      breadcrumbs={[{ name: 'ข้อมูลประเภทโครงการ', active: true }]}
      className="ProjectType"
    >
      <Row>
        <Col>
          <ProjectTypeList />
        </Col>
      </Row>
    </Page>
  );
};

export default ProjectType;
