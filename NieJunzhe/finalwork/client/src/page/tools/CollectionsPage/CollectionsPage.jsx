import {Button, DatePicker, Form, Input, Modal, Radio} from "antd";
import React, {useState} from "react";

function onChange(date, dateString) {
    console.log(date, dateString);
}

const CollectionsPage = (props) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    const onCreate = (values) => {
        props.ChangeState(values);
        setVisible(false);
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setVisible(true);
                }}
            >
                发起众筹
            </Button>
            <Modal
                visible={visible}
                title={<a>发起众筹</a>}
                okText="发起众筹"
                cancelText="取消"
                onCancel={()=>{
                    setVisible(false);
                }}
                destroyOnClose = {true}


                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form
                    form={form}
                    preserve={false}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        modifier: 'public',
                    }}
                >
                    <Form.Item
                        label="发起人"
                        name="account"
                        initialValue ={props.account}
                    >
                        <Input readOnly disabled />
                    </Form.Item>
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the title!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="简介"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the description!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="amount" label="金额">
                        <Input prefix="￥" suffix="ETH"/>
                    </Form.Item>
                    <Form.Item name="date" label="截止日期">
                        <DatePicker onChange={onChange} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CollectionsPage;