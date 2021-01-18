# crowdfunding dapp，浙江大学区块链与数字货币课程作业

## 使用方法

首先，确保您的开发环境已经安装了npm，truffle，node，metamask等工具

- clone到本地
- `npm install`
- 在本地运行区块链，端口为8545
- `truffle migrate --reset`
- 将部署到本地的Crowdfunding合约的地址复制，并替换掉`./src/eth/Crowdfunding.js`中的第303行的字符串
- `yarn start`
- 连接metamask，连接到localhost的8545端口
- 开始使用

## 运行时截图

![运行时](\assets\运行时.png)