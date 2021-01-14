import React, {Component} from 'react';
import web3 from '../utils/initWeb3';
import {factoryContractInstance} from '../eth/instance';
import CardList from './common/CardList';
import {
    getFundingDetail,
    createRequest,
    showRequests,
    finishRequest
} from '../eth/interaction';
import {Form, Label, Segment, Button} from 'semantic-ui-react';
import CreateFundingForm from './CreateFundingForm';
import RequestTab from './common/RequestTab'

class CreatorFundingTab extends Component {
 
    state = {
        creatorFundingDetail : [],
        currentFundingDetail : '',
        requestReason : '',
        requestBalance : '',
        requestAddress : '',
        requests : [],
    }
    
    async componentWillMount() {
        let accounts = await web3.eth.getAccounts()
        let creatorFundings = await factoryContractInstance.methods.getCreatorFunding().call({
            from : accounts[0]
        })
        let creatorFundingDetail = await getFundingDetail(creatorFundings)
        this.setState({
            creatorFundingDetail,
        }) 
    }

    onClickCard = (currentFundingDetail) => {
        this.setState({
            currentFundingDetail
        })
    }

    onClickRequestDetail = async () => {
        try {
            let requests = await showRequests(this.state.currentFundingDetail.fundingAddress)
            this.setState({'requests': requests})
        } catch (e) {
            console.log(e)
        }
    }

    handleChange = (e, {name, value}) => this.setState({[name]: value})

    handleCreate = async () => {
        let {currentFundingDetail, requestReason, requestBalance, requestAddress} = this.state
        try {
            await createRequest(currentFundingDetail.fundingAddress, requestReason, requestBalance, requestAddress)
        } catch (e) {
            console.log(e)
        }
    }

    handleFinishRequest = (index) => {
        try {
            finishRequest(this.state.currentFundingDetail.fundingAddress, index)
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        let {creatorFundingDetail, currentFundingDetail, requestReason, requestBalance, requestAddress} = this.state
        
        return (
            <div>
                <CardList details={creatorFundingDetail} onClickCard={this.onClickCard}/>
                <CreateFundingForm/>
                {
                    <div>
                        <h3>发起付款请求</h3>
                        <Segment>
                            <h4>当前项目:{currentFundingDetail.projectName}, 地址: {currentFundingDetail.fundingAddress}</h4>
                            <Form onSubmit={this.handleCreate}>
                                <Form.Input type='text' name='requestReason' required value={requestReason}
                                            label='请求描述' placeholder='请求描述' onChange={this.handleChange}/>
    
                                <Form.Input type='text' name='requestBalance' required value={requestBalance}
                                            label='付款金额' labelPosition='left' placeholder='付款金额'
                                            onChange={this.handleChange}>
                                    <Label basic>￥</Label>
                                    <input/>
                                </Form.Input>
                                <Form.Input type='text' name='requestAddress' required value={requestAddress}
                                            label='商家地址' labelPosition='left' placeholder='商家地址'
                                            onChange={this.handleChange}>
                                    <input/>
                                </Form.Input>
                                <Form.Button primary content='开始请求' onClick={this.handleCreate}/>
                            </Form>
                        </Segment>
                    </div>
                }
                {
                    this.state.requests && <div>
                        <Button onClick={this.onClickRequestDetail}>申请详情</Button>
                        <RequestTab requests={this.state.requests} tabNo={2} handleFinishRequest={this.handleFinishRequest}/>
                    </div>
                }
            </div>
        )
    }
}

export default CreatorFundingTab