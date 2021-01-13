import React from 'react';
//tools
import {Statistic, Card, Row, Col } from 'antd'
//mytools
import Qm from '../QuickModal/Qm'
//css file
import './Qmb.css';
//component
class Qmb extends React.Component{
    constructor(props){
        super()
    }
    render(){
        return (
            <div className="pxIndexPageInfo">
                <div className="pxIndexPageInfoDisplay">
                <Row gutter={1} style={{width:"100%",height:"50%"}}>
                    <Col span={12} style={{height:"100%"}}>
                    <Card 
                    style={{width:"100%",height:"100%"}}>
                        <Statistic
                        title="所有众筹数量"
                        value={this.props.number.sell}
                        precision={0}
                        valueStyle={{ color: '#222' }}
                        
                        suffix="项"
                        />
                    </Card>
                    </Col>
                    <Col span={12} style={{height:"100%"}}>
                    <Card style={{width:"100%",height:"100%"}}>
                        <Statistic
                        title="我发起的众筹"
                        value={this.props.number.buy}
                        precision={0}
                        valueStyle={{ color: '#222' }}
                        
                        suffix="项"
                        />
                    </Card>
                    </Col>
                </Row>
                <Row gutter={1} style={{width:"100%",height:"50%"}}>
                <Col span={12} style={{height:"100%"}}>
                    <Card 
                    style={{width:"100%",height:"100%"}}>
                        <Statistic
                        title="我参加的众筹"
                        value={this.props.number.today}
                        precision={0}
                        valueStyle={{ color: '#222' }}
                        
                        suffix="项"
                        />
                    </Card>
                    </Col>
                    <Col span={12} style={{height:"100%"}}>
                    <Card style={{width:"100%",height:"100%"}}>
                        <Statistic
                        title="最新区块号"
                        value={this.props.number.block}
                        precision={0}
                        valueStyle={{ color: '#222' }}
                        
                        suffix=""
                        />
                    </Card>
                    </Col>
                </Row>
                </div>
                <Qm 
                    tablePost={this.props.tablePost}
                    handleSubmitPost={this.props.handleSubmitPost}
                    />
      </div>
        )
    }
}
export default Qmb;