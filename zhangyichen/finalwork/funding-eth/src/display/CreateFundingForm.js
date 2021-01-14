import React, {Component} from 'react';
import {Dimmer, Form, Label, Loader, Segment} from 'semantic-ui-react'
import {createFunding} from "../eth/interaction";

class CreateFundingForm extends Component {
    state = {
        active: false,
        projectName: '', 
        targetMonet: '',
        requireName: '',
        time: '',
    }

    handleChange = (e, {name, value}) => this.setState({[name]: value})

    handleCreate = async () => {
        let {active, projectName, targetMoney, requireMoney, time} = this.state
        this.setState({active: true})

        try {
            let res = await createFunding(projectName, targetMoney, requireMoney, time)
            alert('合约创建成功！\n')
        } catch (e) {
            console.log(e)
        }

        this.setState({active: false})
    }

    render() {
        let {active, projectName, targetMoney, requireMoney, time} = this.state
        return (
            <div>
                
                <Dimmer.Dimmable as={Segment} dimmed={active}>
                    <Dimmer active={active} inverted>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    <h3>发起众筹项目</h3>
                    <Form onSubmit={this.handleCreate}>
                        <Form.Input required type='text' placeholder='项目名称' name='projectName'
                                    value={projectName} label='项目名称:'
                                    onChange={this.handleChange}/>
 
                        <Form.Input required type='text' placeholder='支持金额' name='requireMoney'
                                    value={requireMoney} label='支持金额:'
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
                        <Form.Input required type='text' placeholder='众筹时间' name='time' value={time}
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