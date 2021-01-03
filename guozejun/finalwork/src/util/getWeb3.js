import Web3 from 'web3'

let getWeb3 = function () {
  var web3Provider
  if (window.web3) {
    web3Provider = window.web3.currentProvider
  }
  else {
    web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
  }
  var web3 = new Web3(web3Provider)
  return web3
}

export default getWeb3