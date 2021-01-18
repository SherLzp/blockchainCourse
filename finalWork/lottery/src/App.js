import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
let abi =  [
  {
    "constant": true,
    "inputs": [],
    "name": "recipientId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_address",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_goal",
        "type": "uint256"
      }
    ],
    "name": "create_crowdfunding",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "Newaddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_recipientId",
        "type": "uint256"
      }
    ],
    "name": "contribute",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_recipientId",
        "type": "uint256"
      }
    ],
    "name": "Iscompelte",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

let Web3 = require("web3")
let web3 = new Web3()
if(window.ethereum){
  web3 = new Web3(window.ethereum)
}else if(window.web3){
  web3 = new web3(web3.currentProvider)
}else{
  alert('你需要先安装MetaMask')
}
window.ethereum.enable()
module.exports = web3
var address = '0xE834138F175Bf2253C4e376f7491069b6BC05E77';
let contractInstance = new.web3.eth.Contract(abi,address)

web3.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:0429"));

module.exports = contractInstance 

class App extends Component {


  Recipient = async () => {

  }
  
  render() {
    this.helpFunction()
    return (
        <div style={{ paddingLeft: '40%', paddingTop: '2%' }}>
            <input type="text" name="message" id="message" placeholder="请输入" />
        </div>
    );
}
  

}

export default App;
