import React, { Component } from 'react';
import { getFundingDetails, handleInvestFunc } from '../../eth/interation';
import CardList from '../common/CardList';
import {Dimmer, Form, Label, Loader, Segment} from 'semantic-ui-react';


class AllFundingTab extends Component {

    state = {
        active:false,
        allFundingDetails: [],
        selectedFundingDetail:'',
    }

    async componentWillMount() {
        let allFundingDetails = await getFundingDetails(1)
        console.table(allFundingDetails)

        this.setState({
            allFundingDetails,
        })
    }

    //传递一个回调函数给CardList，将所选择的card的详细信息返回来
    onCardClick = (selectedFundingDetail) => {
        console.log('aaaaa:',selectedFundingDetail)
        this.setState({
            selectedFundingDetail:selectedFundingDetail
        })
    }

    handleInvest = async () => {
        this.setState({active:true})
        let {fundingAddress, supportBalance,} = this.state.selectedFundingDetail
        //需要传递选中的合约地址
        //创建合约实例，参与众筹（send，别忘了合约转钱,value）
        try {
            
            await handleInvestFunc(fundingAddress,supportBalance)
            this.setState({active:false})
        } catch (error) {
            console.log(error)
            this.setState({active:false})
        }       
    }

    render() {
        let {fundingAddress,  projectName,  supportBalance } = this.state.selectedFundingDetail
        return (
            <div>
                <CardList details={this.state.allFundingDetails} onCardClick={this.onCardClick}/>
                <div>
                    <h3>参与众筹</h3>
                    <Dimmer.Dimmable as={Segment} dimmed={this.state.active}>
                        <Dimmer active={this.state.active} inverted>
                            <Loader>支持中</Loader>
                        </Dimmer>
                        <Form onSubmit={this.handleInvest}>
                            <Form.Input type='text' value={projectName || ''} label='项目名称:' />
                            <Form.Input type='text' value={fundingAddress || ''} label='项目地址:' />
                            <Form.Input type='text' value={supportBalance || ''} label='支持金额:'
                                labelPosition='left'>
                                <Label basic>￥</Label>
                                <input />
                            </Form.Input>

                            <Form.Button primary content='参与众筹' />
                        </Form>
                    </Dimmer.Dimmable>
                </div>
            </div>


        )
    }
}

export default AllFundingTab