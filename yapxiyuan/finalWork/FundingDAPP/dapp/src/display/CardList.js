//显示项目的图
import React from 'react';
import { Card , Image , List , Progress } from 'semantic-ui-react';

const src = '/public/images/whiteframe.png'

const CardList = (props) => {
    let details = props.details
    let onCardClick = props.onCardClick

    let cards = details.map(detail => {
        return <CardFunding key = {detail.fundingAddress} detail={detail} onCardClick={onCardClick}/>

    })

    return (
        <Card.Group itemsPerRow={4}>
            {cards}
        </Card.Group>
    )

}

const CardFunding = (props) => {
    let detail = props.detail
    let {fundingAddress,manager,projectName,investBalance,targetBalance,projectDescrip,deadline,balance,investorsCount} = detail
    let percent = parseFloat(balance) / parseFloat(targetBalance) * 100
    
    let onCardClick = props.onCardClick

    return(
        <Card onClick={() => {
            return onCardClick && onCardClick(detail)
        }}>
            <Image src = '/images/ethereum.jpg' wrapped ui={false}/>
            <Card.Content>
                <Card.Header>{projectName}</Card.Header>
                <Card.Meta>
                    <span className='date'>截止时间 ：{deadline} （根据上方链接自行转换时间）</span>
                </Card.Meta>
                <Card.Description>概述：{projectDescrip}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <List horizontal style={{display:'flex', justifyContent:'space-around'}}>
                    <List.Item>
                        <List.Content>
                            <List.Header>已筹得</List.Header>
                            {balance}wei
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
                            <List.Header>已参与人数</List.Header>
                            {investorsCount}人
                        </List.Content>
                    </List.Item>
                </List>
            </Card.Content>
        </Card>
    )

}

export default CardList
