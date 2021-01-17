// //1.引入web3和truffle-hdwallet-provider
// // let Web3 = require('web3')
// // console.log('window web3:',window.web3.version)
// //
// // //2.new一个web3实例
// // let web3 = new Web3()
// //
// // //3.设置网络
// //
// // //使用用户自己的provider来填充web3
// // web3.setProvider(window.web3.currentProvider)
// // console.log('web3:',web3.version)
// //
// // export default web3

let Web3 = require('web3')

let web3 = new Web3(window.web3.currentProvider)

//export导出，es6语法，defuault标识默认导出，在使用时，名字可以改变
// 使用时，用import导入
export default web3



