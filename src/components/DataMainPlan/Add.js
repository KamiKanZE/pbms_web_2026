import React from 'react';
import { connect } from 'react-redux';
import { createPost } from '../../actions/plan1';
import {
  Col,
  Form,
  Label,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
class Add extends React.Component {
  state = {
    plan_id: '',
    plan_name: '',
    modal: true,
    refreshing: false,
  };
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.handleSubmit().then(() => {
      this.setState({ refreshing: false });
    });
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.plan_id.trim() && this.state.plan_name.trim()) {
      this.props.onAddPost(this.state);
    }
  };

  handleReset = () => {
    this.setState({
      plan_id: '',
      plan_name: '',
    });
  };
  toggle = modalType => () => {
    if (!modalType) {
      // this.handleReset();
      return this.setState({
        modal: !this.state.modal,
      });
    }
    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label for="plan_id" sm={12}>
            รหัสข้อมูลแผนงาน
          </Label>
          <Col sm={12}>
            <Input
              type="text"
              name="plan_id"
              placeholder="รหัสข้อมูลแผนงาน"
              onChange={this.handleInputChange}
              value={this.state.plan_id}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Label for="plan_name" sm={12}>
            ชื่อข้อมูลแผนงาน
          </Label>
          <Col sm={12}>
            <Input
              type="text"
              name="plan_name"
              placeholder="ชื่อข้อมูลแผนงาน"
              onChange={this.handleInputChange}
              value={this.state.plan_name}
            />
          </Col>
        </FormGroup>
        <FormGroup style={{ textAlign: 'right' }}>
          <Col sm={12}>
            <Button type="submit" color="primary" onClick={this.toggle()}>
              Submit
            </Button>
            &nbsp;
            {/* <Button color="secondary" onClick={this.toggle()}>
              Cancel
            </Button> */}
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddPost: post => {
      dispatch(createPost(post));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(Add);
