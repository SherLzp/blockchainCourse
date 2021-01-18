import React from 'react'
import { Card, Image, List, Progress} from 'semantic-ui-react'



const CardList = (props) => {
    let details = props.details
    let onCardClick = props.onCardClick

    let cards = details.map(detail => {
        return <CardFunding key={detail.fundingAddress} detail={detail} onCardClick = {onCardClick}/>
    })

    return (
        <Card.Group itemsPerRow={4}>
            {cards}
        </Card.Group>
    )

}

export default CardList

const CardFunding = (props) => {
    let detail = props.detail
    let { fundingAddress, manager, projectName, supportBalance, targetBalance, endTime, balance, investorsCount } = detail
    let precent = parseFloat(balance) / parseFloat(targetBalance) * 100
    let onCardClick = props.onCardClick

    return (
        <Card onClick={() => {
            return onCardClick && onCardClick(detail)

        }}>
            <Image src='/images/elliot.jpg' wrapped ui={false} />
            <Card.Content>
                <Card.Header>{projectName}</Card.Header>
                <Card.Meta>
                    <span className='date'>剩余时间：{endTime}s</span>
                </Card.Meta>
                <Card.Description>穿过的都说好</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <List horizontal style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <List.Item>
                        <List.Content>
                            <List.Header>已筹</List.Header>
                            {balance}wei
                    </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <List.Header>已达</List.Header>
                            {precent}%
                    </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <List.Header>参与人数</List.Header>
                            {investorsCount}
                        </List.Content>
                    </List.Item>
                </List>
            </Card.Content>
        </Card>
    )
}





