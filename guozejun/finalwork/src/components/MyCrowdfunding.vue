<template>
  <v-container>
    MyCrowdfunding
    <div v-for="item in Addrlist">{{ item }}</div>
  </v-container>
</template>

<script>
  import {addrlist} from "../main"
  console.log(addrlist);
  export default {
      name: 'MyCrowdfunding',
      data: () => ({
        Addrlist: addrlist
      })
  }
</script>