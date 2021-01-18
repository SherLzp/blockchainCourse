# miniICO

本项目是个人开发的基于以太坊(Ethereum)和智能合约的Dapp项目，内容为ICO众筹系统。

使用的技术栈是Typescript + React + Solidity(0.5.1)



## Avaliable Uses

在该项目中，用户可以：

- 查看网站上所有的众筹项目，浏览内容并参与众筹
- 发起自己的众筹项目，规定其用途、筹集金额，截止日期等内容
- 参与其他人的众筹项目，该项目众筹成功，可以在发起者（Manager）设定使用请求后，对该使用请求进行投票
- 每个用户在投票中所具有的权力正比于其投资金额，若一个项目的资金使用请求得票率高于50%，该项目将成功运行，资金会转入经理人账户中；否则项目失败，资金转回用户账户中

- 众筹项目的状态机如下：

  ![state-machine](./imgs/state-machine.png)



## Quick Start

- 安装Node.js(以及yarn或npm)，以太坊ganache客户端，Chrome插件Metamask。

- 使用Node.js安装truffle框架： 

  `npm install truffle` 或 `yarn add truffle`

- 打开ganache客户端。

  在ganache软件上选择 quickstart，单击右上角齿轮图标进行设置。
  在 workspace 标签页中 add project 选中 [./contracts/truffle-config.js](./contracts/truffle-config.js)，在server标签卡中将端口改为8545。

  单击右上角 save and restart。这样就将ganache连接到了8545端口。    

- 在 [./contracts](./public-offering/src/utils) 目录下运行：    

  `truffle compile` 和 `truffle migrations`

  将生成的Funding.json复制到 [./public-offering/src/utils](./public-offering/src/utils) 下（覆盖那里的Funding.json）。

  将生成智能合约的地址复制到[contracts.ts](./public-offering/src/utils/contracts.ts)文件中的第五行，替换该处的地址。

  这样就就完成了对于智能合约配置。

- 在 [./public-offering](./public-offering) 目录下运行：  

  `yarn` 或 `npm i` 安装依赖包。

- `yarn start` 或 `npm start` 运行应用。

  在[localhost:3000](http://localhost:3000)中使用应用。

- 不要忘记在Metamask中让你的测试用户连接到网站中。
        

## Application Running

#### 无用户接入时

![image-20210112210614200](imgs/image-20210112210614200.png)



#### 接入用户时

![image-20210112210724340](imgs/image-20210112210724340.png)



#### 发起众筹

![image-20210112210933132](imgs/image-20210112210933132.png)



#### 发起成功后

![image-20210112210957886](imgs/image-20210112210957886.png)

![image-20210112211050788](imgs/image-20210112211050788.png)



#### 查看我发起的项目

![image-20210112211114259](imgs/image-20210112211114259.png)



#### 参与一个项目

![image-20210112211243570](imgs/image-20210112211243570.png)



#### 参与项目成功

![image-20210112211303351](imgs/image-20210112211303351.png)



#### 发起使用请求

![image-20210112211343286](imgs/image-20210112211343286.png)



#### 查看项目用途（发起请求后）

![image-20210112211452228](imgs/image-20210112211452228.png)



#### 项目投票通过/失败

![image-20210112211548718](imgs/image-20210112211548718.png)