import Page from 'components/Page';
import { Link } from 'react-router-dom';
import React from 'react';
import KPIList from '../components/KPI/KPI-1List';
import { Card, CardBody, CardHeader, Col, Row ,Input} from 'reactstrap';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

function KPI1({page}) {
  return (
    <Page
      title={'ข้อมูลตัวชี้วัด'}
      breadcrumbs={[{ name: 'ข้อมูลตัวชี้วัด', active: true }]}
      className="KPI1"
    >
      <KPIList page={page}/>
    </Page>
  );
}
export default class KPI extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <KPI1 page={page} />;
  }
}
