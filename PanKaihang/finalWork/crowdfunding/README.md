## 去中心化CrowdFunding DAPP

### 运行方法

首先需要配置和安装好node.js、npm、yarn、ganache等等，然后在chrome浏览器中安装插件metaMask.

未采用工程化方法进行合约编译部署，而是采用remix进行合约部署

1、用Ganache搭建私有网络：在Ganache中点击QUICK START，点击右上角齿轮设置server的端口为8545，在metaMask钱包中，选择网络localHost8545，并根据Ganache上的账户私钥在metaMask中导入账户（账户）。

2、打开Remix，点击Open Files打开/contracts/crowdFunding.sol，然后在SOLIDITY COMPILER页面选择COMPILER为0.6.12+commit.276517d5，点击Compile crowdFunding.sol进行编译

3、在Remix的DEPLOY & RUN TRANSACTION页面，选择ENVIRONMENT为Injected Web3。此时会自动弹出metaMask钱包，选择第一步导入有余额的账户进行连接，CONTRACT选项设置为**AllFundings**，点击Deploy进行部署。

4、在Remix的FILE EXPLORERS界面中找到browser/artifacts/AllFundings.json中找到abi数据项，替换/src/eth/CrowdFunding.js中的abi数据项；在Ganache的TRANSACTION标签页中，找到CONTRACT CREATION的TRANSACTION，将其CREATED CONTRACT ADDRESS替换/src/eth/CrowdFunding.js中的address数据项。

5、在主目录下(即crowdfunding目录下)运行前端：npm  install         +         npm start



### 运行成功截图

首先，dapp的导航栏分为首页，全部众筹，可投资项目，我的创建，我的投资五块内容。

其中，发布众筹项目按键可以**发布众筹**；

查看详情按键首先可以**查看项目详细信息**，然后对于进行中的项目，点击查看详细之后还可以进行**投资**；对于已经成功的项目，点击查看详情之后还可以**对资金使用请求进行投票**

我的创建这里除了查看详情按键还可以对自己创建的且已经成功的众筹项目**提出资金使用请求**。

我的投资这里除了查看详情按键还可以对自己投资的且尚未成功或失败的众筹项目要求**退钱**。

**首页**

<img src=".\assets\mainPage.PNG" alt="mainPage" style="zoom:60%;" />



**全部众筹项目**

<img src=".\assets\allFunding.PNG" alt="allFunding" style="zoom:60%;" />



**可投资项目**

<img src=".\assets\unfinishFunding.PNG" alt="unfinishFunding" style="zoom:60%;" />



**我创建的**

<img src=".\assets\myCreateFunding.PNG" alt="myCreateFunding" style="zoom:60%;" />



**我投资的**

<img src=".\assets\myInvestFunding.PNG" alt="myInvestFunding" style="zoom:60%;" />



**发布众筹**

<img src=".\assets\newFunding.PNG" alt="newFunding" style="zoom:60%;float:left" />



**查看详情与投资**

<img src=".\assets\detailAndInvest.PNG" alt="detailAndInvest" style="zoom:60%;float:left" />



**提出资金使用请求**

<img src=".\assets\newUse.PNG" alt="newUse" style="zoom:60%;float:left" />



**查看详情与给资金使用请求投票**

<img src=".\assets\detailAndVote.PNG" alt="detailAndVote" style="zoom:60%;float:left" />



