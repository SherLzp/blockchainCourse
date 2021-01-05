let models = require('./models');
var path = require('path');
var fs = require('fs');
var web3 = require('./connector');
var factoryABI = fs.readFileSync(path.join(__dirname, '../Solidity/build/contracts/FundingFactory.json')).toString();
var FactoryContract = web3.eth.contract(JSON.parse(factoryABI).abi);
var fundingABI = fs.readFileSync(path.join(__dirname,'../Solidity/build/contracts/Funding.json')).toString();
var fundingContract = web3.eth.contract(JSON.parse(fundingABI).abi);
const contractAddr = '26B0654B39A7795Fd6fd2cc6c2Ff30AfeDF44B54';
var myContractInstance = FactoryContract.at(contractAddr);
web3.eth.defaultAccount = web3.eth.coinbase;

const funding_addr = '0x2bd8ae1bcc7c00944855bd2363814e1a75273020';
async function test() {
    let account = '0x9b1f7cf351be9672a263B06d4De7250fD797A9f3';
    let Requests = {
        purpose:"test2",
        seller:"0x3fafc27cddf2739169e9d1eb83BCba0F67c68d1f",
        cost:1
    }
    await models.create_request(account,Requests, funding_addr);
}
async function test2() {
    let res = await models.check_request(funding_addr);
    //let res = await models.transfer_funding(funding_addr);
    return res;
}
async function test3() {
    await test_refund();
    //return res;
    //test()
}
async function test_refund() {
    let account = '0x9b1f7cf351be9672a263b06d4de7250fd797a9f3';
    await models.refund(account,funding_addr);
}
test3();