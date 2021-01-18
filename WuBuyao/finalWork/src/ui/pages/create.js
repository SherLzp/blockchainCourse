import React from 'react';
import { Layout, Breadcrumb, Button, Form, Input, DatePicker, Col, Row } from 'antd';
import moment from 'moment';

const { Header, Content, Footer } = Layout;

const time_rule = {
    type: 'object',
    required: true,
    message: 'Please select time!'
};

class Create extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }
    onFinish = (values) => {
        console.log(values.title);
        console.log(values.info);
        console.log(moment(values.end_time).format('X'));
        console.log(values.amount);
        this.props.createFunding(values.title, values.info, moment(values.end_time).format('X'), values.amount);
    };

    onReset = () => {
        this.resetFields();
    };

    render() {
        return (
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                        <Breadcrumb.Item>发起众筹</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ margin: '16px 0' }}>
                        <Form name="nest-messages" onFinish={this.onFinish} preserve={false}>
                            <Form.Item name={['title']} label="标题" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name={['amount']} label="金额" rules={[{ required: true }]}>
                                <Input suffix="ETH" />
                            </Form.Item>
                            <Form.Item name={['end_time']} label="截止时间" rules={[time_rule]}>
                                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                            <Form.Item name={['info']} label="详细描述" rules={[{ required: true }]}>
                                <Input.TextArea rows={8} />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8 }}>
                                <Row>
                                    <Col span={12}>
                                        <Button >
                                            Reset
                                        </Button>
                                    </Col>
                                    <Col span={12}>
                                        <Button type="primary" htmlType="submit" >
                                            提交
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Crowdfunding-ETH ©2021 Created by chronoby</Footer>
            </Layout>
        )
    }
}

export default Create;
