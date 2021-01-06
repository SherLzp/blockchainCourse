<template>
    <div>
        <div v-for="item in InfoList"> {{ item }} </div>
    </div>
</template>

<script>
import {getProjectByAddr} from "../util/getContract"
import {InfoList} from "../main"

var infoList
console.log("foo");
// function genInfo(addrlist) {
    
//     if(addrlist)
//     for(let i = 0; i < addrlist.length; ++i){
//         infoList.push(getProjectByAddr(addrlist[i]))
//     }
// }

// genInfo(addrlist)
export default {
    name: 'JoinCrowdfunding',
    data: () => ({
        InfoList: InfoList
    })
}
</script>