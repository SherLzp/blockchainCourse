import React, {Component} from 'react';
import { Modal, Button, Form, Input, Col, Row } from 'antd';

const validateMessages = {
  required: '${label} is required!',
};

const number_rule = { 
  pattern: '^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$',
  required: true,
 };

class Contribute extends Component{
  showModal = (index) => {
    this.setState({
      visible: true,
      index: index,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      index: -1,
    });
  }

  onFinish = (values) => {
    this.props.contribute(this.state.index, values.amount);
    this.setState({visible: false});
  };

  constructor() {
    super();
    this.state = {
      visible: false,
      index: -1,
    };
  }

  render() {
    return (
      <div>
        <a onClick={()=>this.showModal(this.props.index)}>Contribute</a>
        <Modal
          title="Contribute"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          width="400px"
          destroyOnClose="true"
        >
          <Form name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages} preserve={false}>
            <Form.Item name={['amount']} label="Amount" rules={[]}>
              <Input Input prefix="Ξ" suffix="ETH" />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 0, offset: 5 }}>
              <Row>
                <Col span={12}>
                  <Button onClick={this.handleCancel}>
                    Cancel
                  </Button>
                </Col>
                <Col span={12}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Contribute;