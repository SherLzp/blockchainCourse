let solc = require('solc')
let fs = require('fs')

//read contract
let sourceCode = fs.readFileSync('./contracts/Funding.sol','utf-8')
let output = solc.compile(sourceCode,1)

console.log(output)
console.log('FundingAbi:',output['contracts'][':Funding']['interface']);
console.log('FundingAbi',output['contracts'][':Funding']['interface'])
module.exports = output['contracts'][':Funding']