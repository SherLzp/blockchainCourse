import Funding from './Funding.json'
import web3 from './web3'

// 修改地址为合约所在区块内的地址
var contractAddr = "0xc559Bcc539c8914BB5408D39a3268E0A736BA8d6"
const FundingABI = Funding.abi

// 获取合约实例
// @ts-ignore
const contract = new web3.eth.Contract(FundingABI, contractAddr);

export default contract
