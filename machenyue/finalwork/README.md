## 如何运行

1. 安装Node.js(以及yarn或npm)，以太坊ganache客户端，Chrome插件Metamask。

2. 使用Node.js安装truffle框架：

   `npm install truffle` 

3. 打开ganache客户端。

   在ganache软件上选择 quickstart，单击右上角齿轮图标进行设置。 在 workspace 标签页中 add project 选中 `./contracts/truffle-config.js`，在server标签卡中将端口改为8545。

   单击右上角 save and restart。

4. 在 主目录下运行：

   `truffle compile` 

    `truffle migrate`

   将生成的CrowdFunding.json拷贝到`./crowdfunding/src/api/`。

   将智能合约的地址复制到`./crowdfunding/src/api/contract.ts`文件中，替换对应的地址。

5. 在 `.crowdfunding` 目录下运行：

   `yarn`

   `yarn start` 。

6. 浏览器中访问：`http://localhost:8080`

## 成功界面截图

![Alt text](https://github.com/Mirach-mcy/blockchainCourse/blob/3180102882/machenyue/finalwork/assets/1.png)

![image](https://github.com/Mirach-mcy/blockchainCourse/blob/3180102882/machenyue/finalwork/assets/2.png)

![image](https://github.com/Mirach-mcy/blockchainCourse/blob/3180102882/machenyue/finalwork/assets/3.png)

![image](https://github.com/Mirach-mcy/blockchainCourse/blob/3180102882/machenyue/finalwork/assets/4.png)
