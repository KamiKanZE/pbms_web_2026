import Page from 'components/Page';
import React from 'react';
import { Card, Col, Row } from 'reactstrap';
import FormProject from 'components/Project/FormProject';
function FormProject1({ project_id }) {
  return (
    <Page
      title="เพิ่มข้อมูลโครงการ"
      breadcrumbs={[{ name: 'เพิ่มข้อมูลโครงการ', active: true }]}
      className="FormProject"
    >
      <Row>
        <Col xl={12} lg={12} md={12}>
          <Card>
            <FormProject project_id={project_id} />
          </Card>
        </Col>
      </Row>
    </Page>
  );
}

export default class FormProject11 extends React.Component {
  render() {
    let project_id = this.props.match.params.id;
    return <FormProject1 project_id={project_id} />;
  }
}
