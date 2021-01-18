import React, {Component} from 'react';
import { Modal, Button, Form, Input, DatePicker, Col, Row } from 'antd';

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
  message: 'Please input a valid number!'
};

const time_rule = { 
  type: 'object', 
  required: true, 
  message: 'Please select time!' 
};

class CreateProject extends Component{
  showModal = () => {
    this.setState({visible: true});
  }

  handleCancel = () => {
    this.setState({visible: false});
  }

  onFinish = (values) => {
    this.props.createProject(values.title, values.description, values.deadline.valueOf(), values.target);
    this.setState({visible: false});
  };

  constructor() {
    super();
    this.state = {
      visible: false,
    }
  }

  render(){
    return (
      <div style={{ margin: '16px 0' }}>
        <Button type="primary" onClick={this.showModal}>
          Create Project
        </Button>
        <Modal
          title="Create Project"
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
            <Form.Item name={['target']} label="Target" rules={[number_rule]}>
              <Input Input prefix="Ξ" suffix="ETH" />
            </Form.Item>
            <Form.Item name={['deadline']} label="Duration" rules={[time_rule]}>
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
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
    );
  }
}

export default CreateProject;