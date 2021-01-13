import {Button, DatePicker, Form, Input, Modal, Radio} from "antd";
import React, {useState} from "react";


const CollectionsPage2 = (props) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    const onCreate = (values) => {
        props.NewUse(values);
        setVisible(false);
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setVisible(true);
                }}
                disabled={!props.isShow}
            >
                发起使用请求
            </Button>
            <Modal
                visible={visible}
                title={<a>发起使用请求</a>}
                okText="发起请求"
                cancelText="取消"
                onCancel={()=>{
                    setVisible(false);
                }}

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
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        modifier: 'public',
                    }}
                >
                    <Form.Item name="info" label="请求说明">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="goal" label="请求金额">
                        <Input prefix="￥" suffix="ETH" type="number"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CollectionsPage2;