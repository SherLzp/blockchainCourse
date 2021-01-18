//创建众筹项目页面
import React,{Component} from 'react';
import {Dimmer,Form,Label,Loader,Segment} from 'semantic-ui-react';
import {createFunding} from '../eth/interact';

class CreateNewFunding extends Component{
    state = {
        active : false,
        projectName: '',
        investMoney: '',
        targetMoney: '',
        projectDescrip: '',
        duration: '',
    }
    //when data changed then touch below function
    handleChange = (e,{name,value}) => this.setState({[name]:value})

    handleCreate = async() => {
        let{projectName,investMoney,targetMoney,projectDescrip,duration} = this.state
        console.log('investMoney:',investMoney)
        console.log('targetMoney:',targetMoney)
        this.setState({active:true})

        try{
            await createFunding(projectName,investMoney,targetMoney,projectDescrip,duration)
            alert('创建新的众筹项目成功\n')
            this.setState({active:false})

        }catch(error){
            this.setState({active:false})
            console.log(error)
        }
    }

    render(){
        let {active,projectName,investMoney,targetMoney,projectDescrip,duration} = this.state

        return(
            <div>
                <h4></h4>
                <Dimmer.Dimmable as={Segment} dimmed={active}>
                    <Dimmer active={active} inverted>
                        <Loader>Loading...</Loader>
                    </Dimmer>
                    <Form onSubmit={this.handleCreate}>
                        <Form.Input required type = 'text' placeholder='项目名称' name='projectName'
                                value={projectName} label='项目名称 :' onChange={this.handleChange}/>
                        
                        <Form.Input required type = 'text' placeholder='投资金额' name='investMoney'
                                value={investMoney} label='固定投资金额 :' labelPosition='left' onChange={this.handleChange}>
                            <Label basic>￥</Label>
                            <input/>
                        </Form.Input>

                        <Form.Input required type = 'text' placeholder='目标金额' name='targetMoney'
                                value={targetMoney} label='目标金额 :' labelPosition='left' onChange={this.handleChange}>
                            <Label basic>￥</Label>
                            <input/>
                        </Form.Input>

                        <Form.Input required type = 'text' placeholder='项目概述' name='projectDescrip'
                                value={projectDescrip} label='项目概述 :' labelPosition='left' onChange={this.handleChange}>
                            
                        </Form.Input>

                        <Form.Input required type = 'text' placeholder='请输入秒数 eg : 10000' name='duration'
                                value={duration} label='众筹所需时间（秒） :' labelPosition='left' onChange={this.handleChange}>
                            <Label basic>￥</Label>
                            <input/>
                        </Form.Input>
                        <Form.Button primary content='创建'/> 

                    </Form>
                </Dimmer.Dimmable>
            </div>
        )
    }

}

export default CreateNewFunding