let Web3 = require('web3')

var web3Provider;
if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
        // 请求用户授权
        // 不用同步的方式
        window.ethereum.enable();
    } catch (error) {
        // 用户不授权时
        console.error("User denied account access")
    }
} else if (window.web3) {   // 老版 MetaMask Legacy dapp browsers...
    web3Provider = window.web3.currentProvider;
} else {
    web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
}
var web3 = new Web3(web3Provider);//web3就是你需要的web3实例

//export导出，es6语法，default 标识默认导出，使用时候，名字可以改
export default web3;