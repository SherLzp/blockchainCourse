import React from 'react'
//import { Button, Card, Icon, Image, Statistic } from 'semantic-ui-react'
import { Layout, Menu, Card, Col, Row,Divider,Input,InputNumber,List, Space,Progress,Button,Radio,Modal,Tooltip} from 'antd';
import './ui.css'
import { ExceptionMap } from 'antd/lib/result';
const { TextArea } = Input;
const { Header, Content, Footer } = Layout;
const options=[
  {label:'同意',value:true},
  {label:'反对',value:false}
]
const PageExamplePage_info = (props)=>(
    <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} onClick={props.navclick} >
        <Menu.Item key="1">发现项目</Menu.Item>
        
        <Menu.Item key="4">新的项目</Menu.Item>
      </Menu>
      
    </Header>
    <Content style={{ padding: '0 50px' }}>
      
      <div className="site-layout-content" ><Button  onClick={props.back_click}>返回</Button>
      <div ><strong>当前账户：{props.current_account}</strong></div>
      <Modal
          visible={props.invest_modal_visble}
          title="投资项目"
          onOk={props.invest_ok}
          onCancel={props.invest_cancel}
          footer={[
            <Button key="back" onClick={props.invest_cancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading={props.invest_loading} onClick={props.invest_ok}>
              Submit
            </Button>,
          ]}
        >
          <Space size={10} direction="vertical" style={{alignSelf:'center'}}>
          <div>投资金额<InputNumber min={0} defaultValue={0} onChange={props.invest_input}/></div>

          </Space>
        </Modal>

        <Modal
          visible={props.new_proposal_modal_visble}
          title="发起资金使用请求"
          onOk={props.new_prop_ok}
          onCancel={props.new_prop_cancel}
          footer={[
            <Button key="back" onClick={props.new_prop_cancel}>
              返回
            </Button>,
            <Button key="submit" type="primary" loading={props.new_prop_loading} onClick={props.new_prop_ok}>
              提交
            </Button>,
          ]}
        >
          <Space size={10} direction="vertical" style={{alignSelf:'center'}}>
          <div>请求名称：<Input placeholder="请求名称" onChange={props.new_prop_name} /></div>
          <div>请求金额：<InputNumber min={0} defaultValue={0} onChange={props.new_prop_amount}/></div>
          <div>请求描述：<TextArea placeholder="请求描述" rows={5} onChange={props.new_prop_description} /></div>
          </Space>
        </Modal>

        <Modal
          visible={props.vote_modal_visble}
          title="为资金使用请求投票"
          onOk={props.vote}
          onCancel={props.vote_cancel}
          footer={[
            <Button key="back" onClick={props.vote_cancel}>
              返回
            </Button>,
            <Button key="submit" type="primary" loading={props.vote_loading} onClick={props.vote}>
              提交
            </Button>,
          ]}
        >
          <Space size={10} direction="vertical" style={{alignSelf:'center'}}>
            <Radio.Group options={options} onChange={props.vote_change} value={props.vote_opinion} optionType="button" buttonStyle="solid"/>
          </Space>
        </Modal>

      <Divider orientation="left">项目详细信息</Divider>
      <Space direction='vertical' size={20}>
      <div className="site-card-wrapper">
        <Row gutter={16}>
            <Col span={8}>
                <Card title="项目名称" bordered={false}>
                {props.fund_data.name}
                </Card>
            </Col>
            <Col span={8}>
                <Card title="项目情况" bordered={false} >
                  <strong  style={{color:props.fund_data.status_color}}> {props.fund_data.status}</strong> 
                </Card>
            </Col>
            <Col span={8}>
                <Card title="发起人" bordered={false}>
               {props.fund_data.raiser}
                </Card>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={8}>
                <Card title="目标金额" bordered={false}>
                {props.fund_data.target_amount}ETH
                </Card>
            </Col>
            <Col span={8}>
                <Card title="已筹金额" bordered={false}>
                {props.fund_data.total_amount}ETH
                </Card>
            </Col>
            <Col span={8}>
                <Card title="已使用金额" bordered={false}>
               {props.fund_data.total_amount-props.fund_data.current_amount}ETH
                </Card>
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={12}>
                <Card title="项目截止时间" bordered={false}>
                {props.fund_data.due}
                </Card>
            </Col>
            <Col span={12} style={{alignSelf:"center",display:props.fund_data.invest_visble}}>
          <Card  title='投资项目'  bordered={false}  > 
          您已投资：{props.fund_data.invest_amount}ETH
          <br/>
          <Button onClick={props.invest_click} disabled={props.fund_data.invest_disable}  >{props.fund_data.invest_button_info}</Button>
          </Card>
          </Col>
          <Col span={12} style={{alignSelf:"center" ,display:props.fund_data.new_proposal_visble}}>
          <Card  title='申请提款'  bordered={false}  > 
          当前剩余金额：{props.fund_data.current_amount}ETH
          <br/>
          <Button onClick={props.new_prop_click} disabled={props.fund_data.withdrawal_disable}>{props.fund_data.withdrawal_button_info}</Button>
          </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
          <Card  title='项目描述'  bordered={false}  > 
          {props.fund_data.description}
          </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
          <Card  title='项目筹款情况'  bordered={false}  > 
          <Tooltip title={props.fund_data.progress_info}>
          <Progress percent={props.fund_data.percent} status={props.fund_data.progress_status} />
          </Tooltip>
          </Card>
          </Col>
        </Row>
  </div>

    <List
      size="large"
      header={<div style={{width:"100%"}}>
          <Space size={300}>
          <div class="div-inline-vote">提案名称</div><div class="div-inline-vote">提案金额</div><div class="div-inline-vote">提案理由</div><div class="div-inline-vote">投票情况</div><div style={{display:"inline"}}>操作</div>
          </Space>
      </div>}
      footer={<div>共计{props.fund_data.proposals.length}个提案</div>}
      bordered
      dataSource={props.fund_data.proposals}
      renderItem={item => (<List.Item ><List.Item>{item.name}</List.Item>
      <List.Item>{item.amount}</List.Item>
      <List.Item>{item.description}</List.Item>
      <List.Item> <Tooltip title={item.progress_info}> <Progress style={{width:200}} percent={item.percent} success={{percent:item.agree_percent}}  status={item.progress_status} /></Tooltip> </List.Item> 
       <List.Item>  <Button value={item.index} disabled={item.withdrawal_disable} style={{display:props.fund_data.new_proposal_visble}} onClick={props.withdrawal}  type="primary"  > {item.button_info} </Button> 
       <Button value={item.index} disabled={item.vote_disable}  style={{display:props.fund_data.vote_visble}} onClick={props.vote_click}  type="primary"> {item.button_info} </Button>
        </List.Item> 
          </List.Item>)
    }
      
    />
    </Space>
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
)

export default PageExamplePage_info