import React from 'react';
import { connect } from 'react-redux';
import { createPost } from '../../actions/budget';
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
    budget_source_id: '',
    budget_source_name: '',
    modal: false,
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (
      this.state.budget_source_id.trim() &&
      this.state.budget_source_name.trim()
    ) {
      this.props.onAddPost(this.state);
      this.setState({ modal: false });
    }
  };

  handleReset = () => {
    this.setState({
      budget_source_id: '',
      budget_source_name: '',
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
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.toggle().then(() => {
      this.setState({ refreshing: false });
    });
  };
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label for="budget_source_id" sm={12}>
            รหัสข้อมูลแหล่งงบประมาณ(ผลผลิต)
          </Label>
          <Col sm={12}>
            <Input
              type="text"
              name="budget_source_id"
              placeholder="รหัสข้อมูลแหล่งงบประมาณ(ผลผลิต)"
              onChange={this.handleInputChange}
              value={this.state.budget_source_id}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Label for="budget_source_name" sm={12}>
            ชื่อข้อมูลแหล่งงบประมาณ(ผลผลิต)
          </Label>
          <Col sm={12}>
            <Input
              type="text"
              name="budget_source_name"
              placeholder="ชื่อข้อมูลแหล่งงบประมาณ(ผลผลิต)"
              onChange={this.handleInputChange}
              value={this.state.budget_source_name}
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
