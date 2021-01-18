let output = require('./01-compile');

//1. web3 , truffle hdwallet provider
let Web3 = require('web3')
let HDWalletProvider = require('truffle-hdwallet-provider');

//2. new web3
let web3 = new Web3();

//3.net ip and mnemonic
let mnemonic = 'distance exclude anger grant mule rally rail ketchup make siren jaguar tent'
let netIp = 'HTTP://127.0.0.1:8545'

//4. net provider
let provider = new HDWalletProvider(mnemonic,netIp)

//5.set web
web3.setProvider(provider)
console.log('web3 version',web3.version)

//6.abi
let contract = new web3.eth.Contract(JSON.parse(output.interface))

//7.bytecode dapp
let deploy = async() => {
    //1.account
    let accounts = await web3.eth.getAccounts()
    console.log('accounts:',accounts)

    //2.deploy
    let instance = await contract.deploy({
        data:output.bytecode,
    }).send({
        from:accounts[0],
        gas:'3000000'
    })
    //3.contract address
    console.log('instance address: ',instance.option.address)
}

deploy()