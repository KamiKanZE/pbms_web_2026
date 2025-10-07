import Page from 'components/Page';
import { Link } from 'react-router-dom';
import React from 'react';
import KPI1_2List from '../components/KPI1-2/KPI1-2List';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

function KPI1_2({ kpi_id }) {
  return (
    <Page
      title={'การจัดการเกณฑ์การให้คะแนน'}
      breadcrumbs={[
        { name: 'ข้อมูลตัวชี้วัด', active: false, link: '/kpi1' },
        { name: 'การจัดการเกณฑ์การให้คะแนน', active: true },
      ]}
      className="Project1-2"
    >
      <KPI1_2List kpi_id={kpi_id} />
    </Page>
  );
}

export default class Project extends React.Component {
  render() {
    let kpi_id = this.props.match.params.id;
    return <KPI1_2 kpi_id={kpi_id} />;
  }
}
