import React from 'react';
import { Row, Col } from 'reactstrap';
import ReportActivityData from '../../components/Report/ReportActivityData';
import ReportProjectPage from '../../components/Report/ReportProjectPage';

function Report({ page, projectName, projectDetail, revenue_type_category,projectStart, onUpdateData }) {
  console.log(projectStart)
  return (
    <ReportProjectPage
      title="โครงการ"
      breadcrumbs={[{ name: 'การรายงานผลปฏิบัติงาน', active: true }]}
      className="Plan1"
      id={page}
      projectName={projectName}
      projectDetail={projectDetail}
      revenue_type_category={revenue_type_category}
      projectStart={projectStart}
    >
      <Row>
        <Col>
          <ReportActivityData
            page={page}
            title="การรายงานผลปฏิบัติงาน"
            onUpdateData={onUpdateData}
            projectStart={projectStart}
          />
        </Col>
      </Row>
    </ReportProjectPage>
  );
}

export default Report;
