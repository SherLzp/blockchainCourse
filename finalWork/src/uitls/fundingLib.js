let fundingInstance = require('../eth/Funding')
let web3 = require('./web3mod')


export default {

  fundingInstance: fundingInstance,
  web3: web3,
  rpc: fundingInstance.methods,
  /**
   * 将数组格式的信息转换为对象
   * @param fundInfo
   */
  loadInfo(fundInfo) {
    return fundInfo.map(item => {
      return {
        id: parseInt(item[0]),
        starter: item[1],
        beneficiary: item[2],
        goal: parseInt(item[3]),
        sum: parseInt(item[4]),
        votedSum: parseInt(item[5]),
        funders: item[6],
        money: item[7],
        hasVoted: item[8],
        isIssued: item[9],
        isTransferred: item[10],
        desc: item[11],
        issueAmount: parseInt(item[12]),
      }
    })
  },
}
