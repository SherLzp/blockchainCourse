import React, {Component} from 'react';
import {getFundingDetails, handleInvestFunc} from "../../eth/interaction";
import CardList from "../common/CardList";
import {Dimmer, Form, Label, Loader, Segment} from 'semantic-ui-react'

class AllFundingTab extends Component {

    state = {
        show: false,
        active: false,
        allFundingDetails: [],
        seletedFundingDetail: '',
    }


    async componentWillMount() {

        let allFundingDetails = await getFundingDetails(1)

        this.setState({
            allFundingDetails,
        })

    }

    onCardClick = (seletedFundingDetail) => {
        this.setState({
            seletedFundingDetail
        })
        this.setState({
            show:true
        })
    }

    handleInvest = () => {
        let {fundingAddress, manager, projectName, targetMoney, supportMoney, leftTime, balance, investorCount} = this.state.seletedFundingDetail
        handleInvestFunc(fundingAddress, supportMoney)
    }


    render() {
        let {fundingAddress, manager, projectName, targetMoney, supportMoney, leftTime, balance, investorCount} = this.state.seletedFundingDetail
        return (
            <div>
                <CardList details={this.state.allFundingDetails} onCardClick={this.onCardClick}/>
                <br></br>
                {
                this.state.show?<div>
                    <h3>参与众筹</h3>
                    <Dimmer.Dimmable as={Segment} dimmed={this.state.active}>
                        <Dimmer active={this.state.active} inverted>
                            <Loader>支持中</Loader>
                        </Dimmer>
                        <Form onSubmit={this.handleInvest}>
                            <Form.Input type='text' value={projectName || ''} label='项目名称:'/>
                            <Form.Input type='text' value={fundingAddress || ''} label='项目地址:'/>
                            <Form.Input type='text' value={supportMoney || ''} label='支持金额:'
                                        labelPosition='left'>
                                <input/>
                            </Form.Input>

                            <Form.Button primary content='参与众筹'/>
                        </Form>
                    </Dimmer.Dimmable>
                </div>:null
                }
            </div>
        )
    }
}

export default AllFundingTab
