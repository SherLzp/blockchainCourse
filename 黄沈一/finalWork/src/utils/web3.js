import Web3 from 'web3';

let web3 = new Web3();
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
} else if (window.web3) {
  web3 = new Web3(web3.currentProvider);
} else {
  alert('MetaMask is needed!');
}
window.ethereum.enable();

export default web3;