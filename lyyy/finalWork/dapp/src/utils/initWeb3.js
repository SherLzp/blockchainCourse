//require a web3
let Web3 = require('web3')
//provider
let web3 = new Web3()
if(window.ethereum){
    web3 = new Web3(window.ethereum)
    window.ethereum.enable()
}else if(window.web3){
    web3 = new Web3(window.web3.currentProvider)
}else{
    alert('你需要先安装MetaMask')
}


export default web3