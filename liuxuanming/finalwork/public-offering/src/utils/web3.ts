// 导入web3
let Web3 = require('web3')
// 创建web3实例
// @ts-ignore
let web3 = new Web3(window.web3.currentProvider)
// 导出web3实例
export default web3