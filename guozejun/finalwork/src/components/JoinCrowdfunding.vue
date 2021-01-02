<template>
  <div class='metamask-info'>
    <v-text-field v-model="getAccountInfo"></v-text-field>
  </div>
</template>

<script>
import getWeb3 from '../util/getWeb3'

var web3 =  getWeb3()
console.log(web3)
var coinbase;
web3.eth.getCoinbase().then((value) => {
  coinbase = value
  console.log(value)
})

export default {
  name: 'hello-metamask',
  // data: () => {
  //   //Account: ""
  // },
  computed:{
    getAccountInfo() {
      var temp = coinbase
      // .then(
      //   function(value) {
      //     console.log(value)
      //   }
      // )
      return temp
    }
  }
}
</script>

<style scoped></style>