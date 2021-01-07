import CrowdFunding from "./constants/Crowdfunding.json"
import { userAddr, contractManager, web3, InfoList} from "../main"

// 获取并部署众筹智能合约
async function getContract(param) {
    // 获取 contract
    var contract = new web3.eth.Contract(CrowdFunding["abi"])
    // 部署 contract
    var crowdfunding = await contract.deploy({
        data: CrowdFunding["bytecode"],
        arguments: param
    })
    .send({
        from: userAddr,
        gas: '4700000'
    }, function (e, contract) {
        console.log(e, contract)
    })
    console.log(userAddr, crowdfunding._address)
    contractManager.methods.InsertProj(userAddr, crowdfunding._address).send({
        from: userAddr
    })
    return crowdfunding
}

function getProjectByAddr(addr) {
    var contract = new web3.eth.Contract(CrowdFunding["abi"], addr)
    var result
    contract.methods.GetProjectInfo().call({
        from: userAddr
    }).then((val) => {
        result = val
        result[3] = new Date(result[3] * 1000)
        result[4] = new Date(result[4] * 1000)
        result["id"] = addr
        result["amount"] = 0
        console.log(result)
        InfoList.push(result)
    })
}

function participateProj(addr, amount) {
    amount = amount.toString()
    amount += "000000000000000000"
    console.log(addr, amount, userAddr);
    var contract = new web3.eth.Contract(CrowdFunding["abi"], addr)
    contract.methods.Parcipate(amount, userAddr).send({
        from: userAddr,
        value: amount,
        gas: '4700000'
    })
}

export {getContract, getProjectByAddr, participateProj}