import Vue from 'vue'
import App from './App'
import router from './router'
import vuetify from './plugins/vuetify'
import global from './common/Common'
import ProjectManager from "./util/constants/ProjectManager.json"
import Web3 from "web3"
// import { store } from './store/'
import {getProjectByAddr} from "./util/getContract"

import getWeb3 from './util/getWeb3'
// import { address } from './util/constants/crowdfundingContract'

Vue.config.productionTip = false

// 用户地址
export var userAddr
// 主节点地址
export var addressAdmin = '0xeD262B70D72545BaF1B3d6253b8084D534D57Db2'
// web3连接
export var web3
export var addrlist
// 主节点contract
export var contractManager

export var InfoList = new Array()

Vue.use(global)

function GetAllProj () {
    contractManager.methods.GetAllProj().call({
        from: userAddr,
        gasPrice: "0"
    }).then(
        (val) => {
            addrlist = val
            console.log(addrlist);
            for(let i = 0; i < addrlist.length; ++i){
                getProjectByAddr(addrlist[i])
            }
        }
    )
}

getWeb3().then((val) => {
    console.log(val)
    web3 = val[0]
    userAddr = val[1]
    contractManager = new web3.eth.Contract(ProjectManager["abi"], addressAdmin)
    // console.log(contract.methods.GetAllProj().send({
    //     from: userAddr,
    // })
    // )
    GetAllProj()
    new Vue({
        router,
        vuetify,
        global,
        // store,
        render: h => h(App),
        method: {
        }
    }).$mount('#app')
})