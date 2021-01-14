import React from 'react'
import {Card, Image, List, Progress} from 'semantic-ui-react'


const CardList = (props) => {

    let details = props.details
    // console.log(details.)

    let onCardClick = props.onCardClick
    let cards = details.map(detail => {
        return <CardFunding key={detail.fundingAddress}
                            detail={detail}
                            onCardClick={onCardClick}

        />
    })

    return (
        cards.length > 0 ?
        (<Card.Group itemsPerRow={4}>
            {
                cards
            }
        </Card.Group>):<Card><p>暂无项目</p></Card>
    )
}

const CardFunding = (props) => {
    let detail = props.detail

    let onCardClick = props.onCardClick

    let {
        fundingAddress,
        manager,
        projectName,
        targetMoney,
        supportMoney,
        leftTime,
        balance,
        investorCount
    } = detail

    let percent = parseFloat(balance) / parseFloat(targetMoney) * 100

    return (

        <Card onClick={() => onCardClick(detail)}>
            <Card.Content>
                <Card.Header>{projectName}</Card.Header>
                <Card.Meta>
                    <span className='date'>剩余时间:1</span>
                    <span>进度:{percent}</span>
                </Card.Meta>
                <Card.Description>项目描述</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <List horizontal style={{display: 'flex', justifyContent: 'space-around'}}>
                    <List.Item>
                        <List.Content>
                            <List.Header>已筹</List.Header>
                            {balance} wei
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <List.Header>已达</List.Header>
                            {percent}%
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <List.Header>参与人数</List.Header>
                            {investorCount}
                        </List.Content>
                    </List.Item>
                </List>
            </Card.Content>
        </Card>
    )

}

export default CardList