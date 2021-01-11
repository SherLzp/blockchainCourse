import React, {Component} from 'react';
import { Modal, Button, Form, Input, Col, Row } from 'antd';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
  whiteCol: {span: 1}
};

const validateMessages = {
  required: '${label} is required!',
};

const number_rule = { 
  pattern: '^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$', 
  required: true,
  message: 'Please input a valid number!',
};

class CreateDraw extends Component{
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
    console.log(this.state.index);
    this.props.createDraw(this.state.index, values.title, values.description, values.amount);
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
        <a onClick={()=>this.showModal(this.props.index)}>Draw</a>
        <Modal
          title="Create a Draw Request"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          width="50%"
          destroyOnClose="true"
        >
          <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages} preserve={false}>
            <Form.Item name={['title']} label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['amount']} label="Amount" rules={[number_rule]}>
              <Input Input prefix="Ξ" suffix="ETH" />
            </Form.Item>
            <Form.Item name={['description']} label="Description" rules={[{ required: true }]}>
              <Input.TextArea rows={8}/>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
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

export default CreateDraw;