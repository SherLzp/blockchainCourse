import Web3 from 'web3'

/*
* 1. Check for injected web3 (mist/metamask)
* 2. If metamask/mist create a new web3 instance and pass on result
* 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
* 4. Get user account from metamask
* 5. Get user balance
*/

// let getWeb3 = new Promise(function (resolve, reject) {
//   // Check for injected web3 (mist/metamask)
//     var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
//     resolve({
//       injectedWeb3: web3.isConnected(),
//       web3 () {
//         return web3
//       }
//     })
//     if(web3 === 'undefined') reject(new Error('Unable to connect to Metamask'))
// })
//   .then(result => {
//     return new Promise(function (resolve, reject) {
//       // Retrieve network ID
//       result.web3().version.getNetwork((err, networkId) => {
//         if (err) {
//           // If we can't find a networkId keep result the same and reject the promise
//           reject(new Error('Unable to retrieve network ID'))
//         } else {
//           // Assign the networkId property to our result and resolve promise
//           result = Object.assign({}, result, {networkId})
//           resolve(result)
//         }
//       })
//     })
//   })
//   .then(result => {
//     return new Promise(function (resolve, reject) {
//       // Retrieve coinbase
//       result.web3().eth.getCoinbase((err, coinbase) => {
//         if (err) {
//           reject(new Error('Unable to retrieve coinbase'))
//         } else {
//           result = Object.assign({}, result, { coinbase })
//           resolve(result)
//         }
//       })
//     })
//   })
//   .then(result => {
//     return new Promise(function (resolve, reject) {
//       // Retrieve balance for coinbase
//       result.web3().eth.getBalance(result.coinbase, (err, balance) => {
//         if (err) {
//           reject(new Error('Unable to retrieve balance for address: ' + result.coinbase))
//         } else {
//           result = Object.assign({}, result, { balance })
//           resolve(result)
//         }
//       })
//     })
//   })

let getWeb3 = function () {
  var web3Provider
  if (window.web3) {
    web3Provider = window.web3.currentProvider;
  }
  else {
    web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
  }
  var web3 = new Web3(web3Provider)
  return web3
}

export default getWeb3