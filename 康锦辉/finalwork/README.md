# Readme

A crowdfunding Dapp as a project for the blockchain course in ZJU.



#### 准备工作

后端：

用backend文件夹下的truffle-config.js文件运行Ganache

在backend文件夹下执行：

```
truffle deploy / truffle migrate
```

部署合约，将Crowdfund合约的地址更新到frontend/src/backend/contract.js文件中

![image-20210115202543248](imgs\image-20210115202543248.png)





前端：

在frontend文件夹下执行：

```shell
npm install package.json
```

安装项目运行需要的依赖

可能有部分依赖仍然没有安装，需要单独安装

在frontend文件夹下执行：

```shell
npm start
```



将Ganache预设的账户导入metamask并连接到本地私有链



成功运行示例：

![image-20210115201541265](imgs\image-20210115201541265.png)