import React from 'react'
import { Button, Card, Statistic } from 'antd'

const CardExampleCard = (props) => (
    <Card>
        <Card.Content>
            <Card.Header>彩票Demo</Card.Header>
            <Card.Meta>
                <p style={{ wordBreak: 'break-word' }}>管理员地址: {props.manager}</p>
                <p style={{ wordBreak: 'break-word' }}>当前地址: {props.currentAccount}</p>
                <p style={{ wordBreak: 'break-word' }}>上期中奖者:{props.winner}</p>
            </Card.Meta>
            <Card.Description>每晚8点准时开奖！！</Card.Description>
        </Card.Content>
        <Card.Content extra>
            <Button name='user'>
                {props.playerCounts} 人参与
            </Button>
        </Card.Content>

        <Card.Content extra>
            <Statistic color='red'>
                <Statistic.Value>{props.balance}ETH</Statistic.Value>
                <Statistic.Label>奖金池</Statistic.Label>
            </Statistic>
        </Card.Content>

    </Card >
)
export default CardExampleCard;