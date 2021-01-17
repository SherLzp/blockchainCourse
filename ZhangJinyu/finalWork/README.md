区块链与数字货币 final work

> 张金羽-3180102774

### 如何运行我的项目

- 安装私有以太坊客户端Ganache
- 安装nodejs,npm,安装solc编译器,安装Truffle
- 安装可以在Chrome中运行的MetaMask插件
- 运行Ganache软件
  - quickstart新建一个新workspace
  - 在设置的中点击ADD PROJECT按钮导入./truffle-config.js
  - 在设置的SERVER中PORT NUMBER设置为8545
  - 点击SAVE AND RESTART
- 在命令行窗口进入到./chouDapp文件夹内
  - 运行truffle compile
  - 运行truffle migrate
- 在Ganache软件中查看CONTRACTS中chouDapp的地址
  - 将ADDRESS的值复制到chouDapp\src\eth\chouDapp.js中倒数第三行处
- 在命令行窗口中继续执行
  - npm install
  - npm run serve
- 在Chrome浏览器中打开http://localhost:8080
  - 在MetaMask插件中选择localhost 8545作为主网络，向其中导入Ganache内账户并连接到网络后即可使用

### 项目运行成功后的界面截图

- 众筹发起人发起项目众筹，明确项目概述、项目介绍等项目信息，明确众筹金额和截止时间（考虑好时间问题）

  - 截图为account2发起众筹

  ![1610890579049](picture\1610890579049.png)

-  每个用户可以查看所有的众筹项目，也可以查看自己相关的众筹项目（创建者可以查看自己创建的项目、投资人可以查看自己投资过的项目）

  - 截图为account4参与众筹2ETH后查看我的众筹效果（之前account3众筹了8）

  ![1610890864019](picture\1610890864019.png)

- 投资人可以查看未完成众筹项目，进行投资

  - 截图为account3查看众筹

  ![1610890747403](picture\1610890747403.png)

- 众筹成功后，众筹发起人一笔资金使用请求，明确使用金额和目的。请求需要经过投资人的投票来决定是否允许使用，满足50%的允许率，可以进行金额的使用。【注意】每位投资人只允许投一票。

  - 截图为account2发起使用

    ![1610891174588](picture\1610891174588.png)

  - 截图为account3同意使用

    ![1610891351064](picture\1610891351064.png)

- 其他展示请看视频
