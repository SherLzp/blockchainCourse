import {Button, DatePicker, Form, Input, Modal, Radio} from "antd";
import React, {useState} from "react";

function onChange(date, dateString) {
    console.log(date, dateString);
}

const CollectionsPage1 = (props) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    const onCreate = (values) => {
        props.Contribute(values.amount);
        setVisible(false);
    };

    const handleValidator = (rule, val, callback) => {
        if (!val) {
            callback();
        }
        let validateResult = val<=props.limit;
        if (!validateResult) {
            callback('Your amount is greater than goal!');
        }
        let validateResult1 = val>0;
        if (!validateResult1) {
            callback('Invalid input!');
        }
        callback();
    }

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setVisible(true);
                }}
            >
                我要投资
            </Button>
            <Modal
                visible={visible}
                title={<a>投资金额</a>}
                okText="投资"
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
                    <Form.Item
                        name="amount"
                        label="投资金额"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the amount!',
                            },{
                                validator: handleValidator
                            }
                        ]}>
                        <Input prefix="￥" suffix="ETH"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CollectionsPage1;