import React, {Component } from 'react';
import { Form, Input, Button, DatePicker,InputNumber } from 'antd';
import {Redirect} from 'react-router-dom';
import moment from 'moment';
import {createFunding} from '../eth/fundingFactory'

const { TextArea } = Input;
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

class newFunding extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isSuccess:false,
            title: "",
            detail: "",
            endTime: "",
            targetMoney: 0,
        };
    }

    onFinish = async(values) => {
        this.setState({
            title:values.title,
            detail:values.detail,
            targetMoney:values.targetMoney
        })

        var timeStamp = Math.round(new Date(this.state.endTime) / 1000)
        try {
            await createFunding(this.state.title, this.state.detail, this.state.targetMoney, timeStamp)
            alert('创建合约成功')
            this.setState({
                isSuccess: true
            })
        } catch (error) {
            alert('创建合约失败')
            console.log(error)
        }
    };

    GetEndTime(date, dateString){
        this.setState({
            endTime: dateString,
        })
    };

    // 日期限制
    disabledDate=(current)=>{
        let dateTime = new Date(+new Date() +8*3600*1000).toISOString();
        let timeArray =dateTime.split("T")[0].split("-");
        let nowDate = timeArray[0]+"-"+timeArray[1]+"-"+timeArray[2] ;//当前年月日
        
         return current && current <= moment(nowDate) ;
    };
      
    render(){
        if(this.state.isSuccess === true){
            return <Redirect to = {{pathname:'/'}}/>
        }
        else{
        return(
            <div style = {{width:"40%", marginLeft:"25%", marginTop:"80px"}}>
            <Form
                {...layout}
                name="basic"
                layout="horizontal"
                size= "large"
                onFinish={this.onFinish}
            >
                <Form.Item label="众筹项目名称" name="title" rules={[{ required: true, message: '请输入项目名称!' }]}>
                <Input />
                </Form.Item>
                <Form.Item label="众筹项目简介" name="detail" rules={[{ required: true, message: '请补充项目简介!' }]}>
                <TextArea />
                </Form.Item>
                <Form.Item label="众筹截止时间" name="endDate" rules={[{ required: true, message: '请输入众筹截止时间!' }]}>
                <DatePicker disabledDate = {this.disabledDate} showTime onChange = {this.GetEndTime.bind(this)} />
                </Form.Item>
                <Form.Item label="众筹金额(ETH)" name="targetMoney" rules={[{ required: true, message: '请输入众筹目标金额!' }]}>
                <InputNumber style = {{width:"150px"}} min={0.1}  step={0.1}/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                <Button htmlType="submit" type="primary"> 发起众筹 </Button>
                </Form.Item>
            </Form>
      </div>
        )
        }
    }

}

export default newFunding