# Final Work 众筹Dapp

#####                                                                                               3180103701 倪小淳

### 运行配置

1. 准备：安装配置`React`，`Web3`，`npm`，`yarn`，`truffle`，`Ganache`，在浏览器中需要安装MetaMask插件
2. 在`Ganache`新建一个workspace，在Truffle Project设置中导入`truffle-config.js`文件（记得修改truffle-config.js——添加本地区块链网络的配置参数）
3. 在/crowdfund目录下输入命令：`truffle migrate`
4. 在控制台显示的信息中，找到并复制contract address合约地址，粘贴到crowdfund/src/eth/cdfd.js对合约地址进行修改
5. 在/crowdfund目录下输入命令：`npm run start`
6. 在浏览器中访问`localhost:3000`端口

#### 运行界面截图

- 如果没有连上MetaMask

![image-20210113193147828](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20210113193147828.png)



- 发起众筹

![image-20210113212552365](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20210113212552365.png)



- 显示本账户发起的众筹

![image-20210113212637953](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20210113212637953.png)



- 显示“我”参与的众筹

![image-20210113213546657](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20210113213546657.png)



- 显示所有众筹

![image-20210113213508057](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20210113213508057.png)



- 参与众筹

![image-20210113215907210](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20210113215907210.png)



- 发起者提出使用资金请求

![image-20210113222732471](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20210113222732471.png)



- 显示使用资金的请求列表

![image-20210114115611809](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20210114115611809.png)



- 参与者对使用资金申请进行批准投票

![image-20210114121155222](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20210114121155222.png)