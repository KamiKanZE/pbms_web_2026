import Page from 'components/Page';
import { Link } from 'react-router-dom';
import React from 'react';
import ProjectList from '../components/Project1-2/Project1-2List';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

function Project1_2({ project_id }) {
  return (
    <Page
      title={'การจัดการกิจกรรมภายใต้โครงการ'}
      breadcrumbs={[
        { name: 'ข้อมูลโครงการ', active: false, link: '/project1' },
        { name: 'การจัดการกิจกรรมภายใต้โครงการ', active: true },
      ]}
      className="Project1-2"
    >
      <ProjectList project_id={project_id} />
    </Page>
  );
}

export default class Project extends React.Component {
  render() {
    let project_id = this.props.match.params.id;
    return <Project1_2 project_id={project_id} />;
  }
}
