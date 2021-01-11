//导入web3实例
import web3 from "../utils/initWeb3"
import data from "../contracts/Crowdfunding.json"

// 获取工厂合约abi
let factoryAbi = data.abi
// 获取工厂合约地址
let factoryAddress = '0xf2Af32492d47Ef59952C6Ef95D637d132C94e3B'
// 获取工厂合约实例
let contract = new web3.eth.Contract(factoryAbi,factoryAddress)

let getAllFunding = async () => {
    let account = (await web3.eth.getAccounts())[0];
    let currentFunding = []
    let total = await contract.methods.totalFunding().call();

    for(let i=0; i<total; i++){
        currentFunding.push(await getOneFunding(i));
    }
        
    return currentFunding;
}
 
let getOneFunding= async (index) =>{
    const data = await contract.methods.fundings(index).call();
    data.targetMoney = web3.utils.fromWei(data.targetMoney, 'ether')
    data.tempMoney = web3.utils.fromWei(data.tempMoney, 'ether')

    return {index, ...data}
}

let newFunding= async (index) =>{
    

    return {index, ...data}
}



export {
    getAllFunding,
}