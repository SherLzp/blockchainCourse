import React from "react";
import { Button, Form, Input, InputNumber, DatePicker, Space} from 'antd';
const { TextArea } = Input;

const NewFunding = (props) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
      props.onClick(values.title, values.endTime.unix(), values.goal, values.info)
    };

    const onReset = () => {
      form.resetFields();
    };

    return (
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="title" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="info" label="介绍" rules={[{ required: true }]}>
          <TextArea />
        </Form.Item>
        <Form.Item name="goal" label="金额" rules={[{ required: true }]}>
          <InputNumber min={1}/>
        </Form.Item>
        <Form.Item name="endTime" label="到期日" rules={[{ required: true }]}>
          <DatePicker type="date" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" disabled={props.isClicked}>
              发起众筹
            </Button>
            <Button htmlType="button" onClick={onReset} disabled={props.isClicked}>
              清空
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
};

export default NewFunding;


  