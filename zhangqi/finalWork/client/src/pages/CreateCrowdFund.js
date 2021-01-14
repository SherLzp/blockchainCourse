import React, { Component } from "react";

import {
    newFund
} from "../contracts/crowdfund"

import { Form, Input, Button, DatePicker, InputNumber, Select, Modal } from 'antd';
import moment from 'moment';
import "../App.css"

function disabledDate(current) {
    return current && current < moment().endOf('day');
}

class CreateCrowdFund extends Component {
    formRef = React.createRef();

    onSubmit = async (values) => {
        let timeStamp = moment(new Date(values.date)).unix()
        await newFund(this.props.location.state.account, values.name, values.description, values.goal, timeStamp)
        this.formRef.current.setFieldsValue({
            "initiator": "",
            "type": "",
            "name": "",
            "description": "",
            "goal": "",
            "date": ""
        })
        Modal.success({
            content: '提交成功！',
        });
    };

    render () {
        return(
            <div className="form">
                <Form
                    labelCol={{span: 8}}
                    wrapperCol={{span: 10}}
                    layout="horizontal"
                    style={{alignItems: 'center'}}
                    onFinish={this.onSubmit}
                    ref={this.formRef}
                >
                    <Form.Item name="initiator" label="项目发起人">
                        <span className="ant-form-text">{this.props.location.state.account}</span>
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="项目归属"
                        rules={[{
                            required: true,
                            message: "请选择项目归属！"
                        }]}
                    >
                        <Select>
                            <Select.Option value="donate">募捐</Select.Option>
                            <Select.Option value="public_facility">公共设施</Select.Option>
                            <Select.Option value="invest">投资</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="项目名称"
                        rules={[{
                            required: true,
                            message: "请填写项目名称！"
                        }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={"description"}
                        label="项目描述"
                        rules={[{
                            required: true,
                            message: "请填写项目描述！"
                        }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="goal"
                        label="目标资金"
                        rules={[{
                            required: true,
                            message: "请填写目标资金！"
                        }]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="截止日期"
                        rules={[
                            {
                                required: true,
                                message: "请选择截止日期！"
                            },
                        ]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={disabledDate}
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default CreateCrowdFund