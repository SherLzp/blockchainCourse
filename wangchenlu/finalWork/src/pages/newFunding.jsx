import React, {Component } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
} from 'antd';
const { TextArea } = Input;

class newFunding extends Component{
    handleClick = e => {
        console.log('click ', e);
        this.setState({
            currentKey: e.key,
        });
      };
      
    render(){
        return(
            <div style = {{width:"50%", marginLeft:"25%", marginTop:"80px"}}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size= "large"
            >
                <Form.Item label="众筹项目名称">
                <Input />
                </Form.Item>
                <Form.Item label="众筹项目简介">
                <TextArea />
                </Form.Item>
                <Form.Item label="众筹截止日期">
                <DatePicker />
                </Form.Item>
                <Form.Item label="众筹金额">
                <InputNumber />
                </Form.Item>
                <Form.Item label="">
                <Button style = {{marginLeft:"70%"}} onClick={this.handleClick}> 发起众筹 </Button>
                </Form.Item>
            </Form>
      </div>
        )
    }

}

export default newFunding