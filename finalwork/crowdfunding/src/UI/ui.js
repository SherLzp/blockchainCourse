import React from 'react'
//import { Button, Card, Icon, Image, Statistic } from 'semantic-ui-react'
import { Layout, Menu, Breadcrumb ,Card,Image,Button,Statistic,Divider,List, Space,Radio} from 'antd';
import './ui.css'
const { Header, Content, Footer } = Layout;
const options=[
    {label:'所有项目',value:0},
  {label:'我投资的',value:1},
  {label:'我发起的',value:2}
]
const PageExamplePage = (props)=>(
    <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} onClick={props.navclick} selectedkeys={[props.current]}>
        <Menu.Item key="1">发现项目</Menu.Item>
        
        <Menu.Item key="4">新的项目</Menu.Item>
      </Menu>
      
    </Header>
    <Content style={{ padding: '0 50px' }}>
      
      <div className="site-layout-content" >
      <div ><strong>当前账户：{props.current_account}</strong></div>
      <Divider orientation="left">众筹项目一览</Divider>
      <Radio.Group options={options} onChange={props.view_change} value={props.view_option} optionType="button" buttonStyle="solid"/>
    <List
      size="large"
      header={<div >
          
          <div class="div-inline">项目名称</div><div class="div-inline">发起人</div><div class="div-inline">截止时间</div><div style={{display:"inline"}}>筹集状况</div>
         
      </div>}
      footer={<div>共计{props.crowd_funds.length}个众筹项目</div>}
      bordered
      dataSource={props.crowd_funds}
      renderItem={item => (<List.Item value={item.index} onClick={props.fundclick}><List.Item>{item.name}</List.Item><List.Item>{item.raiser}</List.Item><List.Item>{item.due}</List.Item><List.Item><strong style={{color:item.status_color}}>{item.status}   </strong></List.Item></List.Item>)
    }
      
    />
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
)


const CardExampleCard = (props) => (
    <Card>
        <Image src='/images/logo.png' />
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
            <Button>
                
                {props.playerCounts} 人参与
            </Button>
        </Card.Content>

        <Card.Content extra>
            <Statistic color='red'>
                <Statistic.Value>{props.balance}ETH</Statistic.Value>
                <Statistic.Label>奖金池</Statistic.Label>
            </Statistic>
        </Card.Content>

        <Card.Content extra>
            <Statistic color='blue'>
                <Statistic.Value>第{props.round}期</Statistic.Value>
                <a href='https://ropsten.etherscan.io/address/0x66F06D938F90b8cc1604F6f2C4b4520cBDD23DCf'>点击我查看交易历史</a>
            </Statistic>
        </Card.Content>

        <Button animated='fade' color='orange' onClick={props.play} disabled={props.isClicked}>
            <Button.Content visible>投注产生希望</Button.Content>
            <Button.Content hidden>购买放飞梦想</Button.Content>
        </Button>

        <Button inverted color='red' style={{ display: props.isShowButton }} onClick={props.draw}
            disabled={props.isClicked}>
            开奖
        </Button>
        <Button inverted color='orange' style={{ display: props.isShowButton }} onClick={props.refund}
            disabled={props.isClicked}>
            退奖
        </Button>
    </Card >
)
export default PageExamplePage
///export default CardExampleCard
//import es6