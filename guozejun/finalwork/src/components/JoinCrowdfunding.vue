<template>
  <div class='metamask-info'>
    <v-text-field v-model="getAccountInfo"></v-text-field>
  </div>
</template>

<script>

import getWeb3 from '../util/getWeb3'
import getContract from '../util/getContract'
var web3 =  getWeb3()
var instance = getContract()
instance.then(console.log)
console.log(web3)
var coinbase
web3.eth.getCoinbase().then((value) => {
  coinbase = value
  console.log(value)
})

export default {
  name: 'JoinCrowdfunding',
  computed:{
    getAccountInfo() {
      var temp = coinbase
      return temp
    }
  }
}
</script>