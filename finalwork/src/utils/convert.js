let web3 = require('./InitWeb3')

var toWei = (i) => {
    return web3.utils.toWei(String(i), 'ether')
}

var fromWei = (i) => {
    return web3.utils.fromWei(String(i), 'ether')
}

export { toWei, fromWei }