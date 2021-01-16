import React from "react";
import {Button, Form, Input, InputNumber, Space, Card} from 'antd';

const UseForm = (props) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(props.id)
    props.createUse(props.id,  values.useMoney,values.info)
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="info" label="使用信息" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="useMoney" label="使用金额" rules={[{ required: true }]}>
        <InputNumber
          min={1}
          max={props.money_available}
        />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" disabled={props.isClicked}>
            新增请求
          </Button>
          <Button htmlType="button" onClick={onReset} disabled={props.isClicked}>
            返回
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );    
};

export default class CreateUse extends React.Component{
    render(){
        return(
            <Card >
                <UseForm {...this.props} />
            </Card>
        )
    }
} 