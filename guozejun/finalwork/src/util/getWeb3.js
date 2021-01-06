import Web3 from 'web3'

let getWeb3 = function () {
  var provider
  if(window.ethereum) {
    provider = window.ethereum
    try {
      await window.ethereum.enable()
    } catch (error) {
      console.error("User denied account access")
    }
    var web3 = new Web3(provider)
    return web3
  }
  else {
    alert("ERROR! metamask not installed!")
  }
}

export default getWeb3