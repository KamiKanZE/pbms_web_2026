import Page from 'components/Page';
import { Link } from 'react-router-dom';
import React from 'react';
import KPI1_3List from '../components/KPI1-3/KPI1-3List';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

function KPI1_3({ kpi_id }) {
  return (
    <Page
      title={'การจัดการรายงานผลตัวชี้วัด'}
      breadcrumbs={[
        { name: 'ข้อมูลตัวชี้วัด', active: false },
        { name: 'การจัดการรายงานผลตัวชี้วัด', active: true },
      ]}
      className="KPI1-3"
    >
      <KPI1_3List />
    </Page>
  );
}

export default class Project extends React.Component {
  render() {
    return <KPI1_3 />;
  }
}
