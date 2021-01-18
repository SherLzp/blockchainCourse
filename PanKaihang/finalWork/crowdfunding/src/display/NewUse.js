import React from "react";
import {Button, Form, Input, InputNumber, Space, Card} from 'antd';

const UseForm = (props) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(props.id)
    props.newUse(props.id, values.content, values.money)
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="content" label="目的" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="money" label="金额" rules={[{ required: true }]}>
        <InputNumber
          min={1}
          max={props.remainder}
        />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" disabled={props.isClicked}>
            发起请求
          </Button>
          <Button htmlType="button" onClick={onReset} disabled={props.isClicked}>
            清空
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );    
};

export default class NewUse extends React.Component{
    render(){
        return(
            <Card title="发起使用请求">
                <p>{`最大请求金额为：${this.props.remainder} ETH`}</p>
                <UseForm {...this.props} />
            </Card>
        )
    }
}