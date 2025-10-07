import Page from 'components/Page';
import { Link } from 'react-router-dom';
import React from 'react';
import ReportProject from 'components/Project/ReportProject';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Fab } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const reportProject1 = () => {
  return (
    <Page
      title="รายงานผลปฏิบัติงานโครงการ"
      breadcrumbs={[{ name: 'รายงานผลปฏิบัติงานโครงการ', active: true }]}
      className="ReportProject"
    >
      <Row>
        <Col>
          <Card className="mb-3">
            <CardBody>
              <ReportProject />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Page>
  );
};

export default reportProject1;
