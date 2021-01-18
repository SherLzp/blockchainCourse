import React, {Component} from 'react';
import web3 from '../utils/initWeb3';
import {factoryContractInstance} from '../eth/instance';
import CardList from './common/CardList';
import {
    getFundingDetail, 
    handleInvestFunc
} from '../eth/interaction'
import {Icon, Item, Button} from 'semantic-ui-react'
import dapp from './image/dapp1.jpeg'


class AllFundingTab extends Component {
    
    state = {
        allFundingDetail : [],
        currentFundingDetail : '',
    }
    
    async componentWillMount() {
        let accounts = await web3.eth.getAccounts()
        let allFundings = await factoryContractInstance.methods.getAllFundings().call({
            from : accounts[0]
        })
        let allFundingDetail = await getFundingDetail(allFundings)
        this.setState({
            allFundingDetail
        })
    }

    onClickCard = (currentFundingDetail) => {
        // console.log("detail : ", detail)
        this.setState({
            currentFundingDetail
        })
    }

    handleInvest = async () => {
        let detail = this.state.currentFundingDetail
        this.setState({active : true})
        try {
            await handleInvestFunc(detail.fundingAddress, detail.requireMoney)
            alert('参与成功')
        } catch (e) {
            console.log(e)
        }
        this.setState({active : false})
    }

    render() {
        let detail = this.state.currentFundingDetail
        return (
            <div>
                <CardList details={this.state.allFundingDetail} onClickCard={this.onClickCard}/>
                {
                    detail && <div>
                        <Item>
                            <Item.Image size='tiny' src={dapp} />
                            <Item.Content verticalAlign='middle'>
                                <Item.Header as='a'><h3>详情</h3></Item.Header>
                                <Item.Description>
                                    <h4>项目名称：{detail.projectName}</h4>
                                </Item.Description>
                                <Item.Description>
                                    <h4>项目地址：{detail.fundingAddress}</h4>
                                </Item.Description>
                                <Item.Description>
                                    <h4>支持资金：{detail.requireMoney}</h4>
                                </Item.Description>
                                <Item.Extra>
                                    <Button primary onClick={this.handleInvest}>
                                        参与众筹
                                        <Icon name='right chevron' />
                                    </Button>
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    </div>
                }
            </div>
        )
    }
}

export default AllFundingTab
