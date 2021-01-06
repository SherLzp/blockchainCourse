# 项目众筹DApp部署说明

> 郭泽均 3170105271

## 环境说明

本项目在WSL2 Ubuntu20.4 LTS环境下为chrome内核的浏览器开发，如果想要在本地部署本项目，请使用相似环境进行部署。

## 全局依赖项

请将以下全局依赖安装完成之后再运行本项目

- sudo apt install nodejs
- node
- npm
- truffle
- ganache-cli
- vue-cli
- metamask chrome extension

## 启动流程

### 本地私有链环境

在本地启动ganache-cli，查看服务启动的端口，注意本地ganache-cli服务应该通过`./tools/init_blockchain.sh`脚本处理，该脚本会在本地的8545端口启动一个ganache-cli服务，并生成10个指定的用户

![img](./img/init-ganache.png)

本地私有链的用户私钥列表如下

```zsh
Private Keys
==================
(0) 0x09d41b29574cb6b4200c4245321f1b7a618336b8bd0bb0580c9e074aa9c7858a
(1) 0x7cec80d21399baa0e1eff40ef3be1f3a55d4d369591111fb370562e55e346d2b
(2) 0xee97670fc3b192248c3bff2903aee96f05843428341d0e28da9e746b9802f09b
(3) 0xe7e130dc9d4d2905cd55a8bddb05eb21d5a371d7dfe75a63c444d6e657c301e9
(4) 0xf252aaf70394a5d477f97485472601ca3215b7c015ac5875a34b321e003179fb
(5) 0xd13464415601336377f4d146c527f37444ac5bff740b190fdb119c0629edf870
(6) 0x9c68cab31e45311979f1fd305e77d673a03a2c1389d8c6357603267110cb4bf2
(7) 0x7cba3617446f12057313d101d03e31736a56bd7b06c62d9d33e62816dc71c334
(8) 0x3ab22c3f21864b3538c11d1d6d2b6a200266c2d509ba307db260f8deaafb8a04
(9) 0x7a78a4dc8977da3647cce27a2cbe84c1b0012eaec6f56f170ae1a4dddd2f2b2e
```

### 修改truffle配置文件

修改truffle-config.js中的deployment字段为

```js
development: {
    host: "127.0.0.1",     // Localhost (default: none)
    port: 8545,            // Standard Ethereum port (default: none)
    network_id: "*",       // Any network (default: none)
}
```

### 编译并部署智能合约

- 编译

    `truffle compile`

- 部署

    `truffle migrate`

### 启动程序

```zsh
npm install
npm run serve
```
