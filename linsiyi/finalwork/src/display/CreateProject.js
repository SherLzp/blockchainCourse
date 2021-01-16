import React from "react";
import { Button, Form, Input, InputNumber, DatePicker, Space} from 'antd';
const { TextArea } = Input;

const CreateProject = (props) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
      props.onClick(values.summary, values.intro,values.start_time.unix(),values.end_time.unix(), values.money_needed)
    };

    const onReset = () => {
      form.resetFields();
    };

    return (
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="summary" label="内容" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="intro" label="介绍" rules={[{ required: true }]}>
          <TextArea />
        </Form.Item>
        <Form.Item name="money_needed" label="需要金额" rules={[{ required: true }]}>
          <InputNumber min={1}/>
        </Form.Item>
        <Form.Item name="start_time" label="开始时间" rules={[{ required: true }]}>
          <DatePicker type="date" />
        </Form.Item>
        <Form.Item name="end_time" label="结束时间" rules={[{ required: true }]}>
          <DatePicker type="date" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" disabled={props.isClicked}>
              创建众筹
            </Button>
            <Button htmlType="button" onClick={onReset} disabled={props.isClicked}>
              返回
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
};

export default CreateProject;