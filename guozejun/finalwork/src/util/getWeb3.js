import Web3 from 'web3'

let getWeb3 = async function () {
  var provider
  var address
  if(window.ethereum) {
    provider = window.ethereum
    try {
      await window.ethereum.enable()
    } catch (error) {
      console.error("User denied account access")
    }
    var web3 = new Web3(provider)

    await web3.eth.getAccounts(function (error, result) {
			if (!error) {
				address = result
			}
		})

    return new Array(web3, address[0])
  }
  else {
    alert("ERROR! metamask not installed!")
  }
}

export default getWeb3