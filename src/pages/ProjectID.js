import Page from 'components/Page';
import { Link } from 'react-router-dom';
import React from 'react';
import ProjectList from '../components/Project/ProjectID';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

function Projectid({ project_id }) {
  return (
    <Page
      title="ข้อมูลโครงการ"
      breadcrumbs={[{ name: 'ข้อมูลโครงการ', active: true }]}
      className="Project1"
    >
      <Row>
        <Col md={12} style={{ textAlign: 'right' }}>
          <Link to="/FormProject">
            <Tooltip title="Add">
              <Fab className="btn_not_focus" color="primary">
                <Icon>add</Icon>
              </Fab>
            </Tooltip>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mb-3">
            <CardBody>
              <ProjectList project_id={project_id} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Page>
  );
}

export default class ProjectID extends React.Component {
  render() {
    let project_id = this.props.match.params.id;
    return <Projectid project_id={project_id} />;
  }
}
