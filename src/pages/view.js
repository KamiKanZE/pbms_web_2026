import Page from 'components/Page';
import { Link } from 'react-router-dom';
import React from 'react';
import View from '../components/Project1-2/view';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

function View1({ project_id }) {
  return (
    <Page
      title={'การจัดการกิจกรรมภายใต้โครงการ'}
      breadcrumbs={[
        { name: 'ข้อมูลโครงการ', active: false, link: '/project1' },
        { name: 'การจัดการกิจกรรมภายใต้โครงการ', active: true },
      ]}
      className="Project1-2view"
    >
      <View project_id={project_id} />
    </Page>
  );
}

export default class ProjectView extends React.Component {
  render() {
    let project_id = this.props.match.params.id;
    return <View1 project_id={project_id} />;
  }
}
