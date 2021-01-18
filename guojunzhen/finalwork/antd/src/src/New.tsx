import { Card, Form, Input, Button, DatePicker, message } from 'antd';
import { FC } from 'react'
import { RouteComponentProps } from "react-router-dom";
import { create_project } from '../api/contract'
import { Moment } from 'moment'

const New:FC<RouteComponentProps> = ({ match }) => {

  async function onFinish(values:{title: string, description: string, target: string, time: Moment}) {
    try {
      await create_project(values.title, values.description, 
        values.target, Math.floor((values.time.toDate().getTime() - new Date().getTime()) / 1000));
      message.success('成功')
      return true
    } catch (e) {
      console.log(e);
      message.error('失败');
    }
  }


  return (
    <Card title="发起众筹">
      <Form onFinish={onFinish}>
        <Form.Item label="众筹标题" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="内容介绍" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="众筹金额" name="target">
          <Input suffix="Eth"/>
        </Form.Item>
        <Form.Item label="截止时间" name="time">
          <DatePicker showTime />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            发起众筹
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default New;