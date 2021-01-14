import React from 'react'
import {Card, List, Progress} from 'semantic-ui-react'

const CardList = (props) => {
    let details = props.details
    let onClickCard = props.onClickCard
    let cards = details.map(detail => {
        return <MyCard 
            key={detail.fundingAddress} 
            detail={detail}
            onClickCard={onClickCard}
        />
    })
    return (
        <Card.Group centered itemsPerRow={4}>
            {cards}
        </Card.Group>
    )
}

const MyCard = (props) => {
    let detail = props.detail
    let onClickCard = props.onClickCard
    // const {
    //     contractAddress = detail.fundingAddress, 
    //     manager = detail.manager, 
    //     proejctName = detail.proejctName, 
    //     targetMoney = detail.targetMoney, 
    //     requireMoney = detail.requireMoney, 
    //     leftTime = detail.leftTime, 
    //     balance = detail.balance, 
    //     investorCount = detail.investorCount
    // }
    let leftTime = parseInt(parseFloat(detail.leftTime) / 3600)
    let percentage = (parseFloat(detail.balance) / parseFloat(detail.targetMoney)).toFixed(2) * 100
    let accountBalance = parseFloat(detail.balance) / 10**18
    let targetMoney = parseFloat(detail.targetMoney) / 10**18

    return (
        <div>
            <Card color='blue' onClick={() => {onClickCard(detail)}}>

                <Card.Content>
                    <Card.Header>{detail.projectName}</Card.Header>
                    <Card.Meta>
                        <span className='time'>剩余{leftTime}小时</span>
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <Progress percent={percentage} size='tiny' indicating />
                    <List divided horizontal style={{display: 'flex', justifyContent: 'space-around'}}>
                        <List.Item>
                            <List.Content>
                                <List.Header>已筹</List.Header>
                                <List.Description>{accountBalance}/{targetMoney}eth</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content>
                                <List.Header>参与人数</List.Header>
                                <List.Description>{detail.investorCount}</List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </Card.Content>
            </Card>
        </div>
    )
}

export default CardList