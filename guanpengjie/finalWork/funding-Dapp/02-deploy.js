let output = require('./01-compile')

//1.引入web3和truffle-hdwallet-provider
let Web3 = require('web3')
let HDWalletProvider = require('truffle-hdwallet-provider')

//2.new一个web3实例
let web3 = new Web3()

//3.获取助记词和所要连接的网络
let mnemonic = 'april slice fetch small middle raccoon autumn mad false raccoon sort inside'
let netIp = 'http://127.0.0.1:8545'

//4.new一个provider
let provider = new HDWalletProvider(mnemonic,netIp)

//5.设置网络
web3.setProvider(provider)

console.log('web3 version:',web3.version)
//6.拼接合约 abi
let contract = new web3.eth.Contract(JSON.parse(output.interface))

//7.拼接bytecode并部署合约
let deploy = async () => {
    // 1.获取所有的账户
    let accounts = await web3.eth.getAccounts()
    console.log('accounts:',accounts)

    // 2.执行部署
    let instance = await contract.deploy({
        data:output.bytecode,
    }).send({
        from:accounts[0],
        gas:'3000000'
    })
    //8.接收合约地址
    console.log('instance address:',instance.options.address)
}

deploy()







