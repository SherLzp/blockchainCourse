var Web3 = require('web3');
var web3;

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

//console.log(web3.eth.accounts);
//var version = web3.version.node;
//console.log(version);

module.exports = web3;