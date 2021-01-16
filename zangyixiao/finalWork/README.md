## **去中心化众筹Dapp**使用说明

开发环境：Windows10下，基于Nodejs + Solidity + Vue，采用vscode管理编辑

### 一、运行方式

1. 在本机配置好npm，node

   ![node](\images\node.jpg)

   

2. 安装truffle，Ganache，Chrome的MetaMask插件等相关依赖。

   ![node](\images\truffle.jpg)

   ![node](\images\Ganache.jpg)

   ![node](\images\MetaMask.jpg)

   

3. 运行Ganache软件并新建一个Workspace（选择"QUICKSTART"即可）。

   ![node](\images\QUICKSTART.jpg)

   

4. 在新的Workspace中点击设置按钮，在WORKSPACE标签页中点击ADD PROJECT按钮导入./crowdfunding/truffle-config.js文件。

   ![node](\images\setting.jpg)

   ![node](\images\addproject.jpg)

   

5. 在SERVER选项卡将端口号改为8545，其他默认。点击SAVE AND RESTART保存设置。

   ![node](\images\8545.jpg)

   

6. 在cmd命令行窗口进入到./crowdfunding，运行如下指令进行部署：

   ```sh
   truffle compile
   truffle migrate
   ```

7. 在Workspace中点击CONTRACTS选项卡赋值Crowdfunding的合约地址到./crowdfunding/src/eth/CrowdFunding.js

   ![node](\images\address.jpg)

   ![node](\images\address2.jpg)

   

8. 在命令行窗口进入到./crowdfunding，运行如下指令开启Dapp：

   ```sh
   npm install
   npm run serve
   ```

   然后在Chrome浏览器中输入http://localhost:8080地址即可访问。

   ![node](\images\start.jpg)

9. 在MetaMask中选择localhost:8545网络，然后可以在Ganache中导入账户进行使用。

   ![node](\images\daoru.jpg)

   ![node](\images\key.jpg)

   

### 二、Dapp截图

#### 1. 浏览项目页面

![1](images/1.JPG)



#### 2. 我的众筹页面

![2](images/2.JPG)



#### 3. 项目详情页面

![3](images/3.JPG)



#### 4. 发起众筹页面

![4](images/4.JPG)





