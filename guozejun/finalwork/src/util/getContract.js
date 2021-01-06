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
    console.log(addr, typeof(addr));
    var contract = new web3.eth.Contract(CrowdFunding["abi"], addr)
    var result
    contract.methods.GetProjectInfo().call({
        from: userAddr
    }).then((val) => {
        result = val
        console.log(result)
        InfoList.push(result)
    })
}

export {getContract, getProjectByAddr}