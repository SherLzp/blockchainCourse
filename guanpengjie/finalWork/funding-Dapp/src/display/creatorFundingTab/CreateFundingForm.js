import React, {Component} from 'react';
import {Dimmer, Form, Label, Loader, Segment} from 'semantic-ui-react';
import { createFunding } from '../../eth/interation';
// import {createFunding} from '../../eth/interaction'

class CreateFundingForm extends Component {
    state = {
        active: false,
        projectName: '',
        supportMoney: '',
        targetMoney: '',
        duration: '',
    }
    //表单数据变化时触发
    handleChange = (e,{name,value}) => this.setState({[name]:value})

    handleCreate = async() => {
        let { projectName, supportMoney, targetMoney, duration} = this.state
        console.log('targetMoney:',targetMoney)
        console.log('supportMoney:',supportMoney)
        this.setState({active:true})

        try {
            await createFunding(projectName, targetMoney, supportMoney, duration)
            alert('创建合约成功:\n')
            this.setState({active:false})

        } catch (error) {
            
            this.setState({active:false})
            console.log(error)
        }

    }

    render() {
        let {active, projectName, supportMoney, targetMoney, duration} = this.state

        return (
            <div>
                <Dimmer.Dimmable as={Segment} dimmed={active}>
                    <Dimmer active={active} inverted>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    <Form onSubmit={this.handleCreate}>
                        <Form.Input required type='text' placeholder='项目名称' name='projectName'
                                    value={projectName} label='项目名称:'
                                    onChange={this.handleChange}/>
                        <Form.Input required type='text' placeholder='支持金额' name='supportMoney'
                                    value={supportMoney} label='支持金额:'
                                    labelPosition='left'
                                    onChange={this.handleChange}>
                            <Label basic>￥</Label>
                            <input/>
                        </Form.Input>

                        <Form.Input required type='text' placeholder='目标金额' name='targetMoney' value={targetMoney}
                                    label='目标金额:'
                                    labelPosition='left'
                                    onChange={this.handleChange}>
                            <Label basic>￥</Label>
                            <input/>
                        </Form.Input>
                        <Form.Input required type='text' placeholder='目标金额' name='duration' value={duration}
                                    label='众筹时间:'
                                    labelPosition='left'
                                    onChange={this.handleChange}>
                            <Label basic>S</Label>
                            <input/>
                        </Form.Input>
                        <Form.Button primary content='创建众筹'/>
                    </Form>
                </Dimmer.Dimmable>
            </div>
        )
    }
}

export default CreateFundingForm
