## 去中心化众筹平台使用说明

### 一、运行方式

1. 在本机配置好npm，node，truffle，Ganache，Chrome的MetaMask插件等相关依赖。

2. 运行Ganache软件并新建一个Workspace。

3. 在新的Workspace中点击设置按钮，在WORKSPACE标签页中点击ADD PROJECT按钮导入./crowdfunding/truffle-config.js文件。

4. 在SERVER选项卡将端口号改为8545，其他默认。点击SAVE AND RESTART保存设置。

5. 在Workspace中点击CONTRACTS选项卡赋值Crowdfunding的合约地址到./crowdfunding/src/eth/CrowdFunding.js

   ```js
   let address = '合约地址'
   ```

6. 在命令行窗口进入到./crowdfunding，运行如下指令：

   ```sh
   truffle compile
   truffle migrate
   npm install
   npm run serve
   ```

   然后在Chrome浏览器中输入http://localhost:8080地址即可访问平台。

7. 在MetaMask中选择localhost:8545网络，在Ganache中导入至少三个账户，进行使用。

### 二、项目截图

#### 1. 浏览项目页面

![1](images/1.png)

#### 2. 我的众筹页面

![2](images/2.png)

#### 3. 项目详情页面

![3](images/3.png)

#### 4. 发起众筹页面

![4](images/4.png)

#### 5. 发起使用请求页面

![5](images/5.png)

