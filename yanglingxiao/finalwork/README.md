## 3180103608 杨凌霄 去中心化众筹Dapp

### 1 环境配置

#### **1.1主机环境**

**Windows:**

CPU: Intel(R)Core(TM)i5-5200U CPU@2.20GHz
Memory: 8GB(DDR3L 1600MHZ)
Operating System: Windows 10  

#### 1.2 安装Node.js

NodeJS 是一个 JavaScript 的运行时环境（Runtime），可以帮助开发者在非浏览器环境中实现基于 JavaScript 脚本语言的应用开发。事实上， Truffle 也是构建于 JS 语言之上的。我们通过 NodeJS 自带的 Package 管理工具 npm 就可以快速完成 Truffle 库（以及其它可能的依赖库）的下载和自动配置。 

因此， 在 windows 下在安装 NodeJS 的过程中务必确认选中 npm package manager，以及 Add to PATH 选项（确保 NodeJS 的执行文件可以在任何目录下被找到）。 之后我们就可以在 Windows 系统控制（cmd 或者powershell）中完成 NodeJS 的指令调用了。

![1](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\1.png)



#### 1.3 安装Truffle

命令行下执行 npm install –g truffle 可以安装 truffle（install 参数表示安装某个 JS 库， -g 表示它是一个全局可用的库）。  

![2](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\2.png)



#### 1.4 安装Ganache

​		智能合约是运行在以太坊区块链之上的，而以太坊公链上的所有写入操作都需要消耗以太（ETH），也就是用户手中的数字资产。因此，我们有必要选择一个合适的测试用区块链， 或者直接建立一个私有的区块链，用于 DAPP 的编写和测试。 本文中使用 Ganache 来构建私有链。
​		从 https://truffleframework.com/ganache 下载最新版本的 Ganache 并进行安装。 它的运行界面如图，系统已经自动分配了多位虚拟用户，并且给每个人分配了 100ETH 作为初始资产。在后继的开发过程中，我们可以随时使用这里的虚拟用户来进行合约的测试。  

![3](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\3.png)



#### 1.5 安装钱包插件 Metamask

**Windows:**
通过 https://metamask.io/ 安装 MetaMask 插件。  

![4](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\4.png)



#### 1.6 安装lite-server

命令行 npm install -g lite-server 即可。  



### 2 技术栈

- 使用 solidity 语言的 truffle 框架
- 项目模板使用 react 框架
- 前端使用 ES6 语法

- 部署在本地私有网络 http://127.0.0.1:7545
- 使用 MetaMask 钱包插件发布交易



### 3 本地运行方式

**Windows运行方式：**

1. 打开终端进入根目录（crowd-funding-dapp）；

2. 执行npm install安装所需依赖；

3. 执行truffle.cmd compile对智能合约进行编译（需确认truffle.cmd在盘符下有响应）；

   ![5](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\5.png)

   

4. 执行truffle.cmd migrate对智能合约进行部署（在此之前已经启动Ganache并连接上MetaMask）；

   ![6](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\6.png)

   

5. 执行truffle.cmd test对合约进行测试；

6. 执行npm run dev（在此之前需要确认已配置好lite-server）；

7. chrome（或firefox）浏览器localhost:3000端口查看；

**项目目录：**

![7](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\7.png)





### 4 运行界面截图

#### 4.1 众筹商品界面：

![8](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\8.png)



#### 4.2 登录界面

![9](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\9.png)



#### 4.3 购买者成功登录

![10](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\10.png)



#### 4.4 更多的众筹产品展示

![11](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\11.png)



#### 4.5 购买者选择众筹产品进行购买

![12](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\12.png)



#### 4.6 确认购买，交易发生

![13](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\13.png)



#### 4.7 Ganache中BLOCKS更新

![14](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\14.png)



#### 4.8 投资者选择众筹产品进行投资

![15](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\15.png)



#### 4.9 MetaMask中显示以太币扣除

![16](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\16.png)



#### 4.10 MetaMask中显示Activities详情

![17](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\17.png)



#### 4.11 若非投资者访问已投资的项目

![18](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\18.png)



#### 4.12 查看自己已支持（购买）的众筹产品

![19](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\19.png)

#### 4.13 发布一款众筹产品

![20](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\20.png)

#### 4.14 众筹成功后投资者进行投票

![13](D:\Git区块链\blockchainCourse\yanglingxiao\finalwork\images\13.png)



#### 以上为“区块链与数字货币”课程 去中心化众筹Dapp开发的说明文档





