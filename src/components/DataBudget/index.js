import React from 'react';
import FormAdd from './Add';
import List from './List';
import Page from 'components/Page';
import {
  Col,
  Row,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { FormGroup, Fab, Button } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';

class Index extends React.Component {
  state = {
    refreshing: false,
    modal: false,
  };
  toggle = modalType => () => {
    if (!modalType) {
      this.handleReset();
      return this.setState({
        modal: !this.state.modal,
      });
    }
    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
  handleReset = () => {
    this.setState({
      budget_source_id: '',
      budget_source_name: '',
    });
  };
  render() {
    return (
      <Page
        title="budget_source"
        breadcrumbs={[{ name: 'Plan-1', active: true }]}
        className="Plan1"
      >
        <Row>
          <Col style={{ textAlign: 'right' }}>
            <Tooltip title="Add">
              <Fab
                className="btn_not_focus"
                onClick={this.toggle()}
                color="primary"
              >
                <Icon>add</Icon>
              </Fab>
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="mb-12">
              <CardBody>
                <Row>
                  <Col xl={8} lg={8} md={8} />
                  <Col xl={12} lg={12} md={12}>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>BudgetSourceID</th>
                          <th>BudgetSourceName</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        <List />
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle()}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle()}>เพิ่มข้อมูลแผนงาน</ModalHeader>
          <ModalBody>
            <FormAdd />
          </ModalBody>
        </Modal>
      </Page>
    );
  }
}
export default Index;
