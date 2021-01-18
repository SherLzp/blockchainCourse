import React from 'react';
import { Layout, Breadcrumb, Typography } from 'antd';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

class Home extends React.Component {
    render() {
        return (
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                    </Breadcrumb>
                </Content>
                <body>
                    <Typography>
                        <Title style={{ textAlign: 'center' }}>Crowdfunding-ETH</Title>
                        <Paragraph>
                        &nbsp;&nbsp;&nbsp;&nbsp;Crowdfunding-ETH 是一个基于以太坊的 DApp，你可以
                        </Paragraph>
                        <Paragraph>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 发起众筹
                        </Paragraph>
                        <Paragraph>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 发起众筹
                        </Paragraph>
                        <Paragraph>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 查看所有众筹
                        </Paragraph>
                        <Paragraph>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 查看我发起的众筹
                        </Paragraph>
                        <Paragraph>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 查看我投资的众筹
                        </Paragraph>
                        <Paragraph>
                            &nbsp;&nbsp;&nbsp;&nbsp;Have fun!
                        </Paragraph>
                    </Typography>
                </body>
                <Footer style={{ textAlign: 'center' }}>Crowdfunding-ETH ©2021 Created by chronoby</Footer>
            </Layout>
        )
    }
}

export default Home
